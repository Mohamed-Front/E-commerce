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
      show:['dashboard'],
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'statistics',
      displayName: 'users_management',
      show:['list users','list permissions','list roles'],
      meta: {
        icon: 'vuestic-iconset-user',
      },
      disabled: true,
      children: [
        {
          name: 'users',
          displayName: 'users',
          show:'list users'
        },
        {
          name: 'roles',
          displayName: 'roles',
           show:'list roles'
        },
        {
          name: 'Permission',
          displayName: 'Permissions',
           show:'list permissions'
        },
      ],
    },






  ] as INavigationRoute[],
}
