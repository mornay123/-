import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: 'video',
        component: () => import(/* webpackChunkName:'base'  */ '@/views/Video')
      },
      {
        path: 'qa',
        component: () => import(/* webpackChunkName:'base'  */ '@/views/QA')
      },
      {
        path: 'profile',
        component: () => import('@/views/My')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName:'search' */ '@/views/search')
  },
  {
    path: '/user',
    component: () => import(/* webpackChunkName:'user' */ '@/views/user')
  },
  {
    path: '/articles/:articleId',
    component: () => import('@/views/Detail'),
    props: true // 开启路由传参
  }
]

const router = new VueRouter({
  routes
})

export default router
