import Vue from 'vue'

const vueVisible = {
  install (Vue) {
    Vue.directive('visible', (el, binding) => {
      var value = binding.value

      if (value) {
        el.style.visibility = 'visible'
      } else {
        el.style.visibility = 'hidden'
      }
    })
  }
}

Vue.use(vueVisible)
