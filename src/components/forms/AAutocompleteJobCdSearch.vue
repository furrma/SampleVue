<template>
  <!-- JOBコード検索コンポーネント -->
  <v-autocomplete
    v-model="jobCdData"
    item-text="searchableText"
    item-value="jobCdId"
    chips
    :disabled="isDisable"
    :items="jobCdDatas"
    :label="displayedLabel"
    :multiple="isMultiple"
    :loading="isLoading"
  >
    <!-- 検索枠のJOBコードの表示 -->
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        :close="isMultiple"
        @click:close="remove(data.item)"
      >
        {{ data.item.jobCd }}:{{data.item.jobName}}
      </v-chip>
    </template>

    <!-- サジェストとして表示する項目 -->
    <template v-slot:item="data">
      <!-- JOBコード情報 -->
      <v-list-item-content>
        <v-list-item-title v-html="data.item.jobCd + ':' + data.item.jobName"></v-list-item-title>
        <v-list-item-subtitle v-html="
           '【' + data.item.supplierCd + '】' + data.item.supplierName"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    // JOBコードの初期表示値のリスト
    displayedJobCdIds: Array,
    // 複数選択を許可するか
    isMultiple: {
      type: Boolean,
      default: true
    },
    // 無効にするか
    isDisable: {
      type: Boolean,
      default: false
    },
    // 開発終了年月を過ぎているデータを含むかどうか
    isIncludeDevEndOver: {
      type: Boolean,
      default: false
    },
    // 開発終了フラグがtrueのデータを含むかどうか
    isIncludeDevEnd: {
      type: Boolean,
      default: false
    },
    // 仮フラグがtrueのデータを含むかどうか
    isIncludeTentative: {
      type: Boolean,
      default: true
    },
    // 工数入力可能フラグがfalseのデータも含むかどうかの絞り込みで使用
    isIncludeNonAvailable: {
      type: Boolean,
      default: false
    },
    // フィールドタイトル
    displayedLabel: {
      type: String,
      default: 'JOBコード'
    }
  },

  head: {
  },
  data () {
    return {
      jobCdData: null,
      jobCdDatas: [],
      returnData: [],
      isLoading: false
    }
  },

  computed: {
    ...mapState('app', ['locale'])
  },
  created () {
  },
  mounted () {
    // WebAPIからデータを取得する。
    this.request()

    // request後にデータセットした場合、何故か選択済IDがコンポーネントに反映されない事があったので、requestメソッド内でセットするように変更
    // 表示するJOBコードIDがあれば、データをセットする。
    // if (this.isMultiple) {
    //   this.jobCdData = this.displayedJobCdIds
    // } else {
    //   this.jobCdData = this.displayedJobCdIds[0]
    // }
  },
  watch: {
    // v-modelのjobCdDataに変更があれば、親コンポーネントにデータを返す。
    jobCdData () {
      var jobCdList = []
      if (Array.isArray(this.jobCdData)) {
        for (let i = 0; i < this.jobCdData.length; i++) {
          jobCdList.push(this.getJobCdData(this.jobCdData[i]))
        }
      } else {
        jobCdList.push(this.getJobCdData(this.jobCdData))
      }
      this.returnData = jobCdList
      this.$emit('selected', this.returnData)
    },
    displayedJobCdIds (newDisplayedJobCdIds) {
      if (this.isMultiple) {
        this.jobCdData = newDisplayedJobCdIds
      } else {
        this.jobCdData = newDisplayedJobCdIds[0]
      }
    }
  },
  methods: {
    // 選択しているユーザーを除外する処理する。
    remove (item) {
      if (this.isMultiple) {
        const index = this.jobCdData.indexOf(item.jobCdId)

        if (index >= 0) this.jobCdData.splice(index, 1)
      }
    },
    // 親コンポーネントに返す値を作成する。(JOBコードIDから情報を取得する処理)
    getJobCdData (jobCdId) {
      if (jobCdId) {
        for (let i = 0; i < this.jobCdDatas.length; i++) {
          if (this.jobCdDatas[i].jobCdId === jobCdId) {
            const jobCdInfo = {
              jobCdId: jobCdId,
              jobCd: this.jobCdDatas[i].jobCd,
              jobName: this.jobCdDatas[i].jobName,
              supplierCd: this.jobCdDatas[i].supplierCd,
              supplierName: this.jobCdDatas[i].supplierName
            }
            return jobCdInfo
          }
        }
      }
      const unknownJobCdInfo = {
        jobCdId: null,
        jobCd: '',
        jobName: '',
        supplierCd: '',
        supplierName: ''
      }
      return unknownJobCdInfo
    },
    // GETリクエストの実行を行う
    async request () {
      try {
        this.jobCdDatas = []
        this.isLoading = true

        // クエリを作成
        const query = {}
        query.isIncludeDevEndOver = this.isIncludeDevEndOver
        query.isIncludeDevEnd = this.isIncludeDevEnd
        query.isIncludeTentative = this.isIncludeTentative
        query.isIncludeNonAvailable = this.isIncludeNonAvailable

        // データ取得
        const response = await this.$axios.get('/jobCds/autocomplete', {
          params: query
        })
        this.jobCdDatas = response.data
        this.setDatas()
      } catch (error) {
        // エラーメッセージを表示する。
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        this.isLoading = false
      }
    },
    setDatas () {
      // multipleはまだテスト中
      if (this.isMultiple) {
        this.jobCdData = this.jobCdDatas.map(value => (this.displayedJobCdIds.find(x => x === value.jobCdId))).jobCdId
      } else {
        this.jobCdData = this.jobCdDatas.find(value => (this.displayedJobCdIds[0] === value.jobCdId)).jobCdId
      }
    }
  }
}
</script>
