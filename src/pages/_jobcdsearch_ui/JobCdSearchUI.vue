<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card>
      <!-- ヘッダー -->
      <v-toolbar dense flat>
        <v-toolbar-title>JOBコード検索UIコンポーネントサンプル</v-toolbar-title>
      </v-toolbar>

      <v-divider />

      <v-row>
        <v-col>
          <div> ● 検索コンポーネント条件</div>
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
          <v-text-field
            v-model="initialJobCdID"
            label="displayedJobCdIds"
            hint="初期表示するJOBコードID(複数の場合はカンマ区切り)【入力例: 1,3】"
            @change="childCompRedisplay"
            :persistent-hint="true"
          ></v-text-field>
        </v-col>

      </v-row>

      <v-row>
        <v-col>
          <v-switch
            v-model="isIncludeDevEndOver"
            flat
            :label="`isIncludeDevEndOver: ${isIncludeDevEndOver.toString()}`"
            hint="開発終了年月が過ぎているデータを表示するかどうか"
            @change="childCompRedisplay"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="isIncludeDevEnd"
            flat
            :label="`isIncludeDevEnd: ${isIncludeDevEnd.toString()}`"
            hint="開発終了フラグがtrueのデータも含むかどうかの絞り込みで使用"
            @change="childCompRedisplay"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="isIncludeTentative"
            flat
            :label="`isIncludeTentative: ${isIncludeTentative.toString()}`"
            hint="仮フラグがtrueのデータも含むかどうかの絞り込みで使用"
            @change="childCompRedisplay"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="isIncludeNonAvailable"
            flat
            :label="`isIncludeNonAvailable: ${isIncludeNonAvailable.toString()}`"
            hint="工数入力可能フラグがfalseのデータも含むかどうかの絞り込みで使用"
            @change="childCompRedisplay"
            :persistent-hint="true"
          ></v-switch>
        </v-col>
      </v-row>

      <v-divider />

      <v-card-text>
        <v-row dense class="pa-2 align-center">
          <v-col>
            <!-- ユーザー検索コンポーネント -->
            <a-autocomplete-jobCd-search
              :key="redisplay"
              :isMultiple="isMultiple"
              :isDisable="isDisable"
              :displayedLabel="jobCdSearchlabel"
              :displayedJobCdIDs="initializeJobCdIDs"
              :isIncludeDevEnd="isIncludeDevEnd"
              :isIncludeDevEndOver="isIncludeDevEndOver"
              :isIncludeTentative="isIncludeTentative"
              :isIncludeNonAvailable="isIncludeNonAvailable"
              @selected="getData($event)"
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
import AAutocompleteJobCdSearch from '../../components/forms/AAutocompleteJobCdSearch.vue'

export default {
  components: {
    AAutocompleteJobCdSearch
  },

  head: {
  },
  data () {
    return {

      isMultiple: true,
      isDisable: false,
      jobCdSearchlabel: 'JOBコード検索',

      // 初期表示で使用
      initializeJobCdIDs: [], // isMaltiple=falseの場合は、一番最初のデータのみ表示する。
      initialJobCdID: '',

      // 開発終了年月が過ぎているデータも含むかどうかの絞り込みで使用
      isIncludeDevEndOver: false,
      // 開発終了フラグがtrueのデータも含むかどうかの絞り込みで使用
      isIncludeDevEnd: false,
      // 仮フラグがtrueのデータも含むかどうかの絞り込みで使用
      isIncludeTentative: true,
      // 工数入力可能フラグがfalseのデータも含むかどうかの絞り込みで使用
      isIncludeNonAvailable: false,

      redisplay: 0, // スイッチ切り替え時の再描画処理のため。本来は不要。
      rsltSearchDatas: [],
      rsltSearchHeaders: [
        {
          text: 'JOBコードID',
          align: 'start',
          value: 'jobCdId'
        },
        { text: 'JOBコード', value: 'jobCd' },
        { text: 'JOBコード名', value: 'jobName' },
        { text: '取引先CD', value: 'supplierCd' },
        { text: '取引先名', value: 'supplierName' }
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
    initialJobCdID (newVal) {
      this.initializeJobCdIDs = newVal.split(',').map(str => parseInt(str, 10))
      this.childCompRedisplay()
    }
  },
  methods: {
    // スイッチ切り替え時に、子コンポーネントを再描画する。
    childCompRedisplay () {
      this.redisplay = this.redisplay ? 0 : 1
    },
    getData (searchedData) {
      this.rsltSearchDatas = searchedData
    }
  }
}
</script>
