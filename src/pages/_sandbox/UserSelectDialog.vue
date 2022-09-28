<template>
  <v-dialog v-model="isShowDialog" max-width="700px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">
        {{ label }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>ユーザー検索</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row dense class="py-2 align-center">
          <v-text-field
            v-model="keywords"
            append-icon="mdi-magnify"
            outlined
            hide-details
            dense
            clearable
            :placeholder="$t('common.keywords')"
            @keyup.enter="search"
            @click:append="search"
          ></v-text-field>
        </v-row>
        <v-data-table
          v-model="selectedUsers"
          :headers="headers"
          :items="users"
          show-select
          :items-per-page="-1"
          hide-default-footer
          fixed-header
          height="500px"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="select" class="mr-1">
          {{ $t('common.select') }}
        </v-btn>
        <v-btn color="secondary" text @click="cancel">
          {{ $t('common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    label: { type: String }
  },
  data () {
    return {
      isShowDialog: false,
      keywords: '',
      users: [],
      selectedUsers: []
    }
  },
  computed: {
    ...mapState('app', ['locale']),
    headers () {
      return [
        { text: this.$t('ZAD0050.userCd'), value: 'userCd' },
        { text: this.$t('ZAD0050.companyName'), value: 'companyName' },
        { text: this.$t('ZAD0050.userName'), value: 'userName' }
      ]
    }
  },
  watch: {
    isShowDialog () {
      this.users = []
      this.selectedUsers = []
      if (this.isShowDialog) {
        this.search()
      }
    }
  },
  methods: {
    search () {
      const users = []
      for (var i = 0; i < 100; i++) {
        users.push({
          id: i,
          userCd: `S${(i + 1).toString().padStart(4, '0')}`,
          companyName: 'エスツーアイ',
          userName: `User ${i + 1}`
        })
      }

      let filteredUsers = []
      const keywords = this.keywords
      if (keywords) {
        users.forEach(user => {
          if (user.userCd.indexOf(keywords) !== -1 ||
            user.companyName.indexOf(keywords) !== -1 ||
            user.userName.indexOf(keywords) !== -1) {
            filteredUsers.push(user)
          }
        })
      } else {
        filteredUsers = users
      }

      this.selectedUsers = []
      this.users = filteredUsers
    },
    select () {
      this.$emit('selected', this.selectedUsers)
      this.isShowDialog = false
    },
    cancel () {
      this.isShowDialog = false
    }
  }
}
</script>
