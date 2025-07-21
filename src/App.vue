<template>
  <main
    class="bg-[#FAF7F0] min-h-[100vh]"
    v-if="
      !route.path.includes('admin') && !route.path.includes('auth') && !route.path.includes('404') && route.name !== 'home' && !route.name.includes('auth')
    "
  >
    <header>
      <!-- Navbar -->
      <Nav></Nav>
      <!-- stores markets and mall -->
    </header>
    <!-- contaner -->
<div class="mx-auto mt-16 w-[65%] md:w-[75%] sm:w-[90%] xs:w-[96%]">
      <router-view />
    </div>
    <!-- footer -->
    <Footer></Footer>
  </main>
  <router-view v-else />
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
