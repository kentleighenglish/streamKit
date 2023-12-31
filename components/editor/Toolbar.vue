<template>
  <div class="toolbar">
    <div v-if="hasActiveCell" class="sk-flex sk-column">
      <h2>Layer {{ activeLayer + 1 }} - Slide {{ activeSlide + 1 }}</h2>

      <div class="toolbar__panel">
        <EditorControlPanel
          v-model="cell.startTransition"
          :options="transitionTypes"
          label="Start Transition"
        />
      </div>
      <!-- Source Panel -->
      <div class="toolbar__panel">
        <SkInput v-model="cell.source" label="Source" />
      </div>
      <div class="toolbar__panel">
        <EditorControlPanel
          v-model="cell.endTransition"
          :options="transitionTypes"
          label="End Transition"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { mapState, mapActions } from "vuex";
import { find, cloneDeep, merge } from "lodash";
import { Cell } from "@/types/sets";
import { RootState } from "@/types/store";
import transitionTypes from "@/engine/transitions";

export default (Vue as VueConstructor<Vue>).extend({
  data: () => ({
    defaultCell: {
      startTransition: null,
      endTransition: null,
      source: null,
    },
    cell: {},
    transitionTypes,
  }),
  computed: {
    ...mapState({
      currentSet({ sets: { currentSet } }: RootState): Set {
        return currentSet;
      },
      activeLayer({ sets: { currentCell } }: RootState): number | null {
        return currentCell.layer;
      },
      activeSlide({ sets: { currentCell } }: RootState): number | null {
        return currentCell.slide;
      },
      hasActiveCell({ sets: { currentCell } }: RootState): boolean {
        return !!(currentCell.layer !== null && currentCell.slide !== null);
      },
    }),
    activeCell(): Cell | null {
      const { cells = [] } = this.currentSet;

      if (this.activeLayer === null || this.activeSlide === null) {
        return null;
      }

      const activeCell = find(cells, {
        layer: this.activeLayer,
        slide: this.activeSlide,
      });

      return activeCell || { layer: this.activeLayer, slide: this.activeSlide };
    },
  },
  watch: {
    activeCell() {
      Vue.set(
        this,
        "cell",
        merge(cloneDeep(this.defaultCell), cloneDeep(this.activeCell || {}))
      );
    },
    cell: {
      handler() {
        // this.updateActiveCell(this.cell);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      updateActiveCell: "sets/updateActiveCell",
    }),
  },
});
</script>
<style lang="scss">
.toolbar {
  display: flex;
  width: 100%;
  padding: 0 $gap;

  flex-direction: column;

  h2 {
    margin: ($gap / 2) ($gap / 2) 0;
    font-size: 1.2em;
    color: $grey-light;
  }

  &__panel {
    background: lighten($grey-darkest, 3%);
    padding: $gap;
    box-shadow: 2px 2px 20px fade-out(darken($grey-darkest, 3%), 0);
    border-radius: ($global-border-radius / 2);
    margin: ($gap / 2) 0;
  }
}
</style>
