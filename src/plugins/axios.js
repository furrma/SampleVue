import Vue from 'vue'
import axios from 'axios'
import store from '../store/index'
import router from '../router'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

axios.defaults.headers.common.Accept = 'application/json'
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// HTTPリクエスト時の割り込み処理
axios.interceptors.request.use((config) => {
  // AuthorizationヘッダーにSessionStorageのトークンをセット
  config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`

  // Accept-Languageヘッダーに選択言語をセット
  const locale = store.getters['app/locale']
  if (locale) {
    config.headers['Accept-Language'] = locale
  }

  return config
})

// HTTPレスポンス時の割り込み処理
axios.interceptors.response.use(
  (response) => {
    // レスポンスのトークンをSessionStorageに格納
    let token = null
    if (response.headers && response.headers.Authorization) {
      token = response.headers.Authorization
    }
    if (!token && response.data.token) {
      token = response.data.token
    }
    if (token) {
      sessionStorage.setItem('token', token)
    }
    return response
  },
  (err) => {
    if (err.response) {
      // リクエストが行われ、サーバーがステータスコードで応答したが2xxの範囲外
      const { status, config } = err.response

      if (status >= 500 && status <= 599) {
        // 5xxエラーの場合、メッセージを表示
        console.error(err)
        console.log(err.toJSON())
        store.dispatch('app/showErrorRaw', {
          message: err.messages
        })
      } else if (status === 401 && config.url !== '/authenticate') {
        // 401エラーがログイン失敗以外の場合、強制ログアウト
        router.push({
          name: 'login',
          query: { redirect: router.currentRoute.fullPath }
        })
      } else {
        // その他エラーは機能側で制御するため、ここでは何もしない
      }
    } else if (err.request) {
      // リクエストは行われたが、応答がない場合
      // ネットワークエラーとしてメッセージを表示する
      console.error(err)
      console.log(err.toJSON())
      store.dispatch('app/showError', {
        message: 'messages.error.networkError'
      })
    } else {
      // リクエストの設定中に何かが発生した場合
      // 予期せぬエラーとしてメッセージを表示する
      console.error(err)
      console.log(err.toJSON())
      store.dispatch('app/showError', {
        message: 'messages.error.unexpected'
      })
    }

    return Promise.reject(err)
  }
)

Vue.prototype.$axios = axios

export default axios
