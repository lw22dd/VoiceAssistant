import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router' // 导入路由配置
import { createPinia } from 'pinia'
import "animate.css"

createApp(App).use(router).use(createPinia()).mount('#app')
