<template>
  <div :class="componentClass">
    <div class="socketStatus__label">
      {{ socket.connected ? "Connected" : "Disconnected" }}
    </div>
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
  padding: ($gap * 0.75) $gap;
  display: flex;
  align-items: center;
}

.socketStatus__label {
  margin-right: $gap;
  font-size: 0.8em;
}

.socketStatus__indicator {
  width: 12px;
  height: 12px;
  background: $grey-darker;
  border-radius: 50%;
}

.socketStatus--connected {
  .socketStatus__indicator {
    background: $success;
  }
  .socketStatus__label {
    color: $success;
  }
}

.socketStatus--disconnected {
  .socketStatus__indicator {
    background: $danger;
  }
  .socketStatus__label {
    color: $danger;
  }
}
</style>
