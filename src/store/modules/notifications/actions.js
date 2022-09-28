import axios from '../../../plugins/axios'

/**
 * 通知の自動取得を開始
 * @param {*} param0
 * @param {*} credentials
 */
async function startAutoFetch ({ commit, dispatch, state }) {
  dispatch('notifications/fetchNotifications', null, { root: true })

  if (state.intervalId) {
    clearInterval(state.intervalId)
  }

  const intervalId = setInterval(() => {
    dispatch('notifications/fetchNotifications', null, { root: true })
  }, 60 * 1000)
  commit('SET_INTERVAL_ID', intervalId)
}

/**
 * 通知を取得
 * @param {*} param0
 * @param {*} credentials
 */
async function fetchNotifications ({ commit, dispatch }) {
  // 通知を取得
  const response = await axios.get('/notifications/unread')
  const notifications = response.data

  // Storeに保管
  commit('SET_NOTIFICATIONS', notifications)
}

function clearNotifications ({ commit, state }) {
  clearInterval(state.intervalId)
  commit('CLEAR')
}

export default {
  startAutoFetch,
  fetchNotifications,
  clearNotifications
}
