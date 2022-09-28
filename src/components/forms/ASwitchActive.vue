<template>
  <v-switch
    :input-value="value"
    :label="value? $t('common.active') : $t('common.disabled')"
    hide-details
    @change="change"
    inset
    dense
  />
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  methods: {
    change (value) {
      this.$emit('input', !!value)
    }
  }
}
</script>
