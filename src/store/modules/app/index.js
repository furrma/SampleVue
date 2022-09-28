import actions from './actions'
import mutations from './mutations'
import config from '../../../configs/locales'

const { fallbackLocale } = config

const state = {
  // 言語
  locale: fallbackLocale,

  // トースト
  toast: {
    show: false,
    color: 'black',
    icon: '',
    message: '',
    timeout: 3000
  }
}

const getters = {
  /**
   * 現在の選択言語を取得します
   * @param {*} state
   * @returns
   */
  locale (state) {
    return state.locale
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
