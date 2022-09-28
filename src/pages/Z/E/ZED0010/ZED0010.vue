<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZED0010.title") }}</div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
      <v-spacer></v-spacer>
      <!-- 新規登録ボタン -->
      <v-btn color="primary" @click="openNew">
        {{ $t("common.add") }}
      </v-btn>
    </div>

    <v-card>
      <v-row dense class="pa-2 align-center">
        <v-col cols="12" class="d-flex align-center">
          <!-- 会社 -->
          <v-btn-toggle
            dark
            v-model="toggleFilterCompany"
          >
            <v-btn
              v-for="companyBtn in companyBtns"
              :key="companyBtn.key"
              :value="companyBtn.key"
            >
              {{companyBtn.text}}
            </v-btn>
          </v-btn-toggle>

          <v-spacer/>
          <!-- キーワード -->
          <a-keyword-text-field class="flex-grow-1 mr-2" v-model="keywords" @search="search" />
          <!-- 状態 -->
          <v-btn-toggle
            v-model="toggleFilterDate"
            multiple
          >
            <v-btn value="TODAY">
                {{ $t("ZED0010.today") }}
            </v-btn>
            <v-btn value="TOMORROW">
              {{ $t("ZED0010.tomorrow") }}
            </v-btn>
            <v-btn value="OTHERS">
              {{ $t("ZED0010.others") }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- 行動予定表 -->
      <v-data-table
        :headers="scheduleHeaders"
        :items="scheduleItems"
        :loading="isLoading"
        dense
        :items-per-page="-1"
        virtual-rows
        hide-default-footer
        sort-by="sortNo"
        group-by="dateClass"
        show-group-by
        class="flex-grow-1 schedule-table"
        :height="600"
        :fixed-header="true"
      >
        <!-- 氏名カラム -->
        <template v-slot:[`item.arrayUserNames`]="{ item }">
          <v-chip
            v-for="userName in item.arrayUserNames"
            :key="userName"
            small
            color="primary"
            outlined
            class="mr-1"
          >
            {{userName}}
          </v-chip>
        </template>

        <!-- 開始日付カラム -->
        <template v-slot:[`item.startDate`]="{ item }">
          {{getStartDate(item)}}
        </template>

        <!-- 開始時間カラム -->
        <template v-slot:[`item.startTime`]="{ item }">
          {{getStartTime(item)}}
        </template>

        <!-- 時間間隔カラム -->
        <template v-slot:[`item.-`]>
          <div>-</div>
        </template>

        <!-- 終了日付カラム -->
        <template v-slot:[`item.endDate`]="{ item }">
          {{getEndDate(item)}}
        </template>

        <!-- 終了時間カラム -->
        <template v-slot:[`item.endTime`]="{ item }">
          {{getEndTime(item)}}
        </template>

        <template v-slot:[`item.isRegularly`]="{ item }">
          <v-icon v-if="item.isRegularly" small >
            mdi-cached
          </v-icon>
        </template>

        <!-- アクションカラム -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)" >
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)" >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ToggleActiveValue from '../../../../constants/ToggleActiveValue'
import moment from 'moment'

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZED0010.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // 状態
      isLoading: false,

      // フォーム
      keywords: '',
      toggleFilterDate: ['TODAY', 'TOMORROW', 'OTHERS'],
      toggleActiveValue: ToggleActiveValue.ACTIVE,

      toggleFilterCompany: 'S2I', // ログインユーザーの所属会社CD

      // データ
      scheduleItems: [],
      today: '',
      tomorrow: '',

      scheduleHeaders: [
        { text: this.$t('ZED0010.userNames'), value: 'arrayUserNames', sortable: false, groupable: false, divider: true, width: '30%' },
        // { text: '', value: 'sortNo', sortable: true, groupable: false },
        { text: this.$t('ZED0010.date'), value: 'dateClass', divider: true, width: '20%' },
        { text: '', value: 'scheduleClassName', width: '10%' },
        { text: this.$t('ZED0010.destination'), value: 'destination', groupable: false, divider: true, width: '30%' },
        { text: this.$t('ZED0010.start'), value: 'startDate', groupable: false, width: '8%', class: 'col-time', cellClass: 'col-time' },
        { text: '', value: 'startTime', groupable: false, width: '8%', class: 'col-time', cellClass: 'col-time' },
        { text: '', value: '-', sortable: false, groupable: false, width: '2%', class: 'col-time', cellClass: 'col-time' },
        { text: this.$t('ZED0010.end'), value: 'endDate', groupable: false, width: '8%', class: 'col-time', cellClass: 'col-time' },
        { text: '', value: 'endTime', groupable: false, width: '8%', class: 'col-time', cellClass: 'col-time' },
        { text: '', value: 'isRegularly', groupable: false, sortable: false, divider: true, width: '3%', class: 'col-time', cellClass: 'col-time' },
        { text: this.$t('ZED0010.actions'), value: 'actions', groupable: false, sortable: false, width: '10%' }
      ],

      companyBtns: [
        { text: 'S2I', key: 'S2I' },
        { text: 'MRS', key: 'MRS' },
        { text: 'S2F', key: 'S2F' }
      ]
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZED0010.title'),
          to: { name: 'ZED0010' }
        }
      ]
    },
    TODAY () {
      // var today = new Date()
      // return today.getFullYear() + '-' + ('00' + (today.getMonth() + 1)).slice(-2) + '-' + ('00' + today.getDate()).slice(-2)
      return 'TOODAY'
    },
    TOMORROW () {
      // var tomorrow = new Date()
      // return tomorrow.getFullYear() + '-' + ('00' + (tomorrow.getMonth() + 1)).slice(-2) + '-' + ('00' + tomorrow.getDate() + 1).slice(-2)
      return 'TOMORROW'
    },
    OTHERS () {
      return 'OTHERS'
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      // this.search()
      moment.locale(this.locale)
    },
    toggleActiveValue () {
      // this.search()
    }
  },
  mounted () {
    moment.locale(this.locale)
    // 初回検索
    // this.search()
    var date = new Date()
    this.today = moment(date).format('YYYY/MM/DD')
    this.tomorrow = moment(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 1)).format('YYYY/MM/DD')

    this.scheduleItems = [
      {
        timestampUserId: '1631859838641-1',
        arrayUserNames: ['竹内 洋介', '中島 大輝'],
        scheduleClassName: '社外',
        sortNo: 11,
        destination: '日本特殊陶業',
        dateClass: '2021/09/13(月) : 今日',
        startDate: '2021-09-13',
        startTime: '',
        isGoDirectly: true,
        endDate: '2021-09-13',
        endTime: '14:00',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859838641-1',
        arrayUserNames: ['太田 隼介'],
        scheduleClassName: '午後休',
        sortNo: 3,
        destination: '',
        dateClass: '2021/09/13(月) : 今日',
        startDate: '2021-09-13',
        startTime: '12:00',
        isGoDirectly: false,
        endDate: '2021-09-13',
        endTime: '',
        isReturnDirectly: true,
        isRegularly: false
      },
      {
        timestampUserId: '1631859838984-1',
        arrayUserNames: ['水野 伸一'],
        scheduleClassName: '有給休暇',
        sortNo: 0,
        destination: '',
        dateClass: '2021/09/13(月) : 今日',
        startDate: '2021-09-10',
        startTime: '',
        isGoDirectly: false,
        endDate: '2021-09-18',
        endTime: '',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859838984-1',
        arrayUserNames: ['水野 伸一'],
        scheduleClassName: '有給休暇',
        sortNo: 0,
        destination: '',
        dateClass: '2021/09/14(火) : 明日',
        startDate: '2021-09-10',
        startTime: '',
        isGoDirectly: false,
        endDate: '2021-09-18',
        endTime: '',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859838984-1',
        arrayUserNames: ['水野 伸一'],
        scheduleClassName: '有給休暇',
        sortNo: 0,
        destination: '',
        dateClass: 'その他',
        startDate: '2021-09-10',
        startTime: '',
        isGoDirectly: false,
        endDate: '2021-09-18',
        endTime: '',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859838985-1',
        arrayUserNames: ['安藤 吉貴', '中村 条光', '横井 健章'],
        scheduleClassName: '社外',
        sortNo: 11,
        destination: '野球部勧誘活動(緒川駅前)',
        dateClass: '2021/09/13(月) : 今日',
        startDate: '2021-09-12',
        startTime: '16:00',
        isGoDirectly: false,
        endDate: '2021-09-15',
        endTime: '23:00',
        isReturnDirectly: false,
        isRegularly: true
      },
      {
        timestampUserId: '1631859838985-1',
        arrayUserNames: ['安藤 吉貴', '中村 条光', '横井 健章'],
        scheduleClassName: '社外',
        sortNo: 11,
        destination: '野球部勧誘活動(緒川駅前)',
        dateClass: '2021/09/14(火) : 明日',
        startDate: '2021-09-12',
        startTime: '16:00',
        isGoDirectly: false,
        endDate: '2021-09-15',
        endTime: '23:00',
        isReturnDirectly: false,
        isRegularly: true
      },
      {
        timestampUserId: '1631859828985-1',
        arrayUserNames: ['村瀬 竜雄'],
        scheduleClassName: '社外',
        sortNo: 11,
        destination: '長寿病院',
        dateClass: '2021/09/14(火) : 明日',
        startDate: '2021-09-14',
        startTime: '17:00',
        isGoDirectly: false,
        endDate: '2021-09-16',
        endTime: '12:00',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859928985-1',
        arrayUserNames: ['豊永 京平'],
        scheduleClassName: '午前休',
        sortNo: 1,
        destination: '',
        dateClass: 'その他',
        startDate: '2021-09-19',
        startTime: '',
        isGoDirectly: true,
        endDate: '2021-09-19',
        endTime: '12:00',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859828985-1',
        arrayUserNames: ['村瀬 竜雄'],
        scheduleClassName: '社外',
        sortNo: 11,
        destination: '長寿病院',
        dateClass: 'その他',
        startDate: '2021-09-14',
        startTime: '17:00',
        isGoDirectly: false,
        endDate: '2021-09-16',
        endTime: '12:00',
        isReturnDirectly: false,
        isRegularly: false
      },
      {
        timestampUserId: '1631859838985-1',
        arrayUserNames: ['安藤 吉貴', '中村 条光', '横井 健章'],
        scheduleClassName: '社外',
        sortNo: 11,
        destination: '野球部勧誘活動(緒川駅前)',
        dateClass: 'その他',
        startDate: '2021-09-12',
        startTime: '16:00',
        isGoDirectly: false,
        endDate: '2021-09-15',
        endTime: '23:00',
        isReturnDirectly: false,
        isRegularly: true
      },
      {
        timestampUserId: '1631859850085-1',
        arrayUserNames: ['槇林 亮平'],
        scheduleClassName: 'テレワーク',
        sortNo: 9,
        destination: '',
        dateClass: 'その他',
        startDate: '2021-09-15',
        startTime: '',
        isGoDirectly: false,
        endDate: '2021-09-15',
        endTime: '',
        isReturnDirectly: false,
        isRegularly: false
      }
    ]
  },
  methods: {
    getStartDate (item) {
      if (item.dateClass !== 'その他' && item.dateClass !== 'OTHER') {
        if (item.isRegularly) {
          return ''
        }
        if (item.startDate === item.endDate) {
          return ''
        }
      }
      return moment(item.startDate).format('MM/DD (ddd)')
    },
    getStartTime (item) {
      var strStartTime = ''
      if (item.isGoDirectly) {
        return this.$t('ZED0010.goDirectly')
      }
      if (item.isSeriesOfTime) {
        strStartTime = moment(item.startDate).format('MM/DD (ddd)') + ' '
      }
      strStartTime = strStartTime + item.startTime

      return strStartTime
    },
    getEndDate (item) {
      if (item.dateClass !== 'その他' && item.dateClass !== 'OTHER') {
        if (item.isRegularly) {
          return ''
        }
        if (item.startDate === item.endDate) {
          return ''
        }
      }
      return moment(item.endDate).format('MM/DD (ddd)')
    },
    getEndTime (item) {
      var strEndTime = ''
      if (item.isReturnDirectly) {
        return this.$t('ZED0010.returnDirectly')
      }
      if (item.isSeriesOfTime) {
        strEndTime = moment(item.endDate).format('MM/DD (ddd)') + ' '
      }
      strEndTime = strEndTime + item.endTime

      return strEndTime
    },
    // 検索取得を行う
    async search () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.users = []

        // クエリを作成
        const query = {}
        if (this.keywords) {
          query.keywords = this.keywords
        }
        switch (this.toggleActiveValue) {
          case ToggleActiveValue.ACTIVE:
            query.isActive = true
            break
          case ToggleActiveValue.DISABLED:
            query.isActive = false
            break
        }

        // データ取得
        const response = await this.$axios.get('/admin/users', {
          params: query
        })
        this.users = response.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    // 新規登録画面に遷移する
    openNew () {
      this.$router.push({ name: 'ZED0010-new' })
    }
  }
}
</script>

<style scoped>
/*
.schedule-table.v-data-table >>> thead tr th.col-user-name,
.schedule-table.v-data-table >>> tbody tr td.col-user-name {
  background: #86cfdaaa;
}
*/
.schedule-table.v-data-table >>> thead tr th.col-time,
.schedule-table.v-data-table >>> tbody tr td.col-time {
  background: #ffeebaaa;
}
/* .v-data-table td {
    background: #f0f8ff;
}
.v-data-table tr:nth-child(odd) td {
    background: #fff;
}
.v-data-table tr:hover td {
    background-color: #eee;
}
.v-row-group__header td {
    background-color: rgb(169, 164, 177);
} */
</style>
