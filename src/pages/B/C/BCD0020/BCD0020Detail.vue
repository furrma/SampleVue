<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("BCD0020.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("BCD0020.info") }}</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-title>{{ jobCd}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row dense>
          <v-col cols="6">
            <div class="d-flex">
              <v-subheader>{{ $t("BCD0020.jobName") }}</v-subheader>
              <a-text-field
                class="flex-fill"
                vid="jobName"
                ref="jobName"
                v-model="jobName"
                outlined
                dense
                readonly
              />
            </div>

            <div class="d-flex">
              <v-subheader>{{ $t("BCD0020.supplierName") }}</v-subheader>
              <a-text-field
                class="flex-fill"
                vid="supplierName"
                ref="supplierName"
                v-model="supplierName"
                outlined
                dense
                readonly
              />
            </div>

            <div class="d-flex">
              <v-subheader>{{ $t("BCD0020.orderAmount") }}</v-subheader>
              <a-text-field
                class="flex-fill"
                vid="orderAmount"
                ref="orderAmount"
                v-model="orderAmount"
                outlined
                dense
                reverse
                readonly
              />
            </div>

          </v-col>
          <v-col cols="6">
            <a-label-text-field
              vid="jobName"
              ref="jobName"
              v-model="jobName"
              :label="$t('BCD0020.jobName4')"
              outlined
              dense
              readonly
            />

            <a-label-text-field
              vid="jobName"
              ref="jobName"
              v-model="jobName"
              :label="$t('BCD0020.jobName5')"
              outlined
              dense
              readonly
            />

            <a-label-text-field
              vid="jobName"
              ref="jobName"
              v-model="jobName"
              :label="$t('BCD0020.jobName6')"
              outlined
              dense
              readonly
            />

          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  components: {
  },
  data () {
    return {
      occupations: [],
      proOccupations: [],
      skills: [],
      selectedProOccupations: [],
      selectedOccupations: [],
      selectedSkills: [],
      shainList: [],
      searchShainName: '',
      dialog: false,

      // data
      jobCd: '',
      jobName: '',
      supplierName: '',
      orderAmount: 0,

      // data
      // lastMonth: '',
      lastMonth: moment(new Date().setDate(0)).format('MM'),
      targetMonth: '',
      jobCdData: [],
      organizationItems: [],

      // 検索絞り込み条件
      keywords: '',
      partialMatchJobCd: '',
      organizationId: '',
      pmUserId: null,
      isFilteringJobCd: true,
      isFilteringMonth: false,

      isFilterActiveJobCd: true,
      isFilterDevEndJobCd: false,
      isFilterIssueJobCd: false,
      filterSalesSupport: 'INCLUDE',
      filterSalesSupportButtons: [
        {
          value: 'ONLY',
          label: this.$t('BCD0020.isSalesSupport.only'),
          icon: 'mdi-magnify-expand'
        },
        {
          value: 'INCLUDE',
          label: this.$t('BCD0020.isSalesSupport.include'),
          icon: 'mdi-magnify-plus'
        },
        {
          value: 'EXCLUDE',
          label: this.$t('BCD0020.isSalesSupport.exclude'),
          icon: 'mdi-magnify-minus'
        }
      ],
      filterTentative: 'INCLUDE',
      filterTentativeButtons: [
        {
          value: 'ONLY',
          label: this.$t('BCD0020.isTentative.only'),
          icon: 'mdi-magnify-expand'
        },
        {
          value: 'INCLUDE',
          label: this.$t('BCD0020.isTentative.include'),
          icon: 'mdi-magnify-plus'
        },
        {
          value: 'EXCLUDE',
          label: this.$t('BCD0020.isTentative.exclude'),
          icon: 'mdi-magnify-minus'
        }
      ],
      filterInHouse: 'EXCLUDE',
      filterInHouseButtons: [
        {
          value: 'ONLY',
          label: this.$t('BCD0020.isInHouse.only'),
          icon: 'mdi-magnify-expand'
        },
        {
          value: 'INCLUDE',
          label: this.$t('BCD0020.isInHouse.include'),
          icon: 'mdi-magnify-plus'
        },
        {
          value: 'EXCLUDE',
          label: this.$t('BCD0020.isInHouse.exclude'),
          icon: 'mdi-magnify-minus'
        }
      ],
      filterPoc: 'INCLUDE',
      filterPocButtons: [
        {
          value: 'ONLY',
          label: this.$t('BCD0020.isInHouse.only'),
          icon: 'mdi-magnify-expand'
        },
        {
          value: 'INCLUDE',
          label: this.$t('BCD0020.isInHouse.include'),
          icon: 'mdi-magnify-plus'
        },
        {
          value: 'EXCLUDE',
          label: this.$t('BCD0020.isInHouse.exclude'),
          icon: 'mdi-magnify-minus'
        }
      ],
      filterDevEnd: 'EXCLUDE',
      filterDevEndButtons: [
        {
          value: 'ONLY',
          label: this.$t('BCD0020.isDevEnd.only'),
          icon: 'mdi-magnify-expand'
        },
        {
          value: 'INCLUDE',
          label: this.$t('BCD0020.isDevEnd.include'),
          icon: 'mdi-magnify-plus'
        },
        {
          value: 'EXCLUDE',
          label: this.$t('BCD0020.isDevEnd.exclude'),
          icon: 'mdi-magnify-minus'
        }
      ],

      // 画面制御
      isLoading: false
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('BCD0020.title'),
          to: { name: 'BCD0020' }
        }
      ]
    },
    jobCdAnlDetailHeader () {
      return [
        { text: this.$t('BCD0020.jobCd'), value: 'jobCd', divider: true, width: 120 },
        { text: this.$t('BCD0020.supplierName'), value: 'supplierName', divider: true, width: 240 },
        { text: this.$t('BCD0020.jobName'), value: 'jobName', divider: true, width: 240 },
        { text: this.$t('BCD0020.orderAmount'), value: 'orderAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.devAmount'), value: 'devAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.inTargetAmount'), value: 'inTargetAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.outTargetAmount'), value: 'outTargetAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.inActualAmount'), value: 'inActualAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.outActualAmount'), value: 'outActualAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.diffTargetAmount'), value: 'diffTargetAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.diffDevAmount'), value: 'diffDevAmount', groupable: false, divider: true, align: 'right' },
        { text: this.lastMonth + this.$t('BCD0020.actualMonthManHours'), value: 'actualMonthManHours', groupable: false, divider: true, align: 'right' },
        { text: this.lastMonth + this.$t('BCD0020.actualMonthManHourAmount'), value: 'actualMonthManHourAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.actualTotalManHours'), value: 'actualTotalManHours', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.actualTotalManHourAmount'), value: 'actualMonthManHourAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.actualTotalPocAmount'), value: 'actualTotalPocAmount', groupable: false, divider: true, align: 'right' },
        { text: this.$t('BCD0020.pmUserName'), value: 'pmUserName', divider: true },
        { text: this.$t('BCD0020.pmUserOrganizations'), value: 'pmUserOrganizations', divider: true },
        { text: this.$t('BCD0020.salesUserName'), value: 'salesUserName', divider: true },
        { text: this.$t('BCD0020.createdDate'), value: 'createdDate', groupable: false, divider: true },
        { text: this.$t('BCD0020.devStartDate'), value: 'devStartDate', groupable: false, divider: true },
        { text: this.$t('BCD0020.devEndDate'), value: 'devEndDate', groupable: false, divider: true },
        { text: this.$t('BCD0020.expectedBillingDate'), value: 'expectedBillingDate', groupable: false, divider: true },
        { text: this.$t('BCD0020.billingDate'), value: 'billingDate', groupable: false, divider: true }
      ]
    },
    // テーブルの高さを決める処理
    getHeight () {
      return window.innerHeight - 250
    }
  },
  created () {
    // 先月を取得
    // var lastMonthDate = new Date().setMonth(new Date().getMonth() - 1)
    // this.lastMonth = moment(lastMonthDate).format('MM')
  },
  mounted () {
    // 対象年月の初期値
    this.targetMonth = moment(new Date()).format('YYYY-MM')

    // データ仮置き
    this.setTempData()
  },
  watch: {
    targetMonth (val) {
      if (val) {
        // 対象年月が変わった場合、再検索
        this.setTempData()
      } else {
        this.jobCdData = []
      }
    },
    isFilteringJobCd (val) {
      this.isFilteringMonth = !val
    },
    isFilteringMonth (val) {
      this.isFilteringJobCd = !val
    },
    isFilterActiveJobCd (val) {
      if (val) {
        this.isFilterDevEndJobCd = !val
        this.isFilterIssueJobCd = !val
      }
    },
    isFilterDevEndJobCd (val) {
      if (val) {
        this.isFilterActiveJobCd = !val
        this.isFilterIssueJobCd = !val
      }
    },
    isFilterIssueJobCd (val) {
      if (val) {
        this.isFilterActiveJobCd = !val
        this.isFilterDevEndJobCd = !val
      }
    }
  },
  methods: {
    sumField (key) {
      // 表示項目(key)に対する合計値を返す
      return this.jobCdData.reduce((a, b) => a + (b[key] || 0), 0)
    },
    // maxField (key) {
    //   // 表示項目(key)に対する最大値を返す
    //   return this.jobCdData.reduce((a, b) => ((a > b[key]) ? a : b[key]), 0)
    // },
    test (item) {
      alert(JSON.stringify(item))
    },
    getPmUserData (searchedData) {
      this.pmUserId = searchedData[0].userId ?? null
    },
    setTempData () {
      this.jobCd = 'ZZZ-21-0000'
      this.jobName = '新社内システム構築PJ'
      this.supplierName = 'エスツーアイ株式会社'
      this.orderAmount = 30000000

      this.jobCdData = [
        {
          jobCd: 'ZZZ-21-0000',
          jobName: '新社内システム構築PJ',
          supplierCd: 'ZZZ',
          supplierName: 'エスツーアイ株式会社',
          orderAmount: 30000000,
          devAmount: 28500000,
          inTargetAmount: 0,
          outTargetAmount: 0,
          inActualAmount: 0,
          outActualAmount: 0,
          actualTotalPOCAmount: 0,
          diffDevAmount: 0,
          diffTargetAmount: 0,
          actualMonthManHours: 0,
          actualMonthManHourAmount: 0,
          actualTotalManHours: 0
        },
        {
          jobCd: 'NTK-21-0000',
          jobName: '日本特殊陶業 EDS保守',
          supplierCd: 'NTK',
          supplierName: '日本特殊陶業株式会社',
          orderAmount: 12000000,
          devAmount: 28500000,
          inTargetAmount: 0,
          outTargetAmount: 0,
          inActualAmount: 0,
          outActualAmount: 0,
          actualTotalPOCAmount: 0,
          diffDevAmount: 0,
          diffTargetAmount: 0,
          actualMonthManHours: 0,
          actualMonthManHourAmount: 0,
          actualTotalManHours: 0
        },
        {
          jobCd: 'NTK-21-0001',
          jobName: '日本特殊陶業 EDS保守',
          supplierCd: 'NTK',
          supplierName: '日本特殊陶業株式会社',
          orderAmount: 12000000,
          devAmount: 28500000,
          inTargetAmount: 232654,
          outTargetAmount: 844164,
          inActualAmount: -200000,
          outActualAmount: -59594,
          actualTotalPOCAmount: 2661,
          diffDevAmount: 2264594,
          diffTargetAmount: 15499,
          actualMonthManHours: 1000,
          actualMonthManHourAmount: 595992,
          actualTotalManHours: 1000
        },
        {
          jobCd: 'NTK-21-0002',
          jobName: '日本特殊陶業 EDS保守',
          supplierCd: 'NTK',
          supplierName: '日本特殊陶業株式会社',
          orderAmount: 12000000,
          devAmount: 28500000,
          inTargetAmount: 0,
          outTargetAmount: 0,
          inActualAmount: 0,
          outActualAmount: 0,
          actualTotalPOCAmount: 0,
          diffDevAmount: 0,
          diffTargetAmount: 0,
          actualMonthManHours: 0,
          actualMonthManHourAmount: 0,
          actualTotalManHours: 0
        }
      ]
    },
    async searchJobCd () {
      try {

      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },
    async search () {
      try {

      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.totalField {
  font-size: 14px !important;
  background: rgb(255, 253, 118) !important;
}
.minusValue {
  color: rgb(255, 255, 255);
  background: rgb(255, 27, 27) !important;
}
.v-data-table--fixed-header >>> th:nth-child(1) {
  position: sticky !important;
  left: 0px;
  z-index: 5;
  background: white;
}
.v-data-table--fixed-header >>> td:nth-child(1) {
  position: sticky !important;
  left: 0px;
  background: white;
}
.v-data-table--fixed-header >>> th:nth-child(3) {
  position: sticky !important;
  left: 100px;
  z-index: 5;
  background: white;
}
.v-data-table--fixed-header >>> td:nth-child(3) {
  position: sticky !important;
  left: 100px;
  background: white;
}
</style>
