<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">{{ $t("ZAD0050.title") }}</div>
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

      <!-- ユーザーリスト -->
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="isLoading"
        class="flex-grow-1"
      >
        <!-- ユーザーID -->
        <template v-slot:[`item.userCd`]="{ item }">
          <v-avatar size="40">
          <v-img :src="item.userIcon" />
          </v-avatar>
          <router-link :to="{ name: 'ZAD0050-detail', params: { id: item.id } }">
            {{ item.userCd }}
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

export default {
  head: {
    title () {
      return {
        complement: this.$t('ZAD0050.title'),
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
      users: [],

      // アイコンリスト
      iconList: [
        '/images/avatars/avatar1.svg',
        '/images/avatars/avatar2.svg',
        '/images/avatars/avatar3.svg',
        '/images/avatars/avatar4.svg',
        '/images/avatars/avatar5.svg',
        '/images/avatars/avatar6.svg',
        '/images/avatars/avatar7.svg',
        '/images/avatars/avatar8.svg',
        '/images/avatars/avatar9.svg',
        '/images/avatars/avatar10.svg',
        '/images/avatars/avatar11.svg',
        '/images/avatars/avatar12.svg',
        '/images/avatars/avatar13.svg',
        '/images/avatars/avatar14.svg',
        '/images/avatars/avatar15.svg',
        '/images/avatars/avatar16.svg',
        '/images/avatars/avatar17.svg',
        '/images/avatars/avatar18.svg',
        '/images/avatars/avatar19.svg',
        '/images/avatars/avatar20.svg'
      ]
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0050.title'),
          to: { name: 'ZAD0050' }
        }
      ]
    },
    headers () {
      return [
        { text: this.$t('ZAD0050.userCd'), value: 'userCd' },
        { text: this.$t('ZAD0050.employeeNo'), value: 'employeeNo' },
        { text: this.$t('ZAD0050.companyName'), value: 'companyName' },
        { text: this.$t('ZAD0050.userName'), value: 'userName' },
        { text: this.$t('ZAD0050.userNameEn'), value: 'userNameEn' },
        { text: this.$t('ZAD0050.affiliationOrganizations'), value: 'organizationNames' },
        { text: this.$t('ZAD0050.ownedRoles'), value: 'roleNames' },
        { text: this.$t('ZAD0050.email'), value: 'email' },
        { text: this.$t('ZAD0050.isActive'), value: 'isActive' }
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
        this.users = []

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
        const response = await this.$axios.get('/admin/users', {
          params: query
        })
        this.users = response.data

        for (let i = 0; i < this.users.length; i++) {
          if (!this.users[i].userIcon) {
            this.users[i].userIcon = this.getRandomIcon()
          }
        }
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    // ユーザーアイコンをランダムに取得する処理する。
    getRandomIcon () {
      return this.iconList[Math.floor(Math.random() * this.iconList.length)]
    },

    // 新規登録画面に遷移する
    openNew () {
      this.$router.push({ name: 'ZAD0050-new' })
    }
  }
}
</script>
