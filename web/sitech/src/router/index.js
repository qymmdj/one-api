import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import nprogress from 'nprogress'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/login/index.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/register/index.vue'),
    meta: { requiresAuth: false, title: '注册' }
  },
  {
    path: '/',
    component: () => import('@/components/Layout/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: { title: '总览', icon: 'Odometer' }
      },
      {
        path: 'channel',
        name: 'Channel',
        component: () => import('@/pages/channel/index.vue'),
        meta: { title: '渠道管理', icon: 'Connection', requiresAdmin: true }
      },
      {
        path: 'token',
        name: 'Token',
        component: () => import('@/pages/token/index.vue'),
        meta: { title: '令牌管理', icon: 'Key' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', requiresAdmin: true }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/pages/log/index.vue'),
        meta: { title: '日志', icon: 'Document' }
      },
      {
        path: 'redemption',
        name: 'Redemption',
        component: () => import('@/pages/redemption/index.vue'),
        meta: { title: '兑换码', icon: 'Ticket', requiresAdmin: true }
      },
      {
        path: 'topup',
        name: 'Topup',
        component: () => import('@/pages/topup/index.vue'),
        meta: { title: '充值', icon: 'Wallet' }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/pages/setting/index.vue'),
        meta: { title: '系统设置', icon: 'Setting', requiresAdmin: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/profile/index.vue'),
        meta: { title: '个人资料', icon: 'UserFilled' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  document.title = to.meta.title ? `${to.meta.title} - One API` : 'One API'
  
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth !== false
  const requiresAdmin = to.meta.requiresAdmin === true
  
  if (requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (requiresAdmin && !userStore.isAdmin) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

router.afterEach(() => {
  nprogress.done()
})

export default router
