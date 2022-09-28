<template>
  <div class="d-flex flex-column flex-grow-1">
    <file-download />
    <file-upload />
  </div>
</template>

<script>
import FileDownload from './FileDownload/FileDownload.vue'
import FileUpload from './FileUpload/FileUpload.vue'

export default {
  components: {
    FileDownload,
    FileUpload
  },
  head: {
    title () {
      return {
        complement: this.$t('menu.sandbox'),
        inner: this.$t('app.productName')
      }
    }
  }
}
</script>
