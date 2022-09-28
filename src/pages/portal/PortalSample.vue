<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <!-- 画面タイトル -->
        <div class="display-1">
          {{ "ダッシュボード外部リンクサンプル" }}
        </div>
        <!-- パンくずリスト -->
        <a-breadcrumbs :items="breadcrumbs" />
      </div>
        <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="descriptionDialog = true"
          >
          {{ "説明" }}
          </v-btn>
          <v-dialog
            v-model="descriptionDialog"
          >
          <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title>{{ "説明" }}</v-toolbar-title>
          <v-divider></v-divider>
        </v-toolbar>
        <v-card-text>
          {{ "外部リンクサンプルです。現ポータルサイトのように、リンクを画面に散りばめられるとcssのコードをDBに保存する必要があって面倒くさいと考えてます。" }}<br>
          {{ "であれば、リストを使ってその順にDBへ登録すればCSSコードを保存する必要がないし、順番も保持出来そう、というイメージです。" }}
          {{ "右下のボタンからリンクの追加が可能です。" }}<br>
          {{ "画像も登録してもらうことで、左側に画像を表示してもらうことができます。" }}<br>
          {{ "空白時は適当なアイコンを出してればいいのでは、と考えてます。" }}<br>
          <br>
          {{ "ボタンについては試験的に追尾型のフローティングアクションボタンを使用しているだけです。" }}<br>
          {{ "邪魔ならカードの右上にくっつけとく形で問題ないかな、と考えてます。" }}<br>
          {{ "多分順番入れ替えたい、という要望も出てきそうなのでvue-draggableというプラグインでできないかな？と考えてます。" }}<br>
          <strong>{{ "あと、画像についてはまだ実装してません！！ごめんなさい！！！" }}</strong>
        </v-card-text>
      </v-card>
      </v-dialog>
    </div>

    <!-- 外部リンクデザインサンプル(曽我) -->
    <div class="my-2 d-flex">
      <template v-for="(item, index) in favorites">
        <v-card
            :key="index"
            class="mx-auto"
            max-width="400"
            outlined
            hover
            @click="jumpToTheLink(item.link)"
          >
              <v-list-item two-line>
                <v-list-item-avatar tile size="60">
                  <v-img :src="item.image" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-overline mb-1">
                    外部リンク
                  </div>
                  <v-list-item-title class="text-h5 mb-1">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="update(index)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click.stop="deleteItem(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
          </v-card>
      </template>
    </div>

    <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title>{{ "外部リンク" }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-list two-line>
      <v-list-item-group
        v-model="selected"
      >
      <template v-for="(item, index) in favorites">
        <v-list-item :key="item.name">
          <v-list-item-avatar>
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content @click="jumpToTheLink(item.link)">
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-tile-item-action>
            <v-btn icon>
              <v-icon @click.stop="update(index)">
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon @click.stop="deleteItem(index)">
                mdi-delete
              </v-icon>
            </v-btn>
          </v-list-tile-item-action>
        </v-list-item>
      </template>
      </v-list-item-group>
    </v-list>
        </v-card-text>
        <v-card-text>
      <v-btn
        color="pink"
        fab
        dark
        absolute
        right
        bottom
        fixed
        class="mb-5"
        @click="openNewDialog"
      >
      <v-icon>mdi-plus</v-icon>
      </v-btn>
        </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
    >
    <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title>{{ "外部リンク追加" }}</v-toolbar-title>
          <v-divider></v-divider>
        </v-toolbar>
        <v-card-text>
          <input
            style="display: none"
            ref="input"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            @change="selectFile"
          >
          <v-avatar>
            <v-img v-model="image"/>
          </v-avatar>
          <!-- リンク名 -->
          <a-label-text-field
            v-model="linkName"
            label="リンク名"
            outlined
            dense
          />
          <!-- URL -->
          <a-label-text-field
            v-model="url"
            label="リンク先URL"
            outlined
            dense
          />
          <!-- 説明 -->
          <a-label-text-field
            v-model="description"
            label="説明"
            outlined
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :loading="isLoading"
            @click="add"
          >
            {{ $t("common.save") }}
          </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
    <v-card>
          <v-card-text>
            <iframe
              width="500px"
              height="500px"
              src="https://www.iwakyu.com/kondate/"
            />
          </v-card-text>
      </v-card>
  </div>
</template>

<script>

export default {
  head: {
    title () {
      return {
        inner: this.$t('app.productName'),
        complement: this.$t('ZAD0040.title')
      }
    }
  },
  props: [],
  data () {
    return {
      mode: '',
      selectedIndex: null,
      isLoading: false,
      dialog: false,
      descriptionDialog: false,
      linkName: '',
      url: '',
      description: '',
      favorites: [
        {
          image: 'data:image/webp;base64,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',
          link: 'https://www.google.com/?hl=ja',
          name: 'Google先生！',
          description: 'みんな大好きGoogle先生のリンクです。'
        },
        {
          image: '',
          link: 'http://svsql04:10081/',
          name: 'エスツーアイのポータルサイト！',
          description: 'エスツーアイのポータルサイトです。'
        }
      ]
    }
  },
  computed: {
    breadcrumbs () {
      return [
        {
          text: 'ダッシュボード外部リンクサンプル',
          disabled: true
        }
      ]
    }
  },
  methods: {
    openNewDialog () {
      this.initDialog()
      this.dialog = true
      this.mode = 'new'
    },
    add () {
      this.isLoading = true
      const form = {
        link: this.url,
        name: this.linkName,
        description: this.description
      }
      if (this.mode === 'new') {
        this.favorites.push(form)
      } else {
        this.favorites[this.selectedIndex] = form
      }
      this.isLoading = false
      this.dialog = false
    },
    initDialog () {
      this.linkName = ''
      this.url = ''
      this.description = ''
      this.selectedIndex = null
    },
    jumpToTheLink (link) {
      window.open(link, '_blank', 'noreferrer')
    },
    update (index) {
      this.mode = 'edit'
      const data = this.favorites[index]
      this.dialog = true
      this.selectedIndex = index
      this.linkName = data.name
      this.url = data.link
      this.description = data.description
    },
    deleteItem (index) {
      this.favorites.splice(index, 1)
    },
    openFileDialog () {
      this.$refs.input.click()
    },
    selectFile () {
      const file = this.$refs.input.files[0]
      this.image = file
    }
  }
}
</script>
