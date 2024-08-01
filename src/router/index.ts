import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: false
    },
    component: () => import('@/pages/public/login.vue')
  },
  {
    path: '/',
    redirect: '/manage'
  },
  {
    path: '/manage',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/home/index/index.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('access_token')) {
        to.path === '/login' ? next() : router.push('/login')
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        redirect: '/manage/rule'
      },
      {
        path: '/manage/rule',
        component: () => import('@/pages/home/configRule/index.vue')
      },
      {
        path: '/manage/template',
        component: () => import('@/pages/home/message/index.vue')
      },
      {
        path: '/manage/board',
        component: () => import('@/pages/home/dataBoard/dataBoard.vue')
      },
      {
        path: 'user',
        redirect: '/manage/user/users'
      },
      {
        path: '/manage/user/users',
        component: () => import('@/pages/home/userAbout/user.vue')
      },
      {
        path: '/manage/user/group',
        component: () => import('@/pages/home/userAbout/group.vue')
      },
      {
        path: '/manage/user/cluster',
        component: () => import('@/pages/home/userAbout/cluster.vue')
      },
      {
        path: '/manage/app',
        component: () => import('@/pages/home/application/application.vue')
      },
      {
        path: 'stream',
        redirect: '/manage/stream/feishu'
      },
      {
        path: '/manage/stream/feishu',
        component: () => import('@/pages/home/downstreamAbout/feishuServer.vue')
      },
      {
        path: '/manage/stream/sms',
        component: () => import('@/pages/home/downstreamAbout/noteServer.vue')
      },
      {
        path: '/manage/stream/email',
        component: () => import('@/pages/home/downstreamAbout/emailServer.vue')
      },
      {
        path: '/manage/record',
        component: () => import('@/pages/home/informRecord/informRecord.vue')
      },
      {
        path: '/manage/log',
        component: () => import('@/pages/home/infoLog.vue')
      },
      {
        path: '/manage/time',
        component: () => import('@/pages/home/timeTask/timeTask.vue')
      },
      {
        path: '/:pathMatch(.*)',
        redirect: '/notfound'
      },
      {
        path: '/notfound',
        name: 'notFound',
        component: () => import('@/pages/public/notFound.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/notfound'
  },
  {
    path: '/notfound',
    name: 'notFound',
    component: () => import('@/pages/public/notFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
