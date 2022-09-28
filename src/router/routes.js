// Pages
import NotificationsPage from '../pages/notifications/Notifications.vue'
import BlankPage from '../pages/BlankPage.vue'
import SandboxPage from '../pages/_sandbox/Sandbox.vue'
import NotFoundPage from '@/pages/error/NotFoundPage.vue'
import UserSearchUIPage from '../pages/_usersearch_ui/UserSearchUI.vue'
import JobCdSearchUIPage from '../pages/_jobcdsearch_ui/JobCdSearchUI.vue'
import FilterSamplePage from '@/pages/someFilters/FilterSamplePage.vue'
import FilterDetailPage from '@/pages/someFilters/FilterSampleDetail.vue'
import PortalSamplePage from '@/pages/portal/PortalSample.vue'

// Routes
import appZRoutes from './app-z.routes'
import appBRoutes from './app-b.routes'

export default [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: BlankPage
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsPage
  },
  {
    path: '/notifications/:id',
    name: 'notifications-detail',
    component: NotificationsPage,
    props: route => ({
      routeId: Number(route.params.id)
    })
  },
  {
    path: '/sandbox',
    name: 'sandbox',
    component: SandboxPage
  },
  {
    path: '/usersearchui',
    name: 'usersearchui',
    component: UserSearchUIPage
  },
  {
    path: '/jobcdsearchui',
    name: 'jobcdsearchui',
    component: JobCdSearchUIPage
  },
  {
    path: '/filterSample',
    name: 'filterSample',
    component: FilterSamplePage
  },
  {
    path: '/filterSampleDetail',
    name: 'filterSampleDetail',
    component: FilterDetailPage
  },
  {
    path: '/portalSample',
    name: 'portalSample',
    component: PortalSamplePage
  },
  ...appZRoutes,
  ...appBRoutes,
  {
    path: '/error/404',
    name: 'error-not-found',
    component: NotFoundPage,
    meta: {
      layout: 'error'
    }
  },
  {
    path: '*',
    redirect: { name: 'error-not-found' }
  }
]
