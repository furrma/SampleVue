<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center pb-3">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("notifications.title") }}</div>
      </div>
    </div>

    <v-card :style="cardStyle">
      <v-row justify="space-between h-full">
        <v-col cols="3" class="pr-0 h-full">
          <div class="d-flex px-2">
            <!-- 既読/未読/全てのフィルタ -->
            <v-btn-toggle v-model="isRead" mandatory dense>
              <v-btn value="UNREAD">
                {{ $t("notifications.isRead.unread") }}
              </v-btn>
              <v-btn value="READ">
                {{ $t("notifications.isRead.read") }}
              </v-btn>
              <v-btn value="ALL"> {{ $t("notifications.isRead.all") }} </v-btn>
            </v-btn-toggle>
          </div>

          <v-divider class="my-1"></v-divider>

          <!-- 通知リスト -->
          <div class="overflow-y-auto notification-list">
            <!-- ローディング中の表示 -->
            <v-list v-if="isLoading" three-line disabled>
              <v-skeleton-loader v-if="isLoading" type="list-item-three-line" />
            </v-list>
            <!-- データがない場合の表示 -->
            <v-list
              v-else-if="
                !filteredNotifications || filteredNotifications.length == 0
              "
              three-line
              disabled
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    class="grey--text text--lighten-1 font-weight-light"
                  >
                    {{ $t("notifications.noData") }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <!-- リスト表示 -->
            <v-list v-else three-line>
              <v-list-item-group v-model="selected" color="primary" mandatory>
                <v-list-item
                  v-for="(item, index) in filteredNotifications"
                  :key="index"
                  :value="item.id"
                  dense
                >
                  <v-list-item-icon>
                    <v-icon
                      :color="icon(item).color"
                      v-text="icon(item).icon"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle class="d-flex align-center">
                      <div class="mr-1">
                        {{ item.sendDate | sendDateFormat }}
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-chip
                      v-if="!item.isRead"
                      color="primary"
                      small
                      outlined
                      label
                      >未読</v-chip
                    >
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col class="">
          <div v-if="selectedNotification">
            <!-- 既読/未読ボタン -->
            <div>
              <v-btn
                v-if="!selectedNotification.isRead"
                color="primary"
                text
                @click="markAsRead"
              >
                <v-icon left dark>
                  mdi-check
                </v-icon>
                {{ $t("notifications.markAsRead") }}
              </v-btn>
              <v-btn v-else color="secondary" text @click="markAsUnread">
                <v-icon left dark>
                  mdi-undo
                </v-icon>
                {{ $t("notifications.markAsUnread") }}
              </v-btn>
            </div>
            <v-divider class="my-1"></v-divider>
            <!-- 通知詳細 -->
            <div class="text-h5 font-weight-bold mb-1">
              {{ selectedNotification.title }}
            </div>
            <div class="font-weight-normal">
              {{ selectedNotification.sendDate | sendDateFormat }}
            </div>
            <div class="mt-1">
              <v-chip color="primary" small>
                {{ selectedNotification.senderUserName }}
              </v-chip>
            </div>
            <v-divider class="my-2"></v-divider>
            <div>
              {{ selectedNotification.content }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

/**
 * 通知画面です。
 */
export default {
  head: {
    title () {
      return {
        complement: this.$t('notifications.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  props: {
    routeId: Number
  },
  data () {
    return {
      // 状態
      isLoading: false,
      selected: null,
      isRead: 'UNREAD',
      cardHeight: 0,

      // データ
      notifications: []
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    cardStyle () {
      return {
        height: `${this.cardHeight}px`,
        minHeight: '300px'
      }
    },
    selectedNotification () {
      return this.notifications.find((x) => x.id === this.selected)
    },
    filteredNotifications () {
      switch (this.isRead) {
        case 'UNREAD':
          return this.notifications.filter((x) => !x.isRead)
        case 'READ':
          return this.notifications.filter((x) => x.isRead)
        default:
          return this.notifications
      }
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.fetchData()
    },
    routeId () {
      // URLパラメータあるときはその選択を優先
      if (this.routeId) {
        this.isRead = 'ALL'
        this.selected = this.routeId
      }
    },
    isRead () {
      if (!this.filteredNotifications.find((x) => x.id === this.selected)) {
        this.selected = null
      }
    }
  },
  mounted () {
    // イベント登録
    window.addEventListener('resize', this.handleResize)

    // リサイズ初回実行
    this.handleResize()

    // 初回検索
    this.fetchData()
  },
  beforeDestroy: function () {
    // イベント登録解除
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    /**
     * データ取得します
     */
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.notifications = []

        // データ取得
        const response = await this.$axios.get('/notifications')
        this.notifications = response.data

        // URLパラメータあるときはその選択を優先
        if (this.routeId) {
          this.isRead = 'ALL'
          this.selected = this.routeId
        }
      } catch (error) {
        // エラーメッセージを表示
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * 既読にします
     */
    async markAsRead () {
      try {
        // 更新処理
        const notificationId = this.selectedNotification.id
        await this.$axios.post(`/notifications/${notificationId}/read`)

        // 画面情報を更新
        this.selectedNotification.isRead = true

        // リスト再選択
        if (!this.filteredNotifications.find((x) => x.id === this.selected)) {
          this.selected = null
        }
        this.$store.dispatch('notifications/fetchNotifications')
      } catch (error) {
        // エラーメッセージを表示
        this.$store.dispatch('app/catchError', error)
      }
    },

    /**
     * 未読にします
     */
    async markAsUnread () {
      try {
        // 更新処理
        const notificationId = this.selectedNotification.id
        await this.$axios.delete(`/notifications/${notificationId}/read`)

        // 画面情報を更新
        this.selectedNotification.isRead = false

        // リスト再選択
        if (!this.filteredNotifications.find((x) => x.id === this.selected)) {
          this.selected = null
        }
        this.$store.dispatch('notifications/fetchNotifications')
      } catch (error) {
        // エラーメッセージを表示
        this.$store.dispatch('app/catchError', error)
      }
    },

    /**
     * アイコン
     */
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
    },

    handleResize () {
      const HEADER_HEIGHT = 64
      const CONTAINER_PADDING = 24
      const TITLE_HEIGHT = 37
      const TITLE_PADDING = 24
      this.cardHeight = window.innerHeight - (HEADER_HEIGHT + (CONTAINER_PADDING * 2) + TITLE_HEIGHT + TITLE_PADDING)
    }
  },
  filters: {
    sendDateFormat (value) {
      return moment(value).format('YYYY/MM/DD HH:mm')
    }
  }
}
</script>

<style scoped>
.notification-list {
  height: calc(100% - 40px);
}
</style>
