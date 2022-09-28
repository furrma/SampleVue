<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZAD0040.title") }}</div>
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
          <!-- キーワード -->
          <a-keyword-text-field class="flex-grow-1 mr-2" v-model="keywords" @search="search" />
          <!-- 状態 -->
          <a-btn-toggle-active v-model="toggleActiveValue" />
        </v-col>
      </v-row>

      <!-- ロールリスト -->
      <v-data-table
        :headers="headers"
        :items="roles"
        :loading="isLoading"
        class="flex-grow-1"
      >
        <!-- ロール名 -->
        <template v-slot:[`item.id`]="{ item }">
          <router-link :to="{ name: 'ZAD0040-detail', params: { id: item.id } }">
            {{ item.roleName }}
          </router-link>
        </template>

        <!-- 状態 -->
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

/**
 * 権限マスタの一覧画面です。
 */
export default {
  head: {
    title () {
      return {
        complement: this.$t('ZAD0040.title'),
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
      roles: []
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0040.title'),
          to: { name: 'ZAD0040' }
        }
      ]
    },
    headers () {
      return [
        { text: this.$t('ZAD0040.role'), value: 'id' },
        { text: this.$t('ZAD0040.description'), value: 'description' },
        { text: this.$t('ZAD0040.isActive'), value: 'isActive' }
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
        this.roles = []

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
        const response = await this.$axios.get('/admin/roles', {
          params: query
        })
        this.roles = response.data
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
      this.$router.push({ name: 'ZAD0040-new' })
    }
  }
}
</script>
