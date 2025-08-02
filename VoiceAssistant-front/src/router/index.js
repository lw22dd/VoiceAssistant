
import { createRouter, createWebHistory } from 'vue-router'

import Index from '../views/Index.vue'
import Setup from '../views/Setup.vue'
const routes = [
  { path: '/', name: 'Index', component: Index }, // 首页
  { path:'/setup',name:'Setup', component:Setup},
  
]

// 创建路由实例，使用HTML5 history模式（无#号）
const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router