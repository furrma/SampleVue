<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center">
            <div>
             <!--画面タイトル-->
             <div class="display-1">{{ $t("ZBD0040.title") }}</div>
             <!--パンくずリスト-->
             <a-breadcrumbs :items="breadcrumbs" />
            </div>
            <v-spacer></v-spacer>
            <!--新規登録ボタン-->
            <v-btn color="primary" @click="openNew">
                {{ $t("common.add")}}
            </v-btn>
        </div>
        <v-card>
            <v-row dense class="pa-2 align-center">
              <v-col cols="12" class="d-flex align-center">
                <!-- キーワード-->
                <a-keyword-text-field class="flex-grow-1 mr-2" v-model="keywords" @search= "search"/>
                <!-- 状態-->
                <a-btn-toggle-active v-model="toggleActiveValue"/>
              </v-col>
            </v-row>
            <!-- 弁当リスト-->
            <v-data-table
                :headers="headers"
                :items="lunch"
                :loading="isLoading"
                class="flex-grow-1"
            >
            <!-- 弁当名 -->
             <template v-slot:[`item.id`]="{ item }">
                <router-link :to="{ name: 'ZBD0040-detail',params: { id: item.id} }">
                  {{ item.lunchName }}
                </router-link>
              </template>

            <!-- 状態(前日注文) -->
            <template v-slot:[`item.isOrderBeforeDate`]="{ item }">
                <v-icon v-if="item.isOrderBeforeDate" small color="success">
                    mdi-check-circle
                </v-icon>
                <v-icon v-else small color="disable">
                    mdi-circle-outline
                </v-icon>
            </template>
            <!-- 状態(有効,無効) -->
            <template v-slot:[`item.isActive`]="{ item }">
                <v-icon v-if="item.isActive" small color="success">
                    mdi-check-circle
                </v-icon>
                <v-icon v-else small color="disable">
                    mdi-circle-outline
                </v-icon>
            </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ToggleActiveValue from '../../../../constants/ToggleActiveValue'

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZBD0040.title'),
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
      toggleActiveValue: ToggleActiveValue.ACTIVE,
      // データ
      lunch: []
    }
  },

  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0040.title'),
          to: { name: 'ZBD0040' }
        }
      ]
    },
    headers () {
      return [
        { text: this.$t('ZBD0040.lunchName'), value: 'id' },
        { text: this.$t('ZBD0040.price'), value: 'price' },
        { text: this.$t('ZBD0040.isOrderBeforeDate'), value: 'isOrderBeforeDate' },
        { text: this.$t('common.active'), value: 'isActive' }
      ]
    }
  },

  watch: {
    locale () {
      // 言語変更時に再検索
      this.search()
    },
    toggleActiveValue () {
      this.search()
    }
  },
  mounted () {
    // 初回検索
    this.search()
  },

  methods: {
    // 検索取得を行う
    async search () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.lunch = []

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
        const response = await this.$axios.get('admin/lunch', {
          params: query
        })
        this.lunch = response.data
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
      this.$router.push({ name: 'ZBD0040-new' })
    }
  }
}
</script>
