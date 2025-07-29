import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
  server: {
    host: '0.0.0.0',  // 监听所有可用的网络接口
    port: 5174,       // 你可以设置你想要的端口
    proxy:{
      '^/qingniao/*': {
          target: 'https://test-udc.100tal.com/',
          changeOrigin:true,
          // secure: true,
          // rewrite: (path) => path.replace(/^\/udc-api/, '')
      },
      '^/wukong/*': {
          target: 'https://test-udc.100tal.com/',
          changeOrigin:true,
          // secure: true,
          // rewrite: (path) => path.replace(/^\/udc-api/, '')
      },
      '^/next-api': {
          target: 'https://app.xessuyang.com/',
          changeOrigin:true,
          rewrite: (path) => path.replace(/^\/next-api/, '')
      },
      '^/zhuque/api/.*': {
        target: 'https://test-udc.100tal.com/',
        changeOrigin: true,
        secure: true,
      },
    },
  }
})
