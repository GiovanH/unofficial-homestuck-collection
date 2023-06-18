var store = {}
store = {
    has(key) {
        return (null != store.get(key))
    },
    delete(key) {
        localStorage.removeItem(key)
    },
    get(key) {
        // if (key == 'localData') {
        //     return Object.entries(localStorage).reduce((acc, i) => {
        //         try {
        //             acc[i[0]] = JSON.parse(i[1])
        //         } catch {}
        //         return acc
        //     }, {})
        // } else {
        if (key.includes(".")) {
            // Dot index
            const tail = key.split(".").slice(-1)
            const body = key.split(".").slice(0, -1).join(".")
            // console.log(`transforming get(${key}) to get(${body})[${tail}]`)
            return (store.get(body) || {})[tail]
        } else {
            const value = JSON.parse(localStorage.getItem(key))
            // console.log("looked up", key, "=", value)
            return value
        }
        // }
    },
    set(key, value) {
        // if (key == 'localData') {
        //     Object.entries(value).forEach((i) => {
        //         console.log("setting", i[0], i[1])
        //         localStorage.setItem(i[0], JSON.stringify(i[1]))
        //     })
        // } else {
            // key = key.replace('localData.', '')
            // console.log("setting", key, value)
        if (key.includes(".")) {
            // Dot index
            const tail = key.split(".").slice(-1)
            const body = key.split(".").slice(0, -1).join(".")

            const val2 = {...store.get(body)}
            val2[tail] = value

            // console.log(`transforming set(${key}, ${value}) to set(${body}, ${val2})`)
            return store.set(body, val2)
        } else {
            // console.log("setting", key, value)
            localStorage.setItem(key, JSON.stringify(value))
        }

        // }
    }
}

// store.set("a.b.c", 23)
// console.assert(store.get("a") == {'b': {'c': 23}})
// console.assert(store.get("a.b") == {'c': 23})
// console.assert(store.get("a.b.c") == 23)

module.exports = store

