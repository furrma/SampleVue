import Vue from 'vue'
import App from './App.vue'

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import './plugins/vee-validate'

import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'
import './plugins/axios'
import './plugins/vue-visible'
import './plugins/setFormErrors'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'
import './assets/scss/utility.scss'

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'

import ABreadcrumbs from './components/common/ABreadcrumbs'
import AFieldLabel from './components/forms/AFieldLabel'
import ATextField from './components/forms/ATextField'
import ASelect from './components/forms/ASelect'
import ALabelTextField from './components/forms/ALabelTextField'
import ALabelSelect from './components/forms/ALabelSelect'
import ALabelSwitch from './components/forms/ALabelSwitch.vue'
import AKeywordTextField from './components/forms/AKeywordTextField'
import ABtnToggleActive from './components/forms/ABtnToggleActive'
import ASwitchActive from './components/forms/ASwitchActive'
import ALabelTranslationTextFieldGroup from './components/forms/ALabelTranslationTextFieldGroup'
import ADateSelect from './components/forms/ADateSelect'
import ALabelDateSelect from './components/forms/ALabelDateSelect'
import ALabelNumberField from './components/forms/ALabelNumberField.vue'
import ABtnToggle from './components/forms/ABtnToggle.vue'
import ALabelBtnToggle from './components/forms/ALabelBtnToggle.vue'

Vue.component('ABreadcrumbs', ABreadcrumbs)
Vue.component('AFieldLabel', AFieldLabel)
Vue.component('ATextField', ATextField)
Vue.component('ASelect', ASelect)
Vue.component('ALabelTextField', ALabelTextField)
Vue.component('ALabelSelect', ALabelSelect)
Vue.component('ALabelSwitch', ALabelSwitch)
Vue.component('ABtnToggleActive', ABtnToggleActive)
Vue.component('AKeywordTextField', AKeywordTextField)
Vue.component('ASwitchActive', ASwitchActive)
Vue.component('ALabelTranslationTextFieldGroup', ALabelTranslationTextFieldGroup)
Vue.component('ADateSelect', ADateSelect)
Vue.component('ALabelDateSelect', ALabelDateSelect)
Vue.component('ALabelNumberField', ALabelNumberField)
Vue.component('ABtnToggle', ABtnToggle)
Vue.component('ALabelBtnToggle', ALabelBtnToggle)

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
