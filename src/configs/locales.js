import en from '../translations/en'
import ja from '../translations/ja'

// デフォルト言語
const fallbackLocale = 'ja'

// サポートする言語リスト
const availableLocales = [
  {
    code: 'en',
    label: 'English',
    messages: en
  },
  {
    code: 'ja',
    label: '日本語',
    messages: ja
  }
]

// ブラウザ言語を取得
let locale = fallbackLocale
try {
  const { 0: browserLang } = navigator.language.split('-')
  if (availableLocales.map(x => x.code).includes(browserLang)) {
    locale = browserLang
  }
} catch (e) {
  // Do nothing
}

export default {
  locale,
  fallbackLocale,
  availableLocales
}
