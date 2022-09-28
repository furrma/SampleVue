<template>
<validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="save">
  <v-card class="mt-2">
    <v-toolbar dense flat>
      <v-toolbar-title>{{ $t('ZAD0050.associateCompanyInfo') }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pb-0">
      <!-- 協力会社情報ON/OFF -->
      <a-label-switch
        v-model="isInputAssociateCompanyInfo"
        :value="false"
        :label="$t('ZAD0050.isInputAssociateCompanyInfo.name')"
        :trueLabel="$t('ZAD0050.isInputAssociateCompanyInfo.true')"
        :falseLabel="$t('ZAD0050.isInputAssociateCompanyInfo.false')"
      />
    </v-card-text>
      <v-card-text v-if="isInputAssociateCompanyInfo">
        <v-expansion-panels
          class="mb-3"
          v-model="panel"
        >
        <v-expansion-panel>
          <v-expansion-panel-header>{{ $t("ZAD0050.associateCompanies") }}
            <v-spacer></v-spacer>
        <v-icon style="justify-content: right;" v-if="selectedAssociateCompany.length===0" color="error">
          mdi-alert-circle-outline
        </v-icon>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
      <!-- 協力会社テーブル -->
      <v-data-table
        v-model="selectedAssociateCompany"
        :items="associateCompanyList"
        :headers="associateCompanyTableHeaders"
        show-select
        single-select
        item-key="id"
        class="flex-grow-1"
      >
      <!-- 状態 -->
        <template v-slot:[`item.isActive`]="{ item }">
          <v-icon v-if="item.isActive" small color="success">
            mdi-check-circle
          </v-icon>
          <v-icon v-else small color="disable">
            mdi-circle-outline
          </v-icon>
        </template>
        <template v-slot:[`footer.prepend`]>
        <h3 v-if="selectedAssociateCompany.length===0" style="color: red;">{{ $t("ZAD0050.requiredMessage") }}</h3>
      </template>
      </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>

      <!-- 外注契約区分 -->
      <a-label-select
        vid="outsourcingContractClass"
        ref="outsourcingContractClass"
        v-model="outsourcingContractClass"
        :items="outsourcingContractClassList"
        :label="$t('ZAD0050.outsourcingContractClass')"
        item-text="codeName"
        item-value="codeKey"
        outlined
        dense
      />
      <!-- 外注職種区分 -->
      <a-label-select
        vid="outsourcingOccupationClass"
        ref="outsourcingOccupationClass"
        v-model="outsourcingOccupationClass"
        :items="outsourcingOccupationClassList"
        :label="$t('ZAD0050.outsourcingOccupationClass')"
        item-text="codeName"
        item-value="codeKey"
        outlined
        dense
      />
      <!-- 下限 -->
      <a-label-text-field
        vid="lowerLimitHour"
        ref="lowerLimitHour"
        v-model="lowerLimitHour"
        rules="numeric|max:5"
        :label="$t('ZAD0050.lowerLimitHour')"
        outlined
        dense
      />
      <!-- 上限 -->
      <a-label-text-field
        vid="upperLimitHour"
        ref="upperLimitHour"
        v-model="upperLimitHour"
        rules="numeric|max:5"
        :label="$t('ZAD0050.upperLimitHour')"
        outlined
        dense
      />
      <!-- 契約期限日付 -->
      <a-label-date-select
        vid="contractLimitDate"
        ref="contractLimitDate"
        v-model="contractLimitDate"
        :label="$t('ZAD0050.contractLimitDate')"
        outlined
        dense
      />
      <!-- 契約単価 -->
      <a-label-text-field
        vid="contractUnitPrice"
        ref="contractUnitPrice"
        v-model="contractUnitPrice"
        rules="numeric|max:10"
        :label="$t('ZAD0050.contractUnitPrice')"
        outlined
        dense
      />
      <!-- 固定費 -->
      <a-label-text-field
        vid="contractFixedCost"
        ref="contractFixedCost"
        v-model="contractFixedCost"
        rules="numeric|max:10"
        :label="$t('ZAD0050.contractFixedCost')"
        outlined
        dense
      />
      <!-- 備考 -->
      <a-label-text-field
        vid="remarks"
        ref="remarks"
        v-model="remarks"
        :label="$t('ZAD0050.remarks')"
        outlined
        dense
      />
      </v-card-text>
      <!-- 新規用ボタン -->
      <v-card-actions v-if="mode === 'new'">
        <v-btn color="grey lighten-2" :loading="isLoading" @click="previous">
          {{ $t("common.previous") }}
        </v-btn>
        <v-spacer></v-spacer>
      <v-btn color="primary" :loading="isLoading" :disabled="invalid || (isInputAssociateCompanyInfo && (!selectedAssociateCompany || selectedAssociateCompany.length===0))" @click="save">
        {{ $t("common.save") }}
      </v-btn>
    </v-card-actions>
    <!-- 編集用ボタン -->
    <v-card-actions v-else>
      <v-btn color="primary" :loading="isLoading" :disabled="invalid || (isInputAssociateCompanyInfo && (!selectedAssociateCompany || selectedAssociateCompany.length===0))" @click="save">
        {{ $t("common.save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
      </form>
</validation-observer>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      required: true
    },
    associateCompanyList: {
      type: Array,
      required: true
    },
    outsourcingContractClassList: {
      type: Array,
      required: true
    },
    outsourcingOccupationClassList: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      panel: []
    }
  },
  computed: {
    isNewMode () {
      return this.mode === 'new'
    },
    isEditMode () {
      return this.mode === 'edit'
    },
    selectedAssociateCompany: {
      get () {
        if (this.value.associateCompanyId) {
          return this.value.associateCompanyId
            .map(ac => { return this.associateCompanyList.find((c) => c.id === ac) })
        } else {
          return []
        }
      },
      set (selectedAssociateCompany) {
        const associateCompanyId = selectedAssociateCompany.map(c => c.id)
        this.updateValue({ associateCompanyId })
      }
    },
    outsourcingContractClass: {
      get () {
        return this.value.outsourcingContractClass
      },
      set (outsourcingContractClass) {
        this.updateValue({ outsourcingContractClass })
      }
    },
    outsourcingOccupationClass: {
      get () {
        return this.value.outsourcingOccupationClass
      },
      set (outsourcingOccupationClass) {
        this.updateValue({ outsourcingOccupationClass })
      }
    },
    lowerLimitHour: {
      get () {
        return this.value.lowerLimitHour
      },
      set (lowerLimitHour) {
        this.updateValue({ lowerLimitHour })
      }
    },
    upperLimitHour: {
      get () {
        return this.value.upperLimitHour
      },
      set (upperLimitHour) {
        this.updateValue({ upperLimitHour })
      }
    },
    contractLimitDate: {
      get () {
        return this.value.contractLimitDate
      },
      set (contractLimitDate) {
        this.updateValue({ contractLimitDate })
      }
    },
    contractUnitPrice: {
      get () {
        return this.value.contractUnitPrice
      },
      set (contractUnitPrice) {
        this.updateValue({ contractUnitPrice })
      }
    },
    contractFixedCost: {
      get () {
        return this.value.contractFixedCost
      },
      set (contractFixedCost) {
        this.updateValue({ contractFixedCost })
      }
    },
    remarks: {
      get () {
        return this.value.remarks
      },
      set (remarks) {
        this.updateValue({ remarks })
      }
    },
    isInputAssociateCompanyInfo: {
      get () {
        return this.value.isInputAssociateCompanyInfo
      },
      set (isInputAssociateCompanyInfo) {
        this.updateValue({ isInputAssociateCompanyInfo })
      }
    },
    associateCompanyTableHeaders () {
      return [
        { text: this.$t('ZAD0050.associateCompanyCd'), value: 'companyCd' },
        { text: this.$t('ZAD0050.associateCompanyName'), value: 'companyName' },
        { text: this.$t('ZAD0050.isActive'), value: 'isActive' }
      ]
    }
  },
  methods: {
    updateValue (diff) {
      this.$emit('input', { ...this.value, ...diff })
    },
    save () {
      if (this.isNewMode) {
        this.$emit('saveInStep')
      } else if (this.isEditMode) {
        this.$emit('saveInTab')
      }
    },
    previous () {
      this.$emit('previous')
    }
  }
}
</script>
