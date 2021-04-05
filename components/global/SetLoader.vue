<template>
  <div v-if="!createMode" class="setLoader">
    <h2 class="setLoader__title">Select a <b>stream</b> set</h2>
    <div class="setLoader__sets">
      <div
        v-for="set in sets"
        :key="`setLoader_set_${set.id}`"
        class="setLoader__set"
        @click="onLoadSet(set.id)"
      >
        <div class="setLoader__setContent">
          {{ set.name }}
        </div>
      </div>
      <div class="setLoader__set setLoader__set--new" @click="onCreateSet()">
        <div class="setLoader__setContent">
          <span class="icon">add</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="setCreator">
    <h2 class="setCreator__title">Create a <b>stream</b> set</h2>
    <form
      name="createForm"
      class="setCreator__form"
      @submit="onCreateSetSubmit()"
    >
      <FormInput
        v-model="newSet.name"
        name="name"
        label="Set Name"
        placeholder="My set name"
        type="text"
        required
      />
      <div class="sk-flex sk-align-end">
        <SkButton
          type="submit"
          hover-icon="check"
          :loading="creating"
          :disabled="creating"
        >
          Create Set
        </SkButton>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { cloneDeep } from "lodash";
import { Set } from "@/types/sets";
import { RootState } from "@/types/store";

export default Vue.extend({
  data: () => ({
    createMode: false,
    creating: false,
    initialSet: {
      name: null,
    },
    newSet: {},
  }),
  computed: {
    ...mapState({
      sets({ sets: { sets } }: RootState): Set[] {
        return sets;
      },
    }),
  },
  mounted() {
    this.newSet = cloneDeep(this.initialSet);
  },
  methods: {
    ...mapActions({
      createSet: "sets/createSet",
      loadSet: "sets/loadSet",
    }),
    onCreateSet() {
      this.createMode = true;
    },
    onCreateSetSubmit() {
      this.creating = true;
      this.createSet(this.newSet).then(() => {
        this.creating = false;
      });

      this.newSet = cloneDeep(this.initialSet);
    },
    onLoadSet(set: Set) {
      this.loadSet(set);
    },
  },
});
</script>
<style lang="scss">
.setLoader,
.setCreator {
  width: 100%;
  max-width: 1200px;
  margin: 120px auto 0;

  &__title {
    font-size: 32px;
    font-weight: 300;
    color: $grey;
    text-align: center;
  }

  &__sets {
    display: flex;
    justify-content: center;
  }

  &__set {
    height: 160px;
    width: 20%;
    padding: $gap;
  }

  &__setContent {
    display: flex;
    width: 100%;
    height: 100%;

    border-radius: 10px;
    border: 1px solid $grey-dark;
    color: $grey-dark;

    justify-content: center;
    align-items: center;

    .icon {
      font-size: 40px;
    }

    &:hover {
      cursor: pointer;
      border-color: $primary;
      color: $primary;
    }
  }

  &__form {
    margin: 0 auto;
    max-width: 100%;
    width: 500px;
  }
}
</style>
