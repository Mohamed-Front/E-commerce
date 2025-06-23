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
    width: '1rem',
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
    background-color: #47865f;

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
  background-color: #1B8A45!important;
 border-color:  #1B8A45 !important;
 color: wheat !important;
 margin-right: 0px !important;
 margin-left: 0px !important;
 height: 50px !important;
}
.va-sidebar__item:hover {
  background-color: #48a46b !important;
  border-radius: 15px !important;
   height: 50px !important;
   margin-right: 0px !important;
 margin-left: 0px !important;
}


</style>
