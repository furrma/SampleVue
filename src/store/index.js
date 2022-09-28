import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app/index'
import notifications from './modules/notifications/index'
import auth from './modules/auth/index'

Vue.use(Vuex)

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  modules: {
    app,
    notifications,
    auth
  }
})

export default store
