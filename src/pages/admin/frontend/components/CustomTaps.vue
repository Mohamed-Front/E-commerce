<template>
  <div class="mx-auto px-4 max-w-[1500px]">
    <!-- Custom Tabs -->
    <div v-for="tab in customTabs" :key="tab.id">
      <div class="flex items-center justify-between">
        <h2
          class="font-bold font-sans text-gray-800 lg:mt-4 xs:mt-2 xs:text-lg sm:text-xl md:text-2xl lg:text-3xl"
        >
          {{ locale === 'ar' ? tab.name_ar : tab.name_en }}
        </h2>
      </div>

      <!-- Swiper for Both Row Types -->
      <swiper
        :modules="[Autoplay, Grid]"
        :slides-per-view="tab.row_type === 1 ? 4 : 2"
        :grid="tab.row_type === 2 ? { rows: 2, fill: 'row' } : null"
        :space-between="tab.row_type === 1 ? 8 : 16"
        :loop="true"
        :autoplay="{ delay: 0, disableOnInteraction: true }"
        :speed="25000"
        :grab-cursor="true"
        class="mt-6 pb-1"
        :breakpoints="
          tab.row_type === 1
            ? {
                320: { slidesPerView: 2, spaceBetween: 8 },
                640: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 5, spaceBetween: 20 }
              }
            : {
                320: { slidesPerView: 2, spaceBetween: 8, grid: { rows: 2 } },
                640: { slidesPerView: 2, spaceBetween: 12, grid: { rows: 2 } },
                768: { slidesPerView: 3, spaceBetween: 16, grid: { rows: 2 } },
                1024: { slidesPerView: 5, spaceBetween: 20, grid: { rows: 2 } }
              }
        "
      >

  <SwiperSlide
    v-for="(detail, i) in tab.details"
    :key="i"
    class="group flex flex-col items-start pb-[1%] rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-2"
  >
    <router-link
      :to="linkToDetail(tab.type, detail.id, locale === 'ar' ? detail.name_ar : detail.name_en)"
      class="block w-full"
    >
      <div class="w-full aspect-[3.3/4] overflow-hidden rounded-xl shadow-sm relative">
        <img
          :src="detail.media[0]?.url || '/placeholder.jpg'"
          :alt="locale === 'ar' ? detail.name_ar : detail.name_en"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>

      <p class="font-sans mt-4 mb-1 text-center mx-3 text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg">
        {{ locale === 'ar' ? detail.name_ar : detail.name_en }}
      </p>
    </router-link>
  </SwiperSlide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Grid } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/grid'
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const locale = ref(localStorage.getItem('appLang') || 'ar')
const stores = ref([])
const customTabs = ref([])
const storeId = ref(localStorage.getItem('defaultStoreId') || null)
const router = useRouter()
const route = useRoute()

// Fetch stores
const fetchStores = async () => {
  try {
    const response = await axios.get(`api/home/get-stores`)
    stores.value = response.data.data.data
    const defaultStore = stores.value.find(store => store.is_default === 4)

  } catch (error) {
    console.error('Error fetching stores:', error)
  }
}

// Fetch custom tabs based on route
const fetchCustomTabs = async () => {
  try {
    const type = ['home', 'stores-hasmarket'].includes(route.name) ? 'store' : 'category'
    const id = route.params.id || storeId.value
    if (!id) {
      console.error('No store ID available')
      return
    }
    const response = await axios.get(`/api/home/get-custom-tab/${type}/${id}`)
    customTabs.value = response.data.data.data
  } catch (error) {
    console.error('Error fetching custom tabs:', error)
  }
}

const linkToDetail = (type, id, name) => {
  const routeName =
    type === 1 ? 'customtap-category' :
    type === 2 ? 'customtap-products' :
    type === 3 ? 'customtap-brand' :
    null
  if (!routeName) return null
  return { name: routeName, params: { id }, query: { title: name } }
}
// Add to cart placeholder
const addToCart = (detail) => {
  console.log('Added to cart:', detail)
}

// Watch route changes
watch(
  () => route.name,
  () => {
    if (storeId.value || route.params.id) {
      fetchCustomTabs()
    }
  },
  { immediate: true }
)

// Initialize data on mount
onMounted(() => {
  fetchStores()
  if (storeId.value || route.params.id) {
    fetchCustomTabs()
  }
})
</script>

<style scoped>
/* Custom scrollbar for swiper */
.swiper {
  @apply w-full pb-8;
}

.swiper-slide {
  @apply flex flex-col h-auto; /* Ensure slides have auto height for grid layout */
}

/* Optional: Custom scrollbar for the container */
::-webkit-scrollbar {
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
