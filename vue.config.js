// const { VueLoaderPlugin } = require('vue-loader')

// require('ofe').call()
module.exports = {
  configureWebpack: {
    // optimization: {
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //         cacheGroups: {
    //             vendor: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendors',
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    },
    devServer: {
      stats: {
        chunks: false,
        chunkModules: false,
        modules: false
      }
    },
    // devtool: "source-map",
    devtool: "eval-source-map",
    resolve: {
      alias: {
        // Include the vue compiler so mods can use templates
        "vue$": "vue/dist/vue.esm.js",
        "@/*": "./src/*"
      }
    },
    plugins: [],
    module: {
      rules: [{
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
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ],
              plugins: [
                '@babel/plugin-transform-nullish-coalescing-operator',
                '@babel/plugin-transform-optional-chaining',
              ]
            }
          }
        },
        {
          test: /\.node$/,
          loader: "node-loader"
        }
      ]
    }
  },
  chainWebpack: config => {
    if (process.env.ASSET_PACK_HREF) {
      console.log("Replacing for asset href", process.env.ASSET_PACK_HREF)
      const srl_options = options => {
        return {
          search: 'assets://',
          replace: process.env.ASSET_PACK_HREF,
          flags: 'g'
        }
      }
      // config.module.rule('vue')
      //     .use('string-replace-loader')
      //     .loader('string-replace-loader')
      //     .before('cache-loader') // After css imports are resolved
      //     .tap(srl_options)

      for (const rule of ['css', 'scss']) {
        for (const oneOfCase of ['vue', 'vue-modules', 'normal', 'normal-modules']) {
          // console.warn(oneOfCase)
          config.module.rule(rule)
            .oneOf(oneOfCase)
            .use('string-replace-loader')
            .loader('string-replace-loader')
            .before('css-loader') // After css-loader processes imports (before means after)
            .tap(srl_options)
        }
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // TEMPORARY: builds failing due to faulty minimization!
      chainWebpackMainProcess: config => {
        config.plugins.delete("uglify")
        config.optimization.minimize(false)
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

if (process.env.ASSET_PACK_HREF && !process.env.ASSET_PACK_HREF.includes('localhost')) {
  // Production web app builds only

  const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

  module.exports.configureWebpack.plugins.push(
    sentryWebpackPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  )
}
