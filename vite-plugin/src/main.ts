import { createSSRApp } from 'vue'
import './style.css'
import App from './App.vue'

export function bootstrap() {
  const app = createSSRApp(App)
  return { app }
}