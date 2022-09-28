import axios from '../../../plugins/axios'

/**
 * ログイン処理
 * @param {*} param0
 * @param {*} credentials
 */
async function login ({ commit, dispatch }, credentials) {
  // 認証
  await dispatch('authenticate', credentials)

  // ログインユーザー情報を取得
  // 全てのAPIリクエストを並列処理して待機する
  const [responseGetUser, responseGetPermissions] = await Promise.all([
    axios.get('/user'),
    axios.get('/user/permissions')
  ])

  // ログインユーザーをStoreに保管
  const user = responseGetUser.data
  user.permissions = responseGetPermissions.data
  commit('SET_USER', user)
}

/**
 * ログアウト処理
 * @param {*} param0
 */
function logout ({ commit, dispatch }) {
  commit('CLEAR_USER')
  dispatch('notifications/clearNotifications', null, { root: true })

  // SessionStorageのトークンを削除
  sessionStorage.removeItem('token')
}

/**
 * 認証処理
 */
async function authenticate ({ commit, state }, credentials) {
  try {
    // 認証リクエストを送信
    await axios.post('/authenticate', credentials)
  } catch (error) {
    // 認証NGの場合の処理
    if (error.response && error.response.status === 401) {
      // 認証エラーの場合はログイン情報をクリア
      commit('SET_USER', null)
    }
    throw error
  }
}

export default {
  login,
  logout,
  authenticate
}
