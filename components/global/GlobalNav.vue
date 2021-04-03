<template>
  <nav class="navbar">
    <div class="sk-flex">
      <router-link to="/dashboard">
        Dashboard <span class="icon">view_quilt</span>
      </router-link>
      <router-link to="/editor">
        Slide Editor <span class="icon">view_carousel</span>
      </router-link>
      <router-link to="/sources">
        Sources <span class="icon">widgets</span>
      </router-link>
      <router-link to="/media">
        Media <span class="icon">perm_media</span>
      </router-link>
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
