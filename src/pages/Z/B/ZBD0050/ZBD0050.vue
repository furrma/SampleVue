<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZBD0050.title") }}</div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
    </div>

    <v-card>
      <v-row dense class="pa-2 align-center">
        <v-col cols="12" class="d-flex align-center">
          <!-- キーワード -->
          <a-keyword-text-field class="flex-grow-1 mr-2" v-model="keywords" @search="search" />
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
        :height="getHeight"
        hide-default-footer
        fixed-header
        sort-by="jobCd"
        group-by="supplierCd"
        show-group-by
        class="flex-grow-1 schedule-table"
      >
        <!-- JOBコードカラム -->
        <template v-slot:[`item.jobCd`]="{ item }">
          <router-link :to="{ name: 'ZBD0050-detail', params: { id: item.jobCdId } }">
            {{ item.jobCd }}
          </router-link>
        </template>

        <!-- PMユーザーカラム
        <template v-slot:[`item.pmUserName`]="{ item }">
          <v-chip
            small
            outlined
            class="mr-1"
          >
            {{item.pmUserName}}
          </v-chip>
        </template> -->

        <!-- 検索可能ユーザーカラム -->
        <template v-slot:[`item.searchableUserNames`]="{ item }">
          <v-chip
            v-for="userName in item.searchableUserNames"
            :key="userName"
            small
            outlined
            color="primary"
            class="mr-1"
          >
            {{userName}}
          </v-chip>
        </template>

        <!--グループヘッダー-->
        <template v-slot:[`group.header`]="{ group, isOpen, toggle }">
          <th :colspan="jobCdHeaders.length">
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

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZBD0050.title'),
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
          text: this.$t('ZBD0050.title'),
          to: { name: 'ZBD0050' }
        }
      ]
    },
    getHeight () {
      return window.innerHeight - 300
    },
    jobCdHeaders () {
      return [
        { text: this.$t('ZBD0050.jobCd'), value: 'jobCd', groupable: false, divider: true, width: '15%' },
        { text: '', value: 'supplierCd', width: '5%' },
        { text: this.$t('ZBD0050.supplierName'), value: 'supplierName', divider: true, width: '20%' },
        { text: this.$t('ZBD0050.jobName'), value: 'jobName', groupable: false, divider: true, width: '25%' },
        { text: this.$t('ZBD0020.pmUserName'), value: 'pmUserName', divider: true, width: '10%' },
        { text: this.$t('ZBD0050.searchableUser'), value: 'searchableUserNames', groupable: false, divider: true, width: '40%' }
      ]
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.search()
    }
  },
  mounted () {
    // 初回検索
    this.search()

    // ログインユーザーが管理者権限持ちであれば、「保存」ボタン、詳細画面へのリンクを許可
    // Permission : JobCdS2iDetail/Admin
    this.isAdmin = true
  },
  methods: {
    // 検索取得を行う
    async search () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.jobCdData = []

        // クエリを作成
        const query = {}
        if (this.keywords) {
          query.keywords = this.keywords
        }

        // データ取得
        const response = await this.$axios.get('/admin/jobSearchRestrictions', {
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
      this.$router.push({ name: 'ZBD0050-new' })
    },

    // JOBコード備考画面へ遷移する
    openJobCdRemarks (item) {

    },
    // JOBコードの検索制限ユーザー編集画面へ遷移する
    openJobCdRelationalUser (item) {

    },
    copyToClipboard (item) {
      let text = item.jobCd
      text = text + ' ' + item.supplierName
      text = text + ' ' + item.jobName

      navigator.clipboard.writeText(text)
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
  background: rgb(235, 232, 232);
}
</style>
