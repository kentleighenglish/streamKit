<template>
  <div class="viewport">
    <div class="viewport__viewer"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    host: {
      type: String,
      default: null,
    },
  },
});
</script>
<style lang="scss">
.viewport {
  width: 100%;
  height: 100%;

  &__viewer {
    display: flex;
    width: 100%;
    height: 100%;

    position: relative;
    background: darken($grey-darkest, 5%);
    border-radius: $global-border-radius;
  }
}
</style>
