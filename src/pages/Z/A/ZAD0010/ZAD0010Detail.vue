<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZAD0010.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("ZAD0010.companyInfo") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <a-switch-active v-if="isEditMode" v-model="isActive" />
        </v-toolbar>
        <v-card-text>
              <!-- 会社コード(編集モードの場合編集不可) -->
              <a-label-text-field
                vid="companyCd"
                ref="companyCd"
                v-model="companyCd"
                :rules='{required: true, max:3, regex: /^[0-9a-zA-Z]+$/}'
                :label="$t('ZAD0010.companyCd')"
                :disabled="isEditMode"
                outlined
                dense
              />
              <!-- 会社名 -->
              <a-label-translation-text-field-group
                vid="companyName"
                ref="companyName"
                v-model="companyName"
                rules="required|max:100"
                :label="$t('ZAD0010.companyName')"
                outlined
                dense
              />
              <!-- 郵便番号 -->
              <a-label-text-field
                vid="postalCd"
                ref="postalCd"
                v-model="postalCd"
                :rules="{ regex:/^[0-9-]+$/ }"
                :label="$t('ZAD0010.postalCd')"
                outlined
                dense
              />
              <!-- 住所 -->
              <a-label-translation-text-field-group
                vid="address"
                ref="address"
                v-model="address"
                rules="max:255"
                :label="$t('ZAD0010.address')"
                outlined
                dense
              />
              <!-- 電話番号 -->
              <a-label-text-field
                vid="phoneNo"
                ref="phoneNo"
                v-model="phoneNo"
                :rules="{ regex:/^[0-9+-]+$/ }"
                :label="$t('ZAD0010.phoneNo')"
                outlined
                dense
              />
              <!-- FAX -->
              <a-label-text-field
                vid="faxNo"
                ref="faxNo"
                v-model="faxNo"
                :rules="{ regex:/^[0-9+-]+$/ }"
                :label="$t('ZAD0010.faxNo')"
                outlined
                dense
              />
       </v-card-text>
        <v-card-actions>
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
        </v-card-actions>
     </validation-observer>
    </v-card>
  </div>
</template>

<script>

/**
 * 会社マスタの詳細画面です。
 */
export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0010.title')
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
      phoneNo: null,
      faxNo: null,
      addressTid: null,
      companyName: {},
      address: {},
      isActive: true
    }
  },
  computed: {
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0010.title'),
          to: { name: 'ZAD0010' },
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
  mounted () {
    this.refresh()
  },
  methods: {
    /**
     * 画面の再描画を行います
     */
    async refresh () {
      // 更新モードの場合は現在の登録情報を取得
      if (this.isEditMode) {
        this.companyCd = this.routeId
        this.fetchData()
      }
    },
    // 画面表示用の情報を取得
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // データを取得
        const response = await this.$axios.get(`admin/companies/${this.companyCd}`)
        this.setFetchedData(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * 保存処理を行います。
     */
    async save () {
      try {
        // ローディングを設定
        this.isLoading = true

        /// 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })
          this.setFetchedData(response.data)
          this.$router.replace({ name: 'ZAD0010-detail', params: { companyCd: response.data.companyCd } })
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
        this.isLoading = false
      }
    },

    /**
     * 新規登録を行います
     */
    async saveNew () {
    // リクエストを作成
      const request = {
        companyCd: this.companyCd,
        companyName: this.companyName,
        postalCd: this.postalCd,
        phoneNo: this.phoneNo,
        faxNo: this.faxNo,
        address: this.address
      }

      // 登録処理
      return await this.$axios.post('admin/companies', request)
    },

    /**
     * 更新を行います
     */
    async saveUpdate () {
      // リクエストを作成
      const request = {
        companyCd: this.companyCd,
        companyName: this.companyName,
        companyNameTid: this.companyNameTid,
        postalCd: this.postalCd,
        address: this.address,
        addressTid: this.addressTid,
        phoneNo: this.phoneNo,
        faxNo: this.faxNo,
        isActive: this.isActive
      }

      return await this.$axios.patch(`admin/companies/${this.companyCd}`, request)
    },

    /**
     * 画面にレスポンス情報をセットする
     */
    setFetchedData (data) {
      this.companyCd = data.companyCd
      this.companyNameTid = data.companyNameTid
      this.companyName = data.companyName || {}
      this.postalCd = data.postalCd
      this.phoneNo = data.phoneNo
      this.faxNo = data.faxNo
      this.isActive = data.isActive
      this.addressTid = data.addressTid
      this.address = data.address || {}
    }
  }
}
</script>
