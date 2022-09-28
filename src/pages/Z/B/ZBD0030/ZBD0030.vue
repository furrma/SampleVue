<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZBD0030.title") }}</div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>

    </div>

    <v-card>
      <v-row dense class="px-2 pt-2 align-center">
        <v-col cols="12" sm="3">
        <!-- JOBコード オートコンプリート -->
        <a-autocomplete-job-cd-search
          ref="autoCompleteJobCd"
          :isMultiple="false"
          :isDisable="isAutoCompleteDisable"
          :displayedLabel="$t('ZBD0030.jobCd')"
          :displayedJobCdIds="arrayJobCdIds"
          :isIncludeDevEndOver="true"
          :isIncludeDevEnd="true"
          :isIncludeTentative="true"
          :isIncludeNonAvailable="true"
          @selected="getJobCd($event)"
          :key="reDisplay"
        />
        </v-col>

        <v-col cols="12" sm="3">
        <!-- 客先名 -->
        <a-label-text-field
          vid="supplierName"
          ref="supplierName"
          v-model="supplierName"
          :label="$t('ZBD0030.supplierName')"
          outlined
          dense
          disabled
        />
        </v-col>

        <v-col cols="12" sm="6">
        <!-- 案件名 -->
        <a-label-text-field
          vid="jobName"
          ref="jobName"
          v-model="jobName"
          :label="$t('ZBD0030.jobName')"
          outlined
          dense
          disabled
        />
        </v-col>
      </v-row>

      <v-divider/>

      <v-row dense class="pa-2 align-center">
        <v-col cols="12" class="d-flex align-center">
          <!-- キーワード -->
          <a-keyword-text-field class="flex-grow-1 mr-2" v-model="keywords" @search="search" />
          <!-- 検索条件詳細 -->
          <a-btn-toggle-active v-model="toggleActiveValue"/>

          <!-- 新規登録ボタン -->
          <v-btn v-if="isAdmin" class="mx-2" color="primary" @click="openNew" :disabled="isBtnDisable">
            {{ $t("common.add") }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- 備考コードマスタ -->
      <v-data-table
        :headers="jobCdRemarksHeaders"
        :items="jobRemarksCds"
        :loading="isLoading"
        dense
        :items-per-page="-1"
        virtual-rows
        :height="getHeight"
        :fixed-header="true"
        hide-default-footer
      >
        <!-- 備考コード -->
        <template v-slot:[`item.jobRemarksCd`]="{ item }">
          <router-link v-if="isAdmin" :to="{ name: 'ZBD0030-detail', params: { id: jobCdId, jobRemarksCd: item.jobRemarksCd } }">
            {{ item.jobRemarksCd }}
          </router-link>
          <div v-if="!isAdmin">
            {{ item.jobRemarksCd }}
          </div>
        </template>

        <!-- 状態 -->
        <template v-slot:[`item.isActive`]="{ item }">
          <v-icon v-if="item.isActive" small color="success">
            mdi-check-circle
          </v-icon>
          <v-icon v-else small color="disable">
            mdi-circle-outline
          </v-icon>
        </template>

      </v-data-table>

    </v-card>
  </div>
</template>

<script>
import Permissions from '../../../../constants/Permissions'
import { mapState } from 'vuex'
import ToggleActiveValue from '../../../../constants/ToggleActiveValue'
import AAutocompleteJobCdSearch from '../../../../components/forms/AAutocompleteJobCdSearch.vue'

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZBD0030.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  props: ['mode', 'routeId'],
  components: {
    AAutocompleteJobCdSearch
  },
  data () {
    return {
      // 状態
      isAdmin: false,
      isLoading: false,
      isFetchScreenLoading: false,
      isBtnDisable: true,
      isAutoCompleteDisable: false,

      // フォーム
      keywords: '',
      toggleActiveValue: ToggleActiveValue.ACTIVE,

      // データ
      jobCdData: [],
      jobCdId: null,
      supplierName: '',
      jobName: '',
      arrayJobCdIds: [],

      jobRemarksCds: [],

      reDisplay: 0
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0030.title'),
          to: { name: 'ZBD0030' }
        }
      ]
    },
    isListMode () {
      return this.mode === 'list'
    },
    getHeight () {
      return window.innerHeight - 450
    },
    jobCdRemarksHeaders () {
      return [
        { text: this.$t('ZBD0030.jobRemarksCd'), value: 'jobRemarksCd' },
        { text: this.$t('ZBD0030.jobRemarksName'), value: 'jobRemarksName' },
        { text: this.$t('ZBD0030.isActive'), value: 'isActive' }
      ]
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
    jobCdId (val) {
      if (val) {
        this.isBtnDisable = false
      } else {
        this.isBtnDisable = true
      }
    }
  },
  created () {
    // JOBコードマスタから飛んできた場合は対象JOBコードIDをセット
    if (this.isListMode) {
      this.arrayJobCdIds.push(parseInt(this.routeId))
    }
  },
  mounted () {
    this.checkPermission()
    // 初回検索
    if (this.isListMode) {
      this.isAutoCompleteDisable = true
      this.jobCdId = parseInt(this.routeId)
      this.search()
    }
  },
  methods: {
    // 管理者権限チェック
    checkPermission () {
      const hasPermission = this.$store.getters['auth/hasPermissions']([
        Permissions.JOB_REMARKS_CD_ADMIN
      ])
      this.isAdmin = hasPermission
    },
    getJobCd (jobCdData) {
      if (jobCdData.length) {
        this.setJobCdInfo(jobCdData[0])
      }
    },
    // コンポーネントからの情報をセット
    setJobCdInfo (jobCdData) {
      if (jobCdData.jobCdId) {
        this.jobCdId = jobCdData.jobCdId
        this.supplierName = jobCdData.supplierName
        this.jobName = jobCdData.jobName
        this.search()
      } else {
        this.jobRemarksCds = []
        this.jobCdId = null
        this.supplierName = ''
        this.jobName = ''
      }
    },
    // 検索取得を行う
    async search () {
      if (this.jobCdId) {
        try {
        // ローディングを設定
          this.isLoading = true
          this.jobRemarksCds = []

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

          // データ取得
          const response = await this.$axios.get(`/jobRemarksCds/${this.jobCdId}`, {
            params: query
          })
          this.jobRemarksCds = response.data
        } catch (error) {
        // エラーメッセージを表示
          this.$setFormErrors(this.$refs.observer, error)
          this.$store.dispatch('app/catchError', error)
        } finally {
        // ローディングを解除
          this.isLoading = false
        }
      }
    },

    // 新規登録画面に遷移する
    openNew () {
      this.$router.push({ name: 'ZBD0030-new', params: { id: this.jobCdId } })
    },

    // 再描画
    redrawComp () {
      this.$refs.autoCompleteJobCd.request()
    }
  }
}
</script>

<style scoped>

</style>
