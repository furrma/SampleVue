import actions from './actions'

const state = {
  // 通知
  notifications: [],
  intervalId: null
}

const mutations = {
  /**
   * 通知をセットします
   * @param {*} state
   * @param {*} newValue
   */
  SET_NOTIFICATIONS (state, notifications) {
    state.notifications = notifications
  },

  /**
   * SetIntervalのIDをセットします。
   * @param {*} state
   * @param {*} intervalId
   */
  SET_INTERVAL_ID (state, intervalId) {
    state.intervalId = intervalId
  },

  /**
   * クリアします。
   */
  CLEAR (state) {
    state.notifications = []
    state.intervalId = null
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
