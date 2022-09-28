<template>
  <div class="a-label-number-field">
    <a-field-label>{{ $attrs.label }}</a-field-label>
    <validation-provider
    :vid="vid"
    :name="errorLabel || $attrs.label"
    :rules="rules"
    v-slot="{ errors }"
  >
    <v-text-field
      v-bind="$attrs"
      :value="innerValue"
      :type="type"
      :label="innerLabel"
      v-on="listeners"
      :error-messages="errors"
      @focusin="edit"
      @focusout="display"
    >
      <template v-for="(value, name) in $slots" v-slot:[name]>
        <slot :name="name"/>
      </template>
    </v-text-field>
    </validation-provider>
  </div>
</template>

<script>
export default {
  name: 'ALabelNumberField',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: null
    },
    innerLabel: {
      type: String,
      default: ''
    },
    rules: {
      type: [Object, String],
      default: ''
    }
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {
    listeners () {
      const vm = this
      return {
        ...vm.$listenres,
        input: event => (vm.innerValue = event)
      }
    },
    innerValue: {
      get () {
        if (this.editing) {
          return this.value != null ? this.value.toString() : ''
        } else {
          return this.value != null ? this.value.toLocaleString() : ''
        }
      },
      set (newValue) {
        const value = newValue.length > 0 ? Number(newValue) : null
        this.$emit('input', value)
      }
    },
    type () {
      if (this.editing) {
        return 'number'
      } else {
        return 'text'
      }
    }
  },
  methods: {
    display () {
      this.editing = false
    },
    edit () {
      this.editing = true
    }
  }
}
</script>

<style>
</style>
