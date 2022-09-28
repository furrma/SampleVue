<template>
  <div class="d-flex flex-column flex-grow-1">
    <div>
      <!-- 画面タイトル -->
      <div v-if="isListMode" class="display-1 pb-2">{{ $t("BBD0020.titleList") }}</div>
      <div v-else class="display-1 pb-2">{{ $t("BBD0020.title") }}</div>
      <!-- パンくずリスト -->
        <v-breadcrumbs v-if="isListMode" :items="breadcrumbsList" class="pa-0 py-2"></v-breadcrumbs>
        <v-breadcrumbs v-else :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
    </div>
    <validation-observer ref="observer" v-slot="{ invalid }">
    <v-card class="pa-2">
      <v-row dense class="pa-1 align-center">
        <v-col>
          <!-- 対象年月 選択 -->
          <a-label-select
            vid="targetYearMonth"
            ref="targetYearMonth"
            v-model="targetYearMonth"
            :items="targetYearMonthItems"
            rules="required"
            :label="$t('BBD0020.targetYearMonth')"
            dense
          />
        </v-col>
        <v-col>
          <!-- 所属 選択 -->
          <a-label-select
            vid="team"
            ref="team"
            v-model="team"
            :items="teamItems"
            rules="required"
            :disabled="!isAcceptMode"
            item-text="organizationName"
            item-value="organizationId"
            :label="$t('BBD0020.team')"
            dense
          />
        </v-col>
        <v-col>
          <!-- ユーザー 選択 -->
          <a-label-select
            vid="user"
            ref="user"
            v-model="user"
            :items="userItems"
            rules="required"
            :disabled="!isAcceptMode"
            item-text="userName"
            item-value="id"
            :label="$t('BBD0020.user')"
            dense
          />
        </v-col>
        <v-spacer/>
        <!-- 一括チェックボタン -->
        <v-btn
          v-if="isAcceptMode"
          class="ma-1"
          color="primary"
          :disabled="invalid"
          @click="checkAll">
          {{ $t("BBD0020.checkAll") }}
        </v-btn>
        <!-- 保存ボタン -->
        <v-btn
         v-if="isAcceptMode"
         class="ma-1"
         color="primary"
         :loading="isLoading"
         :disabled="invalid"
         @click="updateIsAcceptance"
         >
          {{ $t("common.save") }}
        </v-btn>
      </v-row>
      <v-simple-table dense class="jobCdTable">
        <tbody>
          <!-- 月度 -->
          <tr>
            <td
              v-for="month in months"
              :key="month.value"
              :colspan="month.colspan"
              :rowspan="month.rowspan"
              class="px-2"
            >
              {{ month.text }}
            </td>
          </tr>
          <!-- 日 -->
          <tr>
            <td
              v-for="day in days"
              :key="day.value"
              :colspan="day.colspan"
              width="30px"
              :class="day.class"
            >
              {{ day.text }}
            </td>
          </tr>
          <!-- 検収 -->
          <tr>
            <td
              v-for="accept in accepts"
              :key="accept.date"
              :colspan="accept.colspan"
              :class="accept.class"
            >
              <div v-if="accept.isHeader">{{ accept.text }}</div>
              <div v-else>
                <v-checkbox
                  color="success"
                  v-model="accept.value"
                  :ripple="false"
                  :disabled="accept.disabled"
                />
              </div>
            </td>
          </tr>
          <!-- 勤怠 -->
          <tr>
            <td
              v-for="attendance in attendances"
              :key="attendance.date"
              :colspan="attendance.colspan"
              :class="attendance.class"
            >
              {{ attendance.text }}
            </td>
          </tr>
          <!-- ジョブコード -->
          <tr
            v-for="jobCdTr in jobCdTrs"
            :key="jobCdTr.value"
            :class="jobCdTr.class"
          >
            <td
              v-for="jobCdTd in jobCdTr.jobCdTds"
              :key="jobCdTd.date"
              :rowspan="jobCdTd.rowspan"
              :class="jobCdTd.class"
              :style="jobCdTd.style"
            >
              {{ jobCdTd.text }}
            </td>
          </tr>
          <!-- 労働時間 -->
          <tr class="pink lighten-4">
            <td
              v-for="wokrtimeSum in wokrtimeSums"
              :key="wokrtimeSum.date"
              :colspan="wokrtimeSum.colspan"
              :class="wokrtimeSum.class"
              :style="wokrtimeSum.style"
            >
              {{ wokrtimeSum.text }}
            </td>
          </tr>
          <!-- 残業時間 -->
          <tr>
            <td
              v-for="overtimeSum in overtimeSums"
              :key="overtimeSum.date"
              :colspan="overtimeSum.colspan"
              :class="overtimeSum.class"
              :style="overtimeSum.style"
            >
              {{ overtimeSum.text }}
            </td>
          </tr>
          <!-- 内深夜残業 -->
          <tr>
            <td
              v-for="midnightOvertimeSum in midnightOvertimeSums"
              :key="midnightOvertimeSum.date"
              :colspan="midnightOvertimeSum.colspan"
              :class="midnightOvertimeSum.class"
              :style="midnightOvertimeSum.style"
            >
              {{ midnightOvertimeSum.text }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    </validation-observer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import CodeKey from '../../../../constants/CodeKey'
import Permissions from '../../../../constants/Permissions'

export default {
  head: {
    title () {
      return {
        complement: this.$t('BBD0010.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  props: ['mode'],
  computed: {
    ...mapState('app', ['locale']),
    ...mapState({
      companyCd: state => state.auth.user.companyCd,
      loginUserId: state => state.auth.user.id,
      permission: state => state.auth.user.permissions
    }),
    breadcrumbsList () {
      return [
        {
          text: this.$t('BBD0010.title'),
          to: { name: 'BBD0010' },
          exact: true
        },
        {
          text: this.$t('BBD0020.titleList'),
          disabled: true
        }
      ]
    },
    breadcrumbs () {
      return [
        {
          text: this.$t('BBD0020.title'),
          to: { name: 'BBD0020-accept' },
          exact: true
        }
      ]
    },
    isAcceptMode () {
      // 権限の有無を確認
      return this.permission.map(el => el.permissionCd).includes(Permissions.ACCEPTANCE_ADMIN) && this.mode === 'accept'
    },
    isListMode () {
      return this.mode === 'list'
    }
  },
  data () {
    return {
      // 状態
      isLoading: false,

      targetYearMonth: '',
      team: null,
      user: null,
      targetYearMonthItems: [],
      teamItems: [],
      userItems: [],
      months: [],
      days: [],
      wokrtimeSums: [],
      overtimeSums: [],
      midnightOvertimeSums: [],
      accepts: [],
      attendances: [],
      jobCdTrs: [],
      jobCdTds: []
    }
  },
  created () {
    // 現在の日付を取得
    var date = new Date()
    // 1~20日の場合は現在月、それ以外は次月を対象年月とする
    date.getDate() <= 20 ? date.setMonth(date.getMonth()) : date.setMonth(date.getMonth() + 1)
    // 対象年月をコンボボックスに設定
    this.targetYearMonth = moment(date).format('YYYY/MM')
    // 対象年月リストを作成
    for (let i = 0; i < 3; i++) {
      this.targetYearMonthItems.push(moment(date).format('YYYY/MM'))
      date.setMonth(date.getMonth() - 1)
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.searchIni()
    },
    targetYearMonth () {
      // 必須データが全て設定されている場合検索
      if (this.targetYearMonth && this.team && this.user) {
        this.search()
      }
    },
    user () {
      // 必須データが全て設定されている場合検索
      if (this.targetYearMonth && this.team && this.user) {
        this.search()
      }
    },
    team () {
      // ユーザーリストを再取得
      this.searchUserList()
    },
    isAcceptMode () {
      // 必須データが全て設定されている場合検索
      if (this.targetYearMonth && this.team && this.user) {
        this.search()
      }
    }
  },
  mounted () {
    // 初回検索
    this.user = this.loginUserId
    this.searchIni()
  },
  methods: {
    // 初回検索を行う
    async searchIni () {
      try {
        // ローディングを設定
        this.isLoading = true

        // クエリを作成
        const queryTeams = {}
        queryTeams.userId = this.user
        queryTeams.companyCd = this.companyCd

        // 所属リストを取得
        const responseTeams = await this.$axios.get('/organizations/teams', {
          // クエリパラメータ
          params: queryTeams
        })
        // レスポンス情報をセット
        this.setTeamData(responseTeams.data)
        // ユーザーの組織IDを取得できた場合
        if (this.team) {
          // 対象チームのユーザーリストを取得
          this.searchUserList()
          // ユーザーの勤怠・工数情報を取得
          this.search()
        } else {
          // 検索を行わないため、userをnullに設定
          this.user = null
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
    // ユーザーリスト取得を行う
    async searchUserList () {
      try {
        // ローディングを設定
        this.isLoading = true

        // チームのユーザー情報を取得
        const responseUserList = await this.$axios.get(`/users/teamOrganizationID=${this.team}`)
        this.setUserData(responseUserList.data)
        // 必須データが設定されていない場合、データを表示しない
        if (!(this.targetYearMonth && this.team && this.user)) {
          this.months = []
          this.days = []
          this.accepts = []
          this.attendances = []
          this.jobCdTrs = []
          this.jobCdTds = []
          this.wokrtimeSums = []
          this.overtimeSums = []
          this.midnightOvertimeSums = []
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
    // 検索取得を行う
    async search () {
      try {
        // ローディングを設定
        this.isLoading = true

        // クエリを作成
        const queryAttendanceDate = {}
        queryAttendanceDate.yearMonth = this.targetYearMonth
        queryAttendanceDate.companyCd = this.companyCd

        const queryAttendance = {}
        queryAttendance.yearMonth = this.targetYearMonth
        queryAttendance.userId = this.user

        const queryManHour = {}
        queryManHour.yearMonth = this.targetYearMonth
        queryManHour.userId = this.user

        // APIリクエストを並列処理して待機する
        const [responseAttendancedate, responseAttendance, responseManhour] = await Promise.all([
          // 対象年月度の日程情報
          this.$axios.get('/calendars/targetYearMonth', { params: queryAttendanceDate }),
          // ログインユーザーの勤怠情報
          this.$axios.get('/attendances/target', { params: queryAttendance }),
          // ログインユーザーの工数入力情報を取得
          this.$axios.get('/manHours/target', { params: queryManHour })
        ])
        // レスポンス情報をセット
        this.setDay(responseAttendancedate.data)
        this.setAttendance(responseAttendance.data)
        this.setManHour(responseManhour.data)
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
     * レスポンス情報をセットする
     */
    setTeamData (data) {
      this.teamItems = data.organizations
      // 初期値セット
      this.team = data.userTeamOrganizationId
    },
    setUserData (data) {
      this.userItems = data
      // 初期値セット
      this.user = (data.some(x => x.id === this.user)) ? this.user : null
    },
    setDay (data) {
      // 日数を取得
      const thisMonth = this.targetYearMonth
      const lastMonth = moment(this.targetYearMonth).subtract(1, 'months').format('YYYY/MM')
      // 前月度日数
      const cntLastMonth = data.calendarDayData.filter(function (x) { return moment(x.calendarDate).format('YYYY/MM') === lastMonth }).length
      // 今月度日数
      const cntThisMonth = data.calendarDayData.filter(function (x) { return moment(x.calendarDate).format('YYYY/MM') === thisMonth }).length
      // 月度情報の作成
      this.months = [
        {
          text: '',
          value: 'extra',
          colspan: 2,
          rowspan: 2
        },
        {
          text: lastMonth,
          value: moment(lastMonth).format('YYYY-MM'),
          colspan: cntLastMonth
        },
        {
          text: this.targetYearMonth,
          value: moment(this.targetYearMonth).format('YYYY-MM'),
          colspan: cntThisMonth
        }
      ]
      // 日情報の作成
      this.days = []
      for (const day of data.calendarDayData) {
        let dateClass = ''
        switch (day.calendarDateClass) {
          case CodeKey.LEGAL_HOLIDAY:
            dateClass = 'red lighten-4 px-0 text-center'
            break
          case CodeKey.SCHEDULED_HOLIDAY:
            dateClass = 'blue lighten-4 px-0 text-center'
            break
          default:
            dateClass = 'px-0 text-center'
        }
        const dateList = {
          text: moment(day.calendarDate).format('DD'),
          value: moment(day.calendarDate).format('YYYY-MM-DD'),
          class: dateClass
        }
        this.days.push(dateList)
      }
    },
    setAttendance (data) {
      // 検収情報の作成
      this.accepts = [{ text: this.$t('BBD0020.acceptance'), colspan: 2, isHeader: true }]
      // 勤怠区分情報の作成
      this.attendances = [{ text: this.$t('BBD0020.attendanceClass'), value: 'attendance', colspan: 2 }]
      for (const dayData of this.days) {
        // 日付が一致するデータを保持
        const matchDate = data.find(v => moment(v.date).format('YYYY-MM-DD') === dayData.value)
        const acceptList = matchDate
          ? {
            value: matchDate.isAcceptance,
            class: 'px-0',
            disabled: !this.isAcceptMode,
            attendanceId: matchDate.attendanceId,
            date: dayData.value
          } : {
            value: null,
            disabled: true,
            class: 'px-0',
            attendanceId: 0,
            date: dayData.value
          }
        this.accepts.push(acceptList)
        const attendanceList = matchDate
          ? {
            text: matchDate.attendanceClassName,
            class: matchDate.isWork ? 'px-0 text-center' : 'green--text px-0 text-center',
            date: dayData.value
          } : {
            date: dayData.value
          }
        this.attendances.push(attendanceList)
      }
      // 労働時間の合計行データ作成
      this.setWorkTime(data)
    },
    setWorkTime (data) {
      // 労働時間計情報の作成
      this.wokrtimeSums = [{ text: this.$t('BBD0020.workTimeSummary'), colspan: 2, isHeader: true, style: 'min-width: 200px' }]
      // 残業時間計情報の作成
      this.overtimeSums = [{ text: this.$t('BBD0020.overTimeSummary'), colspan: 2, isHeader: true, style: 'min-width: 200px' }]
      // 内深夜残業時間情報の作成
      this.midnightOvertimeSums = [{ text: this.$t('BBD0020.midnightOverSummary'), colspan: 2, isHeader: true, style: 'min-width: 200px' }]
      for (const dayData of this.days) {
        var matchInputDate = data.find(v => moment(v.date).format('YYYY-MM-DD') === dayData.value)
        // 労働時間合計
        const wokrtimeSum = matchInputDate ? matchInputDate.workHour : null
        const wokrtimeSumList = matchInputDate ? {
          text: matchInputDate.workHour,
          class: 'px-0 text-center',
          date: dayData.value
        } : {
          date: dayData.value
        }
        this.wokrtimeSums.push(wokrtimeSumList)
        // 残業時間合計
        const overtimeSum = matchInputDate ? matchInputDate.overWorkHour : 0
        const overtimeSumList = wokrtimeSum !== null ? {
          text: overtimeSum,
          class: 'px-0 text-center',
          date: dayData.value
        } : {
          date: dayData.value
        }
        this.overtimeSums.push(overtimeSumList)
        // 内深夜残業時間合計
        const midnightOvertimeSum = matchInputDate ? matchInputDate.midnightOverWorkHour : 0
        const midnightOvertimeSumList = wokrtimeSum !== null ? {
          text: midnightOvertimeSum,
          class: 'px-0 text-center',
          date: dayData.value
        } : {
          date: dayData.value
        }
        this.midnightOvertimeSums.push(midnightOvertimeSumList)
      }
    },
    setManHour (data) {
      // ジョブコード情報の作成
      this.jobCdTrs = []
      let jobCdTdsList = {}
      let jobCdTrsList = {}
      // ジョブコードでグループ化した連想配列
      const groubByJobCdIds = data.reduce(function (rv, x) {
        (rv[x.jobCdId] = rv[x.jobCdId] || []).push(x)
        return rv
      }, {})
      // ジョブコード毎に集計を出す
      for (var jobCdIdKey in groubByJobCdIds) {
        // 詳細コードと備考コードでグループ化した連想配列を作成
        const items = groubByJobCdIds[jobCdIdKey].reduce((results, x) => {
          var key = x.jobDetailCd + '-' + x.jobRemarksCd
          results[key] = results[key] || []
          results[key].push(x)
          return results
        }, {})

        // ジョブコードヘッダー追加フラグ
        let isJodCdHeaderFlg = true
        for (const jobRowKey in items) {
          // ジョブコード行情報の初期化
          this.jobCdTds = []
          // ジョブコードヘッダーを追加
          if (isJodCdHeaderFlg) {
            jobCdTdsList = {
              text: groubByJobCdIds[jobCdIdKey][0].jobCd + ' : ' + groubByJobCdIds[jobCdIdKey][0].jobName,
              colspan: 1,
              rowspan: Object.keys(items).length + 1,
              isHeader: true,
              style: 'min-width: 200px'
            }
            this.jobCdTds.push(jobCdTdsList)
            isJodCdHeaderFlg = false
          }
          // ジョブ詳細コード、備考コードヘッダーを追加
          jobCdTdsList = {
            text: items[jobRowKey][0].jobRemarksCd ? items[jobRowKey][0].jobDetailCd +
               ' : ' + items[jobRowKey][0].jobDetailCdName +
            '(' + items[jobRowKey][0].jobRemarksCd + ' : ' + items[jobRowKey][0].jobRemarksCdName + ')'
              : items[jobRowKey][0].jobDetailCd +
               ' : ' + items[jobRowKey][0].jobDetailCdName,
            isHeader: true,
            style: 'min-width: 200px'
          }
          this.jobCdTds.push(jobCdTdsList)
          // 日付毎
          for (const dayData of this.days) {
            const matchDateManHour = items[jobRowKey].find(v => moment(v.inputDate).format('YYYY-MM-DD') === dayData.value)
            jobCdTdsList = matchDateManHour ? {
              text: matchDateManHour.manHour,
              class: 'px-0 text-center',
              manHourId: matchDateManHour.manHourId,
              isAcceptance: matchDateManHour.isAcceptance,
              date: dayData.value
            } : {
              text: '',
              date: dayData.value
            }
            this.jobCdTds.push(jobCdTdsList)
          };
          jobCdTrsList = {
            jobCdTds: this.jobCdTds
          }
          this.jobCdTrs.push(jobCdTrsList)
        }

        // ジョブコード行情報の初期化
        this.jobCdTds = []
        // 計ヘッダーを追加
        jobCdTdsList = {
          text: this.$t('BBD0020.jobCdSummary'),
          isHeader: true,
          style: 'min-width: 200px'
        }
        this.jobCdTds.push(jobCdTdsList)
        // 日付毎にジョブコード単位の工数を合計
        for (const dayData of this.days) {
          const matchDateSum = groubByJobCdIds[jobCdIdKey].filter(v => moment(v.inputDate).format('YYYY-MM-DD') === dayData.value)
          const total = matchDateSum.reduce((sum, element) => sum + element.manHour, 0)
          jobCdTdsList = matchDateSum.length !== 0 ? {
            text: total,
            class: 'px-0 text-center',
            date: dayData.value
          } : {
            date: dayData.value
          }
          this.jobCdTds.push(jobCdTdsList)
        };
        jobCdTrsList = {
          jobCdTds: this.jobCdTds,
          class: 'amber lighten-4'
        }
        this.jobCdTrs.push(jobCdTrsList)
      }
    },
    // 一覧に表示されている検収チェックのうち編集可能なデータを一括チェック
    checkAll () {
      // 編集可能であり、チェックされていないデータ
      for (var accept of this.accepts) {
        if (accept.isHeader) {
          continue
        }
        if (!accept.disabled && !accept.value) {
          accept.value = true
        }
      }
    },

    /**
     * 保存処理を行います。
     */
    async updateIsAcceptance () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 更新処理
        // リクエスト情報を生成
        var acceptanceData = []
        for (var accept of this.accepts) {
          if (accept.isHeader || accept.disabled) {
            continue
          }
          var requestList = { id: accept.attendanceId, isAcceptance: accept.value }
          acceptanceData.push(requestList)
        }
        // リクエストを作成
        const request = {
          attendanceList: acceptanceData
        }

        await this.$axios.patch('/attendance/acceptance', request)

        // リクエスト情報を生成
        var manHourData = []
        for (var jobCdTr of this.jobCdTrs) {
          // 工数IDが存在するデータを抽出
          const manHourIds = jobCdTr.jobCdTds.filter((x) => x.manHourId)
          for (var manHourId of manHourIds) {
            // 日付が一致する検収データの勤怠IDと検収フラグを取得
            const matchDate = this.accepts.find(v => moment(v.date).format('YYYY-MM-DD') === manHourId.date)
            // 検収フラグが読取専用の場合、勤怠未登録なのでスキップ
            if (matchDate.disabled) {
              continue
            }
            var requestManHourList = { id: manHourId.manHourId, isAcceptance: matchDate.value }
            manHourData.push(requestManHourList)
          }
        }
        // リクエストを作成
        const requestManHour = {
          manHourList: manHourData
        }

        await this.$axios.patch('/manHours/acceptance', requestManHour)

        // 再検索
        this.search()

        // 完了メッセージを表示
        this.$store.dispatch('app/showSuccess', {
          message: 'messages.info.success',
          args: ['common.save']
        })
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

<style lang="scss" scoped>
.jobCdTable tbody td {
  font-size: 12px !important;
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
}

.jobCdTable {
  border-top: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
}

.jobCdTable tbody {
  tr {
    transition: initial;
    &:not(.v-data-table__selected):hover {
      box-shadow: initial;
      transform: initial;
    }
  }
}
</style>

<style scoped>
.v-input--selection-controls__input {
  margin-right: 0px !important;
  height: 30px !important;
  width: 30px !important;
}

.v-input__slot {
  margin-bottom: 0px !important;
}

.v-input--selection-controls {
  margin: 0 auto !important;
  width: 80% !important;
  height: 30px !important;
}

div .v-messages {
  display: none !important;
}

.v-data-table__wrapper {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

</style>
