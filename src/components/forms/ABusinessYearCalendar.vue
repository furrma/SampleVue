<template>
  <div>
    <v-sheet>

      <v-sheet color="grey darken-2">
        <v-treeview
          hoverable
          activatable
          dark
          color="indigo lighten-5"
          :items="yearDetailItems"
        />
      </v-sheet>

      <v-row dense justify="center">
        <!-- 4月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m04thdates"
          class="m04th"
          no-title
          :min="m04thmin"
          :max="m04thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m04thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 5月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m05thdates"
          class="m05th"
          no-title
          :min="m05thmin"
          :max="m05thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m05thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 6月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m06thdates"
          class="m06th"
          no-title
          :min="m06thmin"
          :max="m06thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <!-- <template v-slot:default> -->
            <v-sheet>
            <li v-for="(eventDetail, index) in m06thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
            </v-sheet>

          <!-- </template> -->
        </v-date-picker>

        <!-- 7月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m07thdates"
          class="m07th"
          no-title
          :min="m07thmin"
          :max="m07thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m07thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 8月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m08thdates"
          class="m08th"
          no-title
          :min="m08thmin"
          :max="m08thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m08thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 9月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m09thdates"
          class="m09th"
          no-title
          :min="m09thmin"
          :max="m09thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m09thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 10月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m10thdates"
          class="m10th"
          no-title
          :min="m10thmin"
          :max="m10thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m10thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 11月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m11thdates"
          class="m11th"
          no-title
          :min="m11thmin"
          :max="m11thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m11thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 12月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m12thdates"
          class="m12th"
          no-title
          :min="m12thmin"
          :max="m12thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m12thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 1月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m01thdates"
          class="m01th"
          no-title
          :min="m01thmin"
          :max="m01thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m01thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 2月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m02thdates"
          class="m02th"
          no-title
          :min="m02thmin"
          :max="m02thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m02thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

        <!-- 3月度 カレンダー -->
        <v-date-picker
          multiple
          readonly
          v-model="m03thdates"
          class="m03th"
          no-title
          :min="m03thmin"
          :max="m03thmax"
          next-icon
          prev-icon
          event-color='red'
          :events="eventdays"
          :show-current="false"
          :day-format="(d) => new Date(d).getDate()"
          :header-date-format="getCalendarTitle"
        >
          <v-sheet>
            <li v-for="(eventDetail, index) in m03thEvents"  :key='index'> {{ eventDetail.day }} :  {{ eventDetail.name }} </li>
          </v-sheet>
        </v-date-picker>

      </v-row>

    </v-sheet>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  components: {
  },
  props: {
    nendo: {
      type: Number,
      required: true
    },
    holidaylist: Array,
    events: {
      name: String,
      day: String
    }
  },
  data () {
    return {
      // イベント
      eventdays: [],
      // 休日格納
      holidays: [],
      // 稼働日数、年休詳細
      yearDetailItems: [],

      // 4月
      m04thmin: '',
      m04thmax: '',
      m04thdates: [],
      m04thEvents: [],
      // 5月
      m05thmin: '',
      m05thmax: '',
      m05thdates: [],
      m05thEvents: [],
      // 6月
      m06thmin: '',
      m06thmax: '',
      m06thdates: [],
      m06thEvents: [],
      // 7月
      m07thmin: '',
      m07thmax: '',
      m07thdates: [],
      m07thEvents: [],
      // 8月
      m08thmin: '',
      m08thmax: '',
      m08thdates: [],
      m08thEvents: [],
      // 9月
      m09thmin: '',
      m09thmax: '',
      m09thdates: [],
      m09thEvents: [],
      // 10月
      m10thmin: '',
      m10thmax: '',
      m10thdates: [],
      m10thEvents: [],
      // 11月
      m11thmin: '',
      m11thmax: '',
      m11thdates: [],
      m11thEvents: [],
      // 12月
      m12thmin: '',
      m12thmax: '',
      m12thdates: [],
      m12thEvents: [],
      // 1月
      m01thmin: '',
      m01thmax: '',
      m01thdates: [],
      m01thEvents: [],
      // 2月
      m02thmin: '',
      m02thmax: '',
      m02thdates: [],
      m02thEvents: [],
      // 3月
      m03thmin: '',
      m03thmax: '',
      m03thdates: [],
      m03thEvents: [],

      // 集計用
      m04thWorkDay: '',
      m05thWorkDay: '',
      m06thWorkDay: '',
      m07thWorkDay: '',
      m08thWorkDay: '',
      m09thWorkDay: '',
      m10thWorkDay: '',
      m11thWorkDay: '',
      m12thWorkDay: '',
      m01thWorkDay: '',
      m02thWorkDay: '',
      m03thWorkDay: '',
      yearsDay: '',
      yearsWorkDay: '',
      yearsHoliday: ''

    }
  },
  mounted () {

  },
  created () {
    if (this.holidaylist.length) {
      for (let i = 0; i < this.holidaylist.length; i++) {
        this.holidays.push(this.holidaylist[i])
      }

      // イベントの格納
      for (let i = 0; i < this.events.length; i++) {
        this.eventdays.push(this.events[i].day)
        var eventday = new Date(this.events[i].day)
        switch (eventday.getMonth() + 1) {
          case 4:
            this.m04thEvents.push(this.events[i])
            break
          case 5:
            this.m05thEvents.push(this.events[i])
            break
          case 6:
            this.m06thEvents.push(this.events[i])
            break
          case 7:
            this.m07thEvents.push(this.events[i])
            break
          case 8:
            this.m08thEvents.push(this.events[i])
            break
          case 9:
            this.m09thEvents.push(this.events[i])
            break
          case 10:
            this.m10thEvents.push(this.events[i])
            break
          case 11:
            this.m11thEvents.push(this.events[i])
            break
          case 12:
            this.m12thEvents.push(this.events[i])
            break
          case 1:
            this.m01thEvents.push(this.events[i])
            break
          case 2:
            this.m02thEvents.push(this.events[i])
            break
          case 3:
            this.m03thEvents.push(this.events[i])
            break
        }
      }

      // 4月
      var mindate = new Date(this.nendo, 3, 1)
      var maxdate = new Date(this.nendo, 4, 0)
      var m04thDays = maxdate.getDate()
      this.m04thmin = moment(mindate).format('YYYY-MM-DD')
      this.m04thmax = moment(maxdate).format('YYYY-MM-DD')

      // 5月
      mindate = new Date(this.nendo, 4, 1)
      maxdate = new Date(this.nendo, 5, 0)
      var m05thDays = maxdate.getDate()
      this.m05thmin = moment(mindate).format('YYYY-MM-DD')
      this.m05thmax = moment(maxdate).format('YYYY-MM-DD')

      // 6月
      mindate = new Date(this.nendo, 5, 1)
      maxdate = new Date(this.nendo, 6, 0)
      var m06thDays = maxdate.getDate()
      this.m06thmin = moment(mindate).format('YYYY-MM-DD')
      this.m06thmax = moment(maxdate).format('YYYY-MM-DD')

      // 7月
      mindate = new Date(this.nendo, 6, 1)
      maxdate = new Date(this.nendo, 7, 0)
      var m07thDays = maxdate.getDate()
      this.m07thmin = moment(mindate).format('YYYY-MM-DD')
      this.m07thmax = moment(maxdate).format('YYYY-MM-DD')

      // 8月
      mindate = new Date(this.nendo, 7, 1)
      maxdate = new Date(this.nendo, 8, 0)
      var m08thDays = maxdate.getDate()
      this.m08thmin = moment(mindate).format('YYYY-MM-DD')
      this.m08thmax = moment(maxdate).format('YYYY-MM-DD')

      // 9月
      mindate = new Date(this.nendo, 8, 1)
      maxdate = new Date(this.nendo, 9, 0)
      var m09thDays = maxdate.getDate()
      this.m09thmin = moment(mindate).format('YYYY-MM-DD')
      this.m09thmax = moment(maxdate).format('YYYY-MM-DD')

      // 10月
      mindate = new Date(this.nendo, 9, 1)
      maxdate = new Date(this.nendo, 10, 0)
      var m10thDays = maxdate.getDate()
      this.m10thmin = moment(mindate).format('YYYY-MM-DD')
      this.m10thmax = moment(maxdate).format('YYYY-MM-DD')

      // 11月
      mindate = new Date(this.nendo, 10, 1)
      maxdate = new Date(this.nendo, 11, 0)
      var m11thDays = maxdate.getDate()
      this.m11thmin = moment(mindate).format('YYYY-MM-DD')
      this.m11thmax = moment(maxdate).format('YYYY-MM-DD')

      // 12月
      mindate = new Date(this.nendo, 11, 1)
      maxdate = new Date(this.nendo + 1, 0, 0)
      var m12thDays = maxdate.getDate()
      this.m12thmin = moment(mindate).format('YYYY-MM-DD')
      this.m12thmax = moment(maxdate).format('YYYY-MM-DD')

      // 1月
      mindate = new Date(this.nendo + 1, 0, 1)
      maxdate = new Date(this.nendo + 1, 1, 0)
      var m01thDays = maxdate.getDate()
      this.m01thmin = moment(mindate).format('YYYY-MM-DD')
      this.m01thmax = moment(maxdate).format('YYYY-MM-DD')

      // 2月
      mindate = new Date(this.nendo + 1, 1, 1)
      maxdate = new Date(this.nendo + 1, 2, 0)
      var m02thDays = maxdate.getDate()
      this.m02thmin = moment(mindate).format('YYYY-MM-DD')
      this.m02thmax = moment(maxdate).format('YYYY-MM-DD')

      // 3月
      mindate = new Date(this.nendo + 1, 2, 1)
      maxdate = new Date(this.nendo + 1, 3, 0)
      var m03thDays = maxdate.getDate()
      this.m03thmin = moment(mindate).format('YYYY-MM-DD')
      this.m03thmax = moment(maxdate).format('YYYY-MM-DD')

      // 表示範囲(getTime時間)の定義
      var startRangeDateTime = (new Date(this.nendo, 3, 1, 0, 0, 0, 0)).getTime()
      var endRangeDateTime = (new Date(this.nendo + 1, 3, 0, 23, 59, 59, 999)).getTime()

      // 稼働日カウンター
      var m04thHolidayCnt = 0
      var m05thHolidayCnt = 0
      var m06thHolidayCnt = 0
      var m07thHolidayCnt = 0
      var m08thHolidayCnt = 0
      var m09thHolidayCnt = 0
      var m10thHolidayCnt = 0
      var m11thHolidayCnt = 0
      var m12thHolidayCnt = 0
      var m01thHolidayCnt = 0
      var m02thHolidayCnt = 0
      var m03thHolidayCnt = 0

      for (let i = 0; i < this.holidays.length; i++) {
        var holiday = new Date(this.holidays[i])

        // XXXX/4/1 ~ XXXX+1/3/31 までの範囲外は処理対象外
        if (!(startRangeDateTime <= holiday.getTime() && holiday.getTime() <= endRangeDateTime)) {
          continue
        }

        switch (holiday.getMonth() + 1) {
          case 4:
            this.m04thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m04thHolidayCnt++
            break
          case 5:
            this.m05thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m05thHolidayCnt++
            break
          case 6:
            this.m06thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m06thHolidayCnt++
            break
          case 7:
            this.m07thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m07thHolidayCnt++
            break
          case 8:
            this.m08thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m08thHolidayCnt++
            break
          case 9:
            this.m09thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m09thHolidayCnt++
            break
          case 10:
            this.m10thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m10thHolidayCnt++
            break
          case 11:
            this.m11thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m11thHolidayCnt++
            break
          case 12:
            this.m12thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m12thHolidayCnt++
            break
          case 1:
            this.m01thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m01thHolidayCnt++
            break
          case 2:
            this.m02thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m02thHolidayCnt++
            break
          case 3:
            this.m03thdates.push(moment(holiday).format('YYYY-MM-DD'))
            m03thHolidayCnt++
            break
        }
      }

      this.m04thWorkDay = m04thDays - m04thHolidayCnt
      this.m05thWorkDay = m05thDays - m05thHolidayCnt
      this.m06thWorkDay = m06thDays - m06thHolidayCnt
      this.m07thWorkDay = m07thDays - m07thHolidayCnt
      this.m08thWorkDay = m08thDays - m08thHolidayCnt
      this.m09thWorkDay = m09thDays - m09thHolidayCnt
      this.m10thWorkDay = m10thDays - m10thHolidayCnt
      this.m11thWorkDay = m11thDays - m11thHolidayCnt
      this.m12thWorkDay = m12thDays - m12thHolidayCnt
      this.m01thWorkDay = m01thDays - m01thHolidayCnt
      this.m02thWorkDay = m02thDays - m02thHolidayCnt
      this.m03thWorkDay = m03thDays - m03thHolidayCnt

      this.yearsDay = m04thDays +
        m05thDays +
        m06thDays +
        m07thDays +
        m08thDays +
        m09thDays +
        m10thDays +
        m11thDays +
        m12thDays +
        m01thDays +
        m02thDays +
        m03thDays

      this.yearsHoliday = m04thHolidayCnt +
        m05thHolidayCnt +
        m06thHolidayCnt +
        m07thHolidayCnt +
        m08thHolidayCnt +
        m09thHolidayCnt +
        m10thHolidayCnt +
        m11thHolidayCnt +
        m12thHolidayCnt +
        m01thHolidayCnt +
        m02thHolidayCnt +
        m03thHolidayCnt

      this.yearsWorkDay = this.yearsDay - this.yearsHoliday

      // カレンダー日数詳細データの作成
      this.yearDetailItems = [{
        id: 1,
        name: this.$t('components.aBusinessYearCalendar.calendarDetails'),
        children: [
          { id: 2, name: this.$t('components.aBusinessYearCalendar.totalWorkingDays') + this.yearsWorkDay },
          { id: 3, name: this.$t('components.aBusinessYearCalendar.totalHokidays') + this.yearsHoliday }
        ]
      }]
    }
  },
  methods: {
    // カレンダーヘッダー行
    getCalendarTitle (month) {
      var dateMonth = new Date(month)
      var formatMonth = moment(dateMonth).format('YYYY/MM')

      switch (dateMonth.getMonth() + 1) {
        case 4:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m04thWorkDay + ' ) '
          break
        case 5:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m05thWorkDay + ' ) '
          break
        case 6:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m06thWorkDay + ' ) '
          break
        case 7:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m07thWorkDay + ' ) '
          break
        case 8:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m08thWorkDay + ' ) '
          break
        case 9:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m09thWorkDay + ' ) '
          break
        case 10:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m10thWorkDay + ' ) '
          break
        case 11:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m11thWorkDay + ' ) '
          break
        case 12:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m12thWorkDay + ' ) '
          break
        case 1:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m01thWorkDay + ' ) '
          break
        case 2:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m02thWorkDay + ' ) '
          break
        case 3:
          formatMonth = formatMonth + ' ( ' + this.$t('components.aBusinessYearCalendar.workday') + this.m03thWorkDay + ' ) '
          break
      }
      return formatMonth
    }
  }
}
</script>

<style>
</style>
