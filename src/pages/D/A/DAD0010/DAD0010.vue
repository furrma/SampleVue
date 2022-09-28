<template>
  <div class="d-flex flex-column flex-grow-1">
         <div >
            <div>
             <!--画面タイトル-->
             <div class="display-1">{{ $t("DAD0010.title") }}</div>
             <!--パンくずリスト-->
             <a-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"/>
            </div>
            <v-spacer></v-spacer>
        </div>
        <v-col cols="12" sm="12" md="12">
        <v-card>

          <!-- 金額-->
          <v-snackbar v-model="snackbar" timeout="-1" right>
            <lavel>確定分金額</lavel>
             <div>{{beforeDateFrom }} ~ {{beforeDateTo }}：{{ previousSummary }} 円</div>
             <div>{{nextDateFrom }} ~ {{nextDateTo }}：{{ currentSummary }} 円</div>
          </v-snackbar>

           <!-- 月変更ボタン-->
           <v-row dense class="pa-2 py-2align-center">
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>

          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <!-- カレンダータイトル-->
          <v-toolbar-title >{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>

           <v-chip
            class="ma-2 pa-2"
            color="blue"
            text-color="white"
          >
          注文済
          </v-chip>

          <v-chip
            class="ma-2 pa-2"
            color="red"
            text-color="white"
          >
          集計済
          </v-chip>
          </v-row>

          <!-- カレンダー-->
          <v-sheet height="600">
          <v-calendar class="pa-3"
           ref="calendar"
           v-model="calendar"
           @click:date = "searchDay"
           :headers="headers"
           :events="events"
          ></v-calendar>
          </v-sheet>
        </v-card>
        </v-col>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {

  head: {
    title () {
      return {
        complement: this.$t('DAD0010.title'),
        inner: this.$t('app.productName')
      }
    }
  },

  data () {
    return {
      id: null,
      userId: null,
      price: null,
      beforeDateFrom: null,
      beforeDateTo: null,
      nextDateFrom: null,
      nextDateTo: null,
      previousSummary: null,
      currentSummary: null,
      calendar: new Date().toISOString().substr(0, 10),
      colors: ['red', 'blue'],
      names: [],
      start: [],
      timed: [],

      snackbar: true,

      rsltSearchDatas: [],

      // データ
      events: [],
      date: []
    }
  },

  computed: {
    // ログインユーザーID
    ...mapState({
      loginUserId: state => state.auth.user.id
    }),
    // カレンダータイトルを常に表示するため
    title () {
      return moment(this.calendar).format('yyyy年 M月')
    },

    breadcrumbs () {
      return [
        {
          text: this.$t('DAD0010.title'),
          to: { name: 'DAD0010' }
        }
      ]
    },
    headers () {
      return [
        { names: this.$t('ZBD0040.lunchName'), value: 'id' }
      ]
    }
  },

  watch: {
    locale () {
      // 言語変更時に再検索
      this.getEvents()
    },
    toggleActiveValue () {
      this.getEvents()
    }
  },

  mounted () {
    this.setToday()
    this.$refs.calendar.checkChange()
    this.getEvents()
  },

  methods: {
    // データ取得

    // 検索取得を行う
    async getEvents () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.events = []

        // クエリを作成
        const query = {}
        query.userId = this.userId

        const response = await this.$axios.get('lunchOrder', {
          params: query
        })

        // 確定金額を取得
        const money = await this.$axios.get(`lunchOrder/${this.loginUserId}`)
        this.setLunch(response.data)
        this.SetMoney(money.data)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    getData (searchedData) {
      if (searchedData.length) {
        this.userId = searchedData[0].userId
      }
      this.getEvents()
    },

    // 表示
    setLunch (data) {
      // 取得データを配列で格納
      for (let i = 0; i < data.length; i++) {
        this.events.push({
          name: data[i].lunchName,
          start: data[i].orderDate,
          end: data[i].orderDate,
          color: this.getEventColor(data[i])
        })
      }
    },
    // 確定金額表示
    SetMoney (data) {
      this.beforeDateFrom = data.beforeDateFrom
      this.beforeDateTo = data.beforeDateTo
      this.nextDateFrom = data.nextDateFrom
      this.nextDateTo = data.nextDateTo

      this.previousSummary = data.previousSummary
      this.currentSummary = data.currentSummary.toLocaleString()
    },

    setToday () {
      this.focus = ''
    },

    prev () {
      this.$refs.calendar.prev()
    },

    next () {
      this.$refs.calendar.next()
    },

    // 集計フラグ
    getEventColor (data) {
      // 集計済みは赤色にする
      if (data.isCalculated === true) {
        return 'red'
      } else {
        return 'blue'
      }
    },

    // 日付クリックで編集画面に遷移する
    searchDay (item) {
      if (this.today !== null) {
        this.$router.push({ name: 'DAD0010-detail', params: { date: item.date, today: this.today } })
      }
    }
  }
}
</script>
