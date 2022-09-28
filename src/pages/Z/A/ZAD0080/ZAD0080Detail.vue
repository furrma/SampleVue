<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZAD0080.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-spacer/>
    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("ZAD0080.calendarInfo") }}</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-divider />

      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card-text>
          <div class="px-1">
            <form @submit.prevent="saveUpdate">
              <!-- 年度(編集不可) -->
              <a-label-text-field
                vid="nendo"
                ref="nendo"
                v-model="nendo"
                :label="$t('ZAD0080.businessYear')"
                disabled
                outlined
                dense
              />
              <!-- 会社(編集不可) -->
              <a-label-text-field
                vid="company"
                ref="company"
                v-model="company"
                :label="$t('ZAD0080.company')"
                disabled
                outlined
                dense
              />
              <!-- カレンダー名 -->
              <a-label-translation-text-field-group
                vid="calendarNameTranslations"
                ref="calendarNameTranslations"
                v-model="calendarNameTranslations"
                rules="required|max:255"
                :label="$t('ZAD0080.calendarName')"
                outlined
                dense
              />
            </form>
          </div>
        </v-card-text>

         <!-- 日付テーブル -->
        <v-data-table
          :headers="headers"
          :items="years"
          dense
          :items-per-page="20"
          :footer-props="{itemsPerPageOptions: [10, 15, 20, -1]}"
        >

          <!-- 日付区分 列 の編集 -->
          <template v-slot:[`item.dateClass`]="props">
            <v-edit-dialog
              :return-value.sync="props.item.dateClass"
              large
            > {{ getCodeName(props.item.dateClass) }}
              <template v-slot:input>
                <v-select
                  v-model="props.item.dateClass"
                  :items="dateClassItems"
                  item-text="codeName"
                  item-value="codeKey"
                ></v-select>
              </template>
            </v-edit-dialog>
          </template>

          <!-- イベント 列 の編集 -->
          <template v-slot:[`item.dateEvent`]="props">
            <v-edit-dialog
              :return-value.sync="props.item.dateEvent"
              large
            >
              <div>{{ props.item.dateEvent }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.dateEvent"
                  label="Edit"
                  single-line
                  :counter="100"
                  autofocus
                  maxlength="100"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
        <!-- 保存ボタン -->
        <v-card-actions>
          <div class="mt-2">
            <v-btn
              type="submit"
              :disabled="invalid"
              :loading="isLoading"
              color="primary"
              @click="saveUpdate"
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
import CodeTypeCd from '../../../../constants/CodeTypeCd'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0080.title')
      }
    }
  },
  props: ['routeId'],
  data () {
    return {
      // 状態
      isLoading: false,
      pagination: {},
      nendo: null,
      company: '',
      calendarNameTranslations: {
      },
      isActive: true,
      headers: [
        {
          text: this.$t('ZAD0080.headerCalendarDate'),
          // sortable: false,
          value: 'date'
        },
        { text: this.$t('ZAD0080.headerCalendarClass'), value: 'dateClass' },
        { text: this.$t('ZAD0080.headerCalendarEvent'), value: 'dateEvent' }
      ],
      years: [],
      dateClassItems: [],
      calendarId: null,
      companyCd: null,
      calendarNameTid: null,
      calendarDayData: []
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.refresh()
    }
  },
  methods: {
    // 区分名を取得
    getCodeName (codeKey) {
      return this.dateClassItems.filter(x => x.codeKey === codeKey).map(x => x.codeName).join()
    },
    /**
     * 保存処理を行います。
     */
    async saveUpdate () {
      try {
        // ローディングを設定
        this.isLoading = true
        /// 更新処理
        this.calendarDayData = []
        for (var yearData of this.years) {
          var formatDate = moment(yearData.date).format('YYYY-MM-DD')
          var requestJson = { calendarDate: formatDate, calendarDateClass: yearData.dateClass, eventName: yearData.dateEvent || null }
          this.calendarDayData.push(requestJson)
        }
        // リクエストを作成
        const request = {
          calendarId: this.calendarId,
          businessYear: this.nendo,
          companyCd: this.companyCd,
          calendarName: this.calendarNameTranslations,
          calendarNameTid: this.calendarNameTid,
          calendarDayData: this.calendarDayData
        }
        const response = await this.$axios.patch('admin/calendar', request)
        // 完了メッセージを表示
        this.$store.dispatch('app/showSuccess', {
          message: 'messages.info.success',
          args: ['common.save']
        })
        this.setCalendarData(response.data)
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
     * 画面の再描画を行います
     */
    async refresh () {
      this.getCalendarClassData()
      this.getCalendarData()
    },
    // カレンダー日程区分一覧を取得
    async getCalendarClassData () {
      try {
        // ローディングを設定
        this.isLoading = true
        // クエリを作成
        const query = {}
        query.codeType = CodeTypeCd.CLASS_CALENDAR

        // カレンダー日程区分一覧を取得
        const response = await this.$axios.get('/codes', {
          params: query
        })
        this.dateClassItems = response.data
      } catch (error) {
        // エラーの場合
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },
    // カレンダーデータを取得
    async getCalendarData () {
      try {
        // ローディングを設定
        this.isLoading = true
        // クエリを作成
        const query = {}
        query.calendarId = this.calendarId

        // カレンダー日程区分一覧を取得
        const response = await this.$axios.get('/calendar/date', {
          params: query
        })
        this.setCalendarData(response.data)
      } catch (error) {
        // エラーの場合
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },
    setCalendarData (data) {
      this.nendo = data.businessYear
      this.company = data.companyName
      this.calendarNameTid = data.calendarNameTid
      this.companyCd = data.companyCd
      this.calendarNameTranslations = data.calendarName
      this.years = []
      // 曜日の言語を指定
      moment.locale(this.locale)
      for (var calendarDayData of data.calendarDayData) {
        var json = {
          date: moment(calendarDayData.calendarDate).format('YYYY-MM-DD (ddd)'),
          dateClass: calendarDayData.calendarDateClass,
          dateEvent: calendarDayData.eventName
        }
        this.years.push(json)
      };
    }
  },
  mounted () {
    this.calendarId = this.routeId
    this.refresh()
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0080.title'),
          to: { name: 'ZAD0080' },
          exact: true
        },
        {
          text: this.$t('common.edit'),
          disabled: true
        }
      ]
    }
  }
}
</script>
