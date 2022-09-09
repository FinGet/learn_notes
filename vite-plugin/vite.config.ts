import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import TestPlugin from './plugins/testPlugin'
// import VitePlugin from './plugins/vitePlugin'
// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(),TestPlugin(), VitePlugin()],
  plugins: [vue()],
})
