<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZBD0030.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("ZBD0030.info") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <a-switch-active v-if="isEditMode" v-model="isActive" />
      </v-toolbar>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="save">
          <v-card-text>
            <!-- 備考コード -->
            <a-label-text-field
              vid="jobRemarksCd"
              ref="jobRemarksCd"
              v-model="jobRemarksCd"
              rules="required|max:20"
              :label="$t('ZBD0030.jobRemarksCd')"
              :disabled="isEditMode"
              outlined
              dense
            />

            <!-- 備考コード名 -->
            <a-label-translation-text-field-group
              vid="jobRemarksName"
              ref="jobRemarksName"
              v-model="jobRemarksName"
              rules="required|max:255"
              :label="$t('ZBD0030.jobRemarksName')"
              outlined
              dense
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

export default {
  components: {},
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZBD0030.title')
      }
    }
  },
  props: ['mode', 'routeId', 'routeCd'],
  data () {
    return {
      // データ
      jobCdId: null,
      jobRemarksCd: '',
      jobRemarksCdTid: null,
      jobRemarksName: {},
      isActive: true,

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
          text: this.$t('ZBD0030.title'),
          to: { name: 'ZBD0030' },
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
      // JOBコードIDを取得
      this.jobCdId = this.routeId

      // 言語変更時は画面再描画
      if (this.isEditMode) {
        this.jobCdId = this.routeId
        this.jobRemarksCd = this.routeCd
        this.fetchData()
      }
    }
  },
  mounted () {
    // JOBコードIDを取得
    this.jobCdId = this.routeId

    // 更新モードの場合は現在の登録情報を取得
    if (this.isEditMode) {
      this.jobCdId = this.routeId
      this.jobRemarksCd = this.routeCd
      this.fetchData()
    }
  },
  methods: {
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // データを取得
        const response = await this.$axios.get(
          `/admin/jobRemarksCds/${this.jobCdId}/${this.jobRemarksCd}`
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
            name: 'ZBD0030-detail',
            params: {
              id: response.data.jobCdId,
              jobRemarksCd: response.data.jobRemarksCd
            }
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
        jobCdId: this.jobCdId,
        jobRemarksCd: this.jobRemarksCd,
        jobRemarksName: this.jobRemarksName
      }

      // 登録処理
      return await this.$axios.post(
        `/admin/jobRemarksCds/${this.jobCdId}`,
        request
      )
    },
    // 更新を行います
    async saveUpdate () {
      // リクエストを作成
      const request = {
        jobCdId: this.jobCdId,
        jobRemarksCd: this.jobRemarksCd,
        jobRemarksCdTid: this.jobRemarksCdTid,
        jobRemarksName: this.jobRemarksName,
        isActive: this.isActive
      }

      return await this.$axios.patch(
        `/admin/jobRemarksCds/${this.jobCdId}/${this.jobRemarksCd}`,
        request
      )
    },
    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.jobCdId = data.jobCdId
      this.jobRemarksCd = data.jobRemarksCd
      this.jobRemarksCdTid = data.jobRemarksCdTid
      this.jobRemarksName = data.jobRemarksName
      this.isActive = data.isActive
    }
  }
}
</script>
