<template>
  <validation-provider
    :vid="vid"
    :name="errorLabel || $attrs.label"
    :rules="rules"
    v-slot="{ errors }"
    >
          <!-- ユーザー検索コンポーネント -->
            <v-autocomplete
              v-model="userData"
              :error-messages="errors"
              :vid="vid"
              :disabled="isDisable"
              :items="userDatas"
              chips
              :label="displayedLabel"
              item-text="searchableText"
              item-value="userId"
              :multiple="isMultiple"
              :loading="isLoading"
              @change="changeEvent"
            >
              <!-- 検索枠のユーザーの表示 -->
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :close="isMultiple"
                  @click:close="remove(data.item)"
                >
                  <!-- 顔写真 -->
                  <v-avatar v-if="isDisplayUserIcon" left>
                    <v-img :src="data.item.userIcon"></v-img>
                  </v-avatar>

                  {{ data.item.userName }}
                </v-chip>
              </template>

              <!-- サジェストとして表示する項目 -->
              <template v-slot:item="data">
                <!-- 顔写真 -->
                <v-list-item-avatar v-if="isDisplayUserIcon">
                  <img :src="data.item.userIcon">
                </v-list-item-avatar>

                <!-- ユーザー名と、ユーザー情報 -->
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.userName"></v-list-item-title>
                  <v-list-item-subtitle v-if="isDisplayUserInfo"
                    v-html="data.item.companyName + '&ensp;&ensp;&ensp;&ensp;' + data.item.organizationCd + '&ensp;&ensp;&ensp;&ensp;' + data.item.employeeNo + '&ensp;&ensp;&ensp;&ensp;&ensp;' + data.item.userNameEn + '&ensp;&ensp;&ensp;&ensp;&ensp;' + data.item.email">
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>

            </v-autocomplete>
  </validation-provider>

</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    // ユーザーの初期表示値のリスト
    displayedUserIds: Array,
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
    // ユーザーアイコン(顔写真)を表示するか
    isDisplayUserIcon: {
      type: Boolean,
      default: false
    },
    // 会社コードによるユーザーの絞り込みリスト
    filterCompanyCds: {
      type: Array,
      default: () => (new Array(0))
    },
    // 組織IDによるユーザーの絞り込みリスト
    filterOrganizationIds: {
      type: Array,
      default: () => (new Array(0))
    },
    // ロールIDによるユーザーの絞り込みリスト
    filterRoleIds: {
      type: Array,
      default: () => (new Array(0))
    },
    // 非アクティブユーザーを含むかどうか
    isIncludeInactiveUser: {
      type: Boolean,
      default: false
    },
    // フィールドタイトル
    displayedLabel: {
      type: String,
      default: 'ユーザー'
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    vid: {
      type: String,
      required: true
    },
    // ユーザー詳細の表示の有無
    isDisplayUserInfo: {
      type: Boolean,
      default: true
    }
  },

  head: {
  },
  data () {
    return {
      userData: null,
      userDatas: [
        // テストデータ
        // { userId: 220, userName: '中島 大輝', userNameEn: 'Daiki Nakashima', userCd: 'd.nakashima', companyName: 'エスツーアイ株式会社', organizationCd: '42T', employeeNo: '0220', userIcon: '/images/avatars/avatar15.svg', searchableText: '中島大輝&DaikiNakashima&d.nakashima&エスツーアイ株式会社&42T&0220' },
        // { userId: 113, userName: '槇林 亮平', userNameEn: 'Ryohei Makibayashi', userCd: 'r.makibayashi', companyName: 'エスツーアイ株式会社', organizationCd: '42T', employeeNo: '0113', userIcon: '/images/avatars/avatar20.svg', searchableText: '槇林亮平&RyoheiMakibayashi&r.makibayashi&エスツーアイ株式会社&42T&0113' },
        // { userId: 181, userName: '中村 条光', userNameEn: 'Joko Nakamura', userCd: 'j.nakamura', companyName: 'エスツーアイ株式会社', organizationCd: '31T', employeeNo: '0181', userIcon: '/images/avatars/avatar21.svg', searchableText: '中村条光&JokoNakamura&j.nakamura&エスツーアイ株式会社&31T&0181' },
        // { userId: 199, userName: '安藤 吉貴', userNameEn: 'Yoshiki Ando', userCd: 'y.ando', companyName: 'エスツーアイ株式会社', organizationCd: '12T', employeeNo: '0199', userIcon: '/images/avatars/avatar22.svg', searchableText: '安藤吉貴&YoshikiAndo&y.ando&エスツーアイ株式会社&12T&0199' },
        // { userId: 208, userName: '横井 健章', userNameEn: 'Kensho Yokoi', userCd: 'k.yokoi', companyName: 'エスツーアイ株式会社', organizationCd: '32T', employeeNo: '0208', userIcon: '/images/avatars/avatar12.svg', searchableText: '横井健章&KenshoYokoik.yokoi&エスツーアイ株式会社&32T&0208' },
        // { userId: 215, userName: '曽我 周平', userNameEn: 'Shuhei Soga', userCd: 's.soga', companyName: 'エスツーアイ株式会社', organizationCd: '11T', employeeNo: '0215', userIcon: '/images/avatars/avatar13.svg', searchableText: '曽我周平&ShuheiSoga&s.soga&エスツーアイ株式会社&11T&0215' },
        // { userId: 95, userName: '水野 伸一', userNameEn: 'Shinichi Mizuno', userCd: 's.mizuno', companyName: 'エスツーアイ株式会社', organizationCd: '20G', employeeNo: '0095', userIcon: '/images/avatars/avatar14.svg', searchableText: '水野伸一&ShinichiMizuno&s.mizuno&エスツーアイ株式会社&20G&0095' }
      ],
      returnData: [],

      // ユーザーアイコンがない場合、ここからランダムにアイコンを取得するためのリスト
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
      ],
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

    // 表示するユーザーのIDがあれば、データをセットする。
    if (this.isMultiple) {
      this.userData = this.displayedUserIds
    } else {
      this.userData = this.displayedUserIds[0]
    }
  },
  watch: {
    // v-modelのuserDataに変更があれば、親コンポーネントにデータを返す。
    userData () {
      var userList = []
      if (Array.isArray(this.userData)) {
        for (let i = 0; i < this.userData.length; i++) {
          userList.push(this.getUserData(this.userData[i]))
        }
      } else {
        userList.push(this.getUserData(this.userData))
      }
      this.returnData = userList
      this.$emit('selected', this.returnData)
    },
    // 親画面の検索処理よりコンポーネントのmountedが先に終了し、初期IDを表示できない為、監視する。
    displayedUserIds (newDisplayedUserIds) {
      if (this.isMultiple) {
        this.userData = newDisplayedUserIds
      } else {
        this.userData = newDisplayedUserIds[0]
      }
    }
  },
  methods: {
    // 選択しているユーザーを除外する処理する。
    remove (item) {
      if (this.isMultiple) {
        const index = this.userData.indexOf(item.userId)

        if (index >= 0) this.userData.splice(index, 1)
      }
    },
    // 親コンポーネントに返す値を作成する。(ユーザーのIDから、ユーザーの情報を取得する処理)
    getUserData (userId) {
      for (let i = 0; i < this.userDatas.length; i++) {
        if (this.userDatas[i].userId === userId) {
          const userInfo = {
            userId: userId,
            userName: this.userDatas[i].userName,
            userNameEn: this.userDatas[i].userNameEn,
            userCd: this.userDatas[i].userCd,
            employeeNo: this.userDatas[i].employeeNo
          }
          return userInfo
        }
      }
      const unknownUserInfo = {
        userId: userId,
        userName: '',
        userNameEn: '',
        userCd: '',
        employeeNo: ''
      }
      return unknownUserInfo
    },
    // ユーザーアイコンをランダムに取得する処理する。
    getRandomIcon () {
      return this.iconList[Math.floor(Math.random() * this.iconList.length)]
    },
    // GETリクエストの実行を行う
    async request () {
      try {
        this.userDatas = []
        this.isLoading = true

        // クエリを作成
        const query = {}
        if (this.filterCompanyCds.length) {
          query.companyCds = this.filterCompanyCds.join()
        }
        if (this.filterOrganizationIds.length) {
          query.organizationIds = this.filterOrganizationIds.join()
        }
        if (this.filterRoleIds.length) {
          query.roleIds = this.filterRoleIds.join()
        }
        if (!this.isIncludeInactiveUser) {
          query.isActive = true
        }

        // データ取得
        const response = await this.$axios.get('/users/autocomplete', {
          params: query
        })
        this.userDatas = response.data
        for (let i = 0; i < this.userDatas.length; i++) {
          if (!this.userDatas[i].userIcon) {
            this.userDatas[i].userIcon = this.getRandomIcon()
          }
        }
      } catch (error) {
        // エラーメッセージを表示する。
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        this.isLoading = false
      }
    },

    changeEvent () {
      this.$emit('change')
    }

  }
}
</script>
