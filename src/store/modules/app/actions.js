import i18n from '../../../plugins/vue-i18n'

/**
 * 言語を変更します
 * @param {*} param0
 * @param {*} locale
 */
function setLocale ({ state, commit }, locale) {
  commit('setLocale', locale)
}

/**
 * 処理成功メッセージを表示します
 * @param {*} param0
 * @param {*} param1
 */
function showSuccess ({ state, commit }, { message, args }) {
  if (state.toast.show) commit('hideToast')
  setTimeout(() => {
    commit('showToast', {
      color: 'info',
      icon: 'mdi-information-outline',
      message: translate({ message, args }),
      timeout: 5000
    })
  })
}

/**
 * 警告メッセージを表示します
 * @param {*} param0
 * @param {*} param1
 */
function showWarning ({ state, commit }, { message, args }) {
  if (state.toast.show) commit('hideToast')
  setTimeout(() => {
    commit('showToast', {
      color: 'warning',
      icon: 'mdi-alert',
      message: translate({ message, args }),
      timeout: 10000
    })
  })
}

/**
 * エラーメッセージを表示します
 * @param {*} param0
 * @param {*} param1
 */
function showError ({ state, commit }, { message, args }) {
  if (state.toast.show) commit('hideToast')
  setTimeout(() => {
    commit('showToast', {
      color: 'error',
      icon: 'mdi-alert',
      message: translate({ message, args }),
      timeout: 10000
    })
  })
}

/**
 * エラーメッセージを表示します
 * @param {*} param0
 * @param {*} param1
 */
function showErrorRaw ({ state, commit }, message) {
  if (state.toast.show) commit('hideToast')
  setTimeout(() => {
    commit('showToast', {
      color: 'error',
      icon: 'mdi-alert',
      message,
      timeout: 10000
    })
  })
}

/**
 * エラーメッセージを表示します
 * @param {*} param0
 * @param {*} error
 */
function catchError ({ state, commit }, error) {
  // レスポンスが取得できない場合
  // axios-interceptorで処理するため何もしない
  if (!error.response) {
    return
  }

  // 5xxエラーの場合 or 401エラーがログイン失敗以外の場合
  // axios-interceptorで処理するため何もしない
  const { status, config } = error.response
  if ((status >= 500 && status <= 599) ||
    (status === 401 && config.url !== '/authenticate')) {
    return
  }

  // レスポンスのエラーメッセージを表示
  const message = translate(error.response.data.message)
  showErrorRaw({ state, commit }, message)
}

/**
 * メッセージを翻訳します
 * @param {*} param0
 * @returns
 */
function translate ({ message, args }) {
  return i18n.t(message, (args || []).map(arg => i18n.t(arg)))
}

export default {
  setLocale,
  showWarning,
  showSuccess,
  showError,
  showErrorRaw,
  catchError
}
