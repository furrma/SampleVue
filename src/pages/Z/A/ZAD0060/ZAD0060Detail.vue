<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZAD0060.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("ZAD0060.supplierInfo") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <a-switch-active v-if="isEditMode" v-model="isActive" />
        </v-toolbar>
        <v-card-text>
              <!-- 取引先コード(編集モードの場合編集不可) -->
              <a-label-text-field
                vid="supplierCd"
                ref="supplierCd"
                v-model="supplierCd"
                :rules='{required: true, max:10, regex: /^[0-9a-zA-Z]+$/}'
                :label="$t('ZAD0060.supplierCd')"
                :disabled="isEditMode"
                outlined
                dense
              />
              <!-- 取引先名 -->
              <a-label-translation-text-field-group
                vid="supplierName"
                ref="supplierName"
                v-model="supplierName"
                rules="required|max:255"
                :label="$t('ZAD0060.supplierName')"
                outlined
                dense
              />
              <!-- 取引先区分 -->
              <!-- <a-label-select
                vid="supplierClass"
                ref="supplierClass"
                v-model="supplierClass"
                :items="supplierClassList"
                rules="required"
                item-text="codeName"
                item-value="codeKey"
                :label="$t('ZAD0060.supplierClass')"
                outlined
                dense
              ></a-label-select> -->
              <!-- 取引先部署 -->
              <a-label-text-field
                vid="supplierDiv"
                ref="supplierDiv"
                v-model="supplierDiv"
                rules="max:255"
                :label="$t('ZAD0060.supplierDiv')"
                outlined
                dense
              />
              <!-- 取引先担当 -->
              <a-label-text-field
                vid="supplierManager"
                ref="supplierManager"
                v-model="supplierManager"
                rules="max:255"
                :label="$t('ZAD0060.supplierManager')"
                outlined
                dense
              />
              <!-- 営業担当ユーザー検索コンポーネント -->
              <a-autocomplete-user-search
                vid="salesRepUserId"
                ref="salesRepUserId"
                v-model="salesRepUserId"
                :isMultiple= false
                :isDisplayUserIcon= true
                @selected="getData($event)"
                :displayedLabel="$t('ZAD0060.salesRepUserId')"
                :displayedUserIds="initializeUserIDs"
                :isIncludeInactiveUser= false
                :key="redisplay"
              />
              <!-- 郵便番号 -->
              <a-label-text-field
                vid="postalCd"
                ref="postalCd"
                v-model="postalCd"
                :rules="{ regex:/^[0-9-]+$/ }"
                :label="$t('ZAD0060.postalCd')"
                outlined
                dense
              />
              <!-- 住所 -->
              <a-label-translation-text-field-group
                vid="address"
                ref="address"
                v-model="address"
                rules="max:255"
                :label="$t('ZAD0060.address')"
                outlined
                dense
              />
              <!-- 電話番号 -->
              <a-label-text-field
                vid="phoneNo"
                ref="phoneNo"
                v-model="phoneNo"
                :rules="{ regex:/^[0-9+-]+$/ }"
                :label="$t('ZAD0060.phoneNo')"
                outlined
                dense
              />
              <!-- FAX -->
              <a-label-text-field
                vid="faxNo"
                ref="faxNo"
                v-model="faxNo"
                :rules="{ regex:/^[0-9+-]+$/ }"
                :label="$t('ZAD0060.faxNo')"
                outlined
                dense
              />
              <!-- 支払条件 -->
              <a-label-text-field
                vid="paymentTerms"
                ref="paymentTerms"
                v-model="paymentTerms"
                rules="max:255"
                :label="$t('ZAD0060.paymentTerms')"
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
import { mapState } from 'vuex'
import AAutocompleteUserSearch from '@/components/forms/AAutocompleteUserSearch.vue'

/**
 * 取引先マスタの詳細画面です。
 */
export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0060.title')
      }
    }
  },
  components: {
    AAutocompleteUserSearch
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // 状態
      isLoading: false,

      // フォーム
      id: null,
      supplierCd: '',
      supplierNameTid: null,
      // supplierClass: '',
      // supplierClassList: [],
      supplierDiv: '',
      supplierManager: '',
      salesRepUserId: null,
      postalCd: '',
      phoneNo: '',
      faxNo: '',
      paymentTerms: '',
      addressTid: null,
      supplierName: {},
      address: {},
      isActive: true,

      // 担当ユーザー初期表示用
      initializeUserIDs: [],
      // 再描画
      redisplay: 0
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0060.title'),
          to: { name: 'ZAD0060' },
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
      this.refresh()
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
      // this.getCmbBoxData()
      // 更新モードの場合は現在の登録情報を取得
      if (this.isEditMode) {
        this.id = this.routeId
        this.fetchData()
      }
    },
    childCompRedisplay () {
      this.redisplay = this.redisplay ? 0 : 1
    },
    // // コンボボックスデータを取得
    // async getCmbBoxData () {
    //   try {
    //     // ローディングを設定
    //     this.isLoading = true
    //     // クエリを作成
    //     const query = {}
    //     query.codeType = 'CLASS_SUPPLIER'

    //     // コンボボックスデータを取得
    //     const responseCmbBox = await this.$axios.get('/codes', {
    //       params: query
    //     })
    //     this.supplierClassList = responseCmbBox.data
    //   } catch (error) {
    //     // エラーの場合
    //   } finally {
    //     // ローディングを解除
    //     this.isLoading = false
    //   }
    // },
    // 画面表示用の情報を取得
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true
        // データを取得
        const response = await this.$axios.get(`/admin/suppliers/${this.id}`)
        this.setFetchedData(response.data)
        // 初期表示する営業担当ユーザーのIDを取得
        this.initializeUserIDs = [response.data.salesRepUserId]
        // 再描画処理
        this.childCompRedisplay()
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * 保存処理を行います
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
          this.$router.replace({ name: 'ZAD0060-detail', params: { id: response.data.id } })
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
        supplierCd: this.supplierCd,
        supplierName: this.supplierName,
        // supplierClass: this.supplierClass,
        supplierDiv: this.supplierDiv,
        supplierManager: this.supplierManager,
        salesRepUserId: this.salesRepUserId || null,
        postalCd: this.postalCd,
        phoneNo: this.phoneNo,
        faxNo: this.faxNo,
        paymentTerms: this.paymentTerms,
        address: this.address
      }

      // 登録処理
      return await this.$axios.post('/admin/suppliers', request)
    },

    /**
     * 更新を行います
     */
    async saveUpdate () {
      // リクエストを作成
      const request = {
        id: this.id,
        supplierCd: this.supplierCd,
        supplierName: this.supplierName,
        supplierNameTid: this.supplierNameTid,
        // supplierClass: this.supplierClass,
        supplierDiv: this.supplierDiv,
        supplierManager: this.supplierManager,
        salesRepUserId: this.salesRepUserId || null,
        postalCd: this.postalCd,
        address: this.address,
        addressTid: this.addressTid,
        phoneNo: this.phoneNo,
        faxNo: this.faxNo,
        paymentTerms: this.paymentTerms,
        isActive: this.isActive
      }

      return await this.$axios.patch(`/admin/suppliers/${this.id}`, request)
    },

    /**
     * 画面にレスポンス情報をセットします
     */
    setFetchedData (data) {
      this.id = data.id
      this.supplierCd = data.supplierCd
      this.supplierNameTid = data.supplierNameTid
      this.supplierName = data.supplierName || {}
      // this.supplierClass = data.supplierClass
      this.supplierDiv = data.supplierDiv
      this.supplierManager = data.supplierManager
      this.salesRepUserId = data.salesRepUserId
      this.postalCd = data.postalCd
      this.phoneNo = data.phoneNo
      this.faxNo = data.faxNo
      this.isActive = data.isActive
      this.addressTid = data.addressTid
      this.address = data.address || {}
      this.paymentTerms = data.paymentTerms
    },

    getData (searchedData) {
      this.salesRepUserId = searchedData[0].userId ?? null
    }
  }
}
</script>
