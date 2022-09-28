<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZBD0050.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("ZBD0050.info") }}</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="save">
          <v-card-text>
            <!-- JOBコード -->
            <a-label-text-field
              vid="jobCd"
              ref="jobCd"
              v-model="jobCd"
              disabled
              :label="$t('ZBD0050.jobCd')"
              outlined
              dense
            />

            <!-- 客先 編集不可 -->
            <a-label-text-field
              vid="supplierName"
              ref="supplierName"
              v-model="supplierName"
              disabled
              :label="$t('ZBD0050.supplierName')"
              outlined
              dense
            />
            <!-- 案件名 編集不可 -->
            <a-label-text-field
              vid="jobName"
              ref="jobName"
              v-model="jobName"
              disabled
              :label="$t('ZBD0050.jobName')"
              outlined
              dense
            />

            <!-- 検索可能ユーザー -->
            <a-autocomplete-user-search
              vid="searchableUserIds"
              ref="searchableUserIds"
              v-model="searchableUserIds"
              :isMultiple="true"
              :isDisplayUserIcon="false"
              @selected="getData($event)"
              :displayedLabel="$t('ZBD0050.searchableUser')"
              :displayedUserIds="initializeUserIds"
              :isIncludeInactiveUser="false"
              :key="redisplay"
            />
          </v-card-text>
        </form>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="invalid"
            :loading="isSaveLoading"
            @click="save"
          >
            {{ $t("common.save") }}
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AAutocompleteUserSearch from '@/components/forms/AAutocompleteUserSearch.vue'

export default {
  components: {
    AAutocompleteUserSearch
  },
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZBD0050.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // データ
      jobCdId: null,
      jobCd: '',
      supplierName: '',
      jobName: '',
      initializeUserIds: [],
      searchableUserIds: [],

      // 画面制御
      isSaveLoading: false,
      isDisable: false,
      redisplay: 0
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0050.title'),
          to: { name: 'ZBD0050' },
          exact: true
        },
        {
          text: this.isNewMode ? this.$t('common.add') : this.$t('common.edit'),
          disabled: true
        }
      ]
    }
  },
  watch: {
    locale () {
      // 言語変更時は画面再描画
      this.fetchData()
    }
  },
  mounted () {
    // 現在の登録情報を取得
    this.jobCdId = this.routeId
    this.fetchData()
  },
  methods: {
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // データを取得
        const response = await this.$axios.get(
          `/admin/jobSearchRestrictions/${this.jobCdId}`
        )
        this.setFetchedData(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
      }
    },
    // 保存処理
    async save () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // リクエスト情報を作成
        const request = {
          jobCdId: this.jobCdId,
          searchableUserIds: this.searchableUserIds
        }

        // 更新処理
        const response = await this.$axios.put(
          `/admin/jobSearchRestrictions/${this.jobCdId}`,
          request
        )

        // 完了メッセージを表示
        this.$store.dispatch('app/showSuccess', {
          message: 'messages.info.success',
          args: ['common.save']
        })

        this.setFetchedData(response.data)
        // this.childCompRedisplay()
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
      }
    },
    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.jobCdId = data.jobCdId
      this.jobCd = data.jobCd
      this.supplierName = data.supplierName
      this.jobName = data.jobName
      this.initializeUserIds = data.searchableUserIds
    },
    getData (searchedData) {
      this.searchableUserIds = searchedData.map(x => x.userId)
    }
  }
}
</script>
