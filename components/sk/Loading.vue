<template>
  <div class="loading">
    <div class="loading__spinner"></div>
    <div class="loading__smallSpinner"></div>
  </div>
</template>
<style lang="scss">
@keyframes loadingAnim {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}

.loading {
  display: flex;
  position: relative;
  width: 1.5em;
  vertical-align: middle;
  justify-content: center;
  align-items: center;

  &:before {
    display: block;
    content: "";
    padding-top: 100%;
  }
}

.loading__spinner {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;

  border-radius: 50%;
  border: 3px solid transparent;

  border-left-color: $primary;
  border-right-color: $primary;

  animation: loadingAnim infinite 0.7s linear;
}
</style>
