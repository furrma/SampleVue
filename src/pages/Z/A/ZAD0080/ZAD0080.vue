<template>
  <div>
    <div>
      <!-- 画面タイトル -->
      <div class="display-1">{{ $t("ZAD0080.title") }}</div>
      <!-- パンくずリスト -->
      <a-breadcrumbs :items="breadcrumbs" />
    </div>
    <div>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-row dence class="pa-2 align-center">
        <v-spacer/>
        <!-- 年度 選択 -->
        <a-label-select
          vid="businessYear"
          ref="businessYear"
          v-model="businessYear"
          :items="businessYearItems"
          rules="required"
          item-text="businessYear"
          item-value="calendarId"
          :label="$t('ZAD0080.businessYear')"
          dense
        />
        <v-spacer/>
        <!-- 会社 選択 -->
        <a-label-select
          vid="company"
          ref="company"
          v-model="company"
          :items="companyItems"
          rules="required"
          item-text="companyName"
          item-value="companyCd"
          :label="$t('ZAD0080.company')"
          dense
        />
        <v-spacer/>
        <!-- カレンダー名表示 -->
        <div> {{calendarName}} </div>
        <v-spacer/>
        <!-- 勤務時間登録ボタン -->
        <v-btn class="ma-1" color="primary" :disabled="invalid" @click="openWorkTime">
          {{ $t("ZAD0080.workingTimeReg") }}
        </v-btn>
        <!-- 編集ボタン -->
        <v-btn class="ma-1" color="primary" :disabled="invalid" @click="openEdit">
          {{ $t("common.edit") }}
        </v-btn>
        <v-spacer></v-spacer>
        </v-row>
      </validation-observer>
    </div>
    <div>
      <!-- 年度カレンダー -->
      <a-business-year-calendar
        :key="redisplay"
        :nendo="nendo"
        :holidaylist="holidays"
        :events="yearsEvent"
      >
      </a-business-year-calendar>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ABusinessYearCalendar from '../../../../components/forms/ABusinessYearCalendar.vue'
import moment from 'moment'

export default {
  components: {
    ABusinessYearCalendar
  },
  head: {
    title () {
      return {
        complement: this.$t('ZAD0080.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      calendarName: '',
      thisBusinessYear: null,
      nendo: null,
      businessYear: null,
      businessYearItems: [],
      company: '',
      companyItems: [],
      holidays: [],
      yearsEvent: [],
      redisplay: 0 // スイッチ切り替え時の再描画処理のため。
    }
  },
  computed: {
    ...mapState({
      companyCd: state => state.auth.user.companyCd
    }),
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0080.title'),
          to: { name: 'ZAD0080' }
        }
      ]
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.searchCompanyData()
      this.searchCalendar()
      this.search()
    },
    company () {
      this.searchCalendar()
      this.search()
    },
    businessYear () {
      this.searchCalendarSelectYear()
      this.search()
    }
  },
  mounted () {
    // ログインユーザーの会社コード
    this.company = this.companyCd
    // 初回検索
    this.searchCompanyData()
    this.searchCalendar()
    this.search()
  },
  created () {
    // 現在の日付から年度を取得
    var date = new Date()
    date.setMonth(date.getMonth() - 3)
    this.thisBusinessYear = date.getFullYear()
    this.nendo = this.thisBusinessYear
  },
  methods: {
    // 検索取得を行う
    async searchCompanyData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 会社データ一覧を取得
        // データ取得
        const responseCompany = await this.$axios.get('/companies', {
          // クエリパラメータ
          params: { isActive: true }
        })
        this.companyItems = responseCompany.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // 再描画
        this.redisplay = this.redisplay ? 0 : 1
        // ローディングを解除
        this.isLoading = false
      }
    },
    // 検索取得を行う
    async searchCalendar () {
      try {
        // ローディングを設定
        this.isLoading = true

        // カレンダーデータを取得
        // データ取得
        const responseCalendar = await this.$axios.get('/calendars/years', {
          // クエリパラメータ
          params: { companyCd: this.company }
        })
        this.setCalendarData(responseCalendar.data)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // 再描画
        this.redisplay = this.redisplay ? 0 : 1
        // ローディングを解除
        this.isLoading = false
      }
    },
    // 検索取得を行う
    async searchCalendarSelectYear () {
      try {
        // ローディングを設定
        this.isLoading = true

        // カレンダーデータを取得
        // データ取得
        const responseCalendar = await this.$axios.get('/calendars/years', {
          // クエリパラメータ
          params: { companyCd: this.company }
        })
        this.setCalendarDataSelectYear(responseCalendar.data)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // 再描画
        this.redisplay = this.redisplay ? 0 : 1
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
        const queryCalendarId = {}
        queryCalendarId.calendarId = this.businessYear

        // 休日データを取得
        // データ取得
        const responseHolidays = await this.$axios.get('/calendars/holidays', {
          params: queryCalendarId
        })
        this.holidays = responseHolidays.data.holidays

        // イベントデータを取得
        // データ取得
        const responseEvents = await this.$axios.get('/calendars/events', {
          params: queryCalendarId
        })
        this.setEventData(responseEvents.data)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // 再描画
        this.redisplay = this.redisplay ? 0 : 1
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * レスポンス情報をセットする
     */
    setCalendarData (data) {
      this.calendarName = ''
      this.businessYearItems = data
      let isExist = false
      for (var calendarData of data) {
        if (calendarData.businessYear === this.nendo) {
          this.businessYear = calendarData.calendarId
          this.calendarName = calendarData.calendarName
          isExist = true
        }
      };
      if (!isExist) {
        this.businessYear = null
      }
    },
    setCalendarDataSelectYear (data) {
      this.calendarName = ''
      this.businessYearItems = data
      let isExist = false
      for (var calendarData of data) {
        if (calendarData.calendarId === this.businessYear) {
          this.calendarName = calendarData.calendarName
          this.nendo = calendarData.businessYear
          isExist = true
        }
      };
      if (!isExist) {
        this.businessYear = null
      }
    },
    setEventData (data) {
      this.yearsEvent = []
      for (var eventData of data) {
        var eventJson = { name: eventData.eventName, day: moment(eventData.calendarDate).format('YYYY-MM-DD') }
        this.yearsEvent.push(eventJson)
      };
    },

    // 編集画面に遷移する
    openEdit () {
      this.$router.push({ name: 'ZAD0080-detail', params: { calendarId: this.businessYear } })
    },

    // 勤務時間登録画面に遷移する
    openWorkTime () {
      this.$router.push({ name: 'ZAD0080-work-time', params: { calendarId: this.businessYear } })
    }
  }
}
</script>

<style>
</style>
