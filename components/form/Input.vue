<template>
  <ValidationProvider
    v-slot="v"
    tag="div"
    :vid="name"
    :name="name"
    :rules="inputRules"
    mode="passive"
    :class="componentClass"
  >
    <label v-if="type === 'checkbox'">
      <input
        v-model="model"
        :class="validationClass(v)"
        :name="name"
        :type="type"
        :required="required"
        :disabled="disabled"
        @input="updateValue($event.target.value)"
      />
      <div :class="{ checkbox: true, checked: !!model }">
        <span v-if="!!model" class="fas fa-check"></span>
      </div>
      <span class="input__label">
        <slot>
          <span>{{ label }}</span>
        </slot>
      </span>
      <div class="input__frame">
        <div class="input__frameBack"></div>
      </div>
    </label>
    <label v-else-if="type === 'textarea'" :for="name">
      <span class="input__label">
        <slot>
          <span>{{ label }}</span>
        </slot>
      </span>
      <textarea
        v-model="model"
        :class="validationClass(v)"
        :name="name"
        :type="type"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        @input="updateValue($event.target.value)"
      ></textarea>
      <div class="input__frame">
        <div class="input__frameBack"></div>
      </div>
    </label>
    <label v-else-if="type === 'select'" :for="name">
      <span class="input__label">
        <slot>
          <span>{{ label }}</span>
        </slot>
      </span>
      <select
        v-model="model"
        :class="validationClass(v)"
        :name="name"
        :type="type"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        @input="updateValue($event.target.value)"
      >
        <option v-for="(optionLabel, key) in options" :key="key" :value="key">
          {{ optionLabel }}
        </option>
      </select>
      <div class="input__frame">
        <div class="input__frameBack"></div>
      </div>
    </label>
    <label v-else :for="name">
      <span class="input__label">
        <slot>
          <span>{{ label }}</span>
        </slot>
      </span>
      <input
        v-model="model"
        :class="validationClass(v)"
        :name="name"
        :type="passwordVisible ? 'text' : type"
        :required="required"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="updateValue($event.target.value)"
      />
      <span
        v-if="type === 'password' && !suffix"
        class="input__suffix input__suffix--hover"
      >
        <span
          v-if="!passwordVisible"
          class="fas fa-eye"
          @click="passwordVisible = true"
        />
        <span
          v-else
          class="fas fa-eye-slash"
          @click="passwordVisible = false"
        />
      </span>
      <div class="input__frame">
        <div class="input__frameBack"></div>
      </div>
    </label>
  </ValidationProvider>
</template>
<script>
import Vue from "vue";
import classModsMixin from "@/mixins/classModsMixin";
import { ValidationProvider, extend } from "vee-validate";

import validationRules from "@/validation/rules";
import * as policies from "@/validation/policies";

Object.keys(validationRules).forEach((rule) =>
  extend(rule, validationRules[rule])
);

export default Vue.extend({
  components: {
    ValidationProvider,
  },
  mixins: [classModsMixin],
  props: {
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "text",
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    lg: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: [Number, String],
      default: 3,
    },
    value: {
      type: [Number, String],
      default: "",
    },
    suffix: {
      type: String,
      default: null,
    },
    policy: {
      type: String,
      default: null,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  classMod: {
    baseClass: "input",
    modifiers: {
      lg: (vm) => !!vm.lg,
      hasSuffix: (vm) => !!vm.hasSuffix,
      type: (vm) => vm.type,
    },
  },
  data: () => ({
    model: null,
    passwordVisible: false,
  }),
  computed: {
    hasSuffix() {
      return !!this.suffix || this.type === "password";
    },
    inputRules() {
      if (this.policy && policies[this.policy]) {
        return policies[this.policy];
      }

      return {};
    },
  },
  watch: {
    value(v) {
      this.model = v;
    },
  },
  created() {
    this.model = this.value;
  },
  mounted() {
    this.model = this.value;
  },
  methods: {
    updateValue(value) {
      this.$emit("input", value);
    },
    validationClass(v) {
      return `input__element ${
        v.invalid && v.validated ? " input__element--error" : ""
      }`;
    },
  },
});
</script>
<style lang="scss">
.input {
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  margin: calc(#{($gap / 2)} + 0.8em) 0 ($gap * 2);

  &__label,
  &__input {
    color: $grey;
    font-size: $font-size-default;
    line-height: 1.1em;
    padding: ($gap / 2);
    width: 100%;
  }
}

.input__label {
  position: absolute;
  background: inherit;
  font-weight: 600;
  z-index: 2;
  cursor: inherit;
  pointer-events: none;
  bottom: 100%;
  transform: translateY(100%);

  transition: transform 0.2s, font-size 0.3s;

  .input--focus &,
  .input:not(.input--empty) & {
    transform: translateY(0%);
    font-size: 0.8em;
  }
}

.input__element {
  position: relative;
  width: 100%;
  background: none;
  border: none;
  color: $primary;
  z-index: 1;

  @include applyFontStandards();

  &:focus,
  &:active {
    outline: none;
  }

  &:focus {
    color: $grey-light;
  }

  &::placeholder {
    color: $grey-dark;
  }

  option {
    background: $grey-darker;
    color: $grey-lightest;
    border: none;

    @include applyFontStandards();
  }
}

.input__frame {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  margin-bottom: -2px;

  border-bottom: 2px solid $primary-dark;
  transition: border-color 0.4s;

  .input--focus & {
    border-color: $primary;
  }
}

.input__frameBack {
  width: 100%;
  height: 100%;
  background: fade-out($grey, 0.9);
  transform: scaleY(0);
  transition: transform 0.2s;
  transform-origin: bottom;

  .input--focus & {
    transform: scaleY(1);
  }
}

/* RANGE INPUT STYLING */

$range-track-colour: $primary-dark;
$range-thumb-colour: $primary;

$range-thumb-radius: 8px;
$range-thumb-height: 24px;
$range-thumb-width: 8px;

$range-track-width: 100%;
$range-track-height: 4px;
$range-track-radius: 3px;
$range-contrast: 5%;

@mixin rangeTrack() {
  width: $range-track-width;
  height: $range-track-height;
  cursor: pointer;
}

@mixin rangeThumb() {
  height: $range-thumb-height;
  width: $range-thumb-width;
  border-radius: $range-thumb-radius;
  background: $range-thumb-colour;
  cursor: pointer;
}

.input--range {
  .input__frame {
    display: none;
  }

  .input__label {
    transform: translateY(0%);
    font-size: 0.8em;
  }

  .input__element {
    -webkit-appearance: none;
    margin: $range-thumb-height/2 0;
    width: $range-track-width;

    &:focus {
      outline: none;
    }

    &::-webkit-slider-runnable-track {
      @include rangeTrack();
      background: $range-track-colour;
      border-radius: $range-track-radius;
    }

    &::-webkit-slider-thumb {
      @include rangeThumb();
      -webkit-appearance: none;
      margin-top: ($range-track-height / 2) - ($range-thumb-height / 2);
    }

    &:focus::-webkit-slider-runnable-track {
      background: lighten($range-track-colour, $range-contrast);
    }

    &::-moz-range-track {
      @include rangeTrack();
      background: $range-track-colour;
      border-radius: $range-track-radius;
    }
    &::-moz-range-thumb {
      @include rangeThumb();
    }

    &::-ms-track {
      @include rangeTrack();
      background: transparent;
      border-color: transparent;
      border-width: $range-thumb-width 0;
      color: transparent;
    }

    &::-ms-fill-lower {
      background: darken($range-track-colour, $range-contrast);
      border-radius: ($range-track-radius * 2);
    }

    &::-ms-fill-upper {
      background: $range-track-colour;
      border-radius: ($range-track-radius * 2);
    }

    &::-ms-thumb {
      @include rangeThumb();
    }

    &:focus::-ms-fill-lower {
      background: $range-track-colour;
    }

    &:focus::-ms-fill-upper {
      background: lighten($range-track-colour, $range-contrast);
    }
  }
}
</style>
