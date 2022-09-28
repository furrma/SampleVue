<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZBD0020.title") }}</div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
      <v-spacer></v-spacer>
      <!-- 新規登録ボタン -->
      <v-btn v-if="isAdmin" color="primary" @click="openNew">
        {{ $t("common.add") }}
      </v-btn>
    </div>

    <v-card>
      <v-row dense class="pa-2 align-center">
        <v-col cols="12" class="d-flex align-center">
          <!-- キーワード -->
          <a-keyword-text-field class="flex-grow-1 mr-2" v-model="keywords" @search="search" />
          <!-- 検索条件詳細 -->
          <v-menu
            v-model="searchDetailMenu"
            :close-on-content-click="false"
            :nudge-width="200"
            transition="fab-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                {{ $t("ZBD0020.searchDetails.title") }}
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <!-- PM未登録JOBコード -->
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="isUnregistered"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>{{
                    $t("ZBD0020.searchDetails.isUnregistered")
                  }}</v-list-item-title>
                </v-list-item>
                <!-- 仮JOBコード -->
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="isOnlyTentative"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>{{
                    $t("ZBD0020.searchDetails.isOnlyTentative")
                  }}</v-list-item-title>
                </v-list-item>
                <!-- 工事進行基準対象JOBコード -->
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="isOnlyPOC"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>{{
                    $t("ZBD0020.searchDetails.isOnlyPOC")
                  }}</v-list-item-title>
                </v-list-item>
                <!-- 営業支援JOBコード -->
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="isIncludeSalesSupport"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>{{
                    $t("ZBD0020.searchDetails.isIncludeSalesSupport")
                  }}</v-list-item-title>
                </v-list-item>
                <!-- 開発終了JOBコード -->
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="isIncludeDevEnd"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>{{
                    $t("ZBD0020.searchDetails.isIncludeDevEnd")
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider />

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="searchDetailMenu = false">
                  {{ $t("common.cancel") }}
                </v-btn>
                <v-btn color="primary" text @click="search">
                  {{ $t("common.search") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <!-- JOBコードマスタ -->
      <v-data-table
        :headers="jobCdHeaders"
        :items="jobCdData"
        :loading="isLoading"
        dense
        :items-per-page="-1"
        virtual-rows
        hide-default-footer
        sort-by="jobCd"
        group-by="supplierCd"
        show-group-by
        class="flex-grow-1 schedule-table"
        :height="getHeight"
        fixed-header
      >
        <!-- JOBコードカラム -->
        <template v-slot:[`item.jobCd`]="{ item }">
          <router-link
            v-if="isAdmin"
            :to="{ name: 'ZBD0020-detail', params: { id: item.id } }"
          >
            {{ item.jobCd }}
          </router-link>
          <div v-if="!isAdmin">
            {{ item.jobCd }}
          </div>
        </template>

        <!-- 受注金額カラム 3桁区切り表示 -->
        <template v-slot:[`item.orderAmount`]="{ item }">
          {{ item.orderAmount.toLocaleString() }}
        </template>

        <!-- 管理費カラム 3桁区切り表示 -->
        <template v-slot:[`item.managementCost`]="{ item }">
          {{ item.managementCost.toLocaleString() }}
        </template>

        <!-- 開発有効金額カラム 3桁区切り表示 -->
        <template v-slot:[`item.devAmount`]="{ item }">
          {{ item.devAmount.toLocaleString() }}
        </template>

        <!-- (内)目標金額カラム 3桁区切り表示 -->
        <template v-slot:[`item.inTargetAmount`]="{ item }">
          {{ item.inTargetAmount.toLocaleString() }}
        </template>

        <!-- (外)目標金額カラム 3桁区切り表示 -->
        <template v-slot:[`item.outTargetAmount`]="{ item }">
          {{ item.outTargetAmount.toLocaleString() }}
        </template>

        <!-- 開発開始日 -->
        <template v-slot:[`item.devStartDate`]="{ item }">
          <div v-if="item.devStartDate">
            {{ item.devStartDate.substr(0, 10) }}
          </div>
        </template>

        <!-- 開発終了年月 ブランクであれば、開発終了年月(初回)を表示 -->
        <template v-slot:[`item.devEndDate`]="{ item }">
          <div v-if="item.devEndDate">
            {{ item.devEndDate }}
            <v-icon small>
              mdi-pencil-box-outline
            </v-icon>
          </div>
          <div v-if="!item.devEndDate">
            {{ item.devEndDateInitial }}
          </div>
        </template>

        <!-- 請求日 -->
        <template v-slot:[`item.billingDate`]="{ item }">
          <div v-if="item.billingDate">
            {{ item.billingDate.substr(0, 10) }}
          </div>
        </template>

        <!-- アクションカラム -->
        <template v-slot:[`item.actions`]="{ item }">
          <!-- ジョブ備考コード設定 -->
          <v-tooltip bottom v-if="hasRemarksCdPermission">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="openJobCdRemarks(item)">
                mdi-note-text
              </v-icon>
            </template>
            <div>{{ $t("ZBD0020.actions.jobCdRemark") }}</div>
          </v-tooltip>

          <!-- 検索制限JOBコード設定 -->
          <v-tooltip bottom v-if="isAdmin">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="isAdmin"
                v-bind="attrs"
                v-on="on"
                @click="openJobCdRelationalUser(item)"
              >
                mdi-account-cog
              </v-icon>
            </template>
            <div>{{ $t("ZBD0020.actions.jobCdRelationalUser") }}</div>
          </v-tooltip>

          <!-- JOBコードコピー -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="copyToClipboard(item)">
                mdi-content-copy
              </v-icon>
            </template>
            <div>{{ $t("ZBD0020.actions.jobCdCopy") }}</div>
          </v-tooltip> </template
        >

        <!--グループヘッダー-->
        <template v-slot:[`group.header`]="{ group, isOpen, toggle }">
          <th colspan="5" class="onlySticky">
            <v-icon small @click="toggle">
              {{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
            {{ group }}
          </th>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Permissions from '../../../../constants/Permissions'

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZBD0020.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // 状態
      isAdmin: false,
      isLoading: false,
      hasRemarksCdPermission: false,

      // フォーム
      keywords: '',

      // データ
      jobCdData: [],

      // 詳細検索条件
      isUnregistered: false,
      isIncludeSalesSupport: true,
      isOnlyTentative: false,
      isIncludeDevEnd: false,
      isOnlyPOC: false,

      searchDetailMenu: false
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0020.title'),
          to: { name: 'ZBD0020' }
        }
      ]
    },
    jobCdHeaders () {
      return [
        {
          text: this.$t('ZBD0020.actions.header'),
          value: 'actions',
          groupable: false,
          sortable: false,
          divider: true,
          width: 120,
          fixed: true
        },
        {
          text: this.$t('ZBD0020.jobCd'),
          value: 'jobCd',
          groupable: false,
          divider: true,
          width: 150,
          fixed: true
        },
        { text: '', value: 'supplierCd', width: 40 },
        {
          text: this.$t('ZBD0020.supplierName'),
          value: 'supplierName',
          divider: true,
          width: 200
        },
        {
          text: this.$t('ZBD0020.jobName'),
          value: 'jobName',
          groupable: false,
          divider: true,
          width: 300
        },
        {
          text: this.$t('ZBD0020.orderAmount'),
          value: 'orderAmount',
          groupable: false,
          divider: true,
          align: 'right'
        },
        {
          text: this.$t('ZBD0020.devAmount'),
          value: 'devAmount',
          groupable: false,
          divider: true,
          align: 'right'
        },
        {
          text: this.$t('ZBD0020.inTargetAmount'),
          value: 'inTargetAmount',
          groupable: false,
          divider: true,
          align: 'right'
        },
        {
          text: this.$t('ZBD0020.outTargetAmount'),
          value: 'outTargetAmount',
          groupable: false,
          divider: true,
          align: 'right'
        },
        {
          text: this.$t('ZBD0020.devStartDate'),
          value: 'devStartDate',
          groupable: false,
          divider: true
        },
        {
          text: this.$t('ZBD0020.devEndDate'),
          value: 'devEndDate',
          groupable: false,
          divider: true
        },
        {
          text: this.$t('ZBD0020.billingDate'),
          value: 'billingDate',
          divider: true
        },
        {
          text: this.$t('ZBD0020.selUserName'),
          value: 'selUserName',
          divider: true
        },
        {
          text: this.$t('ZBD0020.pmUserName'),
          value: 'pmUserName',
          divider: true
        }
      ]
    },
    getHeight () {
      return window.innerHeight - 300
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.search()
    }
  },
  mounted () {
    // 管理者チェック
    this.checkPermissions()
    // 初回検索
    this.search()
  },
  methods: {
    checkPermissions () {
      // 管理者権限チェック
      const hasAdminPermission = this.$store.getters['auth/hasPermissions']([
        Permissions.JOB_CD_S2I_ADMIN
      ])
      this.isAdmin = hasAdminPermission

      // 備考コード権限チェック
      const hasRemarksCdPermission = this.$store.getters['auth/hasAtLeastOnePermission']([
        Permissions.JOB_REMARKS_CD_ADMIN,
        Permissions.JOB_REMARKS_CD_REFERENCE
      ])
      this.hasRemarksCdPermission = hasRemarksCdPermission
    },
    // 検索取得を行う
    async search () {
      try {
        // ローディングを設定
        this.searchDetailMenu = false
        this.isLoading = true
        this.jobCdData = []

        // クエリを作成
        const query = {}

        // キーワードが空白でない場合には追加
        if (this.keywords) {
          query.keywords = this.keywords
        }

        query.isUnregistered = this.isUnregistered
        query.isOnlyTentative = this.isOnlyTentative
        query.isOnlyPOC = this.isOnlyPOC
        query.isIncludeSalesSupport = this.isIncludeSalesSupport
        query.isIncludeDevEnd = this.isIncludeDevEnd

        // データ取得
        const response = await this.$axios.get('/jobCds', {
          params: query
        })
        this.jobCdData = response.data
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
      this.$router.push({ name: 'ZBD0020-new' })
    },

    // JOBコード備考画面へ遷移する
    openJobCdRemarks (item) {
      this.$router.replace({ name: 'ZBD0030-list', params: { id: item.id } })
    },
    // JOBコードの検索制限ユーザー編集画面へ遷移する
    openJobCdRelationalUser (item) {},
    copyToClipboard (item) {
      let text = item.jobCd
      text = text + ' ' + item.supplierName
      text = text + ' ' + item.jobName

      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log('copied!')
        })
        .catch(e => {
          console.error(e)
        })
    }
  }
}
</script>

<style scoped>
.v-data-table--fixed-header >>> th:nth-child(1) {
  position: sticky !important;
  left: 0px;
  z-index: 5;
  background: rgb(235, 232, 232);
}
.v-data-table--fixed-header >>> td:nth-child(1) {
  position: sticky !important;
  left: 0px;
  background: white;
}
.v-data-table--fixed-header >>> th:nth-child(2) {
  position: sticky !important;
  left: 120px;
  z-index: 5;
  background: white;
}
.v-data-table--fixed-header >>> td:nth-child(2) {
  position: sticky !important;
  left: 120px;
  background: white;
}
.onlySticky {
  position: sticky !important;
  left: 0px;
  background: rgb(235, 232, 232);
}
</style>
