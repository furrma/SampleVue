<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">Welcome</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid: isInvalid }">
          <form @submit.prevent="submit">
            <!-- ユーザーCD -->
            <a-text-field
              vid="userCd"
              v-model="userCd"
              rules="required|max:10"
              :label="$t('ZCD0010.userCd')"
              outlined
            />
            <!-- パスワード -->
            <a-text-field
              vid="password"
              v-model="password"
              rules="required|max:255"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :label="$t('ZCD0010.password')"
              outlined
              @click:append="showPassword = !showPassword"
            />
            <!-- エラーメッセージ -->
            <v-alert
              v-if="errorMessage"
              type="error"
              class="mb-2"
            >{{ errorMessage }}</v-alert>
            <!-- ログインボタン -->
            <v-btn
              type="submit"
              :disabled="isInvalid"
              :loading="isLoading"
              block
              x-large
              color="primary"
            >{{ $t('ZCD0010.login') }}</v-btn>
          </form>
        </validation-observer>
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
        inner: this.$t('app.productName'),
        separator: ' ',
        complement: ' '
      }
    }
  },
  data () {
    return {
      // 状態
      isLoading: false,
      showPassword: false,
      errorMessage: null,

      // フォーム
      userCd: 'admin',
      password: 'admin'
    }
  },
  computed: {
    ...mapState('app', ['locale'])
  },
  mounted () {
    // ログアウト
    this.$store.dispatch('auth/logout')
  },
  methods: {
    // ログイン認証
    async submit () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.errorMessage = null

        // リクエスト送信
        await this.$store.dispatch('auth/login', {
          companyCd: this.companyCd,
          userCd: this.userCd,
          password: this.password
        })

        // トップページまたはリダイレクトもとに遷移
        if (this.$route.query && this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        } else {
          this.$router.push('/')
        }
      } catch (error) {
        // エラー処理
        const { status } = error.response
        if (status === 401) {
          // 認証エラーの場合はエラーメッセージを表示する
          this.errorMessage = this.$t('messages.error.invalidCredentials')
        } else {
          this.$setFormErrors(this.$refs.observer, error)
        }
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    }
  }
}
</script>
