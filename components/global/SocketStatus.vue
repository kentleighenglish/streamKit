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
    box-shadow: 0px 0px 6px 2px fade-out($success, 0.6);
  }
  .socketStatus__label {
    color: $success;
    text-shadow: 0px 0px 8px fade-out($success, 0.2);
  }
}

.socketStatus--disconnected {
  .socketStatus__indicator {
    background: $danger;
    box-shadow: 0px 0px 4px 2px fade-out($danger, 0.8);
  }
  .socketStatus__label {
    color: $danger;
    text-shadow: 0px 0px 8px fade-out($danger, 0.2);
  }
}
</style>
