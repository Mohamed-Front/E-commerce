export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
  show?: string | string[]
  disabled?: boolean
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
        icon: 'dashboard', // أو 'space_dashboard'
      },
    },
    {
      name: 'statistics',
      displayName: 'navigation.users_management',
      show: ['list users', 'list permissions', 'list roles', 'list address'],
      meta: {
        icon: 'people_alt', // أيقونة أفضل لإدارة المستخدمين
      },
      disabled: true,
      children: [
        {
          name: 'users',
          displayName: 'navigation.users',
          show: 'list users',
          meta: { icon: 'person' }
        },
        {
          name: 'address',
          displayName: 'navigation.addresses',
          show: 'list address',
          meta: { icon: 'location_on' }
        },
        {
          name: 'roles',
          displayName: 'navigation.roles',
          show: 'list roles',
          meta: { icon: 'verified_user' } // أفضل من security
        },
        {
          name: 'Permission',
          displayName: 'navigation.permissions',
          show: 'list permissions',
          meta: { icon: 'admin_panel_settings' } // أيقونة ممتازة للصلاحيات
        },
      ],
    },
    {
      name: 'products',
      displayName: 'navigation.products',
      show: ['list brands', 'list model', 'list attributes'],
      meta: {
        icon: 'inventory_2',
      },
      disabled: true,
      children: [
        {
          name: 'product',
          displayName: 'navigation.product',
          show: 'list product',
          meta: { icon: 'inventory' }
        },
        {
          name: 'attributes',
          displayName: 'navigation.attributes',
          show: 'list attributes',
          meta: { icon: 'tune' } // أفضل من settings لهذا الغرض
        },
        {
          name: 'brand',
          displayName: 'navigation.brands',
          show: 'list brands',
          meta: { icon: 'branding_watermark' }
        },
        {
          name: 'discount',
          displayName: 'navigation.discount',
          show: 'list discount',
          meta: { icon: 'percent' } // أيقونة أوضح للخصومات
        },
        {
          name: 'model',
          displayName: 'navigation.models',
          show: 'list model',
          meta: { icon: 'category' } // أو 'auto_awesome_mosaic'
        },
        {
          name: 'coupon',
          displayName: 'navigation.coupons',
          show: 'list coupon',
          meta: { icon: 'local_offer' }
        },
      ],
    },
    {
      name: 'store',
      displayName: 'navigation.stores',
      show: ['list stores', 'list categories'],
      meta: {
        icon: 'store_mall_directory',
      },
      disabled: true,
      children: [
        {
          name: 'stores',
          displayName: 'navigation.stores',
          show: 'list stores',
          meta: { icon: 'storefront' }
        },
        {
          name: 'category',
          displayName: 'navigation.categories',
          show: 'list categories',
          meta: { icon: 'category' }
        },
        {
          name: 'markets',
          displayName: 'navigation.markets',
          show: 'list categories',
          meta: { icon: 'apartment' } // أو 'business'
        },
      ],
    },
    {
      name: 'custom_tabs',
      displayName: 'navigation.custom_tabs',
      show: ['list custom tabs'],
      meta: {
        icon: 'tab',
      },
    },
    {
      name: 'order',
      displayName: 'navigation.orders',
      show: ['list orders'],
      meta: {
        icon: 'shopping_cart_checkout',
      },
    },
    {
      name: 'invoices',
      displayName: 'navigation.invoices',
      show: ['list invoices'],
      meta: {
        icon: 'receipt_long',
      },
    },
    {
      name: 'template-notification',
      displayName: 'navigation.notification',
      show: ['list notification-templates'],
      meta: {
        icon: 'notifications_active',
      },
    },
    {
      name: 'shipping-update',
      displayName: 'navigation.shipping',
      show: ['list shipping-settings'],
      meta: {
        icon: 'local_shipping',
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
          meta: { icon: 'settings_applications' }
        },
        // {
        //   name: 'connect',
        //   displayName: 'navigation.quickBooks',
        //   show: 'list categories',
        //   meta: { icon: 'account_balance' } // أو أيقونة QuickBooks الرسمية إن وجدت
        // },
      ],
    },
  ] as INavigationRoute[],
}
