<template>
  <div class="a-translation-text-field-group">
    <a-field-label>{{ $attrs.label }}</a-field-label>
    <template v-for="(item) in availableLocales">
      <a-text-field
        :key="item.id"
        :vid="vid + '.' + item.code"
        :rules="rules"
        :value="value[item.code]"
        :error-label="$attrs.label + '(' + item.label + ')'"
        v-bind="$attrs"
        :label="item.label"
        @input="updateValue(item.code, $event)"
      />
    </template>
  </div>
</template>

<script>
const availableLocales = [{
  code: 'ja',
  label: '日本語'
}, {
  code: 'en',
  label: 'English'
}]

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
  },
  computed: {
    availableLocales () {
      return availableLocales
    }
  },
  methods: {
    updateValue (key, value) {
      const newValue = {
        ...this.value
      }
      newValue[key] = value
      this.$emit('input', newValue)
    }
  }
}
</script>
