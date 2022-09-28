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
        <v-toolbar-title>{{ $t("ZAD0080.workTimeInfo") }}</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-divider />

      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card-text>
          <div class="px-1">
            <v-row class= "ma-1">
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
              <v-spacer/>

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
              <v-spacer/>
            </v-row>
          </div>
        </v-card-text>

        <!-- 編集テーブル -->
        <v-data-table
          :headers="headers"
          :items="years"
          dense
          :items-per-page="-1"
          virtual-rows
          hide-default-footer
          height="500px"
        >
          <!-- 勤務時間区分のカラム設定 -->
          <template v-slot:[`item.workTimeClass`]="props">
            <v-chip
              :color="getColor(props.item.workTimeClass)"
              dark
            >
              <v-edit-dialog
                :return-value.sync="props.item.workTimeClass"
                large
              >
              {{ getCodeName(props.item.workTimeClass) }}
                <template v-slot:input>
                  <v-select
                    v-model="props.item.workTimeClass"
                    :items="workTimeClassItems"
                    item-text="codeName"
                    item-value="codeKey"
                  ></v-select>
                </template>
              </v-edit-dialog>
            </v-chip>

          </template>

          <!-- 勤務開始時刻のカラム設定 -->
          <template v-slot:[`item.isWorkStartFlg`]="props">
            <v-simple-checkbox
              v-model="props.item.isWorkStartFlg"
            ></v-simple-checkbox>
          </template>

        </v-data-table>
        <!-- 保存ボタン -->
        <v-card-actions>
          <div class="mt-2">
            <v-btn
              type="submit"
              :disabled="invalid"
              :loading="saveLoading"
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
import { mapState } from 'vuex'
import CodeTypeCd from '../../../../constants/CodeTypeCd'

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
      saveLoading: false,
      max50chars: (v) => v.length <= 25 || 'Input too long!',
      pagination: {},
      nendo: null,
      company: '',
      headers: [
        {
          text: this.$t('ZAD0080.headerWorkTime'),
          value: 'daytime'
        },
        { text: this.$t('ZAD0080.headerWorkTimeClass'), value: 'workTimeClass' },
        { text: this.$t('ZAD0080.headerWorkStart'), value: 'isWorkStartFlg' }
      ],
      years: [],
      workTimeClassItems: [],
      calendarId: null,
      companyCd: '',
      workTimeData: []
    }
  },
  watch: {
    locale () {
      // 言語変更時に再検索
      this.refresh()
    }
  },
  mounted () {
    // 初回検索
    this.refresh()
  },
  methods: {
    getColor (classCd) {
      switch (classCd) {
        case this.workTimeClassItems[0].codeKey:
          return 'amber darken-2'
        case this.workTimeClassItems[1].codeKey:
          return 'blue-grey darken-1'
        case this.workTimeClassItems[2].codeKey:
          return 'light-blue darken-2'
        case this.workTimeClassItems[3].codeKey:
          return 'grey darken-3'
      }
    },
    // 区分名を取得
    getCodeName (codeKey) {
      return this.workTimeClassItems.filter(x => x.codeKey === codeKey).map(x => x.codeName).join()
    },
    /**
     * 保存処理を行います。
     */
    async saveUpdate () {
      try {
      // ローディングを設定
        this.saveLoading = true
        /// 更新処理
        this.workTimeData = []
        for (var yearData of this.years) {
          var requestJson = {
            startTime: yearData.daytime,
            workTimeClass: yearData.workTimeClass,
            isStartWorking: yearData.isWorkStartFlg
          }
          this.workTimeData.push(requestJson)
        }
        // リクエストを作成
        const request = {
          calendarId: this.calendarId,
          businessYear: this.nendo,
          companyCd: this.companyCd,
          workTimeData: this.workTimeData
        }
        const response = await this.$axios.patch('admin/worktime', request)
        // 完了メッセージを表示
        this.$store.dispatch('app/showSuccess', {
          message: 'messages.info.success',
          args: ['common.save']
        })
        this.setWorkTimeData(response.data)
      } catch (error) {
      // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
      // ローディングを解除
        this.saveLoading = false
      }
    },
    /**
     * 画面の再描画を行います
     */
    async refresh () {
      this.getWorkTimeClassData()
      this.getWorkTimeData()
    },

    // 勤務時間区分一覧を取得
    async getWorkTimeClassData () {
      try {
        // ローディングを設定
        this.saveLoading = true
        // クエリを作成
        const query = {}
        query.codeType = CodeTypeCd.CLASS_WORKTIME

        // 勤務時間区分一覧を取得
        const response = await this.$axios.get('/codes', {
          params: query
        })
        this.workTimeClassItems = response.data
      } catch (error) {
        // エラーの場合
      } finally {
        // ローディングを解除
        this.saveLoading = false
      }
    },

    // 検索取得を行う
    async getWorkTimeData () {
      try {
        // ローディングを設定
        this.saveLoading = true
        this.companies = []

        // クエリを作成
        const query = {}
        query.calendarId = this.routeId

        // データ取得
        const response = await this.$axios.get('/calendar/worktime', {
          params: query
        })
        this.setWorkTimeData(response.data)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.saveLoading = false
      }
    },
    setWorkTimeData (data) {
      this.calendarId = data.calendarId
      this.nendo = data.businessYear
      this.companyCd = data.companyCd
      this.company = data.companyName
      this.years = []
      for (var workTime of data.workTimeData) {
        var json = {
          daytime: workTime.startTime,
          workTimeClass: workTime.workTimeClass,
          isWorkStartFlg: workTime.isStartWorking
        }
        this.years.push(json)
      };
    }
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

<style>
</style>
