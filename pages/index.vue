<template>
  <div class="container">
    <SetLoader v-if="!hasCurrentSet" />
  </div>
</template>
<script lang="ts">
export default {
  computed: {
    hasCurrentSet() {
      return false;
    },
  },
};
</script>
