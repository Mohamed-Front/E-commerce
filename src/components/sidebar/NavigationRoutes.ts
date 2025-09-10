export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigation.home',
    meta: {
      icon: 'home'
    }
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'navigation.dashboard',
      show: ['dashboard'],
      meta: {
        icon: 'dashboard',
      },
    },
    {
      name: 'statistics',
      displayName: 'navigation.users_management',
      show: ['list users', 'list permissions', 'list roles','list address'],
      meta: {
        icon: 'people',
      },
      disabled: true,
      children: [
        {
          name: 'users',
          displayName: 'navigation.users',
          show: 'list users',
          meta: {
            icon: 'person'
          }
        },
          {
          name: 'address',
          displayName: 'navigation.addresses',
          show: 'list address',
          meta: {
            icon: 'location_on'
          }
        },
        {
          name: 'roles',
          displayName: 'navigation.roles',
          show: 'list roles',
          meta: {
            icon: 'security'
          }
        },
        {
          name: 'Permission',
          displayName: 'navigation.permissions',
          show: 'list permissions',
          meta: {
            icon: 'lock'
          }
        },
      ],
    },
    {
      name: 'products',
      displayName: 'navigation.products',
      show: ['list brands', 'list model','list attributes'],
      meta: {
        icon: 'inventory',
      },
      disabled: true,
      children: [
        {
          name: 'product',
          displayName: 'navigation.product',
          show: 'list product',
          meta: {
            icon: 'product'
          }
        },
         {
          name: 'attributes',
          displayName: 'navigation.attributes',
          show: 'list attributes',
          meta: {
            icon: 'settings'
          }
        },
        {
          name: 'brand',
          displayName: 'navigation.brands',
          show: 'list brands',
          meta: {
            icon: 'branding_watermark'
          }
        },
        {
          name: 'discount',
          displayName: 'navigation.discount',
          show: 'list discount',
          meta: {
            icon: 'branding_watermark'
          }
        },

        {
          name: 'model',
          displayName: 'navigation.models',
          show: 'list model',
          meta: {
            icon: 'model_training'
          }
        },
        {
          name: 'coupon',
          displayName: 'navigation.coupons',
          show: 'list coupon',
          meta: {
            icon: 'local_offer'
          }
        },
      ],
    },


    {
      name: 'store',
      displayName: 'navigation.stores',
      show: ['list stores', 'list categories'],
      meta: {
        icon: 'store',
      },
      disabled: true,
      children: [
        {
          name: 'stores',
          displayName: 'navigation.stores',
          show: 'list stores',
          meta: {
            icon: 'storefront'
          }
        },
        {
          name: 'category',
          displayName: 'navigation.categories',
          show: 'list categories',
          meta: {
            icon: 'category'
          }
        },
         {
          name: 'markets',
          displayName: 'navigation.markets',
          show: 'list categories',
          meta: {
            icon: 'category'
          }
        },
      ],
    },

    //   {
    //   name: 'inventory',
    //   displayName: 'navigation.inventory',
    //   show: ['list custom tabs'],
    //   meta: {
    //     icon: 'dashboard',
    //   },
    // },
     {
      name: 'custom_tabs',
      displayName: 'navigation.custom_tabs',
      show: ['list custom tabs'],
      meta: {
        icon: 'dashboard',
      },
    },
     {
      name: 'order',
      displayName: 'navigation.orders',
      show: ['list orders'],
      meta: {
        icon: 'dashboard',
      },
    },
      {
      name: 'template-notification',
      displayName: 'navigation.notification',
      show: ['list notification-templates'],
      meta: {
        icon: 'dashboard',
      },
    },
     {
      name: 'shipping-setting',
      displayName: 'navigation.shipping',
      show: ['list notification-templates'],
      meta: {
        icon: 'dashboard',
      },
    },

    {
      name: 'setting',
      displayName: 'navigation.settings',
      show: ['list address'],
      meta: {
        icon: 'settings',
      },
      disabled: true,
      children: [


        {
          name: 'setting',
          displayName: 'navigation.setting',
          show: 'list categories',
          meta: {
            icon: 'settings'
          }
        },
      {
          name: 'connect',
          displayName: 'navigation.quickBooks',
          show: 'list categories',
          meta: {
            icon: 'settings'
          }
        },
      ],
    },
  ] as INavigationRoute[],
}
