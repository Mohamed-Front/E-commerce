import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },

  {
    name: 'invioce',
    path: '/invioce/:id',
    component: () => import('../pages/admin/settings/order/invioce.vue'),
  },
  {
    name: 'home',
    path: '/',
    component: () => import('../pages/admin/frontend/pages/home.vue'),
  },
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    beforeEnter: auth,
    children: [

      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },


      {
        name: 'roles',
        path: 'roles',
        component: () => import('../pages/admin/roles/index.vue'),
      },
      {
        name: 'roles-update',
        path: 'roles-update/:id',
        component: () => import('../pages/admin/roles/update.vue'),
      },
      {
        name: 'roles-create',
        path: 'roles-create',
        component: () => import('../pages/admin/roles/create.vue'),
      },
      {
        name: 'Permission',
        path: 'Permission',
        component: () => import('../pages/admin/Permissions/index.vue'),
      },
      {
        name: 'statistics',
        path: 'users_management',
        // component: RouteViewComponent,
        children: [
          {
            name: 'users',
            path: 'users',
            component: () => import('../pages/admin/users/users.vue'),
          },
          {
            name: 'user-edite',
            path: 'user-edite/:id',
            component: () => import('../pages/admin/users/edite.vue'),
          },
          {
            name: 'user-create',
            path: 'user-create',
            component: () => import('../pages/admin/users/create.vue'),
          },

          {
            name: 'tourist',
            path: 'tourist',
            component: () => import('../pages/admin/torist/index.vue'),
          },
          {
            name: 'tourist-show',
            path: 'tourist-show/:id',
            component: () => import('../pages/admin/torist/show.vue'),
          },
        ],
      },
      {
        name: 'tourism-management',
        path: 'product',
        // component: RouteViewComponent,
        children: [
          {
            path: '/product/:id?', // optional id parameter
            name: 'product',       // this name must match what you're using
            component: () => import('../pages/admin/torist/show.vue')
          }


        ],
      },
      {
        name: 'brand-management',
        path: 'brands',
        // component: RouteViewComponent,
        children: [
          {
            name: 'brand',
            path: 'brand',
            component: () => import('../pages/admin/brand/index.vue'),
          },
          {
            name: 'brand-create',
            path: 'brand-create',
            component: () => import('../pages/admin/brand/create.vue'),
          },
          {
            name: 'brand-edit',
            path: 'brand-edit/:id',
            component: () => import('../pages/admin/brand/edite.vue'),
          },

        ],
      },

      {
        name: 'settings',
        path: 'settings',
        // component: RouteViewComponent,
        children: [
          {
            name: 'pages',
            path: 'pages',
            component: () => import('../pages/admin/settings/pages/index.vue'),
          },

        ],
      },

      UIRoute,
    ],
  },

  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    path: '/404',
    component: Page404Layout,
    children: [
      {
        name: 'not-found-advanced',
        path: 'not-found-advanced',
        component: () => import('../pages/404-pages/VaPageNotFoundSearch.vue'),
      },
      {
        name: 'not-found-simple',
        path: 'not-found-simple',
        component: () => import('../pages/404-pages/VaPageNotFoundSimple.vue'),
      },
      {
        name: 'not-found-custom',
        path: 'not-found-custom',
        component: () => import('../pages/404-pages/VaPageNotFoundCustom.vue'),
      },
      {
        name: 'not-found-large-text',
        path: '/pages/not-found-large-text',
        component: () => import('../pages/404-pages/VaPageNotFoundLargeText.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      document.querySelector('.app-layout__page')?.scrollTo(0, 0)
    }
  },
  routes,
})

function auth(to: any, from: any, next: any) {
  if (!localStorage.getItem('token')) {
    return next({ name: 'login' })
  }

  next()
}

export default router
