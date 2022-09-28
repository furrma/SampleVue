<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZBD0040.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("ZBD0040.lunchInfo") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <a-switch-active v-if="isEditMode" v-model="isActive" />
        </v-toolbar>
        <v-card-text>
              <!-- 弁当名-->
              <a-label-translation-text-field-group
              vid="lunchName"
              ref="lunchName"
              v-model="lunchName"
              rules="required"
              :label="$t('ZBD0040.lunchName')"
              outlined
              dense
              />
              <!-- 金額-->
              <a-label-text-field
              vid="price"
              ref="price"
              v-model="price"
              rules="required|numeric|max:4"
              :label="$t('ZBD0040.price')"
              outlined
              dense
              />
              <!--前日注文-->
              <v-checkbox
              vid="isOrderBeforeDate"
              ref="isOrderBeforeDate"
              v-model="isOrderBeforeDate"
              :label="$t('ZBD0040.isOrderBeforeDate')"
              ></v-checkbox>
      </v-card-text>
        <v-card-actions>
              <!-- 保存ボタン -->
              <div class="mt-2">
                <v-btn
                  color="primary"
                  :disabled="invalid"
                  :loading="isLoading"
                  @click="save"
                >
                  {{ $t("common.save") }}
                </v-btn>
              </div>
          </v-card-actions>
        </validation-observer>
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
        complement: this.$t('ZBD0040.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // 状態
      isLoading: false,

      // フォーム
      id: null,
      lunchNameTid: null,
      lunchName: {},
      price: null,
      isOrderBeforeDate: false,
      isActive: true
    }
  },

  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZBD0040.title'),
          to: { name: 'ZBD0040' },
          exact: true
        },
        {
          text: this.isNewMode ? this.$t('common.add') : this.$t('common.edit'),
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
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    async refresh () {
      // 更新モードの場合は現在の登録情報を取得
      if (this.isEditMode) {
        this.id = this.routeId
        this.fetchData()
      }
    },

    // 画面表示用の情報を取得
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // データを取得
        const response = await this.$axios.get(`admin/lunch/${this.id}`)
        this.setFetchedData(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    async save () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })

          this.setFetchedData(response.data)

          this.$router.replace({ name: 'ZBD0040-detail', params: { id: response.data.id } })
          // 編集の場合
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
        // エラーメッセージ表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },
    async saveNew () {
      // リクエスト作成
      const request = {
        lunchName: this.lunchName,
        price: this.price || null,
        isOrderBeforeDate: this.isOrderBeforeDate
      }
      // 登録処理
      return await this.$axios.post('admin/lunch', request)
    },
    async saveUpdate () {
      // リクエスト作成
      const request = {
        id: this.id || null,
        lunchNameTid: this.lunchNameTid,
        lunchName: this.lunchName,
        price: this.price || null,
        isOrderBeforeDate: this.isOrderBeforeDate,
        isActive: this.isActive
      }
      // 更新処理
      return await this.$axios.patch(`admin/lunch/${this.id}`, request)
    },
    // 画面にレスポンス情報をセットする
    setFetchedData (data) {
      this.id = data.id
      this.lunchNameTid = data.lunchNameTid
      this.lunchName = data.lunchName || {}
      this.price = data.price
      this.isOrderBeforeDate = data.isOrderBeforeDate
      this.isActive = data.isActive
    }
  }
}

</script>
