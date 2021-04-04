<template>
  <!-- <div class="trackbar__tools">
    <a class="trackbar__tool" title="Add Layer" href="#" ng-click="vm.onAddLayer()"><span class="icon">add</span></a>
  </div> -->
  <div class="trackbar" data-simplebar>
    <table>
      <tr>
        <td class="trackbar__corner"></td>
        <td
          v-for="(slide, slideIndex) in layers[0].slides"
          :key="`trackbarSlideLable__${slide.key}`"
          class="trackbar__slideHead"
        >
          <div class="sk-flex sk-center">
            <span class="trackbar__label">Slide {{ slideIndex + 1 }}</span>
            <span
              v-if="layers.length > 1"
              class="trackbar__action icon"
              @click="onDeleteSlide(slideIndex)"
            >
              delete
            </span>
          </div>
        </td>
        <td class="trackbar__slideHead">
          <div class="trackbar__actions">
            <span class="trackbar__action" @click="onAddSlide()">
              <span class="icon">add</span>
            </span>
          </div>
        </td>
      </tr>
      <tr
        v-for="(layer, layerIndex) in layers"
        :key="`trackbarLayer__${layer.key}`"
        class="trackbar__layer"
      >
        <td class="trackbar__layerHead">
          <span class="trackbar__label">Layer {{ layerIndex + 1 }}</span>
          <span class="trackbar__actions">
            <span
              v-if="layers.length > 1"
              class="trackbar__action icon"
              @click="onDeleteLayer(layerIndex)"
            >
              delete
            </span>
          </span>
        </td>
        <td
          v-for="(slide, slideIndex) in layer.slides"
          :key="`trackabrSlide__${slide.key}`"
          class="trackbar__slide"
        >
          <div
            class="trackbar__cell"
            @click="onCellClick($event, layerIndex, slideIndex)"
          ></div>
        </td>
        <td class="trackbar__slide trackbar__slide--new"></td>
      </tr>
      <tr class="trackbar__layer">
        <td class="trackbar__layerHead" @click="onAddLayer()">
          <div class="trackbar__actions">
            <span class="trackbar__action icon">add</span>
          </div>
        </td>
        <td :colspan="layers[0].slides.length + 1"></td>
      </tr>
    </table>
    <!-- <div class="trackbar__layers" data-simplebar>
      <div class="trackbar__layer" ng-repeat="(layerIndex, layer) in vm.layers">
        <div class="trackbar__layerActions">
          <span class="trackbar__label">Layer {{ $index + 1 }}</span>
          <span class="trackbar__actions">
            <span class="trackbar__action icon" ng-click="vm.onDeleteLayer($index)" ng-if="vm.layers.length > 1">delete</span>
          </span>
        </div>
        <div class="trackbar__slides">
          <div class="trackbar__slide" ng-repeat="(slideIndex, slide) in layer.slides">
            <div class="trackbar__cell" ng-click="vm.onCellClick($event, layerIndex, slideIndex)">

            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { find, filter } from "lodash";
import { Cell } from "@/types/sets";

interface Slide {
  key: string;
  cell: Cell | null;
}

interface Layer {
  key: string;
  slides: Slide[];
}

const processCells = (
  cells: Cell[],
  layers: number,
  slides: number
): Layer[] => {
  const layersArray: Layer[] = [];

  for (let l = 0; l < layers; l++) {
    if (!layersArray[l]) {
      layersArray[l] = {
        slides: [],
        key: `${l}`,
      };
    }

    for (let s = 0; s < slides; s++) {
      const layer = l;
      const slide = s;

      const matchingCell = find(cells, { layer, slide }) || null;

      layersArray[l].slides[s] = {
        key: `${l}.${s}`,
        cell: matchingCell,
      };
    }
  }

  return layersArray;
};

export default Vue.extend({
  computed: {
    ...mapGetters({
      loadedSet: "sets/loadedSet",
    }),
    layers(): Layer[] {
      const { cells = [], layers = 1, slides = 1 } = this.loadedSet;

      return processCells(cells, layers, slides);
    },
  },
  methods: {
    ...mapActions({
      addLayer: "sets/addLayer",
      deleteLayer: "sets/deleteLayer",
      addSlide: "sets/addSlide",
      deleteSlide: "sets/deleteSlide",
      setActiveCell: "sets/setActiveCell",
    }),
    onDeleteLayer(index: number) {
      const cells = filter(this.layers[index].slides, (c) => !!c.cell);

      if (
        cells.length &&
        !window.confirm(
          "Are you sure? All cells within this layer will be deleted."
        )
      ) {
        return;
      }

      this.deleteLayer(index);
    },
    onAddLayer() {
      this.addLayer();
    },
    onDeleteSlide(index: number) {
      const cells = filter(this.layers[index].slides, (c) => !!c.cell);

      if (
        cells.length &&
        !window.confirm(
          "Are you sure? All cells within this slide will be deleted."
        )
      ) {
        return;
      }

      this.deleteSlide(index);
    },
    onAddSlide() {
      this.addSlide();
    },
    onCellClick($event: MouseEvent, layer: number, slide: number) {
      this.setActiveCell({ layer, slide });
    },
  },
});
</script>
<style lang="scss">
$trackbar-bg: desaturate(lighten($grey-darkest, 3%), 5%);
$trackbar-layer-bg: saturate(lighten($trackbar-bg, 2%), 3%);
$trackbar-layerHead-bg: lighten($trackbar-layer-bg, 3%);
$slide-hover-bg: saturate(lighten($trackbar-layer-bg, 4%), 2%);

$row-size: 80px;
$column-size: 220px;

.trackbar {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: $global-border-radius;
  background: $trackbar-bg;
  height: 250px;
  overflow: auto;

  table {
    display: block;
    border: none;
    border-collapse: collapse;
  }

  tbody {
    display: block;
  }

  &__tools {
    margin: 0 ($gap / 2);
    .trackbar__tool {
      color: $grey-dark;
      padding: ($gap / 4);
    }
  }

  &__label {
    display: block;
    width: 100%;
    text-align: center;
    color: $grey-dark;
    font-weight: bold;
    padding: ($gap / 2) 0;
  }

  &__corner {
    width: $column-size;
    min-width: $column-size;
    background: $trackbar-layerHead-bg;
    position: sticky;
    left: 0;
  }

  &__layerHead {
    // display: flex;
    width: $column-size;
    min-width: $column-size;
    background: $trackbar-layerHead-bg;
    flex-direction: column;

    align-items: center;
    justify-content: center;
    text-align: center;

    position: sticky;
    left: 0;
  }

  &__slideHead {
    width: $column-size;
    min-width: $column-size;
    position: sticky;
    top: 0;
    background: $trackbar-bg;
  }

  &__layer {
    // display: flex;
    height: $row-size;
    background: $trackbar-layer-bg;
    border-top: 1px dashed $grey-darkest;
  }

  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__action {
    display: inline-block;
    color: darken($grey-dark, 5%);

    &:hover {
      color: $primary;
      cursor: pointer;
    }
  }

  &__slide {
    width: $column-size;
    min-width: $column-size;
    height: $row-size;
    border-right: 1px dashed $grey-darker;

    &--new {
      border-right: none;
      opacity: 0;
      pointer-events: none;
    }
  }

  &__cell {
    display: flex;
    width: 100%;
    height: 100%;
    cursor: pointer;

    &:hover {
      background: $slide-hover-bg;
    }
  }
}
</style>
