<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("BCD0020.title") }}</div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
      <v-spacer/>
      <!-- 検索枠 -->
      <v-sheet class="flex-grow-1" >
        <a-keyword-text-field v-model="keywords" @search="search" />
      </v-sheet>

    </div>
    <v-row>
      <!-- 検索項目 -->
      <v-col cols="12" sm="3" md="3">
        <div style="position: sticky; top:100px;">

          <v-checkbox
            vid="isFilteringJobCd"
            ref="isFilteringJobCd"
            v-model="isFilteringJobCd"
            :label="$t('BCD0020.isFilteringJobCd')"
          ></v-checkbox>

          <v-sheet v-if="isFilteringJobCd" class="flex-grow-1 pa-2">
            <!-- TODO：JOBコード検索 -->
            <a-field-label>{{ $t('BCD0020.partialMatchJobCd') }}</a-field-label>
            <a-keyword-text-field
              class="pb-2"
              v-model="partialMatchJobCd"
              @search="searchJobCd"
            />

          </v-sheet>

          <v-checkbox
            vid="isFilteringMonth"
            ref="isFilteringMonth"
            v-model="isFilteringMonth"
            :label="$t('BCD0020.isFilteringMonth')"
          ></v-checkbox>

          <v-sheet v-if="isFilteringMonth" class="flex-grow-1 pa-2">
            <!-- 対象年月 -->
            <a-label-date-select
              vid="targetMonth"
              ref="targetMonth"
              v-model="targetMonth"
              :label="$t('BCD0020.targetMonth')"
              outlined
              dense
              type="month"
            />

            <!-- TODO:対象年月 ⇒ アクティブJOBコード -->
            <v-switch
              v-model="isFilterActiveJobCd"
              inset
              dense
              :label="$t('BCD0020.isFilterActiveJobCd')"
              :disabled="!targetMonth||isFilterActiveJobCd"
            />

            <!-- TODO:対象年月 ⇒ 開発終了JOBコード -->
            <v-switch
              v-model="isFilterDevEndJobCd"
              inset
              dense
              :label="$t('BCD0020.isFilterDevEndJobCd')"
              :disabled="!targetMonth||isFilterDevEndJobCd"
            />

            <!-- TODO:対象年月 ⇒ 発行JOBコード -->
            <v-switch
              v-model="isFilterIssueJobCd"
              inset
              dense
              :label="$t('BCD0020.isFilterIssueJobCd')"
              :disabled="!targetMonth||isFilterIssueJobCd"
            />

          </v-sheet>

          <!-- 組織選択 -->
          <a-label-select
            vid="organizationId"
            ref="organizationId"
            v-model="organizationId"
            :items="organizationItems"
            :label="$t('BCD0020.organization')"
            outlined
            dense
            class="pt-3"
          />

          <!-- PMユーザー -->
          <a-autocomplete-user-search
            vid="pmUserId"
            ref="pmUserId"
            v-model="pmUserId"
            :isMultiple= false
            :isDisplayUserIcon= true
            @selected="getPmUserData($event)"
            :displayedLabel="$t('BCD0020.pmUser')"
            :isIncludeInactiveUser=false
          />

          <!-- 営業支援JOBコード絞り込み -->
          <a-label-btn-toggle
            vid="filterSalesSupport"
            ref="filterSalesSupport"
            v-model="filterSalesSupport"
            :label="$t('BCD0020.isSalesSupport.label')"
            :mandatory="true"
            :buttons="filterSalesSupportButtons"
            class="pb-3"
          />

          <!-- 仮JOBコード絞り込み -->
          <a-label-btn-toggle
            vid="filterTentative"
            ref="filterTentative"
            v-model="filterTentative"
            :label="$t('BCD0020.isTentative.label')"
            :mandatory="true"
            :buttons="filterTentativeButtons"
            class="pb-3"
          />

          <!-- 社内コード絞り込み -->
          <a-label-btn-toggle
            vid="filterInHouse"
            ref="filterInHouse"
            v-model="filterInHouse"
            :label="$t('BCD0020.isInHouse.label')"
            :mandatory="true"
            :buttons="filterInHouseButtons"
            class="pb-3"
          />

          <!-- 工事進行基準対象絞り込み -->
          <a-label-btn-toggle
            vid="filterPoc"
            ref="filterPoc"
            v-model="filterPoc"
            :label="$t('BCD0020.isPoc.label')"
            :mandatory="true"
            :buttons="filterPocButtons"
            class="pb-3"
          />

          <!-- 開発終了絞り込み -->
          <a-label-btn-toggle
            vid="filterDevEnd"
            ref="filterDevEnd"
            v-model="filterDevEnd"
            :label="$t('BCD0020.isDevEnd.label')"
            :mandatory="true"
            :buttons="filterDevEndButtons"
            class="pb-3"
          />

        </div>
      </v-col>

      <!-- 一覧項目 -->
      <v-col cols="12" sm="9" md="9">
        <v-sheet class="flex-grow-1 pa-2">
          <v-data-table
            :headers="jobCdAnlDetailHeader"
            :items="jobCdData"
            dense
            :items-per-page="-1"
            virtual-rows
            hide-default-footer
            :height="getHeight"
            fixed-header
          >

            <!-- JOBコード -->
            <template v-slot:[`item.jobCd`]="{ item }">
              <router-link
                :to="{ name: 'BCD0020-detail', params: { id: item.id } }"
              >
                {{ item.jobCd }}
              </router-link>
            </template>

            <!-- 受注金額カラム 3桁区切り表示 -->
            <template v-slot:[`item.orderAmount`]="{ item }">
              {{item.orderAmount.toLocaleString()}}
            </template>
            <!-- 開発有効金額カラム 3桁区切り表示 -->
            <template v-slot:[`item.devAmount`]="{ item }">
              {{item.devAmount.toLocaleString()}}
            </template>
            <!-- (内)目標金額カラム 3桁区切り表示 -->
            <template v-slot:[`item.inTargetAmount`]="{ item }">
              {{ item.inTargetAmount.toLocaleString() }}
            </template>
            <!-- (外)目標金額カラム 3桁区切り表示 -->
            <template v-slot:[`item.outTargetAmount`]="{ item }">
              {{ item.outTargetAmount.toLocaleString() }}
            </template>
            <!-- (内)実績金額カラム 3桁区切り表示 -->
            <template v-slot:[`item.inActualAmount`]="{ item }">
              <div v-if="item.inActualAmount < 0" class="minusValue">{{ item.inActualAmount.toLocaleString() }}</div>
              <div v-else>{{ item.inActualAmount.toLocaleString() }} </div>
            </template>
            <!-- (外)実績金額カラム 3桁区切り表示 -->
            <template v-slot:[`item.outActualAmount`]="{ item }">
              <div v-if="item.outActualAmount < 0" class="minusValue">{{ item.outActualAmount.toLocaleString() }}</div>
              <div v-else>{{ item.outActualAmount.toLocaleString() }} </div>
            </template>

            <!-- 合計の表示 -->
            <template slot="body.append" >
              <tr class="pink--text">
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField">{{$t('BCD0020.total')}}</th>
                <th class="totalField" style="text-align: right">{{ sumField('orderAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('devAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('inTargetAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('outTargetAmount').toLocaleString() }}</th>
                <th v-if="sumField('inActualAmount') < 0" class="totalField minusValue" style="text-align: right">{{ sumField('inActualAmount').toLocaleString() }}</th>
                <th v-else class="totalField" style="text-align: right">{{ sumField('inActualAmount').toLocaleString() }}</th>
                <th v-if="sumField('outActualAmount') < 0" class="totalField minusValue" style="text-align: right">{{ sumField('outActualAmount').toLocaleString() }}</th>
                <th v-else class="totalField" style="text-align: right">{{ sumField('outActualAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('diffTargetAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('diffDevAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('actualMonthManHours').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('actualMonthManHourAmount').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('actualTotalManHours').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('actualTotalManHourAmounts').toLocaleString() }}</th>
                <th class="totalField" style="text-align: right">{{ sumField('actualTotalPocAmount').toLocaleString() }}</th>
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField"/>
                <th class="totalField"/>
              </tr>
            </template>

          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import AAutocompleteUserSearch from '../../../../components/forms/AAutocompleteUserSearch.vue'

export default {
  components: {
    AAutocompleteUserSearch
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
