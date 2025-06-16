const webpack = require('webpack')
const { execSync } = require('child_process')

const git_branch = execSync('git rev-parse --abbrev-ref HEAD').toString()

var build_info = {
  'process.env.BUILD_BRANCH': JSON.stringify(
    git_branch.trim()
  ),
  'process.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
  'process.env.BUILD_PLATFORM': JSON.stringify(process.platform),
  'process.env.BUILD_GIT_REVISION': JSON.stringify(
    execSync('git rev-parse HEAD').toString().trim()
  )
}

try {
  const git_remote = execSync(`git config --get branch.${git_branch.trim()}.remote`).toString()
  const git_remote_url = execSync(`git config --get remote.${git_remote.trim()}.url`).toString()

  build_info['process.env.BUILD_GIT_REMOTE'] = JSON.stringify(git_remote_url.trim())
} catch (e) {
  build_info['process.env.BUILD_GIT_REMOTE'] = JSON.stringify("(no remote)")
  console.warn("No git remote")
}

module.exports = {
  configureWebpack: {
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
        "@/*": "./src/*",
        "IpcRenderer$": '/src/js/ipcRendererAlias.js'
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
                '@babel/plugin-transform-optional-chaining'
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
    config
      .plugin('buildinfo')
      .use(
      webpack.DefinePlugin,
      [build_info]
    )

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
        copyright: "Copyright © 2025 GiovanH",
        directories: {
          buildResources: "build"
        },
        protocols: {
          name: "Unofficial Homestuck Collection",
          role: "Viewer",
          schemes: ["mspa"]
        },
        win: {
          target: [
            {
              target: "nsis",
              arch: [
                "x64",
                "ia32"
              ]
            },
            {
              target: "zip",
              arch: [
                "x64",
                "ia32"
              ]
            }
          ],
          asarUnpack: [
            "**/node_modules/sharp/**",
            "**/*.node"
          ],
          // eslint-disable-next-line no-template-curly-in-string
          artifactName: "${productName}-${version}-${os}-${arch}.${ext}"
        },
        mac: {
          target: ["dmg"],
          asarUnpack: [
            "**/node_modules/sharp/**",
            "**/*.node"
          ],
          category: "entertainment",
          identity: null
        },
        linux: {
          target: ["AppImage", "tar.gz", "deb"],
          asarUnpack: [
            "**/node_modules/sharp/**",
            "**/*.node"
          ],
          maintainer: "GiovanH <uhscollection@icloud.com>",
          category: "game"
        }
      }
    }
  }
}
