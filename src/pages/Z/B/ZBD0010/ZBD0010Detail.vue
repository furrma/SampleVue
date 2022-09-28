<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZBD0010.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("ZBD0010.info") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <a-switch-active v-if="isEditMode" v-model="isActive" />
      </v-toolbar>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="save">
          <v-card-text>
            <!-- 会社 -->
            <a-label-select
              vid="companyCd"
              ref="companyCd"
              v-model="companyCd"
              :items="companyList"
              rules="required"
              :label="$t('ZBD0010.company')"
              item-text="companyName"
              item-value="companyCd"
              :disabled="isEditMode"
              :loading="isFetchScreenLoading"
              outlined
              dense
            />

            <!-- プロジェクトコード -->
            <a-label-text-field
              vid="projectCd"
              ref="projectCd"
              v-model="projectCd"
              :disabled="isEditMode"
              rules="required|max:20"
              :label="$t('ZBD0010.projectCd')"
              outlined
              dense
            />

            <!-- プロジェクト名 -->
            <a-label-translation-text-field-group
              vid="projectName"
              ref="projectName"
              v-model="projectName"
              rules="required|max:255"
              :label="$t('ZBD0010.projectName')"
              outlined
              dense
            />

            <!-- JOBコードオートコンプリート -->
            <a-autocomplete-job-cd-search
              v-model="jobCdIds"
              :displayedJobCdIds="displayedJobCdIds"
              :isMultiple="true"
              :isDisable="false"
              :isIncludeDevEndOver="true"
              :isIncludeDevEnd="true"
              :isIncludeTentative="true"
              :isIncludeNonAvailable="true"
              @selected="getJobCd($event)"
            />
            </v-card-text>
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
        </form>
      </validation-observer>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AAutocompleteJobCdSearch from '../../../../components/forms/AAutocompleteJobCdSearch.vue'

export default {
  components: {
    AAutocompleteJobCdSearch
  },
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZBD0010.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // データ
      id: null,
      companyCd: '',
      projectCd: '',
      projectNameTid: null,
      projectName: {},
      displayedJobCdIds: [],
      jobCdIds: [],
      isActive: true,
      companyList: [],

      // 画面制御
      isFetchScreenLoading: false,
      isSaveLoading: false
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0010.title'),
          to: { name: 'ZBD0010' },
          exact: true
        },
        {
          text: this.isNewMode ? this.$t('common.add') : this.$t('common.edit'),
          disabled: true
        }
      ]
    },
    isNewMode () {
      return this.mode === 'new'
    },
    isEditMode () {
      return this.mode === 'edit'
    }
  },
  watch: {
    locale () {
      // 言語変更時は画面再描画
      this.reflesh()
    }
  },
  mounted () {
    this.reflesh()
  },
  methods: {
    async reflesh () {
      this.fetchScreenData()

      if (this.isEditMode) {
        this.id = this.routeId
        this.fetchData()
      }
    },
    // 画面表示用の情報を取得
    async fetchScreenData () {
      try {
        // ローディングを設定
        this.isFetchScreenLoading = true
        this.isSaveLoading = true

        // データを取得
        const response = await this.$axios.get('/companies')
        this.companyList = response.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        this.isFetchScreenLoading = false
        this.isSaveLoading = false
      }
    },
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // データを取得
        const response = await this.$axios.get(`/admin/projectCds/${this.id}`)
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

        // 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.$router.replace({
            name: 'ZBD0010-detail',
            params: { id: response.data.id }
          })
        } else if (this.isEditMode) {
          response = await this.saveUpdate()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFetchedData(response.data)
        }
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
      }
    },
    // 新規登録を行います
    async saveNew () {
      // リクエストを作成
      const request = {
        companyCd: this.companyCd,
        projectCd: this.projectCd,
        projectName: this.projectName,
        jobCdIds: this.jobCdIds
      }

      // 登録処理
      return await this.$axios.post('/admin/projectCds', request)
    },
    // 更新を行います
    async saveUpdate () {
      // リクエストを作成
      const request = {
        id: this.id,
        projectNameTid: this.projectNameTid,
        projectName: this.projectName,
        jobCdIds: this.jobCdIds,
        isActive: this.isActive
      }

      return await this.$axios.put(`/admin/projectCds/${this.id}`, request)
    },
    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.companyCd = data.companyCd
      this.projectCd = data.projectCd
      this.projectName = data.projectName
      this.projectNameTid = data.projectNameTid
      this.isActive = data.isActive
      this.displayedJobCdIds = data.jobCdIds
      this.jobCdIds = data.jobCdIds
    },
    getJobCd (searchedData) {
      this.jobCdIds = searchedData.map(x => x.jobCdId)
    }
  }
}
</script>
