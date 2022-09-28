<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ $t("ZAD0020.title") }}
        </div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
    </div>

    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("ZAD0020.organizationInfo") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <a-switch-active v-if="isActiveMode" v-model="isActive" />
        </v-toolbar>
        <v-card-text>
          <!-- 組織コード -->
          <a-label-text-field
            vid="organizationCd"
            ref="organizationCd"
            v-model="organizationCd"
            rules="required|max:10|alpha_num"
            :label="$t('ZAD0020.organizationCd')"
            class="w-half"
            :disabled="isEditMode"
            outlined
            dense
          />
          <!-- 組織区分 -->
          <a-label-select
            vid="organizationClassCd"
            ref="organizationClassCd"
            v-model="organizationClassCd"
            :items="classList"
            rules="required"
            item-text="organizationClassName"
            item-value="organizationClassCd"
            :label="$t('ZAD0020.organizationClassCd')"
            outlined
            dense
          />
          <!-- 会社 -->
          <a-label-select
            vid="companyCd"
            ref="companyCd"
            v-model="companyCd"
            :items="companyList"
            rules="required"
            item-text="companyName"
            item-value="companyCd"
            :label="$t('ZAD0020.companyCd')"
            outlined
            dense
          />
          <!-- 組織名 -->
          <a-label-translation-text-field-group
            vid="organizationNameTranslations"
            ref="organizationNameTranslations"
            v-model="organizationNameTranslations"
            rules="required|max:20"
            :label="$t('ZAD0020.organizationNameTranslations')"
            outlined
            dense
          />
          <!-- 親組織コード -->
          <a-label-select
            vid="organizationParentCd"
            ref="organizationParentCd"
            v-model="organizationParentCd"
            :items="parentList"
            rules="required"
            item-text="companyName"
            item-value="organizationParentCd"
            :label="$t('ZAD0020.organizationParentCd')"
            outlined
            dense
          />
          <!-- 組織長コード -->
          <a-label-select
            vid="organizationLeaderCd"
            ref="organizationLeaderCd"
            v-model="organizationLeaderCd"
            :items="leaderList"
            rules="required"
            item-text="organizationLeaderName"
            item-value="organizationLeaderCd"
            :label="$t('ZAD0020.organizationLeaderCd')"
            outlined
            dense
          />
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
        </v-card-text>
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
        complement: this.$t('ZAD0020.title')
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
          text: this.$t('ZAD0020.title'),
          to: { name: 'ZAD0020' },
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
        { text: this.$t('ZAD0020.permissionName'), value: 'permissionName' },
        { text: this.$t('ZAD0020.permissionCd'), value: 'permissionCd' }
      ]
    },
    isNewMode () {
      return this.mode === 'new'
    },
    isEditMode () {
      return this.mode === 'edit'
    },
    isActiveMode () {
      return true
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
        const response = await this.$axios.get(`/admin/organizations/${this.organizationId}`)
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
            name: 'ZAD0020-detail',
            params: { id: response.data.organizationId }
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
      return await this.$axios.post('/admin/organizations/', request)
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

      return await this.$axios.patch(`/admin/organizations/${this.organizationId}`, request)
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
