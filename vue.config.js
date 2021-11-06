module.exports = {
    configureWebpack: {
        devtool: "source-map"
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: "com.bambosh.unofficialhomestuckcollection",
                productName: "The Unofficial Homestuck Collection",
                copyright: "Copyright © 2020-2021 Bambosh",
                directories: {
                    buildResources: "build"
                },
                win: {
                    target: "zip"
                },
                mac: {
                    category: "entertainment"
                },
                linux: {
                    target: "tar.gz",
                    category: "game"
                }
            }
        }
    }
}
