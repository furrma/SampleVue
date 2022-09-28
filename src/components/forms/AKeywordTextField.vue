<template>
  <v-text-field
    :value='value'
    @input="change"
    append-icon="mdi-magnify"
    outlined
    hide-details
    dense
    clearable
    :placeholder="$t('common.keywords')"
    @keyup.enter="search"
    @click:append="search"
  ></v-text-field>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    change (event) {
      this.$emit('input', event)
    },
    search () {
      this.$emit('search')
    }
  }
}
</script>
