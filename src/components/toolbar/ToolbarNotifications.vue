<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-badge
        bordered
        :content="notificationCount"
        :value="notificationCount"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon v-on="on">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- dropdown card -->
    <v-card>
      <v-list max-width="400">
        <v-subheader class="pa-2 font-weight-bold">{{ $t('toolbarNotifications.title') }}</v-subheader>
        <div>
          <!-- データがない場合の表示 -->
          <v-list-item v-if="notificationCount === 0" disabled>
            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-1 font-weight-light">
                {{ $t("toolbarNotifications.noData") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- リスト表示 -->
          <v-list-item v-for="(item, index) in limittedNotifications" :key="index" :value="item.id" @click="openNotificationDetailPage(item.id)">
            <v-list-item-icon>
              <v-icon :color="icon(item).color" v-text="icon(item).icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="align-self-center">
              <v-list-item-action-text>{{
                item.sendDate | sendDateFormat
              }}</v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </div>
      </v-list>

      <div class="text-center py-2">
        <v-btn small @click="openNotificationPage">{{ $t('toolbarNotifications.seeAll') }}</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState('notifications', ['notifications']),
    notificationCount () {
      return this.notifications ? this.notifications.length : 0
    },
    limittedNotifications () {
      // 先頭10件のみ表示
      const LIMIT = 10
      return this.notifications ? this.notifications.slice(0, LIMIT) : []
    }
  },
  mounted () {
    // 通知の自動取得を開始
    this.$store.dispatch('notifications/startAutoFetch')
  },
  methods: {
    openNotificationDetailPage (id) {
      this.$router.push({ name: 'notifications-detail', params: { id } })
    },
    openNotificationPage () {
      this.$router.push({ name: 'notifications' })
    },
    icon (item) {
      switch (item.type) {
        case 'Warning':
          return {
            color: 'warning',
            icon: 'mdi-alert-circle'
          }
        case 'Error':
          return {
            color: 'error',
            icon: 'mdi-alert-circle'
          }
        default:
          return {
            color: 'primary',
            icon: 'mdi-information'
          }
      }
    }
  },
  filters: {
    sendDateFormat (value) {
      const sendDate = moment(value)
      if (sendDate.isSame(new Date(), 'day')) {
        return sendDate.format('HH:mm')
      } else {
        return sendDate.format('MM/DD HH:mm')
      }
    }
  }
}
</script>
