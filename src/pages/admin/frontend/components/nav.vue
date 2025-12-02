<template>
  <div>
    <!-- Mobile Top Navigation -->
    <nav class="h-[56px] bg-[#fff] flex py-2 px-4 md:hidden relative shadow-sm">
      <div class="w-full flex justify-between items-center">
        <!-- Left: Stores Dropdown -->
        <div class="flex items-center">
          <span class="icon-container bg-[#E6AC31] cursor-pointer" @click.stop="toggleDropdown">
            <i class="fa-solid fa-store text-white"></i>
          </span>
          <!-- Show Default Store Name -->
          <span class="ml-2 text-sm text-gray-700" v-if="defaultStore">{{ defaultStore.name }}</span>
          <!-- Stores Dropdown Menu -->
          <transition name="dropdown-fancy">
            <div
              v-if="isDropdownOpen"
              class="absolute top-full left-0 rtl:right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 overflow-hidden dropdown-fancy"
              ref="storesDropdown"
            >
              <div
                v-for="store in stores"
                :key="store.id"
                @click="selectStore(store)"
                class="flex items-center px-4 py-3 transition-all duration-300 cursor-pointer dropdown-item"
                :class="{ 'bg-amber-50 border-r-4 border-amber-500': store.id === defaultStoreId }"
              >
                <div class="h-full w-full flex items-center justify-center">
                  <div
                    v-if="getStoreImage(store)"
                    class="h-full w-full flex items-center justify-center overflow-hidden"
                  >
                    <img
                      :src="getStoreImage(store)"
                      alt="Store Logo"
                      class="max-w-[90%] max-h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div v-else class="h-full w-full flex items-center justify-center">
                    <i class="fa-solid fa-store text-gray-400 text-xl"></i>
                  </div>
                  <div
                    class="absolute inset-0 rounded-lg border border-transparent group-hover:border-[#E6AC31] transition-all duration-300"
                  ></div>
                </div>

                <span class="text-sm text-gray-700 font-medium">{{ store.name }}</span>
                <i v-if="store.id === defaultStoreId" class="fa-solid fa-check ml-auto text-amber-600 text-xs mx-2"></i>
              </div>
            </div>
          </transition>
        </div>

        <!-- Center: Search Bar -->
        <SearchBar />

        <!-- Right Icons -->
        <div class="flex items-center gap-2">
          <Notifications />
          <span
            class="icon-container bg-[#F2EDDE] cursor-pointer hover:bg-gray-200 transition-colors"
            @click="toggleLang"
          >
            <svg width="8" height="12" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0.509563 12.5V0.579999H8.18956V1.78H1.78956V5.924H7.86956V7.124H1.78956V11.3H8.18956V12.5H0.509563Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
      </div>
    </nav>

    <!-- Desktop Navigation -->
    <nav class="h-[60px] bg-[#fff] flex py-6 px-6 hidden md:flex shadow-sm">
      <div class="w-full flex items-center justify-between">
        <!-- Left: Stores -->
        <div class="flex-[0_0_25%] h-[40px] flex items-center mx-2 overflow-x-auto scrollbar-thin">
          <router-link
            v-for="store in stores"
            :key="store.id"
            :to="linkToStore(store)"
            custom
            v-slot="{ href, navigate }"
          >
            <a
              :href="href"
              class="store-card relative mx-1.5 rounded-lg cursor-pointer max-h-[36px] w-[90px] bg-gray-100 hover:bg-gray-200 transition-all duration-300 group block"
              :class="{ 'border-2 border-[#E6AC31]': store.id === defaultStoreId }"
              @click="
                (e) => {
                  selectStoreSideEffects(store)
                  navigate(e)
                }
              "
            >
              <div class="h-full w-full flex items-center justify-center">
                <div v-if="getStoreImage(store)" class="h-full w-full flex items-center justify-center overflow-hidden">
                  <img
                    :src="getStoreImage(store)"
                    alt="Store Logo"
                    class="max-w-full max-h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div v-else class="h-full w-full flex items-center justify-center">
                  <i class="fa-solid fa-store text-gray-400 text-xl"></i>
                </div>
                <div
                  class="absolute inset-0 rounded-lg border border-transparent group-hover:border-[#E6AC31] transition-all duration-300"
                ></div>
              </div>
            </a>
          </router-link>
        </div>

        <!-- Center: Search Bar -->
        <SearchBar />

        <!-- Right Icons -->
        <div class="flex items-center justify-end ml-5 gap-3">
          <!-- User Dropdown for Desktop -->
          <div class="relative" v-if="isAuthenticated">
            <span
              class="icon-container bg-[var(--main-text-color)] cursor-pointer hover:bg-gray-700 transition-colors"
              @click.stop="toggleUserDropdown"
            >
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.0406 15.0625C15.8508 13.0055 14.0172 11.5305 11.8773 10.8313C14.053 9.53609 15.0951 6.94698 14.4235 4.50575C13.7518 2.06451 11.5319 0.372875 9 0.372875C6.46806 0.372875 4.24816 2.06451 3.57652 4.50575C2.90487 6.94698 3.94704 9.53609 6.12266 10.8313C3.98281 11.5297 2.14922 13.0047 0.959375 15.0625C0.840586 15.2562 0.836273 15.4991 0.948109 15.6969C1.05995 15.8947 1.27031 16.0162 1.49752 16.0142C1.72473 16.0123 1.93298 15.8872 2.04141 15.6875C3.51328 13.1438 6.11484 11.625 9 11.625C11.8852 11.625 14.4867 13.1438 15.9586 15.6875C16.067 15.8872 16.2753 16.0123 16.5025 16.0142C16.7297 16.0162 16.9401 15.8947 17.0519 15.6969C17.1637 15.4991 17.1594 15.2562 17.0406 15.0625ZM4.625 6C4.625 3.58375 6.58375 1.625 9 1.625C11.4162 1.625 13.375 3.58375 13.375 6C13.375 8.41625 11.4162 10.375 9 10.375C6.58483 10.3724 4.62758 8.41517 4.625 6Z"
                  fill="white"
                />
              </svg>
            </span>
            <transition name="dropdown-fancy">
              <div
                v-if="isUserDropdownOpen"
                class="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 overflow-hidden dropdown-fancy"
                ref="userDropdownDesktop"
              >
                <div class="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
                  <p class="text-sm font-semibold text-gray-700">{{ webUser.name }}</p>
                  <p class="text-xs text-gray-500">{{ webUser.phone }}</p>
                </div>
                <router-link
                  :to="{ name: 'profile' }"
                  class="flex items-center px-4 py-3 transition-all duration-200 cursor-pointer dropdown-item"
                >
                  <i class="fa-solid fa-user-circle text-amber-600 mx-2"></i>
                  <span class="text-sm text-gray-700">{{ $t('profile') }}</span>
                </router-link>

                <div
                  @click="logout"
                  class="flex items-center px-4 py-3 transition-all duration-200 cursor-pointer dropdown-item"
                >
                  <i class="fa-solid fa-sign-out-alt text-amber-600 mx-2"></i>
                  <span class="text-sm text-gray-700">{{ $t('logout') }}</span>
                </div>
              </div>
            </transition>
          </div>
          <router-link
            v-else
            :to="{ name: 'authlog' }"
            class="icon-container bg-[var(--main-text-color)] cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.0406 15.0625C15.8508 13.0055 14.0172 11.5305 11.8773 10.8313C14.053 9.53609 15.0951 6.94698 14.4235 4.50575C13.7518 2.06451 11.5319 0.372875 9 0.372875C6.46806 0.372875 4.24816 2.06451 3.57652 4.50575C2.90487 6.94698 3.94704 9.53609 6.12266 10.8313C3.98281 11.5297 2.14922 13.0047 0.959375 15.0625C0.840586 15.2562 0.836273 15.4991 0.948109 15.6969C1.05995 15.8947 1.27031 16.0162 1.49752 16.0142C1.72473 16.0123 1.93298 15.8872 2.04141 15.6875C3.51328 13.1438 6.11484 11.625 9 11.625C11.8852 11.625 14.4867 13.1438 15.9586 15.6875C16.067 15.8872 16.2753 16.0123 16.5025 16.0142C16.7297 16.0162 16.9401 15.8947 17.0519 15.6969C17.1637 15.4991 17.1594 15.2562 17.0406 15.0625ZM4.625 6C4.625 3.58375 6.58375 1.625 9 1.625C11.4162 1.625 13.375 3.58375 13.375 6C13.375 8.41625 11.4162 10.375 9 10.375C6.58483 10.3724 4.62758 8.41517 4.625 6Z"
                fill="white"
              />
            </svg>
          </router-link>

          <router-link
            :to="{ name: 'cart' }"
            class="icon-container bg-[#E6AC31] cursor-pointer hover:bg-[#d89b2a] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.3547 4.09922C17.2359 3.95709 17.0602 3.87497 16.875 3.875H4.27187L3.88984 1.77656C3.78186 1.18219 3.26426 0.750087 2.66016 0.75H2.66016C0.904822 0.75 0.625 1.02982 0.625 1.375C0.625 1.72018 0.904822 2 1.25 2H2.65625L4.65312 12.9602C4.71195 13.2852 4.8556 13.5889 5.06953 13.8406C4.24996 14.6061 4.14205 15.8674 4.81967 16.761C5.49729 17.6546 6.74093 17.891 7.69916 17.3084C8.65740 16.7257 9.01981 15.5128 8.53828 14.5H12.0867C11.9469 14.7927 11.8745 15.1131 11.875 15.4375C11.875 16.6456 12.8544 17.625 14.0625 17.625C15.2706 17.625 16.25 16.6456 16.25 15.4375C16.25 14.2294 15.2706 13.25 14.0625 13.25H6.49766C6.1956 13.25 5.9368 13.0339 5.88281 12.7367L5.63516 11.375H14.6977C15.6038 11.3749 16.3802 10.7267 16.5422 9.83516L17.4922 4.61172C17.5247 4.42894 17.4744 4.24115 17.3547 4.09922ZM7.5 15.4375C7.5 15.9553 7.08027 16.375 6.5625 16.375C6.04473 16.375 5.625 15.9553 5.625 15.4375C5.625 14.9197 6.04473 14.5 6.5625 14.5C7.08027 14.5 7.5 14.9197 7.5 15.4375ZM15 15.4375C15 15.9553 14.5803 16.375 14.0625 16.375C13.5447 16.375 13.125 15.9553 13.125 15.4375C13.125 14.9197 13.5447 14.5 14.0625 14.5C14.5803 14.5 15 14.9197 15 15.4375ZM15.3125 9.61172C15.2584 9.90978 14.9982 10.1261 14.6953 10.125H5.40781L4.49922 5.125H16.1258L15.3125 9.61172Z"
                fill="white"
              />
            </svg>
          </router-link>

          <router-link
            :to="{ name: 'favorites' }"
            class="icon-container bg-[#F2EDDE] cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <i class="fa-solid fa-heart text-black"></i>
          </router-link>

          <Notifications />

          <!-- Fixed Language Toggle Button -->
          <span
            class="icon-container bg-[#F2EDDE] cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center font-bold"
            @click="toggleLang"
          >
            <p class="text-base">{{ currentText }}</p>
          </span>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-gray-200 z-50 md:hidden">
      <div class="flex h-full justify-around items-center px-2">
        <router-link to="/" class="flex flex-col items-center justify-center text-gray-600 hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-house text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('الرئيسية') }}</span>
        </router-link>

        <router-link to="/favorites" class="flex flex-col items-center justify-center text-gray-600 hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-heart text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('المفضلة') }}</span>
        </router-link>

        <router-link to="/cart" class="flex flex-col items-center justify-center text-gray-600 hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-cart-shopping text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('السلة') }}</span>
        </router-link>

        <div @click="UserPage" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-user text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('حسابي') }}</span>
        </div>

        <router-link to="/stores" class="flex flex-col items-center justify-center text-gray-600 hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-store text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('الماركت') }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../../../stores/WebAuth'
import Notifications from './Notification.vue'
import SearchBar from './SearchBar.vue'

// Fixed variable name + initialize correctly
const currentText = ref('E')

const authStore = useAuthStore()
const stores = ref([])
const router = useRouter()
const route = useRoute()
const isDropdownOpen = ref(false)
const isUserDropdownOpen = ref(false)
const defaultStoreId = ref('')
const defaultStore = ref(null)
const hasMarket = ref(null)
const isAuthenticated = ref(false)
const webUser = ref({})

const storesDropdown = ref(null)
const userDropdownDesktop = ref(null)

const getStoreImage = (store) => {
  const storeImage = store.media.find((mediaItem) => mediaItem.name === 'store_image')
  return storeImage ? storeImage.url : null
}

const fetchStores = async () => {
  try {
    const response = await axios.get('api/home/get-stores')
    stores.value = response.data.data.data
    setDefaultStore()
  } catch (error) {
    console.error('Error fetching stores:', error)
  }
}

const setDefaultStore = () => {
  const storedStoreId = localStorage.getItem('defaultStoreId')
  const storedHasMarket = localStorage.getItem('hasMarket')
  if (storedStoreId && storedHasMarket !== null) {
    const selectedStore = stores.value.find((store) => store.id === parseInt(storedStoreId))
    if (selectedStore) {
      defaultStoreId.value = selectedStore.id
      defaultStore.value = selectedStore
      hasMarket.value = selectedStore.has_market
      return
    }
  }

}

const linkToStore = (store) => (store.has_market ? { name: 'stores-hasmarket' } : { name: 'home' })

const selectStoreSideEffects = (store) => {
  defaultStoreId.value = store.id
  defaultStore.value = store
  hasMarket.value = store.has_market
  localStorage.setItem('defaultStoreId', store.id)
  localStorage.setItem('hasMarket', store.has_market)
  isDropdownOpen.value = false
}

const selectStore = (store) => {
  selectStoreSideEffects(store)
  if (store.has_market) {
    router.push({ name: 'stores-hasmarket' })
  } else {
    router.push({ name: 'home' })
  }
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  isUserDropdownOpen.value = false
}

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
  isDropdownOpen.value = false
}

// Fixed toggleLang: now correctly updates the button text after reload
const toggleLang = () => {
  localStorage.setItem('lastRoute', route.fullPath)
  const currentLang = localStorage.getItem('appLang') || 'en'
  const newLang = currentLang === 'en' ? 'ar' : 'en'
  localStorage.setItem('appLang', newLang)

  // Update button text immediately before reload
  currentText.value = newLang === 'ar' ? 'A' : 'E'

  window.location.reload()
}

const UserPage = () => {
  if (isAuthenticated.value) {
    router.push({ name: 'profile' })
  } else {
    router.push({ name: 'authlog' })
  }
}

const logout = () => {
  authStore.handleLogout()
}

const handleClickOutside = (event) => {
  if (isDropdownOpen.value && storesDropdown.value && !storesDropdown.value.contains(event.target)) {
    const storeIcon = event.target.closest('.icon-container')
    if (!storeIcon || !storeIcon.querySelector('.fa-store')) {
      isDropdownOpen.value = false
    }
  }
  if (isUserDropdownOpen.value && userDropdownDesktop.value && !userDropdownDesktop.value.contains(event.target)) {
    const userIcon = event.target.closest('.icon-container')
    if (!userIcon || !userIcon.querySelector('svg')) {
      isUserDropdownOpen.value = false
    }
  }
}

// Set correct language text on component mount
const updateLangButton = () => {
  const lang = localStorage.getItem('appLang') || 'en'
  currentText.value = lang === 'ar' ? 'E' : 'Ar'
}

onMounted(() => {
  const storedStoreId = localStorage.getItem('defaultStoreId')
  const authStatus = localStorage.getItem('authenticatedweb')
  const userData = localStorage.getItem('webUser')
  const lastRoute = localStorage.getItem('lastRoute')

  if (authStatus === 'true' && userData) {
    isAuthenticated.value = true
    webUser.value = JSON.parse(userData)
  }

  if (storedStoreId) {
    defaultStoreId.value = parseInt(storedStoreId)
    hasMarket.value = localStorage.getItem('hasMarket') === '1' ? 1 : 0
    fetchStores()
  } else {
    fetchStores()
  }

  if (lastRoute && lastRoute !== '/') {
    router.push(lastRoute)
    localStorage.removeItem('lastRoute')
  }

  // This is the key fix:
  updateLangButton()

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Your existing styles remain unchanged */
.icon-container {
  @apply flex place-content-center p-2 rounded-md items-center text-[0.5rem] h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] md:h-[36px] md:w-[36px] transition-all duration-200;
}
/* ... rest of your styles ... */
</style>
