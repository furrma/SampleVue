import Vue from 'vue'
import { extend, localize, ValidationProvider, ValidationObserver } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'
import en from 'vee-validate/dist/locale/en.json'

import config from '../configs/locales'

// ルール設定
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
})

// ローカライズ設定
localize({
  ja,
  en
})
localize(config.locale)

// コンポーネント登録
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
