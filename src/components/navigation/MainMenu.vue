<template>
  <v-list nav dense>
    <div v-for="(item, index) in authorizedMenu" :key="index">
      <template v-if="item.visible">
        <div v-if="item.key || item.text" class="pa-1 mt-2 overline">{{ item.key ? $t(item.key) : item.text }}</div>
        <nav-menu :menu="item.items" />
      </template>
    </div>
  </v-list>
</template>

<script>
import NavMenu from './NavMenu'
import authorizeMenu from './authorizeMenu'

export default {
  components: {
    NavMenu
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    authorizedMenu () {
      return authorizeMenu(this.menu)
    }
  }
}
</script>
