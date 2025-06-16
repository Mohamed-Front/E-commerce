<template>
  <div class="app-layout  ">

    <div class="app-layout__content">
      <Transition name="slide">
      <div class="app-layout__sidebar-wrapper" :class="{ minimized: isSidebarMinimized }" v-if="sidebarVisible">
        <div v-if="isFullScreenSidebar" class="flex justify-end">
          <va-button class="px-4 py-4" icon="md_close" preset="plain" color="dark" @click="onCloseSidebarButtonClick" />
        </div>
        <sidebar :width="sidebarWidth" :minimized="isSidebarMinimized" :minimized-width="sidebarMinimizedWidth"
          :animated="!isMobile" />
      </div>
    </Transition>
   <div class="app-layout__page">
    <div class="app-layout__navbar-wrapper">
      <navbar :onToggleSidebar="toggleSidebar" />
    </div>


      <div class=" p-0">
        <div class="md:px-6 md:py-0 pt-0">
          <router-view />
        </div>
      </div>
   </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteUpdate } from 'vue-router'
import { useGlobalStore } from '../stores/global-store'
import { useRouter } from 'vue-router';
import Navbar from '../components/navbar/Navbar.vue'
import Sidebar from '../components/sidebar/Sidebar.vue'
const router = useRouter()
const sidebarVisible = ref(true);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
const GlobalStore = useGlobalStore()

const mobileBreakPointPX = 640
const tabletBreakPointPX = 768

const sidebarWidth = ref('16rem')

const isMobile = ref(false)
const isTablet = ref(false)
const { isSidebarMinimized } = storeToRefs(GlobalStore)
const checkIsTablet = () => window.innerWidth <= tabletBreakPointPX
const checkIsMobile = () => window.innerWidth <= mobileBreakPointPX
const goBack = () => {
  router.go(-1)
};
const onResize = () => {
  isSidebarMinimized.value = checkIsTablet()

  isMobile.value = checkIsMobile()
  isTablet.value = checkIsTablet()
  sidebarWidth.value = isTablet.value ? '100%' : '19rem'
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

onBeforeRouteUpdate(() => {
  if (checkIsTablet()) {
    // Collapse sidebar after route change for Mobile
    isSidebarMinimized.value = true
  }
})

onResize()

const isFullScreenSidebar = computed(() => isTablet.value && !isSidebarMinimized.value)

const onCloseSidebarButtonClick = () => {
  isSidebarMinimized.value = true
}
</script>

<style lang="scss">
$mobileBreakPointPX: 640px;
$tabletBreakPointPX: 768px;

.app-layout {
  height: 100 vh;
  display: flex;
  flex-direction: column;

  &__navbar-wrapper {
    width: 100%;
    min-height: 4rem;
    position: relative;
    z-index: 2;
  }

  &__content {
    display: flex;
    height: calc(100vh - 4rem);
    flex: 1;
    position: relative;

    @media screen and (max-width: $tabletBreakPointPX) {}

    .app-layout__sidebar-wrapper {
      position: relative;

      background: #ffffff;
      z-index: 1;

      @media screen and (max-width: $tabletBreakPointPX) {
        &:not(.minimized) {
          width: 100%;
          height: 100%; // Full height minus navbar
          position: fixed;
          top: 4rem;
          /* Start below navbar */
          z-index: 1;
        }

        .va-sidebar:not(.va-sidebar--minimized) {
          .va-sidebar__menu {
            padding: 0;
          }
        }
      }
    }
  }

  &__page {
    flex-grow: 2;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
}
.slide-enter-to {
  opacity: 1;
}
.slide-leave-from {
  opacity: 1;
}
.slide-leave-to {
  opacity: 0;
}
</style>
