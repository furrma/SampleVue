<!-- VTextFieldを拡張したコンポーネント -->

<template>
  <validation-provider
    :vid="vid"
    :name="errorLabel || $attrs.label"
    :rules="rules"
    v-slot="{ errors }"
  >
    <v-select
      v-model="innerValue"
      :error-messages="errors"
      :label="label"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </validation-provider>
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
    // must be included in props
    value: {
      type: null
    },
    hideLabel: {
      type: Boolean,
      default: false
    },
    errorLabel: {
      type: String
    }
  },
  computed: {
    label () {
      return this.hideLabel ? undefined : this.$attrs.label
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    // Handles internal model changes.
    innerValue (newVal) {
      this.$emit('input', newVal)
    },
    // Handles external model changes.
    value (newVal) {
      this.innerValue = newVal
    }
  },
  created () {
    if (this.value) {
      this.innerValue = this.value
    }
  }
}
</script>
