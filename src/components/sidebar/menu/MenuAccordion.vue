<template>
  <va-accordion v-model="accordionValue" class="sidebar-accordion va-sidebar__menu__inner" multiple>
    <va-collapse v-for="(route, idx) in arr" :key="idx">
      <template #header>
        <va-sidebar-item  :active="isRouteActive(route)"  :to="route.children ? undefined : { name: route.name }">
          <va-sidebar-item-content v-if="Array.isArray(route.show) && route.show.some(element => showRoutes.includes(element))">            <va-icon :name="route.meta.icon" class="va-sidebar-item__icon" />

            <va-sidebar-item-title>
              {{ t(route.displayName) }}
            </va-sidebar-item-title>

            <va-icon v-if="route.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" />
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
      <template  v-for="(child, index) in route.children" :key="index"  >
        <va-sidebar-item v-if="showRoutes.includes(child.show)" :active="isRouteActive(child)" :to="{ name: child.name }">
          <va-sidebar-item-content>
            <div class="va-sidebar-item__icon" />

            <va-sidebar-item-title>
              {{ t(child.displayName) }}

            </va-sidebar-item-title>

          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
    </va-collapse>
  </va-accordion>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { INavigationRoute } from '../NavigationRoutes'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
import { cos } from '@amcharts/amcharts5/.internal/core/util/Math'
  const { t } = useI18n()
  const arr =ref([])
  const pro =ref('')
  const showRoutes= ref([])
  const props = withDefaults(
    defineProps<{
      items?: INavigationRoute[]
    }>(),
    {
      items: () => [],
    },
  )

  const accordionValue = ref<boolean[]>([])

  onMounted(() => {
    showRoutes.value=localStorage.getItem('userPermissions')
    arr.value=props.items

  })
  // function isGroup(item: INavigationRoute) {
  //   return !!item.children
  // }

  function isRouteActive(item: INavigationRoute) {
    return item.name === useRoute().name
  }

  function isItemExpanded(item: INavigationRoute): boolean {
    if (!item.children) {
      return false
    }

    const isCurrentItemActive = isRouteActive(item)
    const isChildActive = !!item.children.find((child) =>
      child.children ? isItemExpanded(child) : isRouteActive(child),
    )

    return isCurrentItemActive || isChildActive
  }
</script>
<style >

</style>
