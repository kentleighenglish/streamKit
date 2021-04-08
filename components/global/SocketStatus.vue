<template>
  <div :class="componentClass">
    <div class="socketStatus__indicator" />
  </div>
</template>
<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { mapState } from "vuex";
import { RootState, SocketStatus } from "@/types/store";
import classModsMixin, { ClassModsMixin } from "@/mixins/classModsMixin";

export default (Vue as VueConstructor<Vue & ClassModsMixin>).extend({
  mixins: [classModsMixin],
  classMod: {
    baseClass: "socketStatus",
    modifiers: {
      connected: (vm: any) => vm.socket.connected,
      connecting: (vm: any) => vm.socket.connecting,
      disconnected: (vm: any) => !vm.socket.connected,
    },
  },
  computed: {
    ...mapState({
      socket({ socket }: RootState): SocketStatus {
        return socket;
      },
    }),
  },
});
</script>
<style lang="scss">
.socketStatus {
  position: absolute;
  top: 0;
  right: 0;
  padding: $gap;
}

.socketStatus__indicator {
  width: 12px;
  height: 12px;
  background: $grey-darker;
  border-radius: 50%;

  .socketStatus--connected & {
    background: $success;
  }

  .socketStatus--connecting & {
    background: $warning;
  }

  .socketStatus--disconnected & {
    background: $danger;
  }
}
</style>
