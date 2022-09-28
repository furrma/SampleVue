<template>
  <v-breadcrumbs :items="items" class="pa-0 py-2">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  }
}
</script>
