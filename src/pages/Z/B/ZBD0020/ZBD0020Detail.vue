<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZBD0020.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("ZBD0020.info") }}</v-toolbar-title>
        <v-spacer></v-spacer>

      </v-toolbar>
      <v-divider />
      <v-card-text>
        <div class="px-1">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="save">

              <!-- 会社 -->
              <a-label-select
                vid="companyCd"
                ref="companyCd"
                v-model="companyCd"
                :items="companies"
                rules="required"
                item-text="companyName"
                item-value="companyCd"
                :label="$t('ZBD0020.companyCd')"
                :loading="isFetchScreenLoading"
                outlined
                dense
                :disabled="isDisableCompany || isEditMode"
              />

              <!-- 取引先 -->
              <a-label-select
                vid="supplierId"
                ref="supplierId"
                v-model="supplierId"
                :items="suppliers"
                rules="required"
                item-text="supplierName"
                item-value="id"
                :label="$t('ZBD0020.supplier')"
                :loading="isFetchScreenLoading"
                outlined
                dense
                :disabled="isDisableSupplier || isEditMode"
              />

              <!-- JOBコード -->
              <a-label-text-field
                vid="jobCd"
                ref="jobCd"
                v-model="jobCd"
                rules="required|max:16"
                :label="$t('ZBD0020.jobCd')"
                outlined
                dense
                :prefix="isNewMode ? jobCdPrefix : ''"
                :disabled="isDisableJobCd || isEditMode"
              />

              <!-- 案件名 -->
              <a-label-translation-text-field-group
                vid="jobName"
                ref="jobName"
                v-model="jobName"
                rules="required|max:255"
                :label="$t('ZBD0020.jobName')"
                outlined
                dense
              />

              <!-- 契約形態区分 -->
              <a-label-select
                vid="contractClass"
                ref="contractClass"
                v-model="contractClass"
                :items="contractClassItems"
                rules="required"
                item-text="codeName"
                item-value="codeKey"
                :label="$t('ZBD0020.contractType')"
                :loading="isFetchScreenLoading"
                outlined
                dense
              />

              <!-- 見積工数(人日) -->
              <a-label-text-field
                vid="estimatePersonDay"
                ref="estimatePersonDay"
                v-model="estimatePersonDay"
                :label="$t('ZBD0020.estimatePersonDay')"
                rules="numeric"
                outlined
                dense
                :suffix="$t('ZBD0020.estimatePersonDaySuffix')"
              />

              <v-expansion-panels multiple>

                <!-- 担当ユーザー -->
                <v-expansion-panel>
                  <v-expansion-panel-header>{{$t('ZBD0020.userDetail')}}</v-expansion-panel-header>
                  <v-expansion-panel-content eager>

                  <!-- 営業担当ユーザー -->
                  <a-autocomplete-user-search
                    :isMultiple="false"
                    :isDisable="false"
                    :isDisplayUserIcon="true"
                    :displayedLabel="$t('ZBD0020.selUserName')"
                    :displayedUserIds="arraySalesRepUserIds"
                    @selected="getSelUserData($event)"
                  />

                  <!-- PM担当ユーザー -->
                  <a-autocomplete-user-search
                    ref="pmUserId"
                    vid="pmUserId"
                    :isMultiple="false"
                    :isDisable="false"
                    :isDisplayUserIcon="true"
                    :label="$t('ZBD0020.pmUserName')"
                    :displayedLabel="$t('ZBD0020.pmUserName')"
                    :displayedUserIds="arrayPmUserIds"
                    rules="required"
                    @selected="getPmUserData($event)"
                  />

                  </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- 金額詳細 -->
                <v-expansion-panel>
                  <v-expansion-panel-header>{{$t('ZBD0020.amountDetail')}}</v-expansion-panel-header>
                  <v-expansion-panel-content>

                    <!-- 受注金額 -->
                    <a-label-number-field
                      vid="orderAmount"
                      ref="orderAmount"
                      v-model="orderAmount"
                      :label="$t('ZBD0020.orderAmount')"
                      rules="max:13"
                      outlined
                      dense
                      prefix="￥"
                    />

                    <!-- 開発有効金額 -->
                    <a-label-number-field
                      vid="devAmount"
                      ref="devAmount"
                      v-model="devAmount"
                      :label="$t('ZBD0020.devAmount')"
                      rules="max:13"
                      outlined
                      dense
                      prefix="￥"
                    />

                    <!-- (内)目標金額 -->
                    <a-label-number-field
                      vid="inTargetAmount"
                      ref="inTargetAmount"
                      v-model="inTargetAmount"
                      :label="$t('ZBD0020.inTargetAmount')"
                      rules="max:13"
                      outlined
                      dense
                      prefix="￥"
                    />

                    <!-- (外)目標金額 -->
                    <a-label-number-field
                      vid="outTargetAmount"
                      ref="outTargetAmount"
                      v-model="outTargetAmount"
                      :label="$t('ZBD0020.outTargetAmount')"
                      rules="max:13"
                      outlined
                      dense
                      prefix="￥"
                    />

                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header>{{$t('ZBD0020.dateDetail')}}</v-expansion-panel-header>
                  <v-expansion-panel-content>

                    <!-- 請求予定年月 -->
                    <a-label-date-select
                      vid="expectedBillingDate"
                      ref="expectedBillingDate"
                      v-model="expectedBillingDate"
                      :label="$t('ZBD0020.expectedBillingDate')"
                      rules="required"
                      outlined
                      dense
                      type="month"
                    />

                    <!-- 開発開始日付 カレンダー -->
                    <a-label-date-select
                      vid="devStartDate"
                      ref="devStartDate"
                      v-model="devStartDate"
                      :label="$t('ZBD0020.devStartDate')"
                      outlined
                      dense
                      type="month"
                    />

                    <!-- 開発終了年月(初回) -->
                    <a-label-text-field
                      vid="devEndDateInitial"
                      ref="devEndDateInitial"
                      v-model="devEndDateInitial"
                      :label="$t('ZBD0020.devEndDateInitial')"
                      outlined
                      dense
                      disabled
                    />

                    <!-- 開発終了年月 -->
                    <a-label-text-field
                      vid="devEndDate"
                      ref="devEndDate"
                      v-model="devEndDate"
                      :label="$t('ZBD0020.devEndDate')"
                      outlined
                      dense
                      :disabled="isNewMode"
                    />

                    <!-- 請求日付 カレンダー -->
                    <a-label-date-select
                      vid="billingDate"
                      ref="billingDate"
                      v-model="billingDate"
                      :label="$t('ZBD0020.billingDate')"
                      outlined
                      dense
                      :disabled="isNewMode"
                    />

                    <!-- 開発終了フラグ -->
                    <a-label-switch
                      v-model="isDevEnd"
                      :label="$t('ZBD0020.isDevEnd.name')"
                      :trueLabel="$t('ZBD0020.isDevEnd.true')"
                      :falseLabel="$t('ZBD0020.isDevEnd.false')"
                      :disabled="isNewMode"
                    />

                  </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- JOBコード設定 -->
                <v-expansion-panel>
                  <v-expansion-panel-header>{{$t('ZBD0020.jobCdProperty')}}</v-expansion-panel-header>
                  <v-expansion-panel-content>

                    <!-- 営業支援フラグ -->
                    <a-label-switch
                      v-model="isSalesSupport"
                      :label="$t('ZBD0020.isSalesSupport.name')"
                      :trueLabel="$t('ZBD0020.isSalesSupport.true')"
                      :falseLabel="$t('ZBD0020.isSalesSupport.false')"
                    />

                    <!-- 仮フラグ -->
                    <a-label-switch
                      v-model="isTentative"
                      :hint="$t('ZBD0020.isTentative.hint')"
                      :persistent-hint="true"
                      :label="$t('ZBD0020.isTentative.name')"
                      :trueLabel="$t('ZBD0020.isTentative.true')"
                      :falseLabel="$t('ZBD0020.isTentative.false')"
                    />

                    <!-- 社内フラグ -->
                    <a-label-switch
                      v-model="isInHouse"
                      :hint="$t('ZBD0020.isInHouse.hint')"
                      :label="$t('ZBD0020.isInHouse.name')"
                      :trueLabel="$t('ZBD0020.isInHouse.true')"
                      :falseLabel="$t('ZBD0020.isInHouse.false')"
                    />

                    <!-- 工事進行基準フラグ -->
                    <a-label-switch
                      v-model="isPoc"
                      :label="$t('ZBD0020.isPoc.name')"
                      :trueLabel="$t('ZBD0020.isPoc.true')"
                      :falseLabel="$t('ZBD0020.isPoc.false')"
                    />

                    <!-- 工数入力可能フラグ -->
                    <a-label-switch
                      v-model="isAvailable"
                      :label="$t('ZBD0020.isAvailable.name')"
                      :trueLabel="$t('ZBD0020.isAvailable.true')"
                      :falseLabel="$t('ZBD0020.isAvailable.false')"
                    />

                    <!-- 実働工数フラグ -->
                    <a-label-switch
                      v-model="isWork"
                      :label="$t('ZBD0020.isWork.name')"
                      :trueLabel="$t('ZBD0020.isWork.true')"
                      :falseLabel="$t('ZBD0020.isWork.false')"
                    />

                  </v-expansion-panel-content>
                </v-expansion-panel>

              </v-expansion-panels>

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
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AAutocompleteUserSearch from '../../../../components/forms/AAutocompleteUserSearch.vue'
import ALabelDateSelect from '../../../../components/forms/ALabelDateSelect.vue'
import Permissions from '@/constants/Permissions'

export default {
  components: {
    AAutocompleteUserSearch,
    ALabelDateSelect
  },
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZBD0020.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // ユーザー検索UI結果
      rsltUserSearchDatas: [],

      // 権限
      isAdmin: false,

      // データ
      id: '',
      companyCd: 'S2I',

      supplierId: '',
      jobCd: '',
      jobNameTid: null,
      jobName: {},
      orderAmount: 0,
      devAmount: 0,
      inTargetAmount: 0,
      outTargetAmount: 0,
      arraySalesRepUserIds: [],
      salesRepUserId: null,
      arrayPmUserIds: [],
      pmUserId: null,
      expectedBillingDate: null,
      devStartDate: null,
      devEndDateInitial: '',
      devEndDate: '',
      billingDate: null,
      isDevEnd: false,
      isInitial: false,
      contractClass: '',
      estimatePersonDay: 0,
      isSalesSupport: false,
      isTentative: false,
      isInHouse: false,
      isPoc: false,
      isAvailable: true,
      isWork: false,

      // コンボボックス項目
      companies: [],
      suppliers: [],
      contractClassItems: [],

      // 画面制御
      isFetchScreenLoading: false,
      isSaveLoading: false,
      isDisbleCompany: false,
      isDisableSupplier: false,
      isDisableJobCd: true,
      jobCdPrefix: ''

    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0020.title'),
          to: { name: 'ZBD0020' },
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
      this.fetchScreenData()
      if (this.isEditMode) {
        this.isDisableCompany = true
        this.isDisableSupplier = true
        this.isDisableJobCd = true
        this.id = this.routeId
        this.fetchData()
      }
    },
    supplierId (val) {
      this.getJobCdPrefix(val)

      // 取引先が入れば、JOBコード項目アクティブ化
      if (val) {
        if (this.isNewMode) {
          this.isDisableJobCd = false
        }
      } else {
        this.isDisableJobCd = true
      }
    },
    expectedBillingDate () {
      if (this.mode === 'new') {
        this.devEndDateInitial = this.expectedBillingDate
      }
    }
  },
  mounted () {
    this.isInitialData()

    // 管理者チェック
    this.checkAdmin()

    // 更新モードの場合は現在の登録情報を取得
    this.fetchScreenData()
    if (this.isEditMode) {
      this.isDisableCompany = true
      this.isDisableSupplier = true
      this.isDisableJobCd = true
      this.id = this.routeId
      this.fetchData()
    }
  },
  methods: {
    isInitialData () {
      if (!this.devEndDateInitial && !this.inTargetAmount && !this.outTargetAmount) {
        this.isInitial = true
      }
    },
    checkAdmin () {
      const hasPermission = this.$store.getters['auth/hasPermissions']([Permissions.JOB_CD_S2I_ADMIN])
      this.isAdmin = hasPermission
    },
    getJobCdPrefix (supplierId) {
      this.jobCdPrefix = this.suppliers.filter(x => x.id === supplierId).map(x => x.supplierCd).join()
      this.jobCdPrefix = this.jobCdPrefix + '-'
    },
    getSelUserData (selUserData) {
      if (selUserData.length) {
        this.salesRepUserId = selUserData[0].userId
      }
    },
    getPmUserData (pmUserData) {
      if (pmUserData.length) {
        this.pmUserId = pmUserData[0].userId
      }
    },
    // 画面表示用の情報を取得
    async fetchScreenData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true
        this.isFetchScreenLoading = true

        // 画面表示用の情報を取得
        const query = {}
        query.isActive = true

        const codeQuery = {}
        codeQuery.isActive = true
        codeQuery.codeType = 'CLASS_CONTRACT'
        const [responseCompanies, responseSuppliers, responseContractClasses] = await Promise.all([

          this.$axios.get('companies', { params: query }),
          this.$axios.get('suppliers', { params: query }),
          this.$axios.get('codes', { params: codeQuery })
        ])

        // 画面に結果をセット
        this.companies = responseCompanies.data
        this.suppliers = responseSuppliers.data
        this.contractClassItems = responseContractClasses.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
        this.isFetchScreenLoading = false
      }
    },

    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // データを取得
        const response = await this.$axios.get(`/admin/jobCds/${this.id}`)
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

          this.setFetchedData(response.data)

          this.$router.replace({ name: 'ZBD0020-detail', params: { id: response.data.id } })
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
        supplierId: this.supplierId,
        jobCd: this.suppliers.find(s => s.id === this.supplierId).supplierCd + '-' + this.jobCd,
        jobName: this.jobName,
        contractClass: this.contractClass,
        estimatePersonDay: this.estimatePersonDay,
        salesRepUserId: this.salesRepUserId,
        pmUserId: this.pmUserId,
        orderAmount: this.orderAmount,
        devAmount: this.devAmount,
        inTargetAmount: this.inTargetAmount,
        outTargetAmount: this.outTargetAmount,
        expectedBillingDate: this.expectedBillingDate,
        devStartDate: this.devStartDate,
        devEndDateInitial: this.devEndDateInitial,
        devEndDate: this.devEndDate,
        billingDate: this.billingDate,
        isDevEnd: this.isDevEnd,
        isSalesSupport: this.isSalesSupport,
        isTentative: this.isTentative,
        isInHouse: this.isInHouse,
        isPoc: this.isPoc,
        isAvailable: this.isAvailable,
        isWork: this.isWork
      }

      // 登録処理
      return await this.$axios.post('/admin/jobCds', request)
    },
    // 更新を行います
    async saveUpdate () {
      // リクエストを作成
      const request = {
        id: this.id,
        jobNameTid: this.jobNameTid,
        jobName: this.jobName,
        contractClass: this.contractClass,
        estimatePersonDay: this.estimatePersonDay,
        salesRepUserId: this.salesRepUserId,
        pmUserId: this.pmUserId,
        orderAmount: this.orderAmount,
        devAmount: this.devAmount,
        inTargetAmount: this.inTargetAmount,
        outTargetAmount: this.outTargetAmount,
        expectedBillingDate: this.expectedBillingDate,
        devStartDate: this.devStartDate,
        devEndDate: this.devEndDate,
        billingDate: this.billingDate,
        isDevEnd: this.isDevEnd,
        isSalesSupport: this.isSalesSupport,
        isTentative: this.isTentative,
        isInHouse: this.isInHouse,
        isPoc: this.isPoc,
        isAvailable: this.isAvailable,
        isWork: this.isWork
      }

      return await this.$axios.patch(`/admin/jobCds/${this.id}`, request)
    },
    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.id = data.id
      this.companyCd = data.companyCd
      this.supplierId = data.supplierId
      this.jobCd = data.jobCd
      this.jobNameTid = data.jobNameTid
      this.jobName = data.jobName
      this.contractClass = data.contractClass
      this.estimatePersonDay = data.estimatePersonDay
      this.arraySalesRepUserIds = [data.salesRepUserId]
      this.arrayPmUserIds = [data.pmUserId]
      this.orderAmount = data.orderAmount
      this.devAmount = data.devAmount
      this.inTargetAmount = data.inTargetAmount
      this.outTargetAmount = data.outTargetAmount
      this.expectedBillingDate = data.expectedBillingDate
      this.devStartDate = data.devStartDate
      this.devEndDateInitial = data.devEndDateInitial
      this.devEndDate = data.devEndDate
      this.billingDate = data.billingDate
      this.isDevEnd = data.isDevEnd
      this.isSalesSupport = data.isSalesSupport
      this.isTentative = data.isTentative
      this.isInHouse = data.isInHouse
      this.isPoc = data.isPoc
      this.isAvailable = data.isAvailable
      this.isWork = data.isWork
    }
  }
}
</script>
