export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'statistics',
      displayName: 'users_management',
      meta: {
        icon: 'vuestic-iconset-user',
      },
      disabled: true,
      children: [
        {
          name: 'users',
          displayName: 'users',
        },
        {
          name: 'roles',
          displayName: 'roles',
        },
        {
          name: 'Permission',
          displayName: 'Permissions',
        },
      ],
    },






  ] as INavigationRoute[],
}
