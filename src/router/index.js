import { createRouter, createWebHistory } from 'vue-router'

import { constantRouterMap } from '@/router/router.config' // 权限控制
// import { constantRouterMap, asyncRouterMap } from '@/router/router.config'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRouterMap // 权限控制
  // routes: constantRouterMap.concat(asyncRouterMap)
})

export default router