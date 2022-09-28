<template>
  <v-btn-toggle
    :value="value"
    @change="change"
    :mandatory="mandatory"
    :multiple="multiple"
    dense
  >
    <v-btn v-for="item in buttons" :key="item.value" :value="item.value">
      <v-icon v-if="item.icon" small> {{item.icon}} </v-icon>
      {{ item.label }}
    </v-btn>
  </v-btn-toggle>
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
    change (event) {
      this.$emit('input', event)
    }
  }
}
</script>
