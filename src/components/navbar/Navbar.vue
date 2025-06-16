<template>
  <va-navbar class="nave flex justify-between shadow-xl" style="color:white !important; direction: ltr !important;">
    <template #right>
      <div class="left">
        <h1>{{ translatedRouteName }}</h1>
      </div>
    </template>
    <template #left>
      <div class="right flex items-center gap-4">
        <va-icon-menu-collapsed
          :class="{ 'x-flip': isSidebarMinimized }"
          class="va-navbar__item"
          :color="colors.primary"
          @click="isSidebarMinimized = !isSidebarMinimized"
        />
        <LocaleSelect id="local-switcher"></LocaleSelect>
      </div>
    </template>
  </va-navbar>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../../stores/global-store'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import VuesticLogo from '../VuesticLogo.vue'
import VaIconMenuCollapsed from '../icons/VaIconMenuCollapsed.vue'
import AppNavbarActions from './components/AppNavbarActions.vue'
import LocaleSelect from '../LocaleSelect.vue'

const router = useRouter()
const { t } = useI18n()
const GlobalStore = useGlobalStore()
const { isSidebarMinimized, userName } = storeToRefs(GlobalStore)
const { getColors } = useColors()
const colors = computed(() => getColors())

// Computed property to reactively track route name changes and translate
const translatedRouteName = computed(() => {
  return router.currentRoute.value.name ? t(router.currentRoute.value.name) : ''
})
</script>

<style lang="scss" scoped>
.va-navbar {
  box-shadow: var(--va-box-shadow);
  z-index: 2;
  background-color: #ffffff !important;
  padding: 0.5rem 1rem;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.x-flip {
  transform: scaleX(-100%);
}

@media screen and (max-width: 768px) {
  .va-navbar {
    padding: 0.5rem;
  }

  .right {
    gap: 0.5rem;
  }
}
</style>
