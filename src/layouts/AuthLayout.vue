<template>
  <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
    <!-- <v-sheet class="layout-side mx-auto mx-md-1 d-none d-md-flex flex-md-column justify-space-between px-2">
      <div class="mt-3 mt-md-10 pa-2">
        <div class="display-2 font-weight-bold primary--text">
          {{ $t('app.productName') }}
        </div>
        <div class="title my-2">{{ $t('app.productCatchphrase') }}</div>
      </div>
      <img class="w-full" src="/images/illustrations/signin-illustration.svg" />
    </v-sheet> -->

    <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column">
      <div class="layout-content ma-auto w-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-side {
  width: 430px;
}

.layout-content {
  max-width: 490px;
}
</style>
