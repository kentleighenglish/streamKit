<template>
  <div class="layout">
    <SetLoader v-if="!currentSetLoaded" />
    <GlobalNav v-if="currentSetLoaded" />
    <Nuxt v-if="currentSetLoaded" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { RootState } from "@/types/store";

export default Vue.extend({
  computed: {
    ...mapState({
      currentSetLoaded({ sets: { currentSet } }: RootState): boolean {
        return !!currentSet;
      },
    }),
  },
});
</script>
<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
