<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZBD0010.title") }}</div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
      <v-spacer></v-spacer>
      <!--新規登録ボタン-->
      <v-btn v-if="isAdmin" color="primary" @click="openNew">
        {{ $t("common.add") }}
      </v-btn>
    </div>

    <v-card>
      <v-row dense class="pa-2 align-center">
        <v-col cols="12" class="d-flex align-center">
          <!-- 未完了JOBコードフラグ -->
          <v-switch
            v-model="isOnlyDevNotEnd"
          />
          <a-field-label class="pt-1 pr-2">{{ $t("ZBD0010.isOnlyDevNotEnd") }}</a-field-label>
          <!-- キーワード -->
          <a-keyword-text-field
            class="flex-grow-1 mr-2"
            v-model="keywords"
            @search="search"
          />
          <!-- 状態 -->
          <a-btn-toggle-active v-model="toggleActiveValue" />
        </v-col>
      </v-row>

      <!-- プロジェクトコードマスタ -->
      <v-simple-table class="table" fixed-header dense :height="getHeight">
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ $t("ZBD0010.projectCd") }}</th>
              <th>{{ $t("ZBD0010.projectName") }}</th>
              <th>{{ $t("ZBD0010.companyName") }}</th>
              <th>{{ $t("ZBD0010.isActive") }}</th>
              <th>{{ $t("ZBD0010.jobCd") }}</th>
              <th>{{ $t("ZBD0010.jobName") }}</th>
              <th align="right">{{ $t("ZBD0010.orderAmount") }}</th>
              <th align="right">{{ $t("ZBD0010.devAmount") }}</th>
              <th align="right">{{ $t("ZBD0010.inTargetAmount") }}</th>
              <th class="right">{{ $t("ZBD0010.outTargetAmount") }}</th>
              <th>{{ $t("ZBD0010.devStartDate") }}</th>
              <th>{{ $t("ZBD0010.devEndDate") }}</th>
              <th>{{ $t("ZBD0010.pmUserName") }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in projectCdData">
              <tr
                v-for="(subItem, subIndex) in item.jobCdList"
                :key="subItem.id"
                :class="subIndex === 0 ? 'totalRow' : ''"
              >
                <td v-if="subIndex === 0" :rowspan="getRowSpan(item)">
                  <router-link
                    v-if="isAdmin"
                    :to="{ name: 'ZBD0010-detail', params: { id: item.id } }"
                  >
                    {{ item.projectCd }}
                  </router-link>
                  <div v-else>
                    {{ item.projectCd }}
                  </div>
                </td>
                <td v-if="subIndex === 0" :rowspan="getRowSpan(item)">
                  {{ item.projectName }}
                </td>
                <td v-if="subIndex === 0" :rowspan="getRowSpan(item)">
                  {{ item.companyName }}
                </td>
                <td v-if="subIndex === 0" :rowspan="getRowSpan(item)">
                  <v-icon v-if="item.isActive" small color="success">
                    mdi-check-circle
                  </v-icon>
                  <v-icon v-else small color="disable">
                    mdi-circle-outline
                  </v-icon>
                </td>
                <td :class="subIndex === 0 ? 'totalRow' : ''">
                  {{ subItem.jobCd }}
                </td>
                <td :class="subIndex === 0 ? 'totalRow' : ''">
                  {{ subItem.jobName }}
                </td>
                <td
                  :class="subIndex === 0 ? 'totalRow text-right pink--text' : 'text-right'"
                >
                  {{ subItem.orderAmount.toLocaleString() }}
                </td>
                <td
                  :class="subIndex === 0 ? 'totalRow text-right pink--text' : 'text-right'"
                >
                  {{ subItem.devAmount.toLocaleString() }}
                </td>
                <td
                  :class="subIndex === 0 ? 'totalRow text-right pink--text' : 'text-right'"
                >
                  {{ subItem.inTargetAmount.toLocaleString() }}
                </td>
                <td
                  :class="subIndex === 0 ? 'totalRow text-right pink--text' : 'text-right'"
                >
                  {{ subItem.outTargetAmount.toLocaleString() }}
                </td>
                <td :class="subIndex === 0 ? 'totalRow pink--text' : ''">
                  {{ subItem.devStartDate }}
                </td>
                <td
                  v-if="subItem.devEndDate != ''"
                  :class="subIndex === 0 ? 'totalRow pink--text' : ''"
                >
                  {{ subItem.devEndDate }}
                  <v-icon small>
                    mdi-pencil-box-outline
                  </v-icon>
                </td>
                <td v-else :class="subIndex === 0 ? 'totalRow pink--text' : ''">
                  {{ subItem.devEndDateInitial }}
                </td>
                <td :class="subIndex === 0 ? 'totalRow' : ''">
                  {{ subItem.pmUserName }}
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ToggleActiveValue from '../../../../constants/ToggleActiveValue'
import Permissions from '../../../../constants/Permissions'

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZBD0010.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // 状態
      isAdmin: false,
      isLoading: false,

      // フォーム
      keywords: '',
      toggleActiveValue: ToggleActiveValue.ACTIVE,
      isOnlyDevNotEnd: false,

      // データ
      projectCdData: [],

      // 詳細検索条件

      searchDetailMenu: false
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0010.title'),
          to: { name: 'ZBD0010' }
        }
      ]
    },
    getHeight () {
      return window.innerHeight - 320
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.search()
    },
    toggleActiveValue () {
      this.search()
    },
    isOnlyDevNotEnd () {
      this.search()
    }
  },
  mounted () {
    // 権限をチェック
    this.checkPermissions()
    // 初回検索
    this.search()
  },
  methods: {
    checkPermissions () {
      // 管理者権限チェック
      const hasAdminPermission = this.$store.getters['auth/hasPermissions']([
        Permissions.PROJECT_CD_ADMIN
      ])
      this.isAdmin = hasAdminPermission
    },
    // 検索取得を行う
    async search () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.projectCdData = []

        // クエリを作成
        const query = {}
        if (this.keywords) {
          query.keywords = this.keywords
        }
        switch (this.toggleActiveValue) {
          case ToggleActiveValue.ACTIVE:
            query.isActive = true
            break
          case ToggleActiveValue.DISABLED:
            query.isActive = false
            break
        }
        query.isOnlyDevNotEnd = this.isOnlyDevNotEnd

        // データ取得
        const response = await this.$axios.get('/projectCds', {
          params: query
        })
        this.projectCdData = response.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    // 新規登録画面に遷移する
    openNew () {
      this.$router.push({ name: 'ZBD0010-new' })
    },
    // 行スパンを取得する
    getRowSpan (item) {
      if (item.jobCdList.length > 0) {
        return item.jobCdList.length
      } else {
        return 1
      }
    }
  }
}
</script>

<style scoped>
table td:is(.totalRow) {
  background: rgb(243, 255, 134) !important;
}

.v-data-table {
  display: block;
  max-width: none;
  overflow-x: hidden;
  white-space: nowrap;
}

.v-data-table__wrapper {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}
</style>
