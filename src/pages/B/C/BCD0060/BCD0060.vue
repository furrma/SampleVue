<template>
  <div class="d-flex flex-column flex-grow-1">
    <!-- 画面タイトル -->
    <div>
      <div class="display-1 pb-2">{{ $t("BCD0060.title") }}</div>
    </div>
    <v-card>
        <v-card-title class="pb-0 text-h5"></v-card-title>
        <v-card-text>
          <v-data-table
            dense
            virtual-rows
            class="flex-grow-1 schedule-table mt-1 header-direction"
            hide-default-footer
            :headers="headers"
            :items="list"
            :loading="isLoading"
          >
          </v-data-table>
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head: {
    title () {
      return {
        complement: this.$t('BCD0060.title'),
        inner: this.$t('app.productName')
      }
    }
  },
  data () {
    return {
      // 状態
      isLoading: false,

      // data
      list: [
        {
          col01: '2021/08',
          col02: 14250,
          col03: '',
          col04: '',
          col05: '',
          col06: '',
          col07: '',
          col08: '',
          col09: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    headers () {
      return [
        { text: this.$t(''), value: 'col01', divider: true, sortable: false, groupable: false, align: 'center', justify: 'middle' },
        { text: this.$t('受注金額'), value: 'col02', divider: true, sortable: false, groupable: false, align: 'center', justify: 'middle' },
        { text: this.$t('当月初頭残金額'), value: 'col03', divider: true, sortable: false, groupable: false, align: 'center' },
        { text: this.$t('当月総工数金額'), value: 'col04', divider: true, sortable: false, groupable: false, align: 'center' },
        { text: this.$t('次月以降予定工数金額'), value: 'col05', divider: true, sortable: false, groupable: false, align: 'center' },
        { text: this.$t('当月売上金額'), value: 'col06', divider: true, sortable: false, groupable: false, align: 'center' },
        { text: this.$t('合計売上金額'), value: 'col07', divider: true, sortable: false, groupable: false, align: 'center' },
        { text: this.$t('次月初頭残金額'), value: 'col08', divider: true, sortable: false, groupable: false, align: 'center' },
        { text: this.$t('工事進捗率'), value: 'col09', divider: true, sortable: false, groupable: false, align: 'center' }
      ]
    }
  }
}
</script>

<style scoped>
.header-direction table tr {
  display:flex;
  flex-direction: column;
  float: left;
}

.header-direction thead, tbody {
  float: left;
}
</style>
