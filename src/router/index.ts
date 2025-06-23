import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },

<<<<<<< Updated upstream
  // {
  //   name: 'invioce',
  //   path: '/invioce/:id',
  //   component: () => import('../pages/admin/settings/order/invioce.vue'),
  // },
  {
    name: 'home',
    path: '/',
    component: () => import('../pages/admin/frontend/pages/home.vue'),
  },
  {
    name: 'stores-page',
    path: '/stores',
    component: () => import('../pages/admin/frontend/pages/stores.vue'),
  },
  {
    name: 'SubCategory',
    path: '/SubCategory',
    component: () => import('../pages/admin/frontend/pages/home/SubCategory.vue'),
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
        ],
      },
      {
        name: 'tourism-management',
        path: 'product',
        // component: RouteViewComponent,
        children: [
          // {
          //   path: '/product/:id?', // optional id parameter
          //   name: 'product', // this name must match what you're using
          //   component: () => import('../pages/admin/torist/show.vue'),
          // },
        ],
      },
      {
        name: 'products-management',
        path: 'products',
        // component: RouteViewComponent,
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
        // component: RouteViewComponent,
        children: [
          {
            name: 'stores',
            path: 'stores',
            component: () => import('../pages/admin/store/index.vue'),
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
        // component: RouteViewComponent,
        children: [
          {
            name: 'attributes',
            path: 'attributes',
            component: () => import('../pages/admin/settings/Attributes/index.vue'),
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
            name: 'discount',
            path: 'discount',
            component: () => import('../pages/admin/settings/discount/index.vue'),
          },
          {
            name: 'discount-create',
            path: 'discount-create',
            component: () => import('../pages/admin/settings/discount/create.vue'),
          },
          {
            name: 'discount-update',
            path: 'discount-update/:id',
            component: () => import('../pages/admin/settings/discount/update.vue'),
          },
        ],
      },

      UIRoute,
    ],
=======

  {
    name: 'home',
    path: '/',
    component: () => import('../pages/admin/frontend/pages/home.vue'),
>>>>>>> Stashed changes
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
