<template>
  <div>
    <!-- Mobile Top Navigation -->
    <nav class="h-[56px] bg-[#fff] flex py-2 px-4 md:hidden relative shadow-sm">
      <div class="w-full flex justify-between items-center">
        <!-- Left: Stores Dropdown -->
        <div class="flex items-center">
          <span class="icon-container bg-[#E6AC31] cursor-pointer" @click="toggleDropdown">
            <i class="fa-solid fa-store text-white"></i>
          </span>
          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div v-if="isDropdownOpen" class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
              <div v-for="store in stores" :key="store.id" @click="router.push(`/stores/${store.id}`)"
                   class="flex items-center px-4 py-3 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                <img v-if="getStoreImage(store)" :src="getStoreImage(store)" alt="Store Logo"
                     class="h-6 w-10 object-contain mr-2" />
                <span class="text-sm text-gray-700">{{ store.name }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- Center: Search Bar -->
        <div class="flex-grow flex items-center bg-gray-100 rounded-lg h-9 mx-3">
          <i class="fa-solid fa-magnifying-glass text-gray-500 px-2.5 text-sm"></i>
          <input
            class="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            type="text"
            :placeholder="$t('search')"
          />
        </div>

        <!-- Right Icons -->
        <div class="flex items-center gap-2">
          <span @click="router.push({ name: 'Cart' })" class="icon-container bg-[#E6AC31] cursor-pointer hover:bg-[#d89b2a] transition-colors">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3547 4.09922C17.2359 3.95709 17.0602 3.87497 16.875 3.875H4.27187L3.88984 1.77656C3.78186 1.18219 3.26426 0.750087 2.66016 0.75H1.25C0.904822 0.75 0.625 1.02982 0.625 1.375C0.625 1.72018 0.904822 2 1.25 2H2.65625L4.65312 12.9602C4.71195 13.2852 4.8556 13.5889 5.06953 13.8406C4.24996 14.6061 4.14205 15.8674 4.81967 16.761C5.49729 17.6546 6.74093 17.891 7.69916 17.3084C8.6574 16.7257 9.01981 15.5128 8.53828 14.5H12.0867C11.9469 14.7927 11.8745 15.1131 11.875 15.4375C11.875 16.6456 12.8544 17.625 14.0625 17.625C15.2706 17.625 16.25 16.6456 16.25 15.4375C16.25 14.2294 15.2706 13.25 14.0625 13.25H6.49766C6.1956 13.25 5.9368 13.0339 5.88281 12.7367L5.63516 11.375H14.6977C15.6038 11.3749 16.3802 10.7267 16.5422 9.83516L17.4922 4.61172C17.5247 4.42894 17.4744 4.24115 17.3547 4.09922ZM7.5 15.4375C7.5 15.9553 7.08027 16.375 6.5625 16.375C6.04473 16.375 5.625 15.9553 5.625 15.4375C5.625 14.9197 6.04473 14.5 6.5625 14.5C7.08027 14.5 7.5 14.9197 7.5 15.4375ZM15 15.4375C15 15.9553 14.5803 16.375 14.0625 16.375C13.5447 16.375 13.125 15.9553 13.125 15.4375C13.125 14.9197 13.5447 14.5 14.0625 14.5C14.5803 14.5 15 14.9197 15 15.4375ZM15.3125 9.61172C15.2584 9.90978 14.9982 10.1261 14.6953 10.125H5.40781L4.49922 5.125H16.1258L15.3125 9.61172Z" fill="white"/>
            </svg>
          </span>
          <span class="icon-container bg-[#F2EDDE] cursor-pointer hover:bg-gray-200 transition-colors" @click="toggleLang">
            <svg width="8" height="12" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.509563 12.5V0.579999H8.18956V1.78H1.78956V5.924H7.86956V7.124H1.78956V11.3H8.18956V12.5H0.509563Z" fill="black"/>
            </svg>
          </span>
        </div>
      </div>
    </nav>

    <!-- Desktop Navigation -->
    <nav class="h-[60px] bg-[#fff] flex py-6 px-6 hidden md:flex shadow-sm ">
      <div class="w-full flex items-center justify-between">
        <!-- Left: Stores -->
        <div class="flex-[0_0_25%] h-[40px] flex items-center mx-2 overflow-x-auto scrollbar-thin">
          <div
            v-for="store in stores"
            :key="store.id"
            @click="showstore(store.id)"
            class="store-card relative mx-1.5 rounded-lg cursor-pointer h-[36px] min-w-[100px] bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
          >
            <div v-if="getStoreImage(store)" class="h-full w-full flex items-center justify-center">
              <img
                :src="getStoreImage(store)"
                alt="Store Logo"
                class="h-[28px] w-[48px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 rounded-lg border border-transparent group-hover:border-[#E6AC31] transition-all duration-300"></div>
            </div>
          </div>
        </div>

        <!-- Center: Search Bar -->
        <div class="flex-[0_0_50%] flex items-center bg-gray-100 rounded-lg h-10 mx-2">
          <i class="fa-solid fa-magnifying-glass text-gray-500 px-3 text-base"></i>
          <input
            class="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            type="text"
            :placeholder="$t('search')"
          />
        </div>

        <!-- Right Icons -->
        <div class=" flex items-center justify-end ml-5 gap-3">
          <span
            class="icon-container bg-[var(--main-text-color)] cursor-pointer hover:bg-gray-700 transition-colors"
            @click="authlogin ? router.push({ name: 'profile' }) : router.push({ name: 'authlog' })"
          >
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0406 15.0625C15.8508 13.0055 14.0172 11.5305 11.8773 10.8313C14.053 9.53609 15.0951 6.94698 14.4235 4.50575C13.7518 2.06451 11.5319 0.372875 9 0.372875C6.46806 0.372875 4.24816 2.06451 3.57652 4.50575C2.90487 6.94698 3.94704 9.53609 6.12266 10.8313C3.98281 11.5297 2.14922 13.0047 0.959375 15.0625C0.840586 15.2562 0.836273 15.4991 0.948109 15.6969C1.05995 15.8947 1.27031 16.0162 1.49752 16.0142C1.72473 16.0123 1.93298 15.8872 2.04141 15.6875C3.51328 13.1438 6.11484 11.625 9 11.625C11.8852 11.625 14.4867 13.1438 15.9586 15.6875C16.067 15.8872 16.2753 16.0123 16.5025 16.0142C16.7297 16.0162 16.9401 15.8947 17.0519 15.6969C17.1637 15.4991 17.1594 15.2562 17.0406 15.0625ZM4.625 6C4.625 3.58375 6.58375 1.625 9 1.625C11.4162 1.625 13.375 3.58375 13.375 6C13.375 8.41625 11.4162 10.375 9 10.375C6.58483 10.3724 4.62758 8.41517 4.625 6Z" fill="white"/>
            </svg>
          </span>
          <span @click="router.push({ name: 'Cart' })" class="icon-container bg-[#E6AC31] cursor-pointer hover:bg-[#d89b2a] transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3547 4.09922C17.2359 3.95709 17.0602 3.87497 16.875 3.875H4.27187L3.88984 1.77656C3.78186 1.18219 3.26426 0.750087 2.66016 0.75H1.25C0.904822 0.75 0.625 1.02982 0.625 1.375C0.625 1.72018 0.904822 2 1.25 2H2.65625L4.65312 12.9602C4.71195 13.2852 4.8556 13.5889 5.06953 13.8406C4.24996 14.6061 4.14205 15.8674 4.81967 16.761C5.49729 17.6546 6.74093 17.891 7.69916 17.3084C8.6574 16.7257 9.01981 15.5128 8.53828 14.5H12.0867C11.9469 14.7927 11.8745 15.1131 11.875 15.4375C11.875 16.6456 12.8544 17.625 14.0625 17.625C15.2706 17.625 16.25 16.6456 16.25 15.4375C16.25 14.2294 15.2706 13.25 14.0625 13.25H6.49766C6.1956 13.25 5.9368 13.0339 5.88281 12.7367L5.63516 11.375H14.6977C15.6038 11.3749 16.3802 10.7267 16.5422 9.83516L17.4922 4.61172C17.5247 4.42894 17.4744 4.24115 17.3547 4.09922ZM7.5 15.4375C7.5 15.9553 7.08027 16.375 6.5625 16.375C6.04473 16.375 5.625 15.9553 5.625 15.4375C5.625 14.9197 6.04473 14.5 6.5625 14.5C7.08027 14.5 7.5 14.9197 7.5 15.4375ZM15 15.4375C15 15.9553 14.5803 16.375 14.0625 16.375C13.5447 16.375 13.125 15.9553 13.125 15.4375C13.125 14.9197 13.5447 14.5 14.0625 14.5C14.5803 14.5 15 14.9197 15 15.4375ZM15.3125 9.61172C15.2584 9.90978 14.9982 10.1261 14.6953 10.125H5.40781L4.49922 5.125H16.1258L15.3125 9.61172Z" fill="white"/>
            </svg>
          </span>
          <span class="icon-container bg-[#F2EDDE] cursor-pointer hover:bg-gray-200 transition-colors" @click="toggleLang">
            <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.509563 12.5V0.579999H8.18956V1.78H1.78956V5.924H7.86956V7.124H1.78956V11.3H8.18956V12.5H0.509563Z" fill="black"/>
            </svg>
          </span>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-gray-200 z-50 md:hidden">
      <div class="flex h-full justify-around items-center px-2">
        <div @click="router.push('/')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-house text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('الرئيسية') }}</span>
        </div>
        <div @click="router.push('/categories')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-grip text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('الفئات') }}</span>
        </div>
        <div @click="router.push('/fashion')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-shirt text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('الموضة') }}</span>
        </div>
        <div
          @click="authlogin ? router.push({ name: 'profile' }) : router.push({ name: 'authlog' })"
          class="flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-[#E6AC31] transition-colors"
        >
          <i class="fa-solid fa-user text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('حسابي') }}</span>
        </div>
        <div @click="router.push('/stores')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-[#E6AC31] transition-colors">
          <i class="fa-solid fa-store text-lg mb-0.5"></i>
          <span class="text-[10px]">{{ $t('الماركت') }}</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const authlogin = ref(false);
const stores = ref([]);
const router = useRouter();
const isDropdownOpen = ref(false);

// Helper function to get the store image URL
const getStoreImage = (store) => {
  const storeImage = store.media.find(mediaItem => mediaItem.name === 'store_image');
  return storeImage ? storeImage.url : null;
};

const fetchStores = async () => {
  try {
    const response = await axios.get('api/home/get-stores');
    stores.value = response.data.data.data;

    // Find the store with is_default: 1 and store its ID in localStorage
    const defaultStore = stores.value.find(store => store.is_default === 1);
    if (defaultStore) {
      localStorage.setItem('defaultStoreId', defaultStore.id);
    }
  } catch (error) {
    console.error('Error fetching stores:', error);
  }
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const showstore = (id) => {
  router.push({ name: 'stores-hasmarket', params: { id } });
};

const toggleLang = () => {
  const currentLang = localStorage.getItem('appLang') || 'en';
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('appLang', newLang);
  window.location.reload();
};

onMounted(() => {
  fetchStores();
});
</script>
<style scoped>
.icon-container {
  @apply flex place-content-center p-2 rounded-md items-center text-[0.5rem] h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] md:h-[36px] md:w-[36px] transition-all duration-200;
}

.store-card {
  @apply relative overflow-hidden;
  transition: all 0.3s ease-in-out;
}

.store-card img {
  @apply transform transition-transform duration-300;
}

.store-card:hover {
  @apply shadow-md bg-gray-200;
}

.store-card:hover img {
  @apply scale-105;
}

.store-card .border {
  @apply transition-all duration-300;
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #E6AC31 #f1f1f1;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #E6AC31;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #d89b2a;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease-in-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Search Bar Enhancement */
input:focus + i {
  @apply text-[#E6AC31];
}

/* Mobile Nav Shadow */
nav {
  @apply transition-shadow duration-300;
}
</style>
