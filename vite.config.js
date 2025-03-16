
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如，如果你的应用被部署在 https://www.xxxxx/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      createVitePlugins(env, command === 'build')
    ],
    build: {
      chunkSizeWarningLimit: 5000,
      minify: 'terser',
      rollupOptions: {  //自定义底层的 Rollup 打包配置
        input: {
          index: path.resolve(__dirname, './index.html'),
          ie: path.resolve(__dirname, './ie/index.html'),
          wechat: path.resolve(__dirname, './wechat/index.html')
        }
      },
      terserOptions: {
        output: {
          // 去除注释
          comments: true
        },
        compress: {
          //生产环境时移除console、debugger
          drop_console: true,
          drop_debugger: true,
          pure_funcs:['console.log'] // 移除 console.log
        },
      }
      // commonjsOptions: {
      //   strictRequires: true
      // }
    },
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 本地代理
    // server: {
    //   port: 80,
    //   host: true,
    //   open: true,
    //   proxy: {
    //     '/api': {
    //       target: 'https://wanweiai.com.cn/',
    //       changeOrigin: true
    //       // rewrite: (p) => p.replace(/^\/aorui/, '')
    //     }
    //   }
    // },
    css: {
      preprocessorOptions : {
        scss: {
          api: "modern",
        }        
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    server: {
      host: '0.0.0.0', // 这个用于启动
      port: '8686', // 指定启动端口
      open: true, //启动后是否自动打开浏览器
        proxy: {
        '/api': {
          target: 'http://8.138.156.214:8686',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '')
        }
      }
    }
  }
})
