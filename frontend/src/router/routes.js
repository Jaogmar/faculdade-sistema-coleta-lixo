const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'conta', component: () => import('pages/RegisterAccountPage.vue') },
      { path: 'pontos', component: () => import('pages/CollectionPointsPage.vue') },
      { path: 'mapa', component: () => import('pages/MapPointsPage.vue') },
      { path: 'protocolos', component: () => import('pages/OpenProtocolsPage.vue') },
      { path: 'guia', component: () => import('pages/GuidePage.vue') },
      { path: 'notificacoes', component: () => import('pages/NotificationsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
