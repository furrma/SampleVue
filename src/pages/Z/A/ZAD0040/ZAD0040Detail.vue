<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZAD0040.title") }}
        </div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
    </div>

    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("ZAD0040.roleInfo") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <a-switch-active v-if="isEditMode" v-model="isActive" />
        </v-toolbar>
        <v-card-text>
          <!-- ロール名 -->
          <a-label-translation-text-field-group
            vid="roleName"
            ref="roleName"
            v-model="roleName"
            rules="required|max:255"
            :label="$t('ZAD0040.roleName')"
            outlined
            dense
          />
          <!-- 説明 -->
          <a-label-translation-text-field-group
            vid="description"
            ref="description"
            v-model="description"
            rules="required|max:255"
            :label="$t('ZAD0040.description')"
            outlined
            dense
          />
        </v-card-text>
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("ZAD0040.rolePermissions") }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            v-model="selectedPermissions"
            :items="permissionList"
            :headers="permissionsTableHeaders"
            :items-per-page="-1"
            show-select
            item-key="permissionCd"
            hide-default-footer
            class="flex-grow-1"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="invalid"
            :loading="isLoading"
            @click="save"
          >
            {{ $t("common.save") }}
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

/**
 * ロールマスタの詳細画面です。
 */
export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0040.title')
      }
    }
  },
  props: ['mode', 'routeId'],
  data () {
    return {
      // 状態
      isLoading: false,

      // フォーム
      id: '',
      roleNameTid: null,
      roleName: {},
      descriptionTid: null,
      description: {},
      selectedPermissions: [],
      isActive: null,

      // データ
      permissionList: []
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    breadcrumbs () {
      return [
        {
          text: this.$t('ZAD0040.title'),
          to: { name: 'ZAD0040' },
          exact: true
        },
        {
          text: this.isNewMode ? this.$t('common.add') : this.$t('common.edit'),
          disabled: true
        }
      ]
    },
    permissionsTableHeaders () {
      return [
        { text: this.$t('ZAD0040.permissionName'), value: 'permissionName' },
        { text: this.$t('ZAD0040.permissionCd'), value: 'permissionCd' }
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
    /**
     * 画面の再描画を行います
     */
    async refresh () {
      // 画面表示用の情報を取得
      this.fetchScreenData()

      // 更新モードの場合は現在の登録情報を取得
      if (this.isEditMode) {
        this.id = this.routeId
        this.fetchData()
      }
    },

    /**
     * 画面表示用の情報を取得します。
     */
    async fetchScreenData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 権限一覧を取得
        const response = await this.$axios.get('/permissions')

        // 画面に結果をセット
        this.permissionList = response.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * データを取得します
     */
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true

        // データを取得
        const response = await this.$axios.get(`/admin/roles/${this.id}`)
        this.setFetchedData(response.data)
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * 保存処理を行います。
     */
    async save () {
      try {
        // ローディングを設定
        this.isLoading = true

        /// 登録処理
        let response = null
        if (this.isNewMode) {
          response = await this.saveNew()

          // 完了メッセージを表示
          this.$store.dispatch('app/showSuccess', {
            message: 'messages.info.success',
            args: ['common.save']
          })
          this.$router.replace({
            name: 'ZAD0040-detail',
            params: { id: response.data.id }
          })
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
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    /**
     * 新規登録を行います
     */
    async saveNew () {
      // リクエストを作成
      const permissions = this.selectedPermissions.map((p) => p.permissionCd)
      const request = {
        roleName: this.roleName,
        description: this.description,
        permissions
      }

      // 登録処理
      return await this.$axios.post('/admin/roles/', request)
    },

    /**
     * 更新を行います
     */
    async saveUpdate () {
      // リクエストを作成
      const permissions = this.selectedPermissions.map((p) => p.permissionCd)
      const request = {
        id: this.id,
        roleNameTid: this.roleNameTid,
        roleName: this.roleName,
        descriptionTid: this.descriptionTid,
        description: this.description,
        isActive: this.isActive,
        permissions
      }

      return await this.$axios.patch(`/admin/roles/${this.id}`, request)
    },

    /**
     * 画面にレスポンス情報をセットする
     */
    setFetchedData (data) {
      this.id = data.id
      this.roleNameTid = data.roleNameTid
      this.roleName = data.roleName || {}
      this.descriptionTid = data.descriptionTid
      this.description = data.description || {}
      this.isActive = data.isActive

      // 権限テーブル選択をセット
      this.selectedPermissions = data.permissions
        .map(rp => {
          return this.permissionList.find((p) => p.permissionCd === rp)
        })
    }
  }
}
</script>
