<template>
  <div :class="componentClass">
    <div v-if="isSaving" class="appStatus__loading">
      <SkLoading />
    </div>
    <div class="appStatus__socket">
      <div class="appStatus__socketLabel">
        {{ socket.connected ? "Connected" : "Disconnected" }}
      </div>
      <div class="appStatus__socketIndicator" />
    </div>
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
    baseClass: "appStatus",
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
      isSaving({ sets: { saving } }: RootState): boolean {
        return saving;
      },
    }),
  },
});
</script>
<style lang="scss">
.appStatus {
  position: absolute;
  top: 0;
  right: 0;
  padding: ($gap * 0.75) $gap;
  display: flex;
  align-items: center;
}

.appStatus__socket {
  display: flex;
  align-items: center;
}

.appStatus__loading {
  margin: 0 $gap;
}

.appStatus__socketLabel {
  margin-right: $gap;
  font-size: 0.8em;
}

.appStatus__socketIndicator {
  width: 12px;
  height: 12px;
  background: $grey-darker;
  border-radius: 50%;
}

.appStatus--connected {
  .appStatus__socketIndicator {
    background: $success;
    box-shadow: 0px 0px 6px 2px fade-out($success, 0.6);
  }
  .appStatus__socketLabel {
    color: $success;
    text-shadow: 0px 0px 8px fade-out($success, 0.2);
  }
}

.appStatus--disconnected {
  .appStatus__socketIndicator {
    background: $danger;
    box-shadow: 0px 0px 4px 2px fade-out($danger, 0.8);
  }
  .appStatus__socketLabel {
    color: $danger;
    text-shadow: 0px 0px 8px fade-out($danger, 0.2);
  }
}
</style>
