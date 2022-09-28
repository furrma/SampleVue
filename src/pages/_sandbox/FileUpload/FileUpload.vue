<template>
  <v-card class="my-1">
    <validation-observer ref="observer" v-slot="{ invalid }">
    <v-toolbar dense flat>
      <v-toolbar-title>File Upload</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-file-input
        v-model="file"
        accept=".csv"
        label="CSVファイル"
        outlined
        dense
        :prepend-icon="null"
        prepend-inner-icon="$file"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        :disabled="invalid"
        :loading="isLoading"
        @click="uploadCsv"
      >
        CSVアップロード
      </v-btn>
    </v-card-actions>
    </validation-observer>
  </v-card>
</template>

<script>
import FormData from 'form-data'

export default {
  data () {
    return {
      isLoading: false,
      file: null
    }
  },
  methods: {
    async uploadCsv () {
      try {
        this.isLoading = true

        const formData = new FormData()
        formData.append('fileName', 'test.csv')
        formData.append('file', this.file)

        await this.$axios.post('/samples/csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // 完了メッセージを表示
        this.$store.dispatch('app/showSuccess', {
          message: 'messages.info.success',
          args: ['common.save']
        })
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    }
  }
}
</script>
