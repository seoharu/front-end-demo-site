import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/views/AuthPage.vue')
  },
  {
    path: '/popular',
    name: 'PopularPage',
    component: () => import('@/views/PopularPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
