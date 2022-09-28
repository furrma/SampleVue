<template>
  <div class="d-flex flex-column flex-grow-1">
    <div>
      <!-- 画面タイトル -->
      <div class="display-1 pb-2">{{ $t("BBD0010.title") }}</div>
    </div>

    <v-card>
      <v-row dense class="pa-2">
        <v-col cols="12" md="4">
          <v-row dense>
            <v-col cols="12" md="6">
              <!-- 対象年月リスト -->
              <v-select
                v-model="targetYearMonth"
                :items="yearMonthList"
                item-text="text"
                item-value="value"
                label="対象年月"
                menu-props="auto"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="8">
              <v-card>
                <!-- 対象日付ピッカー -->
                <v-date-picker
                  v-model="targetDate"
                  locale="ja"
                  :min="minDate"
                  :max="maxDate"
                  :events="getDatepickerEvents"
                  :show-current="false"
                  :no-title="true"
                  :day-format="(d) => new Date(d).getDate()"
                  full-width
                />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <!-- 各チップス -->
              <v-chip class="mt-2" color="green" text-color="white">
                勤怠入力済
              </v-chip>
              <v-chip class="mt-2" color="blue" text-color="white">
                工数入力済
              </v-chip>
              <v-chip class="mt-2" color="grey" text-color="white">
                勤怠未入力
              </v-chip>
              <v-chip class="mt-2" color="orange" text-color="white">
                工数未入力
              </v-chip>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <!-- 月度情報 -->
              <span class="text-h5 font-weight-black">月度情報</span>
            </v-col>
            <v-col cols="12" md="6">
              <!-- 月度一覧表示ボタン -->
              <v-btn color="primary" @click="openList">一覧</v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-expansion-panels multiple>
                <v-expansion-panel>
                  <!-- 勤怠サマリ -->
                  <v-expansion-panel-header> 勤怠 </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-simple-table>
                      <template>
                        <thead>
                          <tr>
                            <th class="text-left">区分</th>
                            <th class="text-left">日数</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in getAttendanceSummary()" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td>{{ item.count }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <!-- 工数サマリ -->
                  <v-expansion-panel-header> 工数 </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-simple-table>
                      <template>
                        <thead>
                          <tr>
                            <th class="text-left">区分</th>
                            <th class="text-left">時間</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in getEffortSummary()" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td>{{ item.count }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="8">
          <v-row dense>
            <v-col cols="12" md="6">
              <!-- 検収チップス -->
              <v-chip label class="mr-2">
                {{ this.targetDate }}
              </v-chip>
              <span v-if="this.targetAttendance.isAcceptance">
                <v-chip color="green" text-color="white">
                  検収済
                </v-chip>
              </span>
              <span v-else>
                <v-chip color="grey" text-color="white">
                  未検収
                </v-chip>
              </span>
            </v-col>
            <v-col align="right">
              <v-btn icon outlined>
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="2">
              <!-- 勤怠区分リスト -->
              <v-select
                v-model="targetAttendance.attendanceClass"
                :items="attendanceClasses"
                :disabled="isAttendanceClassReadonly"
                item-text="attendanceClassName"
                item-value="attendanceClass"
                label="勤怠区分*"
                menu-props="auto"
                hide-details
                @change="changeAttendance"
              />
            </v-col>
            <v-col cols="12" md="2">
              <!-- 開始時刻リスト -->
              <v-select
                v-model="targetAttendance.dayStartTime"
                label="開始時刻"
                menu-props="auto"
                hide-details
                :items="timeItems"
                :disabled="isStartTimeListReadonly"
              />
            </v-col>
            <v-col cols="12" md="2">
              <!-- 終了時刻リスト -->
              <v-select
                v-model="targetAttendance.dayEndTime"
                label="終了時刻"
                menu-props="auto"
                hide-details
                :items="timeItems"
                :disabled="isEndTimeListReadonly"
              />
            </v-col>
            <v-col cols="12" md="2">
              <!-- 深夜残業スイッチ -->
              <v-switch
                v-model="targetAttendance.isMidnightOvertime"
                inset
                hint="深夜残業"
                persistent-hint
                :disabled="isMidnightOvertimeReadonly"
              ></v-switch>
            </v-col>
            <v-col align="right" cols="12" md="4">
              <!-- 振休予定入力フォームボタン -->
              <v-btn
                class="ma-2"
                color="primary"
                :disabled="isTransferWorkInputReadonly"
                @click="showTransferVacationSheduleDialog"
              >
                振休予定入力
              </v-btn>
              <v-dialog
                v-model="transferVacationSheduleDialog"
                persistent
                max-width="360px"
              >
                <!-- 振休予定入力フォーム -->
                <v-card>
                  <v-card-title>
                    <span class="text-h5">振休予定日入力</span>
                  </v-card-title>
                  <v-card-text>
                    <v-card>
                      <!-- 振休予定日ピッカー -->
                      <v-date-picker
                        v-model="targetAttendance.transferVacationScheduleDate"
                        :no-title="true"
                        locale="ja"
                        :min="transferVacationMinDate"
                        :max="transferVacationMaxDate"
                        :allowed-dates="getTransferVacationAllowedDates"
                        :show-current="false"
                        full-width
                      />
                    </v-card>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- キャンセルボタン -->
                    <v-btn
                      color="primary"
                      @click="closeTransferVacationSheduleDialog(true)"
                    >
                      キャンセル
                    </v-btn>
                    <!-- OKボタン -->
                    <v-btn
                      color="primary"
                      @click="closeTransferVacationSheduleDialog()"
                    >
                      OK
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- 勤怠工数入力保存ボタン -->
              <v-btn
                color="primary"
                :disabled="targetAttendance.isAcceptance"
                @click="save"
              >
                保存
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="12">
              <!-- 工数入力インプットカレンダー -->
              <v-calendar
                ref="calendar"
                class="ma-2"
                v-model="targetDate"
                locale="ja"
                event-overlap-mode="column"
                interval-height="20"
                aria-readonly="true"
                :type="calendarType"
                :events="events"
                :interval-count="intervalCount"
                :interval-format="intervalFormat"
                :interval-minutes="workIntervalMinutes"
                :first-time="targetAttendance.dayStartTime"
                :weekdays="weekdays"
                @dblclick.native="dblclickEvent"
                @mouseenter:event="mouseenterEvent"
                @mouseleave:event="mouseleaveEvent"
                @mousedown:event="startDrag"
                @mouseup:event="endDrag"
                @mousedown:time="startTime"
                @mousemove:time="mouseMove"
                @mouseleave.native="cancelDrag"
              >
                <!-- イベント -->
                <template #event="{ event }">
                  <div class="v-event-draggable">
                    <div v-if="event.isWork">
                      <div v-if="event.jobCd.jobCd !== ''">
                        <strong>
                          {{ event.jobCd.jobCd }}:{{ event.jobCd.jobName }}
                        </strong>
                        {{ event.jobDetailCd.jobDetailCd }}:{{
                        event.jobDetailCd.jobDetailCdName
                      }}
                        <span v-if="event.jobRemarksCd.jobRemarksCd != ''">
                          ({{ event.jobRemarksCd.jobRemarksCd }}:{{ event.jobRemarksCd.jobRemarksCdName }})
                        </span>
                      </div>
                      {{ getTimeFormat(event.start) }} - {{ getTimeFormat(event.end) }}
                      <div
                        v-if="event.timed"
                        class="v-event-drag-bottom"
                        @mousedown.stop="extendBottom(event)"
                      ></div>
                    </div>
                    <div v-else>
                      <div>
                        <strong>
                          {{ event.jobCd.jobName }}
                        </strong>
                      </div>
                      {{ getTimeFormat(event.start) }} - {{ getTimeFormat(event.end) }}
                    </div>
                  </div>
                </template>
              </v-calendar>

              <v-dialog
                v-model="selectedEventOpen"
                persistent
                max-width="600px"
              >
                <v-card>
                  <validation-observer ref="observer" v-slot="{ invalid }">
                    <form @submit.prevent="saveEvent">
                      <v-card-title>
                        <span class="text-h5">ジョブコード入力</span>
                        <v-spacer></v-spacer>
                        <div v-if="!isCalendarReadOnly">
                          <v-btn
                            icon
                            @click="removeEvent"
                          >
                            <v-icon>mdi-trash-can-outline</v-icon>
                          </v-btn>
                        </div>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row dense>
                            <v-col>
                              <v-autocomplete
                                v-model="selectedEvent.jobCd"
                                label="ジョブコード"
                                item-value="jobCd"
                                required
                                return-object
                                :items="jobCds"
                                :item-text="(item) => item.jobCd + ':' + item.jobName"
                                :disabled="isCalendarReadOnly"
                                @change="(val) => this.setJobRemarksCds(val)"
                              ></v-autocomplete>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" md="4">
                              <v-select
                                v-model="selectedEvent.jobDetailCd"
                                label="ジョブ詳細コード"
                                item-value="jobDetailCd"
                                menu-props="auto"
                                required
                                return-object
                                :items="jobDetailCds"
                                :item-text="(item) => item.jobDetailCd + ':' + item.jobDetailCdName"
                                :disabled="isCalendarReadOnly"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" md="8" class="pr-0">
                              <v-select
                                v-model="selectedEvent.jobRemarksCd"
                                label="ジョブ備考コード"
                                item-value="jobRemarksCd"
                                menu-props="auto"
                                return-object
                                clearable
                                :items="jobRemarksCds"
                                :item-text="(item) => item.jobRemarksCd + ':' + item.jobRemarksCdName"
                                :disabled="isCalendarReadOnly"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" md="2">
                              <v-text-field
                                label="開始時刻"
                                :value="getTimeFormat(selectedEvent.start)"
                                disabled
                              />
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                label="終了時刻"
                                :value="getTimeFormat(selectedEvent.end)"
                                disabled
                              />
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                label="総工数"
                                :value="(selectedEvent.end - selectedEvent.start) / (60 * 60 * 1000)"
                                disabled
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </form>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="primary" @click="closeEvent">
                        キャンセル
                      </v-btn>
                      <v-btn color="primary" @click="saveEvent" :disabled="invalid">
                        OK
                      </v-btn>
                    </v-card-actions>
                  </validation-observer>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <!-- development 直ぐ消します -->
    <v-snackbar v-model="snackbar" timeout="-1" right>
      <div>規定労働時間：{{ devDefaultWorkTime }} h</div>
      <div>労働時間：{{ devWorkTime }} h</div>
      <div>時間外労働時間：{{ devOvertime }} h</div>
      <div>割増無時間外労働時間：{{ devNoPremiumOvertime }} h</div>
      <div>内深夜労働時間：{{ devMidnightOvertime }} h</div>
      <div>法定休日労働時間：{{ devLegalHoridayWork }} h</div>
      <div>所定休日労働時間：{{ devScheduledHoridayWork }} h</div>
    </v-snackbar>
  </div>
</template>

<script>
import workInputDataJson from './workInputData.json'
import masterDataJson from './masterData.json'
import jobCdDataJson from './jobCdData.json'

export default {
  head: {
    title () {
      return {
        complement: this.$t('BBD0010.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // consts
      // constTodayElement: new Date(),
      constTodayElement: new Date(2021, 8, 8),

      // masters
      calendarDates: [],
      attendanceClasses: [],
      jobDetailCds: [],
      workIntervalMinutes: 30,
      defaultTime: {},
      breakTime: {},
      midnightOvertime: {},

      // jobCds
      jobCds: [],

      // transactions
      attendances: [],
      manHours: [],

      // target
      targetYearMonth: '',
      targetDate: '',
      targetAttendance: {},
      targetEfforts: [],

      // lists
      yearMonthList: [],
      timeItems: [],

      // displayValiables
      transferVacationSheduleDialog: false,
      beforeTransferVacationScheduleDate: '',

      // callendar
      events: [],
      selectedEvent: {},
      selectedOriginEvent: {},
      mouseenteredEvent: null,
      selectedEventOpen: false,
      dragEvent: null,
      dragTime: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
      calendarType: 'day',
      weekdays: [],

      // development
      snackbar: true,
      devDefaultWorkTime: 0.0,
      devWorkTime: 0.0,
      devOvertime: 0.0,
      devNoPremiumOvertime: 0.0,
      devMidnightOvertime: 0.0,
      devLegalHoridayWork: 0.0,
      devScheduledHoridayWork: 0.0
    }
  },
  created () {
  },
  mounted () {
    // WebAPIからデータを取得する。
    this.requestMasterData()

    // masters
    this.calendarDates = masterDataJson.calendarDates
    this.attendanceClasses = masterDataJson.attendanceClasses
    this.jobDetailCds = masterDataJson.jobDetailCds
    this.defaultTime = masterDataJson.defaultTime
    this.breakTime = masterDataJson.breakTime
    this.midnightOvertime = masterDataJson.midnightOvertime

    // jobCds
    this.jobCds = jobCdDataJson.jobCds
    // transactions
    this.attendances = workInputDataJson.attendances
    this.manHours = workInputDataJson.manHours

    // カレンダー情報
    this.yearMonthList = [
      {
        text: this.getYearMonth(this.constTodayElement) + ' 月度',
        value: this.getYearMonth(this.constTodayElement)
      },
      {
        text: this.getYearMonth(this.constTodayElement, -1) + ' 月度',
        value: this.getYearMonth(this.constTodayElement, -1)
      },
      {
        text: this.getYearMonth(this.constTodayElement, -2) + ' 月度',
        value: this.getYearMonth(this.constTodayElement, -2)
      }
    ]

    this.targetYearMonth = this.getYearMonth(this.constTodayElement)
    this.targetDate = this.getDateFormat(this.constTodayElement)
  },
  computed: {
    minDate () {
      const year = this.targetYearMonth.split('/')[0]
      const month = this.targetYearMonth.split('/')[1]
      const date = new Date(year, month - 1, 21)
      if (date.getMonth() === 0) {
        date.setFullYear(date.getFullYear() - 1)
        date.setMonth(11)
      } else {
        date.setMonth(date.getMonth() - 1)
      }
      return this.getDateFormat(date)
    },
    maxDate () {
      const year = this.targetYearMonth.split('/')[0]
      const month = this.targetYearMonth.split('/')[1]
      const date = new Date(year, month - 1, 20)
      return this.getDateFormat(date)
    },
    transferVacationMinDate () {
      const date = new Date(this.targetDate)
      date.setDate(date.getDate() + 1)
      return this.getDateFormat(date)
    },
    transferVacationMaxDate () {
      const date = new Date(this.maxDate)
      date.setMonth(date.getMonth() === 11 ? 0 : date.getMonth() + 1)
      return this.getDateFormat(date)
    },
    eventMinTime () {
      return this.targetAttendance.isMidnightOvertime
        ? new Date(this.targetDate + ' ' + this.midnightOvertime.endTime).getTime()
        : new Date(this.targetDate + ' ' + this.targetAttendance.dayStartTime).getTime()
    },
    eventMaxTime () {
      const tmpDateElement = new Date(this.targetDate + ' ' + this.midnightOvertime.endTime)
      tmpDateElement.setDate(tmpDateElement.getDate() + 1)
      return this.targetAttendance.isMidnightOvertime
        ? tmpDateElement.getTime()
        : new Date(this.targetDate + ' ' + this.targetAttendance.dayEndTime).getTime()
    },
    intervalCount () {
      return (new Date('1900/1/1 ' + this.targetAttendance.dayEndTime) -
              new Date('1900/1/1 ' + this.targetAttendance.dayStartTime)) /
             (this.workIntervalMinutes * 60 * 1000)
    },
    selectedAttendanceClass () {
      return this.attendanceClasses.find(v => v.attendanceClass === this.targetAttendance.attendanceClass)
    },
    jobRemarksCds () {
      return this.jobCds.find(v => v.jobCd === this.selectedEvent.jobCd.jobCd).jobRemarksCds
    },
    isAttendanceClassReadonly () {
      return this.targetAttendance.isAcceptance
    },
    isStartTimeListReadonly () {
      return this.targetAttendance.isAcceptance ||
              this.targetAttendance.isMidnightOvertime ||
              !this.selectedAttendanceClass.isWork ||
              !this.selectedAttendanceClass.isTransfer ||
              !this.selectedAttendanceClass.isPartialVacation ||
              this.selectedAttendanceClass.reflectTimeStart === this.defaultTime.startTime
    },
    isEndTimeListReadonly () {
      return this.targetAttendance.isAcceptance ||
              this.targetAttendance.isMidnightOvertime ||
              !this.selectedAttendanceClass.isWork ||
              !this.selectedAttendanceClass.isTransfer ||
              !this.selectedAttendanceClass.isPartialVacation ||
              this.selectedAttendanceClass.reflectTimeEnd === this.defaultTime.endTime
    },
    isMidnightOvertimeReadonly () {
      return this.targetAttendance.isAcceptance ||
              !this.selectedAttendanceClass.isWork ||
              !this.selectedAttendanceClass.isTransfer ||
              !this.selectedAttendanceClass.isPartialVacation ||
              this.selectedAttendanceClass.reflectTimeEnd === this.defaultTime.endTime
    },
    isCalendarReadOnly () {
      return this.targetAttendance.isAcceptance ||
              !this.selectedAttendanceClass.isWork ||
              !this.selectedAttendanceClass.isTransfer ||
              !this.selectedAttendanceClass.isPartialVacation
    },
    isTransferWorkInputReadonly () {
      return !this.selectedAttendanceClass.isTransfer
    },
    isTransferVacationDay () {
      return this.attendances.find(v => v.transferVacationScheduleDate === this.targetDate)
    }
  },

  watch: {
    targetYearMonth (val) {
      val === this.getYearMonth(this.constTodayElement)
        ? this.targetDate = this.getDateFormat(this.constTodayElement)
        : this.targetDate = this.minDate
    },
    targetDate (val) {
      if (this.attendances.some(v => v.date === val)) {
        this.targetAttendance = { ...this.attendances.find(v => v.date === val) }
      } else {
        // データがない場合
        this.targetAttendance = {
          id: null,
          date: val,
          attendanceClass: 'WORK',
          callendarDateClass: this.calendarDates.find(v => v.date === val),
          dayStartTime: this.defaultTime.startTime,
          dayEndTime: this.defaultTime.endTime,
          transferVacationScheduleDate: '',
          isAcceptance: false,
          isMidnightOvertime: false
        }
      }
      this.targetEfforts = { ...this.manHours.filter(v => v.date === val) }

      // 表示イベントの初期化
      this.events = []
      // 休憩時間を設定する
      this.events.push({
        color: 'grey',
        start: new Date(val + ' ' + this.breakTime.startTime).getTime(),
        end: new Date(val + ' ' + this.breakTime.endTime).getTime(),
        timed: true,
        id: -1,
        date: val,
        jobCd: {
          jobCd: 'BREAK_TIME',
          jobName: '休憩時間'
        },
        jobDetailCd: {},
        jobRemarksCd: {},
        startTime: val + ' ' + this.breakTime.startTime,
        endTime: val + ' ' + this.breakTime.endTime,
        manHours: (new Date(val + ' ' + this.breakTime.endTime).getTime() -
                  new Date(val + ' ' + this.breakTime.startTime).getTime()) / (60 * 60 * 1000),
        isWork: false,
        isAvailable: false,
        isBreakTime: true
      })
      for (const manHourKey in this.targetEfforts) {
        this.events.push({
          color: this.targetEfforts[manHourKey].isWork ? 'blue' : 'grey',
          start: new Date(this.targetEfforts[manHourKey].startTime).getTime(),
          end: new Date(this.targetEfforts[manHourKey].endTime).getTime(),
          timed: true,
          id: this.targetEfforts[manHourKey].id,
          date: this.targetEfforts[manHourKey].date,
          jobCd: {
            jobCd: this.targetEfforts[manHourKey].jobCd,
            jobName: this.targetEfforts[manHourKey].jobName
          },
          jobDetailCd: {
            jobDetailCd: this.targetEfforts[manHourKey].jobDetailCd,
            jobDetailCdName: this.targetEfforts[manHourKey].jobDetailCdName
          },
          jobRemarksCd: {
            jobRemarksCd: this.targetEfforts[manHourKey].jobRemarksCd,
            jobRemarksCdName: this.targetEfforts[manHourKey].jobRemarksCdName
          },
          startTime: this.targetEfforts[manHourKey].startTime,
          endTime: this.targetEfforts[manHourKey].endTime,
          manHours: this.targetEfforts[manHourKey].manHours,
          isWork: this.targetEfforts[manHourKey].isWork,
          isAvailable: this.targetEfforts[manHourKey].isAvailable,
          isBreakTime: false
        })
      }
    },
    'targetAttendance.isMidnightOvertime' () {
      if (this.targetAttendance.isMidnightOvertime) {
        const dayNumber = new Date(this.targetDate + ' ' + this.midnightOvertime.endTime).getDay()
        const nextDayNumber = dayNumber === 6 ? 0 : dayNumber + 1
        this.targetAttendance.dayStartTime = '0:00'
        this.targetAttendance.dayEndTime = '24:00'
        this.calendarType = 'week'
        this.weekdays = [dayNumber, nextDayNumber]
      } else {
        if (this.selectedAttendanceClass.reflectTimeStart === this.defaultTime.startTime) {
          this.targetAttendance.dayStartTime = this.defaultTime.startTime
        }
        if (this.targetAttendance.dayStartTime === '0:00') {
          this.targetAttendance.dayStartTime = this.midnightOvertime.endTime
        }
        if (this.targetAttendance.dayEndTime === '24:00') {
          this.targetAttendance.dayEndTime = this.midnightOvertime.startTime
        }
        this.calendarType = 'day'
        this.weekdays = []
      }
    },
    events () {
      this.calculateOvertime()
    }
  },

  methods: {
    async requestMasterData () {
      try {
        this.isLoading = true

        // データ取得
        const response = await this.$axios.get('/syssettings/WORK_INTERVAL_MINUTES')

        // データをセット
        this.workIntervalMinutes = response.data.value
      } catch (error) {
        // エラーメッセージを表示する。
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        this.isLoading = false
        // 時刻情報
        this.timeItems = this.getTimeitems()
      }
    },

    // date:日付エレメント
    // calcNum:±する数値
    // return:リストに使用する年月キー
    getYearMonth (date, calcNum = 0) {
      const year = date.getFullYear()
      let month = date.getMonth() + 1 + calcNum
      if (date.getDate() > 20) {
        month += 1
      }
      return year + '/' + month
    },

    // date:日付エレメント
    // return:日付からフォーマットされた年月日
    getDateFormat (date) {
      const year = date.getFullYear()
      const month = ('00' + (date.getMonth() + 1)).slice(-2)
      const day = ('00' + date.getDate()).slice(-2)
      return year + '-' + month + '-' + day
    },

    // return:時刻リスト
    getTimeitems () {
      const timeList = []
      const targetTimeElement = new Date('1900/1/1 ' + this.midnightOvertime.endTime)
      const dayEndTimeElement = new Date('1900/1/1 ' + this.midnightOvertime.startTime)

      while (targetTimeElement.getTime() <= dayEndTimeElement.getTime()) {
        timeList.push(targetTimeElement.getHours() + ':' + ('00' + targetTimeElement.getMinutes()).slice(-2))
        targetTimeElement.setMinutes(targetTimeElement.getMinutes() + this.workIntervalMinutes)
      }

      return timeList
    },

    // 工数入力コントロールの時間軸文字列
    intervalFormat (locale) {
      return (
        Number(locale.time.split(':')[0]).toString() + ':' + locale.time.split(':')[1]
      )
    },

    // dateStr:日付文字列
    // return:イベントカラーリスト
    getDatepickerEvents (dateStr) {
      let isWorkingDay = false
      let isAttendanceEnterd = false
      let isEffortsEnterd = false
      const eventColors = []

      if (dateStr < this.minDate || dateStr > this.maxDate) return

      // 出勤日かどうか
      isWorkingDay = this.calendarDates.some(v => v.date === dateStr && v.callendarDateClass === 'WorkingDay')
      // 勤怠入力済みかどうか
      isAttendanceEnterd = this.attendances.some(v => v.date === dateStr)
      // 工数入力済みかどうか
      isEffortsEnterd = this.manHours.some(v => v.date === dateStr)

      if (isAttendanceEnterd) {
        // 勤怠入力済
        eventColors.push('green')
      } else if (isWorkingDay && !isAttendanceEnterd) {
        // 勤怠未入力
        eventColors.push('grey')
      }

      if (isEffortsEnterd) {
        // 工数入力済
        eventColors.push('blue')
      } else if (isWorkingDay && isAttendanceEnterd && !isEffortsEnterd) {
        // 工数未入力
        eventColors.push('orange')
      }

      return eventColors
    },

    // return:月度勤怠サマリーリスト
    getAttendanceSummary () {
      const attendanceSummaryList = []
      const regularWorkingDaysCount = this.calendarDates.filter(
        v => v.date >= this.minDate && v.date <= this.maxDate && v.callendarDateClass === 'WorkingDay'
      ).length

      attendanceSummaryList.push({
        class: 'regularWorkingDay',
        name: '規定労働日数',
        count: regularWorkingDaysCount
      })

      for (const attendanceClassKey in this.attendanceClasses) {
        attendanceSummaryList.push({
          class: this.attendanceClasses[attendanceClassKey].attendanceClass,
          name: this.attendanceClasses[attendanceClassKey].attendanceClassName,
          count: this.attendances.filter(
            v => v.date >= this.minDate && v.date <= this.maxDate && v.attendanceClass === this.attendanceClasses[attendanceClassKey].attendanceClass
          ).length
        })
      }

      return attendanceSummaryList
    },

    // return:月度工数サマリーリスト
    getEffortSummary () {},

    // 振休可能日取得取得
    getTransferVacationAllowedDates (date) {
      return this.calendarDates.some(v => v.date === date && v.callendarDateClass === 'WorkingDay')
    },

    // 振替予定日ダイアログを開いた時の処理
    showTransferVacationSheduleDialog () {
      // ダイアログの表示設定
      this.transferVacationSheduleDialog = true
      // キャンセル用一時データ
      this.beforeTransferVacationScheduleDate = this.targetAttendance.transferVacationScheduleDate
    },

    // 振替予定日ダイアログを閉じた時の処理
    closeTransferVacationSheduleDialog (isCancel = false) {
      // キャンセルの場合、データを元の状態に戻す
      if (isCancel) {
        this.targetAttendance.transferVacationScheduleDate = this.beforeTransferVacationScheduleDate
      }

      // 初期化
      this.transferVacationSheduleDialog = false
      this.transferVacationMinDate = ''
      this.transferVacationMaxDate = ''
      this.beforeTransferVacationScheduleDate = ''
    },

    // 勤怠・工数保存処理
    save () {
      this.attendances = this.attendances.filter(v => v.date !== this.targetDate)
      this.attendances.push(this.targetAttendance)
      this.manHours = this.manHours.filter(v => v.date !== this.targetDate)
      for (const eventKey in this.events) {
        if (this.events[eventKey].isBreakTime) {
          continue
        }
        this.manHours.push(
          {
            id: this.events[eventKey].id,
            date: this.events[eventKey].date,
            jobCd: this.events[eventKey].jobCd.jobCd,
            jobName: this.events[eventKey].jobCd.jobName,
            jobDetailCd: this.events[eventKey].jobDetailCd.jobDetailCd,
            jobDetailCdName: this.events[eventKey].jobDetailCd.jobDetailCdName,
            jobRemarksCd: this.events[eventKey].jobRemarksCd.jobRemarksCd,
            jobRemarksCdName: this.events[eventKey].jobRemarksCd.jobRemarksCdName,
            startTime: this.getDateTimeFormat(this.events[eventKey].start),
            endTime: this.getDateTimeFormat(this.events[eventKey].end),
            manHours: (this.events[eventKey].end - this.events[eventKey].start) / (60 * 60 * 1000),
            isWork: this.events[eventKey].isWork,
            isAvailable: this.events[eventKey].isAvailable
          }
        )
      }
    },

    // イベントを表示
    showEvent (event) {
      this.selectedOriginEvent = event
      this.selectedEvent = { ...event }
      this.selectedEventOpen = true
    },
    // イベントを閉じる
    closeEvent () {
      this.selectedOriginEvent = {}
      this.selectedEvent = {}
      this.selectedEventOpen = false
    },
    // イベントを保存
    saveEvent () {
      Object.assign(this.selectedOriginEvent, this.selectedEvent)
      this.closeEvent()
    },
    // イベントを削除
    removeEvent () {
      this.events = this.events.filter((event) => { return event.start !== this.selectedEvent.start })
      this.closeEvent()
    },

    // カレンダーマウスイベント
    dblclickEvent () {
      if (this.mouseenteredEvent && this.mouseenteredEvent.isAvailable) {
        this.showEvent(this.mouseenteredEvent)
      }
    },
    mouseenterEvent ({ event }) {
      this.mouseenteredEvent = event
    },
    mouseleaveEvent () {
      this.mouseenteredEvent = null
    },

    startDrag ({ event, timed }) {
      if (this.isCalendarReadOnly || !event.isAvailable) {
        return
      }

      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
    startTime (tms) {
      if (this.isCalendarReadOnly) {
        return
      }

      const mouse = new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start
        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)

        // 日の開始時刻~終了時刻出ない場合イベントを作らない
        if (this.createStart < this.eventMinTime || this.createStart >= this.eventMaxTime) {
          return
        }

        // 他のイベントと重なる場合は作らない
        for (const eventKey in this.events) {
          if (this.createStart >= this.events[eventKey].start && this.createStart < this.events[eventKey].end) {
            return
          }
        }

        this.createEvent = {
          color: 'blue',
          start: this.createStart,
          end: this.createStart + this.workIntervalMinutes * 60 * 1000,
          timed: true,

          id: -1,
          date: this.targetDate,
          jobCd: {
            jobCd: '',
            jobName: ''
          },
          jobDetailCd: {
            jobDetailCd: '',
            jobDetailCdName: ''
          },
          jobRemarksCd: {
            jobRemarksCd: '',
            jobRemarksCdName: ''
          },
          startTime: '',
          endTime: '',
          manHours: '',
          isWork: true,
          isAvailable: true,
          isBreakTime: false
        }
        this.events.push(this.createEvent)
      }
    },
    extendBottom (event) {
      if (this.isCalendarReadOnly) {
        return
      }

      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    mouseMove (tms) {
      if (this.isCalendarReadOnly) {
        return
      }

      const mouse = new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start
        const end = this.dragEvent.end
        const duration = end - start
        const newStartTime = mouse - this.dragTime
        const newStart = this.roundTime(newStartTime)
        const newEnd = newStart + duration
        if (newStart < this.eventMinTime || newEnd > this.eventMaxTime) {
          return
        }
        if (
          this.events.some(v => v !== this.dragEvent &&
            (
              (newStart >= v.start && newStart < v.end) ||
              (newEnd > v.start && newEnd <= v.end) ||
              (v.start >= newStart && v.start < newEnd) ||
              (v.end > newStart && v.end <= newEnd))
          )
        ) {
          return
        }
        this.dragEvent.start = newStart
        this.dragEvent.end = newEnd
      } else if (this.createEvent && this.createStart !== null) {
        let mouseRounded = 0
        if (this.createStart >= mouse) {
          mouseRounded = this.roundTime(mouse)
        } else {
          mouseRounded = this.roundTime(mouse, false)
        }
        const newStart = Math.min(mouseRounded, this.createStart)
        const newEnd = Math.max(mouseRounded, this.createStart + (this.workIntervalMinutes * 60 * 1000))
        if (newStart < this.eventMinTime || newEnd > this.eventMaxTime) {
          return
        }
        for (const eventKey in this.events) {
          if (this.createEvent !== this.events[eventKey]) {
            if (
              (newStart >= this.events[eventKey].start && newStart < this.events[eventKey].end) ||
              (newEnd > this.events[eventKey].start && newEnd <= this.events[eventKey].end) ||
              (this.events[eventKey].start >= newStart && this.events[eventKey].start < newEnd) ||
              (this.events[eventKey].end > newStart && this.events[eventKey].end <= newEnd)
            ) {
              return
            }
          }
        }
        this.createEvent.start = newStart
        this.createEvent.end = newEnd
      }
    },
    endDrag () {
      if (this.createEvent && this.createStart !== null && !this.extendOriginal) {
        this.showEvent(this.createEvent)
      }
      this.dragTime = null
      this.dragEvent = null
      this.createStart = null
      this.createEvent = null
      this.extendOriginal = null
    },
    cancelDrag () {
      if (this.isCalendarReadOnly) {
        return
      }

      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          const i = this.events.indexOf(this.createEvent)
          if (i !== -1) {
            this.events.splice(i, 1)
          }
        }
      }
      this.dragTime = null
      this.dragEvent = null
      this.createStart = null
      this.createEvent = null
      this.extendOriginal = null
    },
    roundTime (tms, down = true) {
      const roundDownTime = this.workIntervalMinutes * 60 * 1000
      return down ? tms - (tms % roundDownTime) : tms + (roundDownTime - (tms % roundDownTime))
    },
    getTimeFormat (tms) {
      const date = new Date(tms)
      return date.getHours() + ':' + ('00' + date.getMinutes()).slice(-2)
    },
    getDateTimeFormat (tms) {
      const date = new Date(tms)
      return this.getDateFormat(date) + ' ' + date.getHours() + ':' + ('00' + date.getMinutes()).slice(-2)
    },
    calculateOvertime () {
      // 各項目初期化
      this.devDefaultWorkTime = 0
      this.devWorkTime = 0
      this.devOvertime = 0
      this.devNoPremiumOvertime = 0
      this.devMidnightOvertime = 0
      this.devLegalHoridayWork = 0
      this.devScheduledHoridayWork = 0

      // 規定労働時間
      if (this.calendarDates.some(v => v.date === this.targetDate && v.callendarDateClass === 'WorkingDay')) {
        this.devDefaultWorkTime = ((new Date(this.targetDate + ' ' + this.defaultTime.endTime).getTime() -
                                    new Date(this.targetDate + ' ' + this.defaultTime.startTime).getTime()) / (60 * 60 * 1000)) -
                                  ((new Date(this.targetDate + ' ' + this.breakTime.endTime).getTime() -
                                    new Date(this.targetDate + ' ' + this.breakTime.startTime).getTime()) / (60 * 60 * 1000))
      }

      // 労働時間でない時間
      let notWorkTime = 0
      // 深夜時間帯開始時間
      const midnightOverTimeStart = new Date(this.targetDate + ' ' + this.midnightOvertime.startTime).getTime()

      // 工数データに対して計算する
      for (const eventKey in this.events) {
        // 休憩時間はスキップ
        if (this.events[eventKey].isBreakTime) {
          continue
        }

        if (this.events[eventKey].isWork) {
          this.devWorkTime += (this.events[eventKey].end - this.events[eventKey].start) / (60 * 60 * 1000)
          if (this.events[eventKey].end > midnightOverTimeStart) {
            // 深夜残業時間の計算
            if (this.events[eventKey].start >= midnightOverTimeStart) {
              this.devMidnightOvertime += (this.events[eventKey].end - this.events[eventKey].start) / (60 * 60 * 1000)
            } else {
              this.devMidnightOvertime += (this.events[eventKey].end - midnightOverTimeStart) / (60 * 60 * 1000)
            }
          }
        } else {
          notWorkTime = (this.events[eventKey].end - this.events[eventKey].start) / (60 * 60 * 1000)
        }
      }

      // 労働しなければならない時間
      const necessaryWorkTime = this.devDefaultWorkTime - notWorkTime

      // 休日労働時間の計算
      if (this.calendarDates.some(v => v.date === this.targetDate && v.callendarDateClass === 'ScheduledHoliday')) {
        this.devScheduledHoridayWork = this.devWorkTime
      } else if (this.calendarDates.some(v => v.date === this.targetDate && v.callendarDateClass === 'LegalHoliday')) {
        this.devLegalHoridayWork = this.devWorkTime
      } else {
      // 時間外労働時間の計算
        if (necessaryWorkTime < this.devWorkTime) {
          // 時間外労働時間
          this.devOvertime = this.devWorkTime + notWorkTime - this.devDefaultWorkTime
          // 割増無時間外労働時間
          if (this.devWorkTime <= this.devDefaultWorkTime) {
            this.devNoPremiumOvertime = this.devOvertime
            this.devOvertime = 0
          } else {
            this.devNoPremiumOvertime = notWorkTime
            this.devOvertime -= this.devNoPremiumOvertime
          }
        }
      }
    },

    // 勤怠区分変更時
    changeAttendance () {
      if (this.selectedAttendanceClass.isWork || this.selectedAttendanceClass.isTransfer) {

      } else {
        if (this.selectedAttendanceClass.isPartialVacation) {
          // 開始時刻、終了時刻をソートする
          if (this.selectedAttendanceClass.reflectTimeStart === this.defaultTime.startTime) {
            // 午前休:深夜残業でない場合は開始時間をセットする
            if (!this.targetAttendance.isMidnightOvertime) {
              this.targetAttendance.dayStartTime = this.selectedAttendanceClass.reflectTimeStart
            }
            this.events = this.events.filter(v => v.start >= new Date(this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeEnd).getTime() &&
                                                  (v.isWork || v.isBreakTime))
          }
          if (this.selectedAttendanceClass.reflectTimeEnd === this.defaultTime.endTime) {
            // 午後休:深夜残業の場合、offする
            if (this.targetAttendance.isMidnightOvertime) {
              this.targetAttendance.isMidnightOvertime = false
              this.targetAttendance.dayStartTime = this.midnightOvertime.endTime
            }
            this.targetAttendance.dayEndTime = this.selectedAttendanceClass.reflectTimeEnd
            this.events = this.events.filter(v => v.end <= new Date(this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeStart).getTime() &&
                                                  (v.isWork || v.isBreakTime))
          }
          this.events.push({
            color: 'grey',
            start: new Date(this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeStart).getTime(),
            end: new Date(this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeEnd).getTime(),
            timed: true,

            id: -1,
            date: this.targetDate,
            jobCd: {
              jobCd: this.selectedAttendanceClass.attendanceClass,
              jobName: this.selectedAttendanceClass.attendanceClassName
            },
            jobDetailCd: {},
            jobRemarksCd: {},
            startTime: this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeStart,
            endTime: this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeEnd,
            manHours: (new Date(this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeEnd).getTime() -
                      new Date(this.targetDate + ' ' + this.selectedAttendanceClass.reflectTimeStart).getTime()) / (60 * 60 * 1000),
            isWork: false,
            isAvailable: false,
            isBreakTime: false
          })
        } else {
          this.events = []
          this.events.push({
            color: 'grey',
            start: new Date(this.targetDate + ' ' + this.defaultTime.startTime).getTime(),
            end: new Date(this.targetDate + ' ' + this.defaultTime.endTime).getTime(),
            timed: true,

            id: -1,
            date: this.targetDate,
            jobCd: {
              jobCd: this.selectedAttendanceClass.attendanceClass,
              jobName: this.selectedAttendanceClass.attendanceClassName
            },
            jobDetailCd: {},
            jobRemarksCd: {},
            startTime: this.targetDate + ' ' + this.defaultTime.startTime,
            endTime: this.targetDate + ' ' + this.defaultTime.endTime,
            manHours: (new Date(this.targetDate + ' ' + this.defaultTime.endTime).getTime() -
                    new Date(this.targetDate + ' ' + this.defaultTime.startTime).getTime()) / (60 * 60 * 1000),
            isWork: false,
            isAvailable: false
          })
          this.targetAttendance.dayStartTime = this.defaultTime.startTime
          this.targetAttendance.dayEndTime = this.defaultTime.endTime
          this.targetAttendance.transferVacationScheduleDate = ''
          this.targetAttendance.isMidnightOvertime = false
        }
      }
    },
    // 勤怠・工数一覧画面に遷移
    openList () {
      this.$router.push({ name: 'BBD0020-list' })
    }
  }
}
</script>

<style>
.theme--light.v-calendar-daily {
  background-color: #ffffff;
  border-left: #90a4ae 1px solid;
  border-top: #90a4ae 1px solid;
  border-right: #90a4ae 1px solid;
  border-bottom: #90a4ae 1px solid;
}
</style>

<style lang="scss" scoped>
.v-event-draggable {
  padding-left: 6px;
  user-select:none;
}
.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}
.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;
  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }
  &:hover::after {
    display: block;
  }
}
</style>
