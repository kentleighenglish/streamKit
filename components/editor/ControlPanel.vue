<template>
  <div class="controlPanel">
    <h3>{{ label }}</h3>
    <SkInput
      v-model="model.type"
      type="select"
      label="Type"
      :options="types"
      @input="updateValue($event, 'type')"
    />
    <div v-if="model.type">
      <div v-for="(control, key) in controls" :key="`controlPanel__${key}`">
        <SkInput
          v-model="model.parameters[key]"
          :type="control.type || 'text'"
          :label="control.label"
          :min="control.min"
          :max="control.max"
          @input="updateValue($event, key, true)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { cloneDeep, merge } from "lodash";

interface Parameter {
  [key: string]: any;
}

interface Model {
  type?: string;
  parameters: Parameter;
}

interface ControlPanel {
  defaultModel: Model;
  model: Model;
}

export default (Vue as VueConstructor<Vue & ControlPanel>).extend({
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: null,
    },
    value: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    defaultModel: {
      parameters: {},
    },
    model: {
      parameters: {},
    },
  }),
  computed: {
    types() {
      return Object.keys(this.options).reduce(
        (acc: { [key: string]: string }, key) => ({
          ...acc,
          [key]: this.options[key].label || key,
        }),
        {}
      );
    },
    controls() {
      if (this.model && this.model.type) {
        return this.options[this.model.type].controls || {};
      } else {
        return {};
      }
    },
  },
  watch: {
    value() {
      Vue.set(this, "model", cloneDeep(merge(this.defaultModel, this.value)));
    },
  },
  methods: {
    updateValue(value: any, key: string, parameter: boolean = false) {
      this.$emit(
        "input",
        cloneDeep(
          merge(
            this.defaultModel,
            this.model,
            parameter ? { parameters: { [key]: value } } : { [key]: value }
          )
        )
      );
    },
  },
});
</script>
<style lang="scss">
.controlPanel {
  display: flex;
  flex-direction: column;

  h3 {
    display: block;
    margin: 0em 0 0.8em;
    font-size: 16px;
    color: $grey;
  }
}
</style>
