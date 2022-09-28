<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <a-text-field
        :value="dateDisplay"
        prepend-inner-icon="mdi-calendar"
        clearable
        readonly
        v-bind="mergeAttrs(attrs)"
        v-on="on"
        @click:clear="emitClear"
      />
    </template>
    <v-date-picker
      :value="date"
      @input="emitValue"
      locale="ja-jp"
      scrollable
      :day-format="(d) => new Date(d).getDate()"
      :type="type"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import moment from 'moment'

/**
 * 日付入力用のコンポーネントです。
 */
export default {
  props: {
    value: {
      type: String
    },
    type: {
      type: String,
      default: 'date'
    }
  },
  data: () => ({
    menu: false
  }),
  computed: {
    date () {
      return this.value || new Date().toISOString().substr(0, 10)
    },
    dateDisplay () {
      if (this.type !== 'month') {
        return this.value ? moment(this.value).format('YYYY/MM/DD') : ''
      } else {
        return this.value ? moment(this.value).format('YYYY/MM') : ''
      }
    }
  },
  methods: {
    mergeAttrs (attrs) {
      return {
        ...this.$attrs,
        ...attrs
      }
    },
    emitValue (value) {
      this.$emit('input', value)
      this.menu = false
    },
    emitClear () {
      this.$emit('input', null)
    }
  }
}
</script>
