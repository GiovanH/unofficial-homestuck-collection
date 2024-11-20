const semver = require("semver");

var store = {} // Self-referential

store = {
    has(key) {
        return (null != store.get(key))
    },
    delete(key) {
        store.set(key, undefined)
        // localStorage.removeItem(key)
    },
    get(key) {
        if (key == undefined) {
            // Whole store as root
            const parsed = Object.fromEntries(Object.entries(localStorage).map(t => {
                try {
                    return [t[0], (t[1] == 'undefined' ? undefined : JSON.parse(t[1]))]
                } catch {
                    console.warn("Couldn't parse localStorage entry", t)
                    return t
                }}))
            // console.debug("loading whole localstorage", localStorage, parsed)
            return parsed
        } else if (key.includes(".")) {
            // Dot index
            const tail = key.split(".").slice(-1)
            const body = key.split(".").slice(0, -1).join(".")
            // console.debug(`transforming get(${key}) to get(${body})[${tail}]`)
            return (store.get(body) || {})[tail]
        } else {
            const json_repr = localStorage.getItem(key)
            const value = json_repr == 'undefined' ? undefined : JSON.parse(json_repr)
            // console.debug("looked up", key, "=", value)
            return value
        }
    },
    set(key, value) {
        if (value == undefined && (key instanceof Object)) {
            // Set whole store
            value = key
            key = undefined
            Object.entries(value).forEach(kv => {
                const [k, v] = kv
                // console.debug("decomposing", k, v)
                store.set(k, v)
            })
            // return JSON.parse(JSON.stringify(localStorage))
        } else if (key.includes(".")) {
            // Dot index
            const tail = key.split(".").slice(-1)
            const body = key.split(".").slice(0, -1).join(".")

            const val2 = {...store.get(body)}
            val2[tail] = value

            // console.debug(`transforming set(${key}, ${value}) to set(${body}, ${val2})`)
            return store.set(body, val2)
        } else {
            // console.debug("setting", key, value)
            localStorage.setItem(key, JSON.stringify(value))
        }
    },
    scopedStore(scope) {
        return {
            has: (key) => store.has(`${scope}.${key}`),
            get: (key) => store.get(`${scope}.${key}`),
            delete: (key) => store.delete(`${scope}.${key}`),
            set: (key, value) => store.set(`${scope}.${key}`, value),
        }
    },
    migrate(migrations, versionToMigrate) {
        // Implementation of https://github.com/sindresorhus/conf/blob/main/source/index.ts#L485
        const INTERNAL_KEY = '__internal__';
        const MIGRATION_KEY = `${INTERNAL_KEY}.migrations.version`;

        function _isVersionInRangeFormat(version) {
            return semver.clean(version) === null;
        }

        function _shouldPerformMigration(candidateVersion, previousMigratedVersion, versionToMigrate) {
            if (_isVersionInRangeFormat(candidateVersion)) {
                if (previousMigratedVersion !== '0.0.0' && semver.satisfies(previousMigratedVersion, candidateVersion)) {
                    return false;
                }
                return semver.satisfies(versionToMigrate, candidateVersion);
            }
            if (semver.lte(candidateVersion, previousMigratedVersion)) {
                return false;
            }
            if (semver.gt(candidateVersion, versionToMigrate)) {
                return false;
            }
            return true;
        }

        let previousMigratedVersion = store.get(MIGRATION_KEY) || '2.4.0';
        const newerVersions = Object.keys(migrations)
            .filter(candidateVersion => _shouldPerformMigration(candidateVersion, previousMigratedVersion, versionToMigrate));
        // let storeBackup = { ...this.store };
        for (const version of newerVersions) {
            try {
                const migration = migrations[version];
                migration(store);
                store.set(MIGRATION_KEY, version);
                previousMigratedVersion = version;
                // storeBackup = { ...this.store };
            }
            catch (error) {
                // this.store = storeBackup;
                console.error(`Something went wrong during the migration! ${version} ${error}`);
            }
        }
        if (_isVersionInRangeFormat(previousMigratedVersion) || !semver.eq(previousMigratedVersion, versionToMigrate)) {
            store.set(MIGRATION_KEY, versionToMigrate);
        }
    }
}

// store.set("a.b.c", 23)
// console.assert(store.get("a") == {'b': {'c': 23}})
// console.assert(store.get("a.b") == {'c': 23})
// console.assert(store.get("a.b.c") == 23)

module.exports = store

