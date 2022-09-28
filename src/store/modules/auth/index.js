import actions from './actions'
import includesAll from '../../../utils/includesAll'

const state = {
  /**
   * ログインユーザー
   */
  user: getSavedState('auth.user')
}

const getters = {
  /**
   * ログインしているかどうかを判定します。
   * @param {*} state
   * @returns
   */
  isLoggedin (state) {
    if (!state.user) {
      return false
    }
    const token = sessionStorage.getItem('token')
    if (!token) {
      return false
    }
    return true
  },

  /**
   * 必要な権限を全て保持しているかを判定します。
   * @param {*} state
   * @returns
   */
  hasPermissions: (state) => (requirePermissions) => {
    if (!state.user) {
      return false
    }
    const permissionCds = (state.user.permissions || []).map(x => x.permissionCd)
    return includesAll(permissionCds, requirePermissions)
  },

  /**
   * 必要な権限を1つでも保持しているかを判定します。
   * @param {*} state
   * @returns
   */
  hasAtLeastOnePermission: (state) => (requirePermissions) => {
    if (!state.user) {
      return false
    }
    const permissionCds = (state.user.permissions || []).map(x => x.permissionCd)
    const hasPermission = requirePermissions.some(r => permissionCds.includes(r))
    if (!hasPermission) {
      return false
    } else {
      return true
    }
  }
}

const mutations = {
  /**
   * ログインユーザーをセットします
   * @param {*} state
   * @param {*} newValue
   */
  SET_USER (state, newValue) {
    state.user = newValue
    saveState('auth.user', newValue)
  },

  CLEAR_USER (state) {
    state.user = null
    saveState('auth.user', null)
  }
}

/**
 * SessionStorageから値を取得する
 * @param {*} key
 * @returns
 */
function getSavedState (key) {
  return JSON.parse(sessionStorage.getItem(key))
}

/**
 * SessionStorageに値を保存します
 * @param {*} key
 * @param {*} state
 */
function saveState (key, state) {
  sessionStorage.setItem(key, JSON.stringify(state))
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
