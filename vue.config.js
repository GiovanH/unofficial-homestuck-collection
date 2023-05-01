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
                    artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
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
