<template>
  <button
    :type="type"
    :class="{ skButton: true, 'skButton--loading': loading }"
    :disabled="disabled"
    @click="onClick($event)"
  >
    <div class="skButton__content">
      <slot></slot>
    </div>
    <div class="skButton__frame">
      <div v-if="hoverIcon" class="skButton__frameInner">
        <span v-if="!loading" class="icon">{{ hoverIcon }}</span>
        <SkLoading v-if="loading" />
      </div>
    </div>
  </button>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    type: {
      type: String,
      default: "button",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hoverIcon: {
      type: String,
      default: null,
    },
  },
  methods: {
    onClick(e: MouseEvent) {
      this.$emit("click", e);
    },
  },
});
</script>
<style lang="scss">
.skButton {
  display: flex;
  position: relative;
  background: none;
  padding: $gap ($gap * 2);
  margin: $gap 0;
  color: $primary;
  font-weight: 300;

  @include applyFontStandards();

  cursor: pointer;
  overflow: hidden;

  border: none;

  &:active,
  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: default;
    color: $grey-dark;
  }
}

.skButton__content {
  display: flex;
  align-items: center;
}

.skButton__frame {
  z-index: 2;
  position: absolute;
  border: 2px solid $primary-dark;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: translateY(100%);
  pointer-events: none;
  margin-top: -2px;

  transition: border-color 0.1s, transform 0.2s, margin-top 0.2s;

  .skButton:hover:not(:disabled) &,
  .skButton--loading & {
    border-color: $primary;
    transform: translateY(0%);
    margin-top: 0px;
  }

  .skButton:disabled & {
    border-color: $grey-darker;
    color: $grey;
  }
}

.skButton__frameInner {
  display: flex;
  width: 100%;
  height: 100%;
  background: $grey-darkest;

  justify-content: center;
  align-items: center;
}
</style>
