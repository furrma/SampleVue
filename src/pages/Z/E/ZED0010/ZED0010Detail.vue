<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZED0010.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ $t("ZED0010.info") }}</v-toolbar-title>
        <v-spacer></v-spacer>

      </v-toolbar>
      <v-divider />
      <v-card-text>
        <div class="px-1">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="save">

              <!-- 登録先行動予定表 -->
              <a-label-select
                vid="companyCd"
                ref="companyCd"
                v-model="companyCd"
                :items="companies"
                rules="required"
                item-text="companyName"
                item-value="companyCd"
                :label="$t('ZED0010.registrationSchedule')"
                :loading="isFetchScreenLoading"
                dense
              />

              <!-- ユーザー -->
              <!-- ユーザー検索コンポーネント -->
              <a-autocomplete-user-search
                :isMultiple=true
                :isDisable=false
                :isDisplayUserIcon=true
                :displayedLabel="$t('ZED0010.user')"
                :displayedUserIds="arrayUserIds"
                @selected="getData($event)"
              />

              <!-- 予定区分 -->
              <v-radio-group
                v-model="scheduleClass"
                row
              >
                <v-radio
                  v-for="scheduleClassBtn in scheduleClassData"
                  :key="scheduleClassBtn.key"
                  :label="scheduleClassBtn.text"
                  :value="scheduleClassBtn.key"
                ></v-radio>
              </v-radio-group>

              <!-- 行先 -->
              <a-label-text-field
                v-if="!isDisableDestination"
                vid="destination"
                ref="destination"
                v-model="destination"
                rules="max:255"
                :label="$t('ZED0010.destination')"
                outlined
                dense
                :disabled="isDisableDestination"
              />
              <a-label-text-field
                v-if="isDisableDestination"
                vid="destination"
                ref="destination"
                v-model="destination"
                rules="max:255"
                :label="$t('ZED0010.destination')"
                outlined
                dense
                :disabled="isDisableDestination"
                background-color="grey lighten-2"
              />

              <v-divider/>

              <!-- 期間 -->
              <v-radio-group
                v-model="termClass"
                row
              >
                <!-- 今日 -->
                <v-radio
                  key="TODAY"
                  :label="$t('ZED0010.today')"
                  value="TODAY"
                ></v-radio>
                <!-- 明日 -->

                <v-radio
                  key="TOMORROW"
                  :label="$t('ZED0010.tomorrow')"
                  value="TOMORROW"
                ></v-radio>

                <!-- 指定日 -->
                <v-radio
                  key="SPECIFIED"
                  value="SPECIFIED"
                >
                  <template v-slot:label>
                    {{ $t('ZED0010.specified') + ' : ' }}
                    <!-- 指定日 カレンダー -->
                    <a-label-date-select v-if="termClass==='SPECIFIED'"
                      vid="specifiedDay"
                      ref="specifiedDay"
                      v-model="specifiedDay"
                      :label="$t('ZED0010.specifiedDay')"
                      dense
                    />

                  </template>
                </v-radio>

                <v-radio
                  key="SPECIFIED_TERM"
                  value="SPECIFIED_TERM"
                >
                  <template v-slot:label>

                    {{ $t('ZED0010.specifiedTeam') + ' : ' }}
                    <!-- 指定期間 開始 カレンダー -->
                    <a-label-date-select v-if="termClass==='SPECIFIED_TERM'"
                      vid="specifiedTeamStart"
                      ref="specifiedTeamStart"
                      v-model="specifiedTeamStart"
                      :label="$t('ZED0010.specifiedTeamStart')"
                      dense
                    />
                    <div v-if="termClass==='SPECIFIED_TERM'">
                      {{ $t('ZED0010.specifiedTeamWavyLine') }}
                    </div>
                    <!-- 指定期間 終了 カレンダー -->
                    <a-label-date-select v-if="termClass==='SPECIFIED_TERM'"
                      vid="specifiedTeamEnd"
                      ref="specifiedTeamEnd"
                      v-model="specifiedTeamEnd"
                      :label="$t('ZED0010.specifiedTeamEnd')"
                      dense
                    />

                  </template>
                </v-radio>
              </v-radio-group>

              <v-divider/>

              <v-row >
                <v-col cols="3">
                  <!-- 開始時間 -->
                  <a-label-text-field
                    vid="startTime"
                    ref="startTime"
                    v-model="startTime"
                    rules="max:255"
                    :label="$t('ZED0010.startTime')"
                    dense
                    :disabled="goDirectly||isDisableStartTime"
                  />
                  <v-checkbox
                    v-model="goDirectly"
                    :label="$t('ZED0010.goDirectly')"
                    dense
                    :disabled="isDisableStartTime"
                  />
                </v-col>
                <!-- 終了時間 -->
                <v-col cols="3">
                  <a-label-text-field
                    vid="endTime"
                    ref="endTime"
                    v-model="endTime"
                    rules="max:255"
                    :label="$t('ZED0010.endTime')"
                    dense
                    :disabled="returnDirectly||isDisableEndTime"
                  />
                  <v-checkbox
                    v-model="returnDirectly"
                    :label="$t('ZED0010.returnDirectly')"
                    dense
                    :disabled="isDisableEndTime"
                  />
                </v-col>
                <!-- 指定期間内の一連の時間チェックボックス -->
                <v-col cols="6">
                  <v-checkbox
                    v-model="isRegularly"
                    dense
                    :label="$t('ZED0010.isRegularly')"
                    :disabled="termClass!=='SPECIFIED_TERM'||isDisableRegularlyCheck"
                    :hint="$t('ZED0010.isRegularlyHint')"
                    :persistent-hint="true"
                  >

                    <!-- 繰り返し曜日の設定 -->
                    <template v-slot:prepend>
                      <v-menu
                        v-model="isRegularlyMenu"
                        :close-on-content-click="false"
                        :nudge-width="200"
                        transition="fab-transition"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            :disabled="!isRegularly"
                          >
                            <v-icon>mdi-cached</v-icon>
                          </v-btn>
                        </template>

                        <v-card>
                          <v-list>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isMonday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isMonday")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isTuesday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isTuesday")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isWednesday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isWednesday")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isThursday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isThursday")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isFriday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isFriday")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isSaturday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isSaturday")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-switch v-model="isSunday"/>
                              </v-list-item-action>
                              <v-list-item-title>{{$t("ZED0010.isSunday")}}</v-list-item-title>
                            </v-list-item>

                          </v-list>

                          <v-divider/>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn
                              color="primary"
                              text
                              @click="isRegularlyMenu = false"
                            >
                              {{$t("common.ok")}}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>

                    </template>
                  </v-checkbox>

                </v-col>
              </v-row>

            </form>
            <v-card-actions>
              <v-btn
                color="primary"
                :disabled="invalid"
                :loading="isLoading"
                @click="save"
              >
                {{ $t("common.save") }}
              </v-btn>
            </v-card-actions>
          </validation-observer>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AAutocompleteUserSearch from '../../../../components/forms/AAutocompleteUserSearch.vue'
import ALabelDateSelect from '../../../../components/forms/ALabelDateSelect.vue'

export default {
  components: {
    AAutocompleteUserSearch,
    ALabelDateSelect
  },
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZED0010.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // 情報
      isFetchScreenLoading: false,
      isLoading: false,

      // ユーザー検索UI結果
      rsltUserSearchDatas: [],

      // データ
      id: '',
      companyCd: 'S2I',
      arrayUserIds: [2, 3],
      destination: '',
      scheduleClass: 'OUTSIDE',
      termClass: 'TODAY',

      specifiedDay: '',
      specifiedTeamStart: '',
      specifiedTeamEnd: '',

      startTime: '',
      endTime: '',
      goDirectly: false,
      returnDirectly: false,
      isRegularly: false,
      isMonday: true,
      isTuesday: true,
      isWednesday: true,
      isThursday: true,
      isFriday: true,
      isSaturday: true,
      isSunday: true,

      // コンボボックス項目
      companies: [],

      // 画面の有効/無効制御
      isDisableDestination: true,
      isDisableStartTime: true,
      isDisableEndTime: true,
      isDisableRegularlyCheck: true,

      scheduleClassData: [
        {
          text: '有給休暇',
          key: 'PAID_HOLIDAY',
          sortNo: 0,
          isAbleDestination: false,
          isNecessaryDestination: false,
          isAbleStartTime: false,
          isNecessaryStartTime: false,
          isAbleEndTime: false,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '午前休',
          key: 'PAID_HOLIDAY_AM',
          sortNo: 1,
          isAbleDestination: false,
          isNecessaryDestination: false,
          isAbleStartTime: false,
          isNecessaryStartTime: false,
          isAbleEndTime: true,
          isNecessaryEndTime: true,
          isAbleRegularlyCheck: false
        },
        {
          text: '午後休',
          key: 'PAID_HOLIDAY_PM',
          sortNo: 2,
          isAbleDestination: false,
          isNecessaryDestination: false,
          isAbleStartTime: true,
          isNecessaryStartTime: true,
          isAbleEndTime: false,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '代休',
          key: 'COMPENSATORY_HOLIDAY',
          sortNo: 3,
          isAbleDestination: false,
          isNecessaryDestination: false,
          isAbleStartTime: true,
          isNecessaryStartTime: false,
          isAbleEndTime: true,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: true
        },
        {
          text: '振替休日',
          key: 'COMPENSATORY_DAY_OFF',
          sortNo: 4,
          isAbleDestination: false,
          isNecessaryDestination: false,
          isAbleStartTime: false,
          isNecessaryStartTime: false,
          isAbleEndTime: false,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '特別休暇',
          key: 'SPECIAL_HOLIDAY',
          sortNo: 5,
          isAbleDestination: false,
          isNecessaryDestination: false,
          isAbleStartTime: false,
          isNecessaryStartTime: false,
          isAbleEndTime: false,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '欠勤',
          key: 'ABSENCE',
          sortNo: 6,
          isAbleDestination: true,
          isNecessaryDestination: false,
          isAbleStartTime: false,
          isNecessaryStartTime: false,
          isAbleEndTime: false,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '遅刻',
          key: 'LATE',
          sortNo: 7,
          isAbleDestination: true,
          isNecessaryDestination: false,
          isAbleStartTime: false,
          isNecessaryStartTime: false,
          isAbleEndTime: true,
          isNecessaryEndTime: true,
          isAbleRegularlyCheck: false
        },
        {
          text: '早退',
          key: 'EARLY',
          sortNo: 8,
          isAbleDestination: true,
          isNecessaryDestination: false,
          isAbleStartTime: true,
          isNecessaryStartTime: true,
          isAbleEndTime: false,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: 'テレワーク',
          key: 'REMOTEWORK',
          sortNo: 9,
          isAbleDestination: true,
          isNecessaryDestination: false,
          isAbleStartTime: true,
          isNecessaryStartTime: false,
          isAbleEndTime: true,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '時差出勤',
          key: 'STAGGER_WORKTIME',
          sortNo: 10,
          isAbleDestination: true,
          isNecessaryDestination: false,
          isAbleStartTime: true,
          isNecessaryStartTime: false,
          isAbleEndTime: true,
          isNecessaryEndTime: false,
          isAbleRegularlyCheck: false
        },
        {
          text: '社外',
          key: 'OUTSIDE',
          sortNo: 11,
          isAbleDestination: true,
          isNecessaryDestination: true,
          isAbleStartTime: true,
          isNecessaryStartTime: true,
          isAbleEndTime: true,
          isNecessaryEndTime: true,
          isAbleRegularlyCheck: true
        }
      ],

      isRegularlyMenu: false

    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZED0010.title'),
          to: { name: 'ZED0010' },
          exact: true
        },
        {
          text: this.$t('ZED0010.info'),
          disabled: true
        }
      ]
    },
    isNewMode () {
      return this.mode === 'new'
    },
    isEditMode () {
      return this.mode === 'edit'
    }
  },
  watch: {
    locale () {
      // 言語変更時は画面再描画
      this.fetchScreenData()
      if (this.isEditMode) {
        this.id = this.routeId
        this.fetchData()
      }
    },
    scheduleClass (val) {
      this.isDisable()

      this.goDirectly = false
      this.returnDirectly = false
      this.isRegularly = false

      // 午前休
      if (val === 'PAID_HOLIDAY_AM') {
        this.goDirectly = true
        this.returnDirectly = false
      }
      // 午後休
      if (val === 'PAID_HOLIDAY_PM') {
        this.goDirectly = false
        this.returnDirectly = true
      }
      // 遅刻
      if (val === 'LATE') {
        this.goDirectly = true
        this.returnDirectly = false
      }
      // 早退
      if (val === 'EARLY') {
        this.goDirectly = false
        this.returnDirectly = true
      }
    },
    termClass () {
      this.isDisable()

      this.isRegularly = false
    }
  },
  mounted () {
    // 更新モードの場合は現在の登録情報を取得
    this.fetchScreenData()
    if (this.isEditMode) {
      this.id = this.routeId
      this.fetchData()
    }
  },
  methods: {
    isDisable () {
      this.isDisableDestination = !JSON.parse(this.scheduleClassData.filter(x => x.key === this.scheduleClass).map(x => x.isAbleDestination).join().toLowerCase())
      this.isDisableStartTime = !JSON.parse(this.scheduleClassData.filter(x => x.key === this.scheduleClass).map(x => x.isAbleStartTime).join().toLowerCase())
      this.isDisableEndTime = !JSON.parse(this.scheduleClassData.filter(x => x.key === this.scheduleClass).map(x => x.isAbleEndTime).join().toLowerCase())
      this.isDisableRegularlyCheck = !JSON.parse(this.scheduleClassData.filter(x => x.key === this.scheduleClass).map(x => x.isAbleRegularlyCheck).join().toLowerCase())
    },
    getData (searchedData) {
      // for (let i = 0; i < rsltData.length; i++) {
      //   this.rsltSearchDatas.push(rsltData[i])
      // }
      this.rsltUserSearchDatas = searchedData
    },
    // 画面表示用の情報を取得
    async fetchScreenData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true
        this.isFetchScreenLoading = true

        // 画面表示用の情報を取得
        const query = {}
        const response = await this.$axios.get('companies', {
          params: query
        })

        // 画面に結果をセット
        this.companies = response.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
        this.isFetchScreenLoading = false
      }
    },

    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // データを取得
        const response = await this.$axios.get(`/admin/users/${this.id}`)
        this.setFetchedData(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
      }
    },
    // 保存処理
    async save () {
      try {
        // ローディングを設定
        this.isSaveLoading = true

        // 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.$router.replace({ name: 'ZED0010-detail', params: { id: response.data.id } })
        } else if (this.isEditMode) {
          response = await this.saveUpdate()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFetchedData(response.data)
        }
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
      }
    },
    // 新規登録を行います
    async saveNew () {
    // リクエストを作成
      const request = {
        companyCd: this.companyCd,
        userCd: this.userCd,
        password: this.password,
        userName: this.userName,
        email: this.email
      }

      // 登録処理
      return await this.$axios.post('/admin/users', request)
    },
    // 更新を行います
    async saveUpdate () {
      // リクエストを作成
      const request = {
        id: this.id,
        companyCd: this.companyCd,
        userCd: this.userCd,
        userName: this.userName,
        email: this.email,
        isActive: this.isActive
      }

      return await this.$axios.patch(`/admin/users/${this.id}`, request)
    },
    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.id = data.id
      this.companyCd = data.companyCd
      this.userCd = data.userCd
      this.userName = data.userName
      this.email = data.email
      this.isActive = data.isActive
    }
  }
}
</script>
