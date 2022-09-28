import Vue from 'vue'
import i18n from './vue-i18n'

/**
 * ValidationObserverにエラーレスポンスのメッセージをセットします
 * @param {*} observer
 * @param {*} error
 * @returns
 */
function setFormErrors (observer, error) {
  // エラー情報が取得できない場合は処理しない
  if (!error.response || !error.response.data || !error.response.data.errors) {
    return
  }

  // ValidationObserverにエラーメッセージをセット
  const errors = error.response.data.errors
  const formErrors = {}
  Object.keys(errors).forEach(k => {
    formErrors[k] = errors[k].map(m => translate(m))
  })
  observer.setErrors(formErrors)
}

/**
 * メッセージを翻訳します
 * @param {*} m
 * @returns
 */
function translate (m) {
  const args = m.args.map(arg => i18n.t(arg))
  return i18n.t(m.message, args)
}

Vue.prototype.$setFormErrors = setFormErrors
