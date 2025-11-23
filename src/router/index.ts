import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import WebLayout from '../layouts/WebLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },
  {
    name: '',
    path: '/',
    component: WebLayout,
    children: [
      {
        name: 'home',
        path: '/',
        component: () => import('../pages/admin/frontend/pages/home.vue'),
        beforeEnter: (to, from, next) => {
          const hasMarket = localStorage.getItem('has-market') === 'true';
          if (hasMarket) {
            next({ name: 'stores-hasmarket' });
          } else {
            next();
          }
        },
      },
      {
        name: 'subcategory',
        path: '/subcategory/:id',
        component: () => import('../pages/admin/frontend/pages/products/SubCategory.vue'),
      },
      {
        name: 'produts_category',
        path: '/produts-category/:id',
        component: () => import('../pages/admin/frontend/pages/products/produts-category.vue'),
      },
       {
        name: 'products-brand',
        path: '/products-brand/:id',
        component: () => import('../pages/admin/frontend/pages/products/brand-products.vue'),
      },

      {
        name: 'media-products',
        path: '/media-products/:id',
        component: () => import('../pages/admin/frontend/pages/media-links/media-products.vue'),

      },
       {
        name: 'media-category',
        path: '/media-category/:id',
        component: () => import('../pages/admin/frontend/pages/media-links/media-category.vue'),

      },
      {
        name: 'customtap-products',
        path: '/customtap-products/:id',
        component: () => import('../pages/admin/frontend/pages/customtap/customtap-products.vue'),
        props: route => ({
          title: route.query.title
        })
      },
       {
        name: 'customtap-category',
        path: '/customtap-category/:id',
        component: () => import('../pages/admin/frontend/pages/customtap/customtap-category.vue'),
         props: route => ({
          title: route.query.title
        })
      }, {
        name: 'customtap-brand',
        path: '/customtap-brand/:id',
        component: () => import('../pages/admin/frontend/pages/customtap/customtap-brand.vue'),
         props: route => ({
          title: route.query.title
        })
      },
      {
        name: 'Product-details',
        path: '/product-details/:id',
        component: () => import('../pages/admin/frontend/pages/products/product-details.vue'),
      },
      {
        name: 'stores-hasmarket',
        path: '/stores-hasmarket',
        component: () => import('../pages/admin/frontend/pages/stores/hasmarket.vue'),
      },
      {
        name: 'stores-nomarket',
        path: '/stores-nomarket',
        component: () => import('../pages/admin/frontend/pages/stores/nothasmarket.vue'),
      },
      {
        name: 'stores-nothasmarket',
        path: '/stores-nothasmarket/:id',
        component: () => import('../pages/admin/frontend/pages/stores/nothasmarket.vue'),
      },


      {
        name: 'stores-page',
        path: '/stores',
        component: () => import('../pages/admin/frontend/pages/stores.vue'),
      },
      {
        name: 'favorites',
        path: '/favorites',
        component: () => import('../pages/admin/frontend/pages/favorites.vue'),
         beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },

      {
        name: 'editprofile',
        path: '/edit-profile',
        component: () => import('../pages/admin/frontend/pages/profile/EditProfile.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },
      {
        name: 'addres',
        path: '/addres',
        component: () => import('../pages/admin/frontend/pages/profile/adress.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },
       {
        name: 'add-addres',
        path: '/add-addres',
         props: (route) => ({
           id: route.query.id,

        }),
        component: () => import('../pages/admin/frontend/pages/profile/add-addres.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },
      {
        name: 'orders',
        path: '/orders',
        component: () => import('../pages/admin/frontend/pages/profile/orders.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },
      {
        name: 'profile',
        path: '/profile',
        component: () => import('../pages/admin/frontend/pages/profile/profile.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },
      {
        name: 'cart',
        path: '/cart',
        component: () => import('../pages/admin/frontend/pages/cart.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('authenticatedweb') === 'true';
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'authlog' });
          }
        },
      },
    ],
  },
  {
    name: 'forgetpassword',
    path: '/forget-password',
    component: () => import('../pages/admin/frontend/pages/auth/ForgetPassword.vue'),
  },
  {
    name: 'changepassword',
    path: '/change-password',
    component: () => import('../pages/admin/frontend/pages/auth/ChnagePassword.vue'),
    props: (route) => ({
      email: route.query.email,
      phone: route.query.phone,
    }),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('../pages/admin/frontend/pages/auth/register.vue'),
  },
  {
    name: 'otp',
    path: '/otp/:type',
    props: (route) => ({
      email: route.query.email,
      phone: route.query.phone,
      otp_type: route.query.otp_type,
    }),
    component: () => import('../pages/admin/frontend/pages/auth/otp.vue'),
  },
  {
    name: 'authlog',
    path: '/authlog',
    component: () => import('../pages/admin/frontend/pages/auth/auth.vue'),
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
        children: [
          {
            name: 'users',
            path: 'users',
            component: () => import('../pages/admin/users/users.vue'),
          },
          {
            name: 'user-edit',
            path: 'user-edit/:id',
            component: () => import('../pages/admin/users/edite.vue'),
          },
          {
            name: 'user-create',
            path: 'user-create',
            component: () => import('../pages/admin/users/create.vue'),
          },
        ],
      },
      {
        name: 'tourism-management',
        path: 'product',
        children: [],
      },
      {
        name: 'products-management',
        path: 'products',
        children: [
          {
            name: 'product',
            path: 'product',
            component: () => import('../pages/admin/products/product/index.vue'),
          },
          {
            name: 'product-create',
            path: 'product-create',
            component: () => import('../pages/admin/products/product/create.vue'),
          },
          {
            name: 'product-update',
            path: 'product-update/:id',
            component: () => import('../pages/admin/products/product/update.vue'),
          },
          {
            name: 'brand',
            path: 'brand',
            component: () => import('../pages/admin/products/brand/index.vue'),
          },
          {
            name: 'brand-create',
            path: 'brand-create',
            component: () => import('../pages/admin/products/brand/create.vue'),
          },
          {
            name: 'brand-edit',
            path: 'brand-edit/:id',
            component: () => import('../pages/admin/products/brand/edite.vue'),
          },
          {
            name: 'model',
            path: 'model',
            component: () => import('../pages/admin/products/model/index.vue'),
          },
          {
            name: 'model-create',
            path: 'model-create',
            component: () => import('../pages/admin/products/model/create.vue'),
          },
          {
            name: 'model-edit',
            path: 'model-edit/:id',
            component: () => import('../pages/admin/products/model/edit.vue'),
          },
          {
            name: 'discount',
            path: 'discount',
            component: () => import('../pages/admin/discount/index.vue'),
          },
          {
            name: 'discount-create',
            path: 'discount-create',
            component: () => import('../pages/admin/discount/create.vue'),
          },
          {
            name: 'discount-update',
            path: 'discount-update/:id',
            component: () => import('../pages/admin/discount/update.vue'),
          },
          {
            name: 'coupon',
            path: 'coupon',
            component: () => import('../pages/admin/products/coupon/index.vue'),
          },
          {
            name: 'coupon-create',
            path: 'coupon-create',
            component: () => import('../pages/admin/products/coupon/create.vue'),
          },
          {
            name: 'coupon-update',
            path: 'coupon-update/:id',
            component: () => import('../pages/admin/products/coupon/update.vue'),
          },
          {
            name: 'markets',
            path: 'markets',
            component: () => import('../pages/admin/products/markets/index.vue'),
          },
          {
            name: 'market-create',
            path: 'market-create',
            component: () => import('../pages/admin/products/markets/create.vue'),
          },
          {
            name: 'market-update',
            path: 'market-update/:id',
            component: () => import('../pages/admin/products/markets/update.vue'),
          },
          {
            name: 'category',
            path: 'category',
            component: () => import('../pages/admin/products/category/index.vue'),
          },
          {
            name: 'category-create',
            path: 'category-create',
            component: () => import('../pages/admin/products/category/create.vue'),
          },
          {
            name: 'category-update',
            path: 'category-update/:id',
            component: () => import('../pages/admin/products/category/update.vue'),
          },
        ],
      },
      {
        name: 'store-management',
        path: 'store',
        children: [
          {
            name: 'stores',
            path: 'stores',
            component: () => import('../pages/admin/store/index.vue'),
          },
           {
            name: 'store-shipping-settings',
            path: 'store-shipping-settings/:id',
            component: () => import('../pages/admin/store/shipping-setting.vue'),
          },
          {
            name: 'product-shipping-settings',
            path: 'product-shipping-settings/:id',
            component: () => import('../pages/admin/products/product/shipping-setting.vue'),
          },
          {
            name: 'market-shipping-settings',
            path: 'market-shipping-settings/:id',
            component: () => import('../pages/admin/products/markets/shipping-setting.vue'),
          },
           {
            name: 'category-shipping-settings',
            path: 'category-shipping-settings/:id',
            component: () => import('../pages/admin/products/category/shipping-setting.vue'),
          },
           {
            name: 'inventory',
            path: 'inventory',
            component: () => import('../pages/admin/inventory/index.vue'),
          },

            {
            name: 'inventory-quantity',
            path: 'inventory-quantity/:id',
            component: () => import('../pages/admin/inventory/update.vue'),
          },
          {
            name: 'order',
            path: 'order',
            component: () => import('../pages/admin/orders/index.vue'),
          },
          {
            name: 'order-show',
            path: 'order-show/:id',
            component: () => import('../pages/admin/orders/show.vue'),
          },
          {
            name: 'store-create',
            path: 'store-create',
            component: () => import('../pages/admin/store/create.vue'),
          },
          {
            name: 'store-edit',
            path: 'store-edit/:id',
            component: () => import('../pages/admin/store/edit.vue'),
          },
        ],
      },
      {
        name: 'settings',
        path: 'settings',
        children: [
          {
            name: 'setting',
            path: 'setting',
            component: () => import('../pages/admin/settings/setting/update.vue'),
          },

          {
            name: 'shipping-update',
            path: 'shipping-update',
            component: () => import('../pages/admin/shipping-setting/update.vue'),
          },
         {
            name: 'media-links',
            path: 'media-links/:id/:type',
            component: () => import('../pages/admin/store/mediaLinks.vue'),
          },


            {
            name: 'template-notification',
            path: 'template-notification',
            component: () => import('../pages/admin/template-notification/index.vue'),
          },
         {
            name: 'attributes',
            path: 'attributes',
            component: () => import('../pages/admin/settings/Attributes/index.vue'),
          },
          {
            name: 'invoices',
            path: 'invoices',
            component: () => import('../pages/admin/Invoice/index.vue'),
          },
           {
            name: 'invoice-show',
            path: 'invoices-show/:id',
            component: () => import('../pages/admin/Invoice/show.vue'),
          },
          {
            name: 'attribute-create',
            path: 'attribute-create',
            component: () => import('../pages/admin/settings/Attributes/create.vue'),
          },
          {
            name: 'attribute-update',
            path: 'attribute-update/:id',
            component: () => import('../pages/admin/settings/Attributes/update.vue'),
          },
          {
            name: 'address',
            path: 'address',
            component: () => import('../pages/admin/settings/address/index.vue'),
          },
          {
            name: 'address-create',
            path: 'address-create',
            component: () => import('../pages/admin/settings/address/create.vue'),
          },
          {
            name: 'address-update',
            path: 'address-update/:id',
            component: () => import('../pages/admin/settings/address/update.vue'),
          },
          {
            name: 'connect',
            path: 'connect',
            component: () => import('../pages/admin/settings/quickBooks/connect.vue'),
          },
          {
            name: 'custom_tabs',
            path: 'custom-tabs',
            component: () => import('../pages/admin/settings/custom-tabs/index.vue'),
          },
          {
            name: 'custom_tabs_create',
            path: 'custom-tabs-create',
            component: () => import('../pages/admin/settings/custom-tabs/create.vue'),
          },
          {
            name: 'custom_tabs_update',
            path: 'custom-tabs-update/:id',
            component: () => import('../pages/admin/settings/custom-tabs/edit.vue'),
          },
          {
            name: 'custom_tabs_show',
            path: 'custom-tabs-show/:id',
            component: () => import('../pages/admin/settings/custom-tabs/show.vue'),
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
