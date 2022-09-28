<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">

          {{ $t("DAD0020.title") }}
        </div>
        <!-- パンくずリスト -->
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"/>
      </div>
    </div>

    <v-row align="stretch">
    <v-col cols="12" sm="6" md="6">
    <v-card >
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ $t("DAD0020.lunchOrderInfo") }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text >
              <!-- 注文日-->
              <a-label-text-field
              vid="orderDate"
              ref="orderDate"
              v-model="orderDate"
              rules="required"
              :disabled="true"
              :label="$t('DAD0020.orderDate')"
              outlined
              dense
              />
              <!-- 配膳先-->
              <a-label-select
              v-model="deliveryLocation"
              :items="deliveryLocationList"
              :label="$t('DAD0020.deliveryLocation')"
              @change="getLunchOrder"
              item-text="codeName"
              item-value="codeKey"
              outlined
              dense
              ></a-label-select>
              <!-- 弁当注文リスト-->
            <v-data-table
                :headers="headers"
                :items="lunchOrder"
                :loading="isLoading"
                class="flex-grow-1"
            >
            <!-- 注文数変更 -->
            <template v-slot:[`item.amount`]="props">
              <v-edit-dialog
                :return-value.sync="props.item.amount"
                large
              >
              {{ props.item.amount }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.amount"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            </v-data-table>
       </v-card-text>

        <v-card-actions>
              <!-- 保存ボタン -->
              <div class="mt-2">
                <v-btn
                  color="primary"
                  :disabled="invalid"
                  :loading="isLoading"
                  @click="save"
                >
                  {{ $t("common.save") }}
                </v-btn>
              </div>
          </v-card-actions>
        </validation-observer>
      </v-card>
    </v-col>

      <!-- メニュー表示-->
      <v-col  cols="12" sm="6" md="6" class="py-0">
      <v-card height="100%">
        <v-toolbar-title>{{ $t("DAD0020.menu") }}</v-toolbar-title>
          <v-card-text>
            <iframe width="100%" height="500"
            src="https://www.iwakyu.com/kondate/"
           />
          </v-card-text>
      </v-card>
      </v-col>
     </v-row>

    </div>
</template>

<script>
export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),

        complement: this.$t('DAD0020.title')
      }
    }
  },

  props: ['mode', 'routeId', 'routeDate'],

  data () {
    return {
      // 状態
      isLoading: false,

      // 配膳先コンボボックスデータ
      deliveryLocationList: [],
      deliveryLocation: '',
      // フォーム
      lunchOrder: [],
      orderDate: '',
      lunchNameTid: null,
      lunchId: null,
      amount: null,
      price: null
    }
  },

  computed: {
    breadcrumbs () {
      return [
        {
          text: this.$t('DAD0020.title'),
          to: { name: 'DAD0020' },
          exact: true
        },
        {
          text: this.$t('common.add')
        }
      ]
    },

    headers () {
      return [
        { text: this.$t('DAD0020.lunchName'), value: 'lunchName' },
        { text: this.$t('DAD0020.price'), value: 'price' },
        { text: this.$t('DAD0020.amount'), value: 'amount' }
      ]
    }
  },

  locale () {
    // 言語変更時は画面再描画
    this.refresh()
  },
  mounted () {
    this.refresh()
  },
  methods: {
    async refresh () {
      // 更新モードの場合は現在の登録情報を取得

      this.userId = this.routeId
      this.date = this.routeDate
      this.setFetchedData()
      this.fetchComboData()
    },

    async getLunchOrder () {
      this.fetchData()
    },

    // 画面表示用の情報を取得
    // データを取得
    async fetchData () {
      try {
        // ローディングを設定
        this.isLoading = true
        this.lunchOrder = []

        // クエリを作成
        const query = {}
        query.orderDate = this.date
        this.setFetchedData()
        const response = await this.$axios.get(`admin/lunchOrder/${this.userId}/${this.deliveryLocation}`, {
          params: query
        })
        this.lunchOrder = response.data
      } catch (error) {
        // エラーの場合は404ページに移動
        this.$router.replace({ name: 'error-not-found' })
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    // 配膳先コンボボックス取得
    async fetchComboData () {
      try {
        // ローディングを設定
        this.isSaveLoading = true
        this.isFetchScreenLoading = true

        // 画面表示用の情報を取得
        const query = {}
        query.isActive = true

        const codeQuery = {}
        codeQuery.isActive = true
        codeQuery.codeType = 'LOCATION'
        const [deliveryLocationList] = await Promise.all([
          this.$axios.get('codes', { params: codeQuery })
        ])

        // 画面に結果をセット
        this.deliveryLocationList = deliveryLocationList.data
      } catch (error) {
        // エラーメッセージを表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isSaveLoading = false
        this.isFetchScreenLoading = false
      }
    },

    async save () {
      try {
        // ローディングを設定
        this.isLoading = true

        // 登録処理
        let response = null
        response = await this.saveNew()

        // 完了メッセージを表示
        this.$store.dispatch('app/showSuccess', {
          message: 'messages.info.success',
          args: ['common.save']
        })

        this.setFetchedData(response.data)
      } catch (error) {
        // エラーメッセージ表示
        this.$setFormErrors(this.$refs.observer, error)
        this.$store.dispatch('app/catchError', error)
      } finally {
        // ローディングを解除
        this.isLoading = false
      }
    },

    // 保存ボタン処理
    async saveNew () {
      // リクエスト作成
      const request = {
        userId: this.userId,
        orderDate: this.orderDate,
        deliveryLocation: this.deliveryLocation,
        lunchOrder: this.lunchOrder
      }
      // 登録処理
      return await this.$axios.put(`admin/lunchOrder/${this.userId}/${this.orderDate}`, request)
    },

    // 画面に注文日をセットする
    setFetchedData () {
      this.orderDate = this.date
    }
  }
}
</script>
