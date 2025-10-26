<template>
  <div class="mx-auto px-4 max-w-[1500px]">
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <div v-else-if="error" class="text-center py-16 text-red-600">
      <p class="text-lg font-semibold">{{ error }}</p>
      <button @click="fetchCustomTabs(route.params.id, currentPage)" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
        Retry
      </button>
    </div>

    <div v-else v-for="tab in customTabs" :key="tab.id" class="m-auto max-w-7xl">

      <div
        class="mt-6 grid gap-x-4 gap-y-8"
        :class="
          tab.row_type === 1
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5'
        "
      >
        <div
          v-for="(detail, i) in tab.details"
          :key="i"
          class="group flex flex-col items-start cursor-pointer transition-all pb-[1%] rounded-lg shadow-lg duration-300 hover:-translate-y-2 h-auto"
          @click="navigateToDetail(detail.has_subcategories, detail.id, locale === 'ar' ? detail.name_ar : detail.name_en)"
          :aria-label="`Maps to ${locale === 'ar' ? detail.name_ar : detail.name_en}`"
        >
          <div class="w-full overflow-hidden rounded-xl shadow-sm relative bg-gray-100 aspect-square">
            <img
              :src="detail.media[0]?.url || '/placeholder.jpg'"
              :alt="locale === 'ar' ? detail.name_ar : detail.name_en"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
            ></div>
          </div>
          <p
            class="font-sans mt-4 mb-1 text-center mx-3 text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg w-full truncate"
          >
            {{ locale === 'ar' ? detail.name_ar : detail.name_en }}
          </p>
        </div>
      </div>

      <div v-if="pagination.last_page > 1" class="flex justify-center items-center pt-8">
        <nav class="inline-flex gap-2" aria-label="Pagination">
          <template v-for="(link, index) in pagination.links" :key="index">
            <button
              v-if="link.url && !['&laquo; Previous', 'Next &raquo;'].includes(link.label)"
              @click="goToPage(parseInt(link.label))"
              :aria-current="link.active ? 'page' : undefined"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                link.active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
              ]"
            >
              {{ link.label }}
            </button>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

// --- Props ---
defineProps({
  title: {
    type: String,
    default: ''
  }
})

// --- Setup ---
const { t } = useI18n()
const locale = ref(localStorage.getItem('appLang') || 'ar')
const customTabs = ref([])
const isLoading = ref(true)
const error = ref(null)
const router = useRouter()
const route = useRoute()
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  links: []
})
const currentPage = ref(parseInt(route.query.page) || 1)
const isMobile = ref(false)

// --- Responsiveness and Page Limit Logic ---
const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

const perPageLimit = computed(() => {
  return isMobile.value ? 8 : 15
})

onMounted(() => {
  checkScreenSize()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkScreenSize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkScreenSize)
  }
})

// --- Data Fetching ---
const fetchCustomTabs = async (id, page = 1) => {
  if (!id) return

  isLoading.value = true
  error.value = null

  const url = `/api/home/get-media-link/details/${route.params.id}?limit=${perPageLimit.value}&page=${page}`

  try {
    const response = await axios.get(url)
    const apiData = response.data.data

    pagination.value = {
      current_page: apiData.details.current_page,
      last_page: apiData.details.last_page,
      next_page_url: apiData.details.next_page_url,
      prev_page_url: apiData.details.prev_page_url,
      links: apiData.details.links
    }
    currentPage.value = apiData.details.current_page

    customTabs.value = [
      {
        id: id,
        name_ar: apiData.name_ar || t('home.customTabTitle', { number: id }),
        name_en: apiData.name_en || t('home.customTabTitle', { number: id }),
        type: apiData.type,
        row_type: apiData.type === 1 ? 1 : 2,
        details: (apiData.details.data || []).map((item) => ({
          id: item.id,
          name_ar: item.name_ar,
          name_en: item.name_en,
          has_subcategories: item.has_subcategories,
          media: item.media
        }))
      }
    ]
  } catch (err) {
    console.error('Error fetching custom tabs:', err)
    error.value = t('error.fetchFailed') || 'Failed to load custom content.'
  } finally {
    isLoading.value = false
    router.push({ query: { ...route.query} }).catch(() => {})
  }
}

// --- Navigation ---
const navigateToDetail = (hasSubcategories, id, name) => {
  let routeName
  if (hasSubcategories) {
    routeName = 'customtap-category'
  } else {
    routeName = 'customtap-products'
  }
  router.push({ name: routeName, params: { id }, query: { title: name } })
}

// --- Pagination ---
const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= pagination.value.last_page) {
    fetchCustomTabs(route.params.id, pageNumber)
  }
}

// --- Lifecycle & Watchers ---
onMounted(() => {
  fetchCustomTabs(route.params.id, currentPage.value)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      currentPage.value = 1
      fetchCustomTabs(newId, 1)
    }
  }
)

watch(perPageLimit, (newLimit, oldLimit) => {
  if (newLimit !== oldLimit) {
    currentPage.value = 1
    fetchCustomTabs(route.params.id, 1)
  }
})
</script>

<style scoped>
/* You can add custom styles here if needed, but Tailwind is mostly used inline */
</style>
