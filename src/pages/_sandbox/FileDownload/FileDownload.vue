<template>
  <v-card class="my-1">
    <validation-observer ref="observer" v-slot="{ invalid }">
    <v-toolbar dense flat>
      <v-toolbar-title>File Download</v-toolbar-title>
    </v-toolbar>
    <v-card-actions>
      <v-btn
        color="primary"
        :disabled="invalid"
        :loading="isCsvLoading"
        @click="downloadCsv"
      >
        CSVダウンロード
      </v-btn>
      <v-btn
        color="green"
        class="white--text"
        :disabled="invalid"
        :loading="isExcelLoading"
        @click="downloadExcel"
      >
      <v-icon>mdi-file-excel-outline</v-icon>
      Excelダウンロード
      </v-btn>
    </v-card-actions>
    </validation-observer>
  </v-card>
</template>

<script>
import contentDisposition from 'content-disposition'
import { saveAs } from 'file-saver'

export default {
  data () {
    return {
      isCsvLoading: false,
      isExcelLoading: false
    }
  },
  methods: {
    async downloadCsv () {
      try {
        this.isCsvLoading = true

        const response = await this.$axios.get('/samples/csv', {
          responseType: 'blob'
        })
        const blob = new Blob([response.data], {
          type: response.data.type
        })

        // ファイル名を取得
        const disposition = contentDisposition.parse(response.headers['content-disposition'])
        const fileName = disposition.parameters.filename

        // ファイルダウンロード
        saveAs(blob, fileName)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isCsvLoading = false
      }
    },
    async downloadExcel () {
      try {
        this.isExcelLoading = true

        const response = await this.$axios.get('/samples/excel', {
          responseType: 'blob'
        })
        const blob = new Blob([response.data], {
          type: response.data.type
        })

        // ファイル名を取得
        const disposition = contentDisposition.parse(response.headers['content-disposition'])
        const fileName = disposition.parameters.filename

        // ファイルダウンロード
        saveAs(blob, fileName)
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isExcelLoading = false
      }
    }
  }
}

// function getFileName (contentDisposition) {
//   let fileName = contentDisposition.substring(contentDisposition.indexOf("''") + 2,
//     contentDisposition.length
//   )
//   // デコードするとスペースが"+"になるのでスペースへ置換します
//   fileName = decodeURI(fileName).replace(/\+/g, ' ')

//   return fileName
// }
</script>
