<template>
  <nav class="navbar">
    <div class="sk-flex">
      <a to="/dashboard">Dashboard <span class="icon">view_quilt</span></a>
      <a to="/editor">Slide Editor <span class="icon">view_carousel</span></a>
      <a to="/sources">Sources <span class="icon">widgets</span></a>
      <a to="/media">Media <span class="icon">perm_media</span></a>
    </div>
  </nav>
</template>
<style lang="scss">
nav.navbar {
  display: flex;

  a {
    display: flex;
    color: white;
    text-decoration: none;
    padding: ($gap / 2) $gap;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    align-items: center;

    .icon {
      font-size: 1em;
      margin-left: ($gap / 2);
      color: $grey;
    }

    &:hover {
      border-bottom-color: $primary;
    }

    &.active {
      background: $primary;
      color: white;
      cursor: default;

      .icon {
        color: inherit;
      }
    }
  }
}
</style>
