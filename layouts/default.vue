<template>
  <div class="layout">
    <SocketStatus />
    <SetLoader v-if="!currentSetLoaded" />
    <GlobalNav v-if="currentSetLoaded" />
    <Nuxt v-if="currentSetLoaded" />
  </div>
</template>
<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { mapState, mapActions } from "vuex";
import { RootState } from "@/types/store";
import { SocketClientInstance } from "@/types/socket";

interface DefaultLayout {
  addSocket: (socket: () => SocketClientInstance) => void;
  initSet: () => void;
}

export default (Vue as VueConstructor<Vue & DefaultLayout>).extend({
  computed: {
    ...mapState({
      currentSetLoaded({ sets: { currentSet } }: RootState): boolean {
        return !!currentSet;
      },
    }),
  },
  mounted() {
    this.addSocket(this.$socket);

    this.$socket().connect();

    this.initSet();
  },
  methods: {
    ...mapActions({
      addSocket: "addSocket",
      initSet: "sets/initSet",
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
