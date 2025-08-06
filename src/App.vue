<template>

  <router-view  />
</template>

<script setup>
  import Nav from './pages/admin/frontend/components/nav.vue'
  import Footer from './pages/admin/frontend/components/footer.vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
</script>
<style lang="scss">
  @import 'scss/main.scss';

  #app {
    font-family: 'Source Sans Pro', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    margin: 0;
  }
</style>
