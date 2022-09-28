<template>
  <div class="a-label-btn-toggle">
    <a-field-label>{{ $attrs.label }}</a-field-label>
      <a-btn-toggle
        :vid="vid"
        :value="value"
        :multiple="multiple"
        :mandatory="mandatory"
        :buttons="buttons"
        v-bind="$attrs"
        v-on="$listeners"
      />
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  props: {
    vid: {
      type: String,
      required: true
    },
    value: {
      type: String
    },
    mandatory: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // buttons: [{
    //   value: {
    //     type: String
    //   },
    //   label: {
    //     type: String
    //   },
    //   icon: {
    //     type: String
    //   }
    // }]
    buttons: {
      type: Array
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
