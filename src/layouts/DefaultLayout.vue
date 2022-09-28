<template>
  <div class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1"
    >
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2">
          <div class="d-flex align-center title text-uppercase">
            <img
              src="/images/logos/logo-sample.jpg"
              style="height:25px;"
            />
            <div class="ml-1 title-text">
              {{ $t('app.productName') }}
            </div>
          </div>
        </div>
      </template>

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />

    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar app>
      <v-card class="flex-grow-1 d-flex pa-0 ma-0" flat>
        <div class="d-flex flex-grow-1 align-center">
          <div class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <v-spacer></v-spacer>

            <toolbar-language />

            <div class="mr-1">
              <toolbar-notifications />
            </div>

            <toolbar-user />
          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import config from '../configs'
import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage'
import ToolbarNotifications from '../components/toolbar/ToolbarNotifications'

export default {
  components: {
    MainMenu,
    ToolbarUser,
    ToolbarLanguage,
    ToolbarNotifications
  },
  data () {
    return {
      drawer: null,

      navigation: config.navigation
    }
  }
}
</script>

<style scoped>
.title-text {
  padding-top: 1px;
}
</style>
