<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card>
      <!-- ヘッダー -->
      <v-toolbar dense flat>
        <v-toolbar-title>ユーザー検索UIコンポーネントサンプル</v-toolbar-title>
      </v-toolbar>

      <v-divider />

      <v-row>
        <v-col>
          <div> ● 検索コンポーネント条件 (propsとか、、、) </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-switch
            v-model="isMultiple"
            flat
            :label="`isMultiple: ${isMultiple.toString()}`"
            @change="childCompRedisplay"
            hint="複数選択可能かどうか"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="isDisable"
            flat
            :label="`isDisable: ${isDisable.toString()}`"
            hint="無効かどうか"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="isDispUserIcon"
            flat
            :label="`isDisplayUserIcon: ${isDispUserIcon.toString()}`"
            hint="ユーザーアイコンを表示するかどうか"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
        <v-col>
          <v-text-field
            v-model="initialUserID"
            label="displayedUserIds"
            hint="初期表示するユーザーID(複数の場合はカンマ区切り)【入力例: 1,3】"
            :persistent-hint="true"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div> ● オートコンプリートで表示するユーザーの絞り込み条件 ([絞込]ボタン実行で候補が絞り込まれる) </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
           <v-text-field
            v-model="filteringCompanyCds"
            label="filterCompanyCds"
            filled
            hint="会社コードによる表示の絞り込み(複数の場合はカンマ区切り)【入力例: S2I,MRS】"
            :persistent-hint="true"
          ></v-text-field>
        </v-col>
        <v-col>
           <v-text-field
            v-model="filteringOrganizationIds"
            label="filterOrganizationIds"
            filled
            hint="組織IDよる表示の絞り込み(複数の場合はカンマ区切り)【入力例: 3,4,14】"
            :persistent-hint="true"
          ></v-text-field>
        </v-col>
        <v-col>
           <v-text-field
            v-model="filteringRoleIds"
            label="filterRoleIds"
            filled
            hint="ロールIDよる表示の絞り込み(複数の場合はカンマ区切り)【入力例: 1,2】"
            :persistent-hint="true"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-switch
            v-model="isIncludeInactiveUserFlag"
            flat
            :label="`isIncludeInactiveUser: ${isIncludeInactiveUserFlag.toString()}`"
            hint="非アクティブユーザーも含むかどうか"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
      </v-row>

      <v-btn depressed color="primary" outlined @click="doFiltering">
        絞込
      </v-btn>
      <v-divider />

      <v-card-text>
        <v-row dense class="pa-2 align-center">
          <v-col>
            <!-- ユーザー検索コンポーネント -->
            <a-autocomplete-user-search
              :key="redisplay"
              :isMultiple="isMultiple"
              :isDisable="isDisable"
              :isDisplayUserIcon="isDispUserIcon"
              :displayedLabel="userSearchlabel"
              :displayedUserIds="initializeUserIDs"
              @selected="getData($event)"
              :filterCompanyCds="filterCompanyCdArray"
              :filterOrganizationIds="filterOrganizationIdArray"
              :filterRoleIds="filterRoleIdArray"
              :isIncludeInactiveUser="isIncludeInactiveUserFlag"
            />
          </v-col>
        </v-row>

        <v-divider />

        <v-row dense class="pa-2 align-center">
          <div> 検索結果 </div>
        </v-row>

            <v-data-table
              :headers="rsltSearchHeaders"
              :items="rsltSearchDatas"
            ></v-data-table>

        <v-divider />

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import AAutocompleteUserSearch from '../../components/forms/AAutocompleteUserSearch.vue'

export default {
  components: {
    AAutocompleteUserSearch
  },

  head: {
  },
  data () {
    return {

      isMultiple: true,
      isDisable: false,
      isDispUserIcon: true,
      userSearchlabel: 'ユーザー検索',

      // 初期表示で使用
      initializeUserIDs: [], // isMaltiple=falseの場合は、一番最初のデータのみ表示する。
      initialUserID: '',

      // 会社コードでの絞り込みで使用
      filterCompanyCdArray: [],
      filteringCompanyCds: '',

      // 組織IDでの絞り込みで使用
      filterOrganizationIdArray: [],
      filteringOrganizationIds: '',

      // ロールIDでの絞り込みで使用
      filterRoleIdArray: [],
      filteringRoleIds: '',

      // 非アクティブユーザーも含むかどうかの絞り込みで使用
      isIncludeInactiveUserFlag: false,

      redisplay: 0, // スイッチ切り替え時の再描画処理のため。本来は不要。
      rsltSearchDatas: [],
      rsltSearchHeaders: [
        {
          text: 'ユーザーID',
          value: 'userId'
        },
        { text: 'ユーザー名', value: 'userName' },
        { text: 'ユーザー名(英)', value: 'userNameEn' }
      ]
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  watch: {
    initialUserID (newVal) {
      this.initializeUserIDs = newVal.split(',').map(str => parseInt(str, 10))
      this.childCompRedisplay()
    }
  },
  methods: {
    // スイッチ切り替え時に、子コンポーネントを再描画する。
    childCompRedisplay () {
      this.redisplay = this.redisplay ? 0 : 1
    },
    getData (searchedData) {
      // for (let i = 0; i < rsltData.length; i++) {
      //   this.rsltSearchDatas.push(rsltData[i])
      // }
      this.rsltSearchDatas = searchedData
    },
    doFiltering () {
      this.filterCompanyCdArray = []
      this.filterOrganizationIdArray = []
      this.filterRoleIdArray = []
      if (this.filteringCompanyCds) {
        this.filterCompanyCdArray = this.filteringCompanyCds.split(',')
      }
      if (this.filteringOrganizationIds) {
        this.filterOrganizationIdArray = this.filteringOrganizationIds.split(',').map(str => parseInt(str, 10))
      }
      if (this.filteringRoleIds) {
        this.filterRoleIdArray = this.filteringRoleIds.split(',').map(str => parseInt(str, 10))
      }
      this.childCompRedisplay()
    }
  }
}
</script>
