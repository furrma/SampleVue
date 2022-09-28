<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZAD0050.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <!-- 新規用画面表示 -->
    <v-stepper v-if="isNewMode" v-model="stepper" class="mx-auto">
      <v-stepper-header class="elevation-0">
        <v-stepper-step
          :complete="stepper > 1"
          step="1"
        >
        {{ $t('ZAD0050.userInfo') }}
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          step="2"
        >
        {{ $t('ZAD0050.associateCompanyInfo') }}
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items v-if="isNewMode">
        <v-stepper-content class="pa-0" step="1">
          <user-tab
            v-model="user"
            :mode="mode"
            :companyList="companyList"
            :occupationClassList="occupationClassList"
            :locationList="locationList"
            :roleList="roleList"
            :organizationList="organizationList"
            :isLoading="isLoading"
            @next="next"
          />
        </v-stepper-content>
        <v-stepper-content class="pa-0" step="2">
          <associate-tab
          v-model="associate"
          :mode="mode"
          :associateCompanyList="associateCompanyList"
          :outsourcingContractClassList="outsourcingContractClassList"
          :outsourcingOccupationClassList="outsourcingOccupationClassList"
          :isLoading="isLoading"
          @save="saveUser"
          @previous="previous"
          @saveInStep="saveUser"
          @saveInTab="saveAssociateCompanyInfo"
        />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

      <!-- 編集用画面表示 -->
    <v-tabs v-if="isEditMode" v-model="tab" background-color="transparent">
      <v-tab to="#user">{{ $t('ZAD0050.userInfo') }}</v-tab>
      <v-tab to="#associate">{{ $t('ZAD0050.associateCompanyInfo') }}</v-tab>
    </v-tabs>

    <v-tabs-items v-if="isEditMode" v-model="tab">
      <v-tab-item value="user">
        <user-tab
          v-model="user"
          :mode="mode"
          :companyList="companyList"
          :occupationClassList="occupationClassList"
          :locationList="locationList"
          :roleList="roleList"
          :organizationList="organizationList"
          :isLoading="isLoading"
          :isResetLoading="isResetLoading"
          @save="saveUser"
          @resetPassword="resetPassword"
        />
      </v-tab-item>
      <v-tab-item value="associate">
        <associate-tab
          v-model="associate"
          :mode="mode"
          :associateCompanyList="associateCompanyList"
          :outsourcingContractClassList="outsourcingContractClassList"
          :outsourcingOccupationClassList="outsourcingOccupationClassList"
          :isLoading="isLoading"
          @saveInStep="saveUser"
          @saveInTab="saveAssociateCompanyInfo"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserTab from './ZAD0050Detail/UserTab.vue'
import AssociateTab from './ZAD0050Detail/AssociateTab.vue'

export default {
  components: {
    UserTab,
    AssociateTab
  },
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0050.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // 状態
      isLoading: false,
      isResetLoading: false,
      tab: null,
      stepper: 1,

      // フォーム
      id: null,
      user: {},
      associate: {},

      // データ
      companyList: [],
      occupationClassList: [],
      locationList: [],
      roleList: [],
      organizationList: [],
      associateCompanyList: [],
      outsourcingContractClassList: [],
      outsourcingOccupationClassList: []
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0050.title'),
          to: { name: 'ZAD0050' },
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
      this.reflesh()
    }
  },
  mounted () {
    this.reflesh()
  },
  methods: {
    /**
     * 画面の再描画を行います。
     */
    async reflesh () {
      // 画面表示用の情報を取得
      this.fetchScreenData()

      // 更新モードの場合は現在の登録情報を取得
      if (this.isEditMode) {
        this.id = this.routeId
        this.fetchUserData()
        this.fetchAssociateCompanyData()
      }
    },

    /**
     * 画面表示用の情報を取得します。
     */
    async fetchScreenData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 職種区分用クエリを作成
        const occupationClassQuery = {}
        occupationClassQuery.codeType = 'CLASS_OCCUPATION'
        occupationClassQuery.isActive = true

        // 所在地用クエリを作成
        const locationQuery = {}
        locationQuery.codeType = 'LOCATION'
        locationQuery.isActive = true

        // 外注契約区分用クエリを作成
        const outsourcingContractClassQuery = {}
        outsourcingContractClassQuery.codeType = 'CLASS_OUTSOURCING_CONTRACT'
        outsourcingContractClassQuery.isActive = true

        // 外注職種区分用クエリを作成
        const outsourcingOccupationClassQuery = {}
        outsourcingOccupationClassQuery.codeType = 'CLASS_OUTSOURCING_OCCUPATION'
        outsourcingOccupationClassQuery.isActive = true

        // 画面表示用の情報を取得
        // 全てのAPIリクエストを並列処理して待機する
        const [responseCompanies, responseOccupations, responseLocations, responseRoles, responseOrganizations,
          responseAssociateCompanies, responseOutsourcingContracts, responseOutsourcingOccupations] = await Promise.all([
          // ユーザータブ
          this.$axios.get('/companies'),
          this.$axios.get('/codes', { params: occupationClassQuery }),
          this.$axios.get('/codes', { params: locationQuery }),
          this.$axios.get('/roles'),
          this.$axios.get('/organizations'),

          // 協力会社タブ
          this.$axios.get('/associateCompanies'),
          this.$axios.get('/codes', { params: outsourcingContractClassQuery }),
          this.$axios.get('/codes', { params: outsourcingOccupationClassQuery })
        ])

        // 画面に結果をセット
        this.companyList = responseCompanies.data
        this.occupationClassList = responseOccupations.data
        this.locationList = responseLocations.data
        this.roleList = responseRoles.data
        this.organizationList = responseOrganizations.data
        this.associateCompanyList = responseAssociateCompanies.data
        this.outsourcingContractClassList = responseOutsourcingContracts.data
        this.outsourcingOccupationClassList = responseOutsourcingOccupations.data
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
     * ユーザーデータを取得します。
     */
    async fetchUserData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // データを取得
        const response = await this.$axios.get(`/admin/users/${this.id}`)
        this.setFetchedUser(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * 協力会社ユーザーデータを取得します。
     */
    async fetchAssociateCompanyData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // データを取得
        const response = await this.$axios.get(`/admin/associateCompanyUsers/${this.id}`)
        this.setFechedAssociateCompanyUser(response.data)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * ユーザー保存処理
     */
    async saveUser () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 登録処理
        let userResponse = null
        if (this.isNewMode) {
          userResponse = await this.saveUserNew()

          // 協力会社保存処理を実行するため、IDを保管
          this.id = userResponse.data.id

          // もし協力会社ユーザー情報入力フラグがONであれば続けて登録処理
          if (this.associate.isInputAssociateCompanyInfo) {
            await this.saveAssociateCompanyInfoNew()
            this.associate.associateCompanyId = [this.associate.associateCompanyId]
          }

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFetchedUser(userResponse.data)

          this.$router.replace({ name: 'ZAD0050-detail', params: { id: userResponse.data.id } })
        } else if (this.isEditMode) {
          userResponse = await this.saveUserUpdate()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFetchedData(userResponse.data)
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
     * 協力会社情報保存処理
     */
    async saveAssociateCompanyInfo () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveAssociateCompanyInfoNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFechedAssociateCompanyUser(response.data)
        } else if (this.isEditMode) {
          if (this.associate.isInputAssociateCompanyInfo) {
            response = await this.saveAssociateCompanyInfoUpdate()
          } else {
            response = await this.deleteAssociateCompanyInfo()
          }

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFechedAssociateCompanyUser(response.data)
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
     * パスワードリセット処理
     */
    async resetPassword () {
      try {
        // ローディング設定
        this.isResetLoading = true

        // リクエストを送信
        const response = await this.$axios.patch(`/admin/users/resetPassword/${this.id}`)

        // 新パスワードをユーザータブへ受け渡し
        this.user.newPassword = response.data.password

        // ダイアログの調整を行う
        this.user.confirmDialog = false
        this.user.showNewPasswordDialog = true
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isResetLoading = false
      }
    },

    // 新規登録を行います
    async saveUserNew () {
      // リクエストを作成
      let request = null

      // 協力会社ユーザー情報入力フラグがONの場合は協力会社IDも登録
      if (this.associate.isInputAssociateCompanyInfo) {
        request = {
          associateCompanyId: this.associate.associateCompanyId[0],
          ...this.user
        }
      } else {
        request = this.user
      }
      // 登録処理
      return await this.$axios.post('/admin/users', request)
    },
    // 更新を行います
    async saveUserUpdate () {
      // リクエストを作成
      const request = {
        id: this.id,
        ...this.user
      }

      return await this.$axios.patch(`/admin/users/${this.id}`, request)
    },
    // 協力会社情報の新規登録を行います。
    async saveAssociateCompanyInfoNew () {
      // リクエストを作成
      const request = {
        userId: this.id,
        ...this.associate.associateCompanyId = this.associate.associateCompanyId[0],
        ...this.associate
      }

      // 登録処理
      return await this.$axios.post('/admin/associateCompanyUsers', request)
    },
    // 協力会社情報の更新を行います。
    async saveAssociateCompanyInfoUpdate () {
      const request = {
        userId: this.id,
        ...this.associate.associateCompanyId = this.associate.associateCompanyId[0],
        ...this.associate
      }

      return await this.$axios.patch(`/admin/associateCompanyUsers/${this.id}`, request)
    },
    // 協力会社情報の削除を行います。
    async deleteAssociateCompanyInfo () {
      return await this.$axios.delete(`/admin/associateCompanyUsers/${this.id}`)
    },

    /**
     * 画面にレスポンスのユーザーをセットします。
     */
    setFetchedUser (data) {
      this.user = data

      // データを初期化しておく(ここで設定しないとダイアログと内容が出現しない時があるため)
      this.user.newPassword = ''
      this.user.confirmDialog = false
      this.user.showNewPasswordDialog = false
    },

    /**
     * 画面にレスポンスの協力会社ユーザーをセットします。
     */
    setFechedAssociateCompanyUser (data) {
      this.associate = data

      // NULLでなければ入力フラグをONにしておく
      if (this.associate.associateCompanyId !== null) {
        this.associate.isInputAssociateCompanyInfo = true
        this.associate.associateCompanyId = [this.associate.associateCompanyId]
      }
    },

    /**
     * 次ステップへ移動します。
     */
    next () {
      this.stepper += 1
    },

    /**
     * 前ステップへ移動します。
     */
    previous () {
      this.stepper -= 1
    }
  }
}
</script>
