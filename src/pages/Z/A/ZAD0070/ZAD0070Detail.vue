<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center">
            <div>
             <!--画面タイトル-->
             <div class="display-1">{{ $t("ZAD0070.title") }}</div>
             <!--パンくずリスト-->
             <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>
        <v-card>
          <v-toolbar dense flat>
            <v-toolbar-title>{{ $t("ZAD0070.companyInfomation") }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <a-switch-active v-if="isEditMode" v-model=isActive />
            </v-toolbar>
            <v-divider />
        <v-card-text>
          <div class="px1">
            <validation-observer ref="observer" v-slot="{ invalid }">
            <form>
              <!-- 協力会社CD(編集モードの場合編集不可) -->
              <!-- 会社コード(編集モードの場合編集不可) -->
              <a-label-text-field
                vid="companyCd"
                ref="companyCd"
                v-model="companyCd"
                rules="required|max:6"
                :label="$t('ZAD0070.companyCd')"
                :disabled="isEditMode"
                outlined
                dense
              />
              <!-- 会社名 -->
              <a-label-translation-text-field-group
                vid="companyNameTranslations"
                ref="companyNameTranslations"
                v-model="companyNameTranslations"
                rules="required|max:100"
                :label="$t('ZAD0070.companyName')"
                outlined
                dense
              />
              <!-- 郵便番号 -->
              <a-label-text-field
                vid="postalCd"
                ref="postalCd"
                v-model="postalCd"
                rules="max:10"
                :label="$t('ZAD0070.postalCd')"
                outlined
                dense
              />
              <!-- 住所 -->
              <a-label-translation-text-field-group
                vid="addressTranslations"
                ref="addressTranslations"
                v-model="addressTranslations"
                rules="max:255"
                :label="$t('ZAD0070.address')"
                outlined
                dense
              />
              <!-- 電話番号 -->
              <a-label-text-field
                vid="phoneNo"
                ref="phoneNo"
                v-model="phoneNo"
                rules="max:20"
                :label="$t('ZAD0070.phoneNo')"
                outlined
                dense
              />
              <!-- FAX -->
              <a-label-text-field
                vid="faxNo"
                ref="faxNo"
                v-model="faxNo"
                rules="max:20"
                :label="$t('ZAD0070.faxNo')"
                outlined
                dense
              />
              <!-- 保存ボタン -->
              <div class="mt-2">
                <v-btn
                  color="primary"
                  :disabled="invalid"
                  :loading="isLoading"
                  @click="save"
                >
                  {{ $t("common.save") }}
                </v-btn>
              </div>
              </form>
            </validation-observer>
          </div>
        </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0070.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // 状態
      isLoading: false,

      // フォーム
      companyCd: '',
      companyNameTid: null,
      postalCd: '',
      phoneNo: '',
      faxNo: '',
      addressTid: null,
      companyNameTranslations: {},
      addressTranslations: {},
      isActive: true
    }
  },

  computed: {
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0070.title'),
          to: { name: 'ZAD0070' },
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
      if (this.isEditMode) {
        this.companyCd = this.routeId
        this.fetchData()
      }
    }
  },
  mounted () {
    if (this.isEditMode) {
      this.companyCd = this.routeId
      this.fetchData()
    }
  },

  methods: {
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true
        // データを取得
        const response = await this.$axios.get(`admin/associateCompanies/${this.companyCd}`)
        // 詳細情報(データを取得)
        this.setFetchedData(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    async save () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFetchedData(response.data)

          this.$router.replace({ name: 'ZAD0070-detail', params: { companyCd: response.data.companyCd } })
          // 編集の場合
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
        // エラーメッセージ表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },
    async saveNew () {
      // リクエスト作成
      const request = {
        companyCd: this.companyCd,
        companyTValue: this.companyNameTranslations,
        postalCd: this.postalCd,
        phoneNo: this.phoneNo,
        faxNo: this.faxNo,
        addressTValue: this.addressTranslations
      }
      // 登録処理
      return await this.$axios.post('admin/associateCompanies', request)
    },
    // 更新を行う
    async saveUpdate () {
      // リクエスト作成
      const request = {
        companyCd: this.companyCd,
        companyNameTid: this.companyNameTid,
        companyTValue: this.companyNameTranslations,
        postalCd: this.postalCd,
        addressTid: this.addressTid,
        addressTValue: this.addressTranslations,
        phoneNo: this.phoneNo,
        faxNo: this.faxNo,
        isActive: this.isActive
      }
      // 更新処理
      return await this.$axios.patch(`admin/associateCompanies/${this.companyCd}`, request)
    },

    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.companyCd = data.companyCd
      this.companyNameTid = data.companyNameTid
      this.companyNameTranslations = data.companyTValue
      this.postalCd = data.postalCd
      this.addressTranslations = data.addressTranslations
      this.phoneNo = data.phoneNo
      this.faxNo = data.faxNo
      this.isActive = data.isActive
      this.addressTid = data.addressTid
      if (data.addressTValue != null) {
        this.addressTranslations = data.addressTValue
      }
    }
  }
}

</script>
