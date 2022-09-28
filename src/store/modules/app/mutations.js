// ----------------------------------------
// 言語を変更する
// ----------------------------------------
function setLocale (state, locale) {
  state.locale = locale
}

// ----------------------------------------
// トーストを表示する
// ----------------------------------------
function showToast (state, toast) {
  const { color, timeout, message, icon } = toast

  state.toast = {
    message,
    color,
    timeout,
    icon,
    show: true
  }
}

// ----------------------------------------
// トーストを非表示にする
// ----------------------------------------
function hideToast (state) {
  state.toast.show = false
}

// ----------------------------------------
// トーストをリセットする
// ----------------------------------------
function resetToast (state) {
  state.toast = {
    show: false,
    color: 'black',
    message: '',
    icon: '',
    timeout: 3000
  }
}

export default {
  setLocale,
  showToast,
  hideToast,
  resetToast
}
