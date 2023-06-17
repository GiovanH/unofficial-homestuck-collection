module.exports = {
    configureWebpack: {
        devtool: "source-map",
        resolve: {
            alias: {
                // Include the vue compiler so mods can use templates
                "vue$": "vue/dist/vue.esm.js"
            }
        },
        module: {
            rules: [
                {
                    test: /\.node$/,
                    loader: "node-loader",
                }
            ]
        }
    },
    chainWebpack: config => {
        for (const rule of ['scss']) {
            for (const oneOfCase of ['vue', 'vue-module', 'normal', 'normal-module']) {
                // console.warn(oneOfCase)
                config.module.rule('scss')
                    .oneOf(oneOfCase)
                    .use('string-replace-loader')
                    .loader('string-replace-loader')
                    // TODO: This isn't working on @imports (see candy corn)
                    .after('scss-loader') // After css imports are resolved
                    .tap(options => {
                        return {
                            search: 'assets://',
                            replace: (process.env.ASSET_PACK_HREF || 'http://localhost:8413/'),
                        }
                    })
                // console.warn(config.module.rule('scss').oneOf(oneOfCase).uses)
            }
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            // TEMPORARY: builds failing due to faulty minimization!
            chainWebpackMainProcess: config => {
                config.plugins.delete("uglify");
                config.optimization.minimize(false);
            },
            // chainWebpackRendererProcess: config => {
            //     config.plugins.delete("uglify");
            //     config.optimization.minimize(false);
            // },
            builderOptions: {
                appId: "com.bambosh.unofficialhomestuckcollection",
                productName: "The Unofficial Homestuck Collection",
                copyright: "Copyright © 2020-2022 Bambosh",
                directories: {
                    buildResources: "build"
                },
                win: {
                    target: {
                        target: "zip",
                        arch: [
                            "x64",
                            "ia32"
                        ]
                    },
                    artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
                    asarUnpack: [
                        "**/node_modules/sharp/**",
                        "**/*.node"
                    ]
                },
                mac: {
                    target: ["dmg"],
                    category: "entertainment",
                    identity: null,
                    asarUnpack: [
                        "**/node_modules/sharp/**",
                        "**/*.node"
                    ]
                },
                linux: {
                    target: ["AppImage", "tar.gz"],
                    category: "game",
                    asarUnpack: [
                        "**/node_modules/sharp/**",
                        "**/*.node"
                    ]
                }
            }
        }
    }
}
