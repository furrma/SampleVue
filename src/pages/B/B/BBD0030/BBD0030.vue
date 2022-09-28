<template>
  <div class="d-flex flex-column flex-grow-1">
    <div>
      <!-- 画面タイトル -->
      <div class="display-1 pb-2">{{ $t("BBD0030.title") }}</div>
    </div>

    <v-card>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="user"
              :items="users"
              :item-text="(item) => item.userName"
              label="ユーザー検索"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-menu
              ref="menuFromDate"
              v-model="menuFromDate"
              :close-on-content-click="false"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="fromDate"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  label="開始日付"
                  :max="toDate"
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="fromDate = null"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fromDate"
                no-title
                locale="ja"
                :show-current="false"
                @change="menuFromDate = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="3">
            <v-menu
              ref="menuToDate"
              v-model="menuToDate"
              :close-on-content-click="false"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="toDate"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  label="終了日付"
                  :min="fromDate"
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="toDate = null"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="toDate"
                no-title
                :show-current="false"
                @change="menuToDate = false"
                locale="ja"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-card class="ma-2" color="light-blue lighten-5">
          <v-card-title> 振替対象</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="beforeJobCd"
                  label="ジョブコード*"
                  :items="jobCds"
                  :item-text="(item) => item.jobCd + ':' + item.jobCdName"
                  item-value="jobCd"
                  required
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="beforeJobDetailCd"
                  label="ジョブ詳細コード"
                  :items="jobDetailCds"
                  :item-text="
                    (item) => item.jobDetailCd + ':' + item.jobDetailCdName
                  "
                  item-value="jobDetailCd"
                  return-object
                  clearable
                  required
                  menu-props="auto"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="beforeJobRemarksCd"
                  label="ジョブ備考コード"
                  :items="beforeJobCd.jobRemarksCds"
                  :item-text="
                    (item) => item.jobRemarksCd + ':' + item.jobRemarksCdName
                  "
                  item-value="jobRemarksCd"
                  return-object
                  clearable
                  menu-props="auto"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="ma-2" color="orange lighten-5">
          <v-card-title> 振替先 </v-card-title>
          <v-card-text>
            <v-row dense> </v-row>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="afterJobCd"
                  label="ジョブコード*"
                  :items="jobCds"
                  :item-text="(item) => item.jobCd + ':' + item.jobCdName"
                  item-value="jobCd"
                  required
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="afterJobDetailCd"
                  label="ジョブ詳細コード"
                  :items="jobDetailCds"
                  :item-text="
                    (item) => item.jobDetailCd + ':' + item.jobDetailCdName
                  "
                  item-value="jobDetailCd"
                  return-object
                  clearable
                  required
                  menu-props="auto"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="afterJobRemarksCd"
                  label="ジョブ備考コード"
                  :items="afterJobCd.jobRemarksCds"
                  :item-text="
                    (item) => item.jobRemarksCd + ':' + item.jobRemarksCdName
                  "
                  item-value="jobRemarksCd"
                  return-object
                  clearable
                  menu-props="auto"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-row dense class="justify-end">
          <v-btn color="primary" class="ma-2" large>実行</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  head: {
    title () {
      return {
        complement: this.$t('BBD0030.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // selected
      user: {
        userID: null,
        userName: null
      },
      beforeJobCd: {
        jobCd: null,
        jobCdName: null,
        jobRemarksCds: []
      },
      beforeJobDetailCd: {
        jobDetailCd: null,
        jobDetailCdName: null
      },
      beforeJobRemarksCd: {
        jobRemarksCd: null,
        jobRemarksCdName: null
      },
      afterJobCd: {
        jobCd: null,
        jobCdName: null,
        jobRemarksCds: []
      },
      afterJobDetailCd: {
        jobDetailCd: null,
        jobDetailCdName: null
      },
      afterJobRemarksCd: {
        jobRemarksCd: null,
        jobRemarksCdName: null
      },

      // list
      users: [
        { userID: 'k.yokoi', userName: '横井健章' },
        { userID: 't.test', userName: 'テストユーザ―' }
      ],

      jobCds: [
        {
          jobCd: 'AAA-01-0001',
          jobCdName: 'テストジョブコードA',
          jobRemarksCds: []
        },
        {
          jobCd: 'BBB-01-0001',
          jobCdName: 'テストジョブコードB',
          jobRemarksCds: []
        },
        {
          jobCd: 'CCC-01-0001',
          jobCdName: 'テストジョブコードC',
          jobRemarksCds: [
            {
              jobRemarksCd: '0001',
              jobRemarksCdName: '備考コード1'
            },
            {
              jobRemarksCd: '0002',
              jobRemarksCdName: '備考コード2'
            },
            {
              jobRemarksCd: '0003',
              jobRemarksCdName: '備考コード3'
            }
          ]
        }
      ],
      jobDetailCds: [
        {
          jobDetailCd: '01',
          jobDetailCdName: '設計'
        },
        {
          jobDetailCd: '02',
          jobDetailCdName: '実装'
        },
        {
          jobDetailCd: '03',
          jobDetailCdName: 'テスト'
        },
        {
          jobDetailCd: '07',
          jobDetailCdName: 'その他'
        }
      ],

      // display
      fromDate: null,
      toDate: null,
      menuFromDate: false,
      menuToDate: false
    }
  },
  methods: {}
}
</script>
