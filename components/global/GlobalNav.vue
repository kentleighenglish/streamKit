<template>
  <nav class="navbar">
    <div class="sk-flex">
      <router-link to="/">
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
  padding: 0 $gap;

  a {
    display: flex;
    color: $grey;
    text-decoration: none;
    padding: ($gap / 2) $gap;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    align-items: center;
    font-size: 0.9em;
    box-shadow: 0 8px 0px -6px transparent;
    transition: box-shadow 0.1s, border-color 0.1s;

    .icon {
      font-size: 1em;
      margin-left: ($gap / 2);
      color: $grey;
    }

    &:hover:not(.nuxt-link-exact-active) {
      border-bottom-color: $primary;
      box-shadow: 0 8px 8px -6px fade-out($primary, 0.6);
    }

    &.nuxt-link-exact-active {
      color: $primary;
      cursor: default;

      .icon {
        color: inherit;
      }
    }
  }
}
</style>
