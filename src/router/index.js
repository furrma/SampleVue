import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import routes from './routes'

Vue.use(Router)

/**
 * https://router.vuejs.org/
 */
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
 * @param {*} to
 * @param {*} from
 * @param {*} next
 * @returns
 */
router.beforeEach((to, from, next) => {
  // 認証が必要なURLで認証されていない場合はログイン画面にリダイレクトする
  const isLogin = store.getters['auth/isLoggedin']
  const isAllowAnonymous = to.matched.some((page) => page.meta.allowAnonymous)
  if (!isAllowAnonymous && !isLogin) {
    // ログイン画面にリダイレクト
    return next({
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    })
  }

  // 必要な権限を保有していない場合はトップページにリダイレクトする
  if (to.matched.some((page) => page.meta.requirePermissions)) {
    // meta情報から必要な権限を取得
    const requirePermissions = to.matched
      .map(page => page.meta.requirePermissions)
      .reduce((a, b) => { return a.concat(b) }, [])

    const requireArray = to.matched
      .map(page => page.meta.requireAll)
    const requireAll = requireArray[0]
    // 必要な権限を保有しているか判定
    let hasPermissions
    if (requireAll === false) {
      hasPermissions = store.getters['auth/hasAtLeastOnePermission'](requirePermissions)
    } else {
      hasPermissions = store.getters['auth/hasPermissions'](requirePermissions)
    }
    if (!hasPermissions) {
      // トップページにリダイレクト
      return next({
        path: '/'
      })
    }
  }

  return next()
})

export default router
