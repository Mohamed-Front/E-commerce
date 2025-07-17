<template>
  <va-sidebar :width="width" :minimized="minimized" :minimized-width="minimizedWidth" :animated="animated">
    <menu-minimized v-if="minimized" :items="items"/>
    <menu-accordion v-else :items="items"/>
  </va-sidebar>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import NavigationRoutes from './NavigationRoutes'
import MenuAccordion from './menu/MenuAccordion.vue'
import MenuMinimized from './menu/MenuMinimized.vue'

withDefaults(
  defineProps<{
    width?: string
    color?: string
    animated?: boolean
    minimized?: boolean
    minimizedWidth?: string
  }>(),
  {
    width: '16rem',
    color: 'secondary',
    animated: true,
    minimized: true,
    minimizedWidth: undefined,
  },
)

const items = ref(NavigationRoutes.routes)
</script>

<style lang="scss">
.va-sidebar {
  &__menu {
    padding: 2rem 0;
    background-color: var(--main-text-color);
  }

  &-item {
    &__icon {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.router-link-active {
  background-color: var(--main-text-color)!important;
  border-color:  var(--main-text-color) !important;
}

.router-link-active div , .router-link-active a {
  color: white !important;
}

.sidebar-item__children {
  background-color: #f8f4ec;
  margin: 0 8px;
}
</style>
