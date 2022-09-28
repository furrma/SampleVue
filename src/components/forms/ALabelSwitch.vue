<template>
  <div class="a-label-switch">
    <a-field-label>{{ label }}</a-field-label>
    <v-switch
      :input-value="value"
      :label="customLabel"
      @change="change"
      inset
      dense
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    trueLabel: {
      type: String,
      required: true
    },
    falseLabel: {
      type: String,
      required: true
    }
  },
  computed: {
    customLabel () {
      const valueLabel = this.value ? this.trueLabel : this.falseLabel
      return this.label + ' : ' + valueLabel
    }
  },
  methods: {
    change (value) {
      this.$emit('input', !!value)
    }
  }
}
</script>
