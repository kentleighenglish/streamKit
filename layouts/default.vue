<template>
  <div class="layout">
    <Nuxt />
  </div>
</template>

<style lang="scss">
layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  ng-transclude {
    display: block;
    width: 100%;
    height: 100%;

    ui-view {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
