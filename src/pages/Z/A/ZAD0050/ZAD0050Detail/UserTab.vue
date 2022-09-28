<template>
<validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submitEvent">
  <v-card class="mt-2">
    <v-toolbar dense flat>
      <v-toolbar-title>{{ $t('ZAD0050.userInfo') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <a-switch-active v-if="isEditMode" v-model="isActive" />
    </v-toolbar>
    <v-card-text>
      <!-- ユーザーCD -->
      <a-label-text-field
        vid="userCd"
        ref="userCd"
        v-model="userCd"
        rules="required|max:20"
        :label="$t('ZAD0050.userCd')"
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
        :label="$t('ZAD0050.companyCd')"
        outlined
        dense
      />
      <!-- 社員番号 -->
      <a-label-text-field
        vid="employeeNo"
        ref="employeeNo"
        v-model="employeeNo"
        rules="max:10"
        :label="$t('ZAD0050.employeeNo')"
        outlined
        dense
      />
      <!-- ユーザー名 -->
      <a-label-text-field
        vid="userName"
        ref="userName"
        v-model="userName"
        rules="required|max:255"
        :label="$t('ZAD0050.userName')"
        outlined
        dense
      />
      <!-- ユーザー名(英) -->
      <a-label-text-field
        vid="userNameEn"
        ref="userNameEn"
        v-model="userNameEn"
        rules="required|max:255"
        :label="$t('ZAD0050.userNameEn')"
        outlined
        dense
      />
      <!-- 生年月日 -->
      <a-label-date-select
        vid="birthday"
        ref="birthday"
        v-model="birthday"
        :label="$t('ZAD0050.birthday')"
        outlined
        dense
      />
      <!-- パスワード（新規登録の場合のみ表示-->
      <a-label-text-field
        v-if="isNewMode"
        vid="password"
        ref="password"
        v-model="password"
        rules="required|max:255"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :label="$t('ZAD0050.password')"
        outlined
        dense
        @click:append="showPassword = !showPassword"
      />
      <!-- メールアドレス -->
      <a-label-text-field
        vid="email"
        ref="email"
        v-model="email"
        rules="required|email|max:255"
        :label="$t('ZAD0050.email')"
        outlined
        dense
      />
      <!-- 職種区分 -->
      <a-label-select
        vid="occupationClass"
        ref="occupationClass"
        v-model="occupationClass"
        :items="occupationClassList"
        :label="$t('ZAD0050.occupationClass')"
        item-text="codeName"
        item-value="codeKey"
        outlined
        dense
      />
      <!-- 入社年月日 -->
      <a-label-date-select
        vid="initiationDate"
        ref="initiationDate"
        v-model="initiationDate"
        :label="$t('ZAD0050.initiationDate')"
        outlined
        dense
      />
      <!-- 在籍状況 -->
      <a-label-switch
        v-model="isEnrolled"
        :label="$t('ZAD0050.isEnrolled.name')"
        :trueLabel="$t('ZAD0050.isEnrolled.true')"
        :falseLabel="$t('ZAD0050.isEnrolled.false')"
      />
      <!-- 所在地 -->
      <a-label-select
        vid="location"
        ref="location"
        v-model="location"
        :items="locationList"
        :label="$t('ZAD0050.location')"
        item-text="codeName"
        item-value="codeKey"
        outlined
        dense
      />
      <!-- 内線番号 -->
      <a-label-text-field
        vid="extensionNo"
        ref="extensionNo"
        v-model="extensionNo"
        rules="max:10"
        :label="$t('ZAD0050.extensionNo')"
        outlined
        dense
      />
      <v-expansion-panels
        v-model="panel"
        multiple
      >
      <!-- 組織 -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            {{ $t("ZAD0050.affiliationOrganizations") }}
          </div>
          <div class="d-flex flex-grow-1">
            <label v-for="item in selectedOrganizations" :key="item.organizationId">
              {{ item.organizationName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
          </div>
          <!-- 必須いらないらしいのでコメントアウト -->
        <!-- <v-spacer></v-spacer>
        <v-icon style="justify-content: right;" v-if="selectedOrganizations.length===0" color="error">
          mdi-alert-circle-outline
        </v-icon> -->
        </v-expansion-panel-header>
        <v-expansion-panel-content>
      <v-card-text>
          <v-data-table
            v-model="selectedOrganizations"
            :items="organizationList"
            :headers="organizationTableHeaders"
            show-select
            multiple
            item-key="organizationId"
            class="flex-grow-1"
          >
      <!-- <template v-slot:[`footer.prepend`]>
        <h3 v-if="selectedOrganizations.length===0" style="color: red;">{{ $t("ZAD0050.requiredMessage") }}</h3>
      </template> -->
          </v-data-table>
      </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>

    <!-- ロール -->
    <v-expansion-panel>
      <v-expansion-panel-header>{{ $t("ZAD0050.ownedRoles") }}
        <!-- 必須いらないらしいのでコメントアウト -->
        <!-- <v-spacer></v-spacer>
        <v-icon style="justify-content: right;" v-if="selectedRoles.length===0" color="error">
          mdi-alert-circle-outline
        </v-icon> -->
      </v-expansion-panel-header>
      <v-expansion-panel-content>
    <v-card-text>
      <v-data-table
        v-model="selectedRoles"
        :items="roleList"
        :headers="roleTableHeaders"
        show-select
        item-key="id"
        class="flex-grow-1"
        style="border-collase: collapse; width: 100%; border-color: red; border: 1px;"
      >
      <!-- <template v-slot:[`footer.prepend`]>
        <h3 v-if="selectedRoles.length===0" style="color: red;">{{ $t("ZAD0050.requiredMessage") }}</h3>
      </template> -->
      </v-data-table>
    </v-card-text>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- システム制御 -->
    <v-expansion-panel>
      <v-expansion-panel-header>{{ $t("ZAD0050.systemControl") }}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card-text>
          <!-- 勤怠入力不要フラグ -->
          <a-label-switch
            v-model="isUnnecessaryInputAttendance"
            :label="$t('ZAD0050.isUnnecessaryInputAttendance.name')"
            :trueLabel="$t('ZAD0050.isUnnecessaryInputAttendance.true')"
            :falseLabel="$t('ZAD0050.isUnnecessaryInputAttendance.false')"
          />
          <v-divider></v-divider>
          <!-- 工数入力不要フラグ -->
          <a-label-switch
            v-model="isUnnecessaryInputManHours"
            :label="$t('ZAD0050.isUnnecessaryInputManHours.name')"
            :trueLabel="$t('ZAD0050.isUnnecessaryInputManHours.true')"
            :falseLabel="$t('ZAD0050.isUnnecessaryInputManHours.false')"
          />
          <v-divider></v-divider>
          <!-- AD認証フラグ -->
          <a-label-switch
            v-model="isAdAccount"
            :label="$t('ZAD0050.isAdAccount.name')"
            :trueLabel="$t('ZAD0050.isAdAccount.true')"
            :falseLabel="$t('ZAD0050.isAdAccount.false')"
          />
          <!-- 管理者フラグ -->
          <a-label-switch
            v-model="isAdmin"
            :label="$t('ZAD0050.isAdmin.name')"
            :trueLabel="$t('ZAD0050.isAdmin.true')"
            :falseLabel="$t('ZAD0050.isAdmin.false')"
          />
        </v-card-text>
      </v-expansion-panel-content>
    </v-expansion-panel>
      </v-expansion-panels>
      </v-card-text>
    <!-- 新規用ボタン -->
    <v-card-actions v-if="mode === 'new'">
      <v-spacer></v-spacer>
      <v-btn color="primary" class="mt-2" :loading="isLoading" :disabled="invalid" type="submit">
        {{ $t("common.next") }}
      </v-btn>
    </v-card-actions>
    <!-- 編集用ボタン -->
    <v-card-actions v-else>
      <v-btn color="primary" class="mt-2" :loading="isLoading" :disabled="invalid" type="submit">
        {{ $t("common.save") }}
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- 他操作エクスパンションパネル -->
  <v-expansion-panels v-if="isEditMode && !isAdAccount" v-model="dangerPanel" class="mt-2">
    <v-expansion-panel>
      <v-expansion-panel-header> {{ $t("ZAD0050.otherActions") }} </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="warning--text title">Warning Zone</div>
        <v-card flat outlined class="card-warning">
          <v-card-text>
            <div class="d-flex rounded-lg">
              <div class="d-flex justify-center align-center">
                <div class="subtitle">
                  {{ $t("ZAD0050.resetPasswordDescription") }}
                </div>
              </div>
            </div>
            <!-- パスワードリセット -->
            <v-btn outlined color="warning" class="mt-2" @click="confirmDialog = true">
              <v-icon>mdi-lock-reset</v-icon>
              {{ $t("ZAD0050.resetPassword") }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

  <!-- パスワードリセット確認ダイアログ -->
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title>{{ $t("ZAD0050.resetPasswordConfirmTitle") }}</v-card-title>
      <v-card-text>{{ $t("ZAD0050.resetPasswordConfirmSentence") }}</v-card-text>
      <v-card-actions>
        <v-btn width="49%" outlined color="secondary" @click="confirmDialog = false">{{ $t("common.cancel") }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn width="49%" color="warning" :loading="isResetLoading" @click="resetPassword">{{ $t("common.ok") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 新パスワード表示ダイアログ -->
  <v-dialog v-model="showNewPasswordDialog" max-width="400">
    <v-card>
      <v-card-title>{{ $t("ZAD0050.resetPasswordCompleteTitle") }}</v-card-title>
      <v-card-text>{{ $t("ZAD0050.resetPasswordCompleteSentence") }}</v-card-text>
      <v-card-text class="text-center" style="font-size: 1em;">{{ newPassword }}</v-card-text>
      <v-card-actions>
        <v-btn width="99%" color="primary" @click="showNewPasswordDialog = false">{{ $t("common.ok") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
      </form>
</validation-observer>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      required: true
    },
    companyList: {
      type: Array,
      required: true
    },
    occupationClassList: {
      type: Array,
      required: true
    },
    locationList: {
      type: Array,
      required: true
    },
    roleList: {
      type: Array,
      required: true
    },
    organizationList: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: false
    },
    isResetLoading: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      // 状態
      showPassword: false,
      panel: [],
      dangerPanel: []
      // confirmDialog: false,
      // showNewPasswordDialog: false
    }
  },
  computed: {
    isNewMode () {
      return this.mode === 'new'
    },
    isEditMode () {
      return this.mode === 'edit'
    },
    userCd: {
      get () {
        console.log(this.value)
        return this.value.userCd
      },
      set (userCd) {
        this.updateValue({ userCd })
      }
    },
    companyCd: {
      get () {
        return this.value.companyCd
      },
      set (companyCd) {
        this.updateValue({ companyCd })
      }
    },
    employeeNo: {
      get () {
        return this.value.employeeNo
      },
      set (employeeNo) {
        this.updateValue({ employeeNo })
      }
    },
    userName: {
      get () {
        return this.value.userName
      },
      set (userName) {
        this.updateValue({ userName })
      }
    },
    userNameEn: {
      get () {
        return this.value.userNameEn
      },
      set (userNameEn) {
        this.updateValue({ userNameEn })
      }
    },
    birthday: {
      get () {
        return this.value.birthday
      },
      set (birthday) {
        this.updateValue({ birthday })
      }
    },
    password: {
      get () {
        return this.value.password
      },
      set (password) {
        this.updateValue({ password })
      }
    },
    email: {
      get () {
        return this.value.email
      },
      set (email) {
        this.updateValue({ email })
      }
    },
    occupationClass: {
      get () {
        return this.value.occupationClass
      },
      set (occupationClass) {
        this.updateValue({ occupationClass })
      }
    },
    initiationDate: {
      get () {
        return this.value.initiationDate
      },
      set (initiationDate) {
        this.updateValue({ initiationDate })
      }
    },
    isEnrolled: {
      get () {
        return this.value.isEnrolled
      },
      set (isEnrolled) {
        this.updateValue({ isEnrolled })
      }
    },
    location: {
      get () {
        return this.value.location
      },
      set (location) {
        this.updateValue({ location })
      }
    },
    extensionNo: {
      get () {
        return this.value.extensionNo
      },
      set (extensionNo) {
        this.updateValue({ extensionNo })
      }
    },
    isActive: {
      get () {
        return this.value.isActive
      },
      set (isActive) {
        this.updateValue({ isActive })
      }
    },
    selectedRoles: {
      get () {
        if (this.value.roles) {
          return this.value.roles
            .map(ur => { return this.roleList.find((r) => r.id === ur) })
        } else {
          return []
        }
      },
      set (selectedRoles) {
        const roles = selectedRoles.map(r => r.id)
        this.updateValue({ roles })
      }
    },
    selectedOrganizations: {
      get () {
        if (this.value.organizations) {
          return this.value.organizations
            .map(uo => { return this.organizationList.find((o) => o.organizationId === uo) })
        } else {
          return []
        }
      },
      set (selectedOrganizations) {
        const organizations = selectedOrganizations.map(o => o.organizationId)
        for (var i = 0; i < selectedOrganizations.length; i++) {
          if (organizations.indexOf(selectedOrganizations[i].parentOrganizationId) === -1 && selectedOrganizations[i].parentOrganizationId !== null) {
            organizations.push(selectedOrganizations[i].parentOrganizationId)
          }
        }
        this.updateValue({ organizations })
      }
    },
    isUnnecessaryInputAttendance: {
      get () {
        return this.value.isUnnecessaryInputAttendance
      },
      set (isUnnecessaryInputAttendance) {
        this.updateValue({ isUnnecessaryInputAttendance })
      }
    },
    isUnnecessaryInputManHours: {
      get () {
        return this.value.isUnnecessaryInputManHours
      },
      set (isUnnecessaryInputManHours) {
        this.updateValue({ isUnnecessaryInputManHours })
      }
    },
    isAdAccount: {
      get () {
        return this.value.isAdAccount
      },
      set (isAdAccount) {
        this.updateValue({ isAdAccount })
      }
    },
    isAdmin: {
      get () {
        return this.value.isAdmin
      },
      set (isAdmin) {
        this.updateValue({ isAdmin })
      }
    },
    newPassword: {
      get () {
        return this.value.newPassword
      }
    },
    confirmDialog: {
      get () {
        return this.value.confirmDialog
      },
      set (confirmDialog) {
        this.updateValue({ confirmDialog })
      }
    },
    showNewPasswordDialog: {
      get () {
        return this.value.showNewPasswordDialog
      },
      set (showNewPasswordDialog) {
        this.updateValue({ showNewPasswordDialog })
      }
    },
    roleTableHeaders () {
      return [{ text: this.$t('ZAD0050.role'), value: 'roleName' }]
    },
    organizationTableHeaders () {
      return [
        { text: this.$t('ZAD0050.organizationCds'), value: 'organizationCd' },
        { text: this.$t('ZAD0050.organizationNames'), value: 'organizationName' }
      ]
    }
  },
  methods: {
    updateValue (diff) {
      this.$emit('input', { ...this.value, ...diff })
    },
    submitEvent () {
      if (this.mode === 'new') {
        this.$emit('next')
      } else {
        this.$emit('save')
      }
    },
    resetPassword () {
      this.$emit('resetPassword')
    }
  }
}
</script>

<style scoped>
.card-warning {
  border-color: #ffd166;
}
</style>
