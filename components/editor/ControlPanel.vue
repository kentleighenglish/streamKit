<template>
  <div class="controlPanel">
    <h3>{{ label }}</h3>
    <FormInput
      v-model="model.type"
      type="select"
      label="Type"
      :options="types"
    />
    <div ng-if="vm.model.type">
      <div ng-repeat="(control, key) in controls">
        <FormInput
          v-model="model.parameters[key]"
          :type="control.type || 'text'"
          :label="control.label"
          :min="control.min"
          :max="control.max"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { cloneDeep, merge } from "lodash";

export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    defaultModel: {
      type: null,
      parameters: {},
    },
  }),
  computed: {
    types() {
      return Object.keys(this.options).reduce(
        (acc, key) => [...acc, { key, label: this.options[key].label || key }],
        []
      );
    },
  },
  controls() {
    if (this.model && this.model.type) {
      return cloneDeep(
        merge(this.defaultModel, this.ngModelCtrl.$viewValue || {})
      );
    } else {
      return {};
    }
  },
});
</script>
<style lang="scss">
.controlPanel {
  display: flex;
  flex-direction: column;

  h3 {
    display: block;
    margin: 0.5em 0;
  }
}
</style>
