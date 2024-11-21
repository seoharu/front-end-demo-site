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
  {
    path: '/search',
    name: 'SearchPage',
    component: () => import('@/views/SearchPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// // Navigation guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('TMDb-Key')
//   if (to.name !== 'Login' && !isAuthenticated) {
//     next({ name: 'Login' })
//   } else {
//     next()
//   }
// })

export default router
