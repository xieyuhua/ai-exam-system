import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    // 读取环境变量，默认走本机后端；对接远程时设置 VITE_API_TARGET
    const env = loadEnv(mode, __dirname, '')
    const apiTarget = env.VITE_API_TARGET || 'http://localhost:8080'

    const proxy = {
        '/api': {
            target: apiTarget,
            changeOrigin: true,
            // 远程若是自签 HTTPS，可临时关闭证书校验
            secure: env.VITE_API_SECURE === 'false' ? false : true
        }
    }

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        },
        server: {
            port: 8283,
            proxy
        },
        // preview 也需要代理，否则 /api 请求无法转发到后端
        preview: {
            port: 3000,
            proxy
        },
        build: {
            outDir: '../static-vue',
            emptyOutDir: true
        }
    }
})
