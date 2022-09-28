<template>
  <div class="d-flex flex-column flex-grow-1">
    <!-- 画面タイトル -->
    <div>
      <div class="display-1 pb-2">{{ $t("BBD0040.title") }}</div>
    </div>
    <v-card>
      <v-card class="ma-2">
        <v-card-title class="pb-0 text-h5">集計対象選択</v-card-title>
        <v-card-text>
          <v-row
            dense
            class="align-center"
          >
            <v-col
              cols="12"
              class="d-flex align-center"
              md="4"
            >
              <!-- 会社コード -->
              <v-select
                v-model="targetCompanyCd"
                :items="companyList"
                :item-text="(item) => item.companyCd + ' : ' + item.companyName"
                item-value="companyCd"
                label="会社"
                menu-props="auto"
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
              class="d-flex align-center"
              md="1"
            >
              <!-- 年度リスト -->
              <v-select
                :items="yearList"
                v-model="targetYear"
                label="年度"
                menu-props="auto"
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
              class="d-flex align-center"
              md="1"
            >
              <!-- 月度リスト -->
              <v-select
                :items="monthList"
                v-model="targetMonth"
                label="月"
                menu-props="auto"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <!-- 勤怠集計ボタン -->
              <v-btn
                class="ma-2"
                color="primary"
                @click="() => this.confirmDialog = true"
              >
                <v-icon left>
                  mdi-account-alert
                </v-icon>
                勤怠集計
              </v-btn>
              <v-dialog
                v-model="confirmDialog"
                persistent
                max-width="520px"
              >
                <!--確認ダイアログ -->
                <v-card class="pa-2">
                  <v-card-text>
                    <!-- 集計期間表示 -->
                    <v-chip
                      label
                      class="mb-1"
                      color="green"
                      text-color="white"
                    >
                      {{ this.targetStartDate }} ~ {{ this.targetEndDate }}
                    </v-chip>
                    <div class="mb-1">上記期間を対象に勤怠集計処理を実施します。</div>
                    <!-- コメント入力 -->
                    <v-textarea
                      v-model="targetComments"
                      filled
                      clearable
                      auto-grow
                      label="コメント"
                    ></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- キャンセルボタン -->
                    <v-btn
                      color="blue-grey"
                      class="white--text"
                      @click="closeAttendanceSummary"
                    >
                      キャンセル
                    </v-btn>
                    <!-- 実行ボタン -->
                    <v-btn
                      color="primary"
                      @click="executeAttendanceSummary"
                    >
                      実行
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <!-- 管理者用 -->
            <v-col align="right" cols="12" md="3">
              <!-- 従業員勤怠入力 -->
              <v-btn
                color="yellow"
                @click="() => this.adminDialog = true"
              >
                <v-icon left>
                  mdi-key
                </v-icon>
                従業員勤怠入力
              </v-btn>
              <v-dialog
                v-model="adminDialog"
                persistent
                max-width="520px"
              >
                <!--確認ダイアログ -->
                <v-card class="pa-1">
                  <v-card-text>
                    <v-row dence class="pl-2 pr-2">
                      <!-- ユーザー検索コンポーネント -->
                      <a-autocomplete-user-search
                        :isMultiple=true
                        :isDisable=false
                        :isDisplayUserIcon=true
                        :displayedLabel="$t('ZED0010.user')"
                        :displayedUserIds="arrayUserIds"
                        @selected="getData($event)"
                      />
                    </v-row>
                    <v-row dence class="pl-2 pr-2">
                      <!-- 勤怠区分 -->
                      <v-select
                        v-model="targetAttendanceClass"
                        :items="attendanceClasses"
                        item-text="attendanceClassName"
                        item-value="attendanceClass"
                        label="勤怠区分"
                        menu-props="auto"
                        hide-details
                      />
                    </v-row>
                    <v-row dence class="pl-2 pr-2">
                      <v-card  class="mt-3">
                        <!-- 対象日付ピッカー -->
                        <v-date-picker
                          v-model="targetDates"
                          locale="ja"
                          multiple
                          full-width
                          class="ma-2"
                          :show-current="false"
                          :no-title="true"
                          :day-format="(d) => new Date(d).getDate()"
                        />
                      </v-card>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- キャンセルボタン -->
                    <v-btn
                      color="primary"
                      @click="closeAdminDialog"
                    >
                      キャンセル
                    </v-btn>
                    <!-- 実行ボタン -->
                    <v-btn
                      color="primary"
                      @click="executeAttendanceInput"
                    >
                      実行
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 勤怠集計履歴テーブル -->
      <v-card class="ma-2 overflow-y-auto" max-height="400px">
        <v-card-title class="pb-0 text-h5">集計履歴</v-card-title>
        <v-card-text>
          <v-data-table
            dense
            virtual-rows
            sort-by="createdOn"
            sort-desc
            show-group-by
            group-by="companyCd"
            class="flex-grow-1 schedule-table mt-1"
            :headers="attendanceSummaryHistoryListHeaders"
            :items="attendanceSummaryHistoryList"
            :loading="isLoading"
            :items-per-page="10"
          >
            <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
              <th :colspan="attendanceSummaryHistoryListHeaders.length">
                <v-icon @click="toggle">
                  {{ isOpen ? 'mdi-minus-box' : 'mdi-plus-box' }}
                </v-icon>
                {{ items[0].companyCd }} : {{ items[0].companyName }}
              </th>
            </template>
            <!-- 会社 -->
            <template v-slot:[`item.companyCd`]="{ item }">
              {{ item.companyCd }} : {{ item.companyName }}
            </template>

            <!-- 年度 -->
            <template v-slot:[`item.year`]="{ item }">
              {{ item.year }}年度
            </template>

            <!-- 月 -->
            <template v-slot:[`item.month`]="{ item }">
              {{ item.month }}月
            </template>

            <!-- アクションカラム -->
            <template v-slot:[`item.actions`]="{ item }">
              <!-- Excel出力 -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    @click="outputExcel(item)"
                    color="green darken-2"
                  >
                    mdi-file-excel
                  </v-icon>
                </template>
                <span>Excel出力</span>
              </v-tooltip>
              <!-- CSV出力 -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    @click="outputCSV(item)"
                    color="orange darken-2"
                  >
                    mdi-file-delimited
                  </v-icon>
                </template>
                <div>CSV出力</div>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- 有給取得状況表示 -->
      <v-card class="ma-2 overflow-y-auto" max-height="400px">
        <v-card-title class="pb-0 text-h5">有給取得状況</v-card-title>
        <v-card-text>
          <v-data-table
            dense
            virtual-rows
            show-group-by
            group-by="companyCd"
            class="flex-grow-1 schedule-table mt-1"
            hide-default-footer
            :headers="payVacationListHeaders"
            :items="payVacationList"
            :loading="isLoading"
            :items-per-page="10"
          >
            <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
              <th :colspan="payVacationListHeaders.length">
                <v-icon @click="toggle">
                  {{ isOpen ? 'mdi-minus-box' : 'mdi-plus-box' }}
                </v-icon>
                {{ items[0].companyCd }} : {{ items[0].companyName }}
              </th>
            </template>
            <!-- 会社 -->
            <template v-slot:[`item.companyCd`]="{ item }">
              {{ item.companyCd }} : {{ item.companyName }}
            </template>

            <!-- 部署 -->
            <template v-slot:[`item.organizationName`]="{ item }">
              {{ item.organizationName }}
            </template>

            <!-- 付与日数 -->
            <template v-slot:[`item.grantDays`]="{ item }">
              {{ item.grantDays }}
            </template>

            <!-- 取得日数 -->
            <template v-slot:[`item.takeDays`]="{ item }">
              {{ item.takeDays }}
            </template>

            <!-- 取得率 -->
            <template v-slot:[`item.takeRate`]="{ item }">
              {{ item.takeRate.toFixed(2) }} %
            </template>

            <!-- 平均取得日数 -->
            <template v-slot:[`item.takeAverage`]="{ item }">
              {{ item.takeAverage }}
            </template>

          </v-data-table>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AAutocompleteUserSearch from '../../../../components/forms/AAutocompleteUserSearch.vue'

export default {
  components: {
    AAutocompleteUserSearch
  },
  head: {
    title () {
      return {
        complement: this.$t('BBD0040.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // 状態
      isLoading: false,
      confirmDialog: false,
      adminDialog: false,
      payVacationDialog: false,

      // フォーム
      constTodayElement: new Date(),
      targetYear: null,
      targetMonth: null,
      targetCompany: null,
      targetComments: null,
      targetDates: [],

      companyList: [
        {
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社'
        },
        {
          companyCd: 'MRS',
          companyName: '村瀬電機株式会社'
        }
      ],
      yearList: [
        2022,
        2021,
        2020
      ],
      monthList: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],

      // データ
      attendanceSummaryHistoryList: [
        {
          id: 1,
          year: 2021,
          month: 5,
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          comments: '',
          createdOn: '2021/5/24 10:25:30'
        },
        {
          id: 3,
          year: 2021,
          month: 6,
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          comments: '',
          createdOn: '2021/6/22 10:00:03'
        },
        {
          id: 4,
          year: 2021,
          month: 7,
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          comments: '',
          createdOn: '2021/7/25 9:41:46'
        },
        {
          id: 5,
          year: 2021,
          month: 8,
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          comments: '',
          createdOn: '2021/8/24 11:14:20'
        },
        {
          id: 6,
          year: 2021,
          month: 9,
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          comments: '',
          createdOn: '2021/9/23 10:21:51'
        },
        {
          id: 2,
          year: 2021,
          month: 5,
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          comments: '○○さん入力ミスの為、再集計しました。',
          createdOn: '2021/5/24 16:03:24'
        }
      ],

      payVacationList: [
        {
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          organizationCd: 'MNG',
          organizationName: '管理センター',
          grantDays: 160,
          takeDays: 36,
          takeRate: 22.50,
          takeAverage: 2.34
        },
        {
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          organizationCd: 'DEV',
          organizationName: 'システム開発センター',
          grantDays: 800,
          takeDays: 128,
          takeRate: 16.00,
          takeAverage: 2.56
        },
        {
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          organizationCd: 'SAL',
          organizationName: 'ソリューション推進センター',
          grantDays: 320,
          takeDays: 64,
          takeRate: 20.00,
          takeAverage: 1.88
        },
        {
          companyCd: 'S2I',
          companyName: 'エスツーアイ株式会社',
          organizationCd: 'S2I',
          organizationName: '全社',
          grantDays: 1280,
          takeDays: 228,
          takeRate: 17.81,
          takeAverage: 2.85
        }
      ]

    }
  },
  computed: {
    ...mapState('app', ['locale']),
    attendanceSummaryHistoryListHeaders () {
      return [
        { text: this.$t('アクション'), value: 'actions', groupable: false, sortable: false, divider: true, width: 90, align: 'center' },
        { text: this.$t('年度'), value: 'year', divider: true, groupable: false, width: 100, align: 'center' },
        { text: this.$t('月'), value: 'month', divider: true, groupable: false, width: 60, align: 'center' },
        { text: this.$t('作成日時'), value: 'createdOn', divider: true, groupable: false, width: 160 },
        { text: this.$t('コメント'), value: 'comments', divider: true, groupable: false }
      ]
    },
    payVacationListHeaders () {
      return [
        { text: this.$t('部署'), value: 'organizationName', divider: true, groupable: false },
        { text: this.$t('付与日数'), value: 'grantDays', divider: true, groupable: false, align: 'right' },
        { text: this.$t('取得日数'), value: 'takeDays', divider: true, groupable: false, align: 'right' },
        { text: this.$t('取得率'), value: 'takeRate', divider: true, groupable: false, align: 'right' },
        { text: this.$t('平均取得日数'), value: 'takeAverage', divider: true, groupable: false, align: 'right' }
      ]
    },
    targetStartDate () {
      return this.targetMonth === 1
        ? (this.targetYear - 1) + '/' + 12 + '/' + 21
        : this.targetYear + '/' + (this.targetMonth - 1) + '/' + 21
    },
    targetEndDate () {
      return this.targetYear + '/' + this.targetMonth + '/' + 20
    }
  },
  mounted () {
    this.targetYear = this.constTodayElement.getFullYear()
    this.targetMonth = this.constTodayElement.getMonth() + 1
    this.targetCompanyCd = 'S2I'
  },
  methods: {
    closeAttendanceSummary () {
      this.targetComments = ''
      this.confirmDialog = false
    },
    executeAttendanceSummary () {
      const now = new Date()
      this.attendanceSummaryHistoryList.push(
        {
          id: this.attendanceSummaryHistoryList.length + 1,
          year: this.targetYear,
          month: this.targetMonth,
          companyCd: this.targetCompanyCd,
          companyName: this.companyList.find((v) => v.companyCd === this.targetCompanyCd).companyName,
          comments: this.targetComments,
          createdOn: now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
        }
      )
      this.closeAttendanceSummary()
    },
    executeAttendanceInput () {
      this.closeAdminDialog()
    },
    closeAdminDialog () {
      this.adminDialog = false
      this.targetDates = []
    },
    closePatVacationDialog () {
      this.payVacationDialog = false
    }
  }

}
</script>
