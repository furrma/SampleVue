<template>
  <v-btn-toggle :value="value" @change="change" mandatory dense>
    <v-btn :value="ACTIVE">
      {{ $t("common.active") }}
    </v-btn>
    <v-btn :value="DISABLED">
      {{ $t("common.disabled") }}
    </v-btn>
    <v-btn :value="ALL">
      {{ $t("common.all") }}
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import ToggleActiveValue from '../../constants/ToggleActiveValue'

export default {
  props: {
    value: {
      type: String
    }
  },
  computed: {
    ACTIVE () {
      return ToggleActiveValue.ACTIVE
    },
    DISABLED () {
      return ToggleActiveValue.DISABLED
    },
    ALL () {
      return ToggleActiveValue.ALL
    }
  },
  methods: {
    change (event) {
      this.$emit('input', event)
    }
  }
}
</script>
