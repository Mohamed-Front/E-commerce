<template>
  <div class="mx-auto px-4 max-w-[1500px] py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-xl font-semibold text-red-600 mb-4">{{ error }}</p>
      <button @click="fetchProducts(route.params.id, currentPage)" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
        {{ t('products.retry') || 'Retry' }}
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else class="max-w-7xl mx-auto">
      <div class="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div
          v-for="pro in products"
          :key="pro.id"
          class="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          @click="navigateToDetail(pro.id)"
        >
          <!-- Image Container -->
          <div class="aspect-square bg-gray-100 overflow-hidden relative">
            <img
              :src="pro.img"
              :alt="pro.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>

            <!-- Wishlist Button -->
            <button
              v-if="authStore.authenticatedweb"
              @click.stop="toggleFavorite(pro)"
              class="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg z-10 transition-all"
              :class="{ 'text-red-500': pro.is_wished }"
              :aria-label="pro.is_wished ? t('wishlist.remove') : t('wishlist.add')"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <!-- Out of Stock Overlay -->
            <div v-if="pro.isOutOfStock" class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span class="text-white font-bold text-lg">{{ t('products.outOfStock') }}</span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 flex flex-col">
            <h3 class="font-semibold text-gray-900 text-lg line-clamp-2 leading-tight mb-2">
              {{ truncateName(pro.name, 50) }}
            </h3>

            <p v-if="pro.sub_name" class="text-gray-600 text-sm line-clamp-2 mb-3">
              {{ pro.sub_name }}
            </p>

            <!-- Rating -->
            <div class="flex items-center gap-1 mb-3">
              <span class="text-yellow-500 font-bold text-sm">{{ pro.total_rating || '0.0' }}</span>
              <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"/>
              </svg>
              <span class="text-gray-500 text-xs">({{ pro.total_reviews || 0 }})</span>
            </div>

            <!-- Price & Cart Button -->
            <div class="mt-auto flex items-center justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-gray-900">
                  {{ $t('currencyLabel') }} {{ formatPrice(pro.final_price) }}
                </span>
                <span v-if="pro.total_discounts_value > 0" class="text-base line-through text-blue-600 opacity-80">
                  {{ $t('currencyLabel') }} {{ formatPrice(pro.base_price) }}
                </span>
              </div>

              <!-- Add to Cart Button -->
              <button
                @click.stop="addToCart(pro)"
                :disabled="pro.isOutOfStock"
                class="p-3 rounded-full transition-all duration-300 shadow-md"
                :class="[
                  pro.in_cart
                    ? 'bg-[#0b3baa] text-white'
                    : pro.isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#A6853B] text-white hover:bg-[#8f702c]'
                ]"
              >
                <svg v-if="pro.in_cart" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0 .984.984 0 0 0 0 1.4l4.2 4.2c.39.39 1.01.39 1.4 0l8.4-8.4a.984.984 0 0 0 0-1.4.984.984 0 0 0-1.4 0L9 16.2z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.708.707 1.708H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </button>
            </div>

            <!-- Free Shipping Badge -->
            <div v-if="pro.is_free_shipping" class="flex items-center mt-3 text-[#0b3baa] text-xs font-medium">
              <i class="pi pi-truck mr-1"></i>
              {{ $t("products.Free_Delivery") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="mt-12 flex justify-center">
        <nav class="inline-flex gap-2" aria-label="Pagination">
          <template v-for="(link, index) in pagination.links" :key="index">
            <button
              v-if="link.url"
              @click="goToPage(extractPageFromUrl(link.url))"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                link.active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
              ]"
              :aria-current="link.active ? 'page' : undefined"
              :disabled="!link.url"
            >
              <span v-html="link.label"></span>
            </button>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useAuthStore } from '../../../../../stores/WebAuth'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const products = ref([])
const isLoading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  links: [],
})

// Helpers
const formatPrice = (price) => Number(price || 0).toFixed(2)
const truncateName = (name, len) => name?.length > len ? name.slice(0, len) + '...' : name
const extractPageFromUrl = (url) => {
  if (!url) return 1
  const match = url.match(/page=(\d+)/)
  return match ? parseInt(match[1]) : 1
}

// Fetch Products
const fetchProducts = async (id, page = 1) => {
  isLoading.value = true
  error.value = null

  try {
    const limit = window.innerWidth < 768 ? 10 : 20
    const url = `/api/home/get-media-link/details/${id || ''}?limit=${limit}&page=${page}`

    const res = await axios.get(url)
    const data = res.data.data.details || res.data.data

    products.value = data.data.map(p => ({
      id: p.id,
      name: locale.value === 'ar' ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar),
      sub_name: locale.value === 'ar' ? (p.sub_name_ar || p.sub_name_en) : (p.sub_name_en || p.sub_name_ar),
      base_price: parseFloat(p.base_price),
      total_discounts_value: parseFloat(p.total_discounts_value || 0),
      final_price: Math.max(0, parseFloat(p.base_price) - parseFloat(p.total_discounts_value || 0)),
      img: p.media?.find(m => m.name === 'product_main_image')?.url || p.key_default_image || '/placeholder.jpg',
      total_rating: p.total_rating || '0.0',
      total_reviews: p.total_reviews || 0,
      is_wished: p.is_wished || false,
      in_cart: p.in_cart || false,
      is_stock: p.is_stock,
      isOutOfStock: p.is_stock === 0,
      is_free_shipping: p.is_free_shipping || false,
    }))

    pagination.value = {
      current_page: data.current_page,
      last_page: data.last_page,
      links: data.links || [],
    }
    currentPage.value = data.current_page
  } catch (err) {
    error.value = t('error.fetchFailed') || 'Failed to load products'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Actions
const navigateToDetail = (id) => {
  router.push({ name: 'Product-details', params: { id } })
}

const goToPage = (page) => {
  if (page !== currentPage.value) {
    fetchProducts(route.params.id, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const addToCart = async (product) => {
  if (!authStore.authenticatedweb) return router.push({ name: 'AuthLogin' })
  if (product.isOutOfStock || product.in_cart) return

  try {
    await axios.post('/api/cart/add', { product_id: product.id, quantity: 1 })
    product.in_cart = true
  } catch (err) {
    alert(t('cart.error'))
  }
}

const toggleFavorite = async (product) => {
  if (!authStore.authenticatedweb) return router.push({ name: 'AuthLogin' })

  const wasWished = product.is_wished
  try {
    if (wasWished) {
      await axios.delete(`/api/wishlists/${product.id}`)
    } else {
      await axios.post('/api/wishlists', { product_id: product.id })
    }
    product.is_wished = !wasWished
  } catch (err) {
    product.is_wished = wasWished
  }
}

// Lifecycle
onMounted(() => {
  locale.value = localStorage.getItem('appLang') || 'ar'
  fetchProducts(route.params.id, route.query.page || 1)
})

watch(() => route.params.id, (newId) => {
  currentPage.value = 1
  fetchProducts(newId, 1)
})

watch(() => route.query.page, (page) => {
  const p = parseInt(page) || 1
  if (p !== currentPage.value) {
    fetchProducts(route.params.id, p)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
