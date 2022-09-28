<template>
  <div class="a-label-text-field">
    <a-field-label>{{ $attrs.label }}</a-field-label>
    <a-text-field
      :vid="vid"
      :rules="rules"
      :value="value"
      v-bind="$attrs"
      v-on="$listeners"
      hide-label
    />
  </div>
</template>

<script>
export default {
  props: {
    vid: {
      type: String,
      required: true
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: null
    }
  }
}
</script>
