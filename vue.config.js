// const { VueLoaderPlugin } = require('vue-loader')

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
                    test: /\.(?:js|mjs|cjs)$/,
                    exclude: {
                        and: [/node_modules/], // Exclude libraries in node_modules ...
                        not: [
                            // Except for a few of them that needs to be transpiled because they use modern syntax
                            /vue-reader/,
                            /typescript-etw/
                        ]
                    },
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: "defaults" }]
                            ],
                            plugins: [
                                '@babel/plugin-proposal-nullish-coalescing-operator',
                                '@babel/plugin-proposal-optional-chaining',
                            ]
                        }
                    }
                },
                {
                    test: /\.node$/,
                    loader: "node-loader",
                }
            ]
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
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
                    asarUnpack: [
                        "**/node_modules/sharp/**"
                    ]
                },
                mac: {
                    target: ["dmg"],
                    category: "entertainment",
                    identity: null,
                    asarUnpack: [
                        "**/node_modules/sharp/**"
                    ]
                },
                linux: {
                    target: ["AppImage", "tar.gz"],
                    category: "game",
                    asarUnpack: [
                        "**/node_modules/sharp/**"
                    ]
                }
            }
        }
    }
}
