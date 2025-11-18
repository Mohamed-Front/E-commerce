<template>
  <main class="bg-[#FAF7F0] min-h-screen py-12">
    <section class="mx-auto max-w-7xl px-4">
      <h1
        class="text-4xl font-bold text-center mb-12"
        :class="{
          'font-noto-kufi text-right': locale === 'ar',
          'font-plus-jakarta': locale === 'en'
        }"
      >
        {{ t('favorites.title') }}
      </h1>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-xl font-semibold text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchFavorites()" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          {{ t('common.retry') }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="text-center py-20">
        <p class="text-2xl text-gray-600 mb-6">{{ t('favorites.empty') }}</p>
        <button @click="router.push({ name: 'Home' })" class="bg-[#A6853B] text-white px-8 py-3 rounded-lg hover:bg-[#8f702c] transition">
          {{ t('favorites.continueShopping') }}
        </button>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="pro in favorites"
          :key="pro.id + '-' + (pro.variant_id || '')"
          class="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer"
          @click="router.push({ name: 'Product-details', params: { id: pro.id } })"
        >
          <!-- Image -->
          <div class="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              :src="pro.img"
              :alt="pro.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>

            <!-- Remove from Wishlist Button -->
            <button
              @click.stop="removeFromWishlist(pro)"
              class="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg z-10 text-red-500 hover:bg-red-50 transition-all"
              :aria-label="t('favorites.remove')"
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

          <!-- Content -->
          <div class="p-5 flex flex-col flex-grow">
            <h3 class="font-semibold text-gray-900 text-lg line-clamp-2 mb-2">
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

            <!-- Price & Cart -->
            <div class="mt-auto flex items-center justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-gray-900">
                  {{ $t('currencyLabel') }} {{ formatPrice(pro.final_price) }}
                </span>
                <span v-if="pro.total_discounts_value > 0" class="text-base line-through text-blue-600 opacity-80">
                  {{ $t('currencyLabel') }} {{ formatPrice(pro.base_price) }}
                </span>
              </div>

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

            <!-- Free Shipping -->
            <div v-if="pro.is_free_shipping" class="flex items-center mt-3 text-[#0b3baa] text-xs font-medium">
              <i class="pi pi-truck mr-1"></i>
              {{ $t("products.Free_Delivery") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="mt-16 flex justify-center">
        <nav class="inline-flex gap-2" aria-label="Pagination">
          <button
            v-for="link in pagination.links"
            :key="link.label"
            @click="link.url && fetchFavorites(extractPage(link.url))"
            :disabled="!link.url"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              link.active
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-50'
            ]"
            v-html="link.label"
          />
        </nav>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../../../../stores/WebAuth'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// State
const favorites = ref([])
const isLoading = ref(true)
const error = ref(null)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  links: []
})

// Helpers
const formatPrice = (price) => Number(price || 0).toFixed(2)
const truncateName = (name, len) => name?.length > len ? name.slice(0, len) + '...' : name
const extractPage = (url) => {
  if (!url) return 1
  const match = url.match(/page=(\d+)/)
  return match ? parseInt(match[1]) : 1
}

// Fetch Wishlist
const fetchFavorites = async (page = 1) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' })
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const res = await axios.get('/api/wishlists', { params: { page, limit: 12 } })
    const data = res.data.data

    favorites.value = (data.data || []).map(p => ({
      id: p.id,
      variant_id: p.variant_id || null,
      name: locale.value === 'ar' ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar),
      sub_name: locale.value === 'ar' ? (p.sub_name_ar || p.sub_name_en) : (p.sub_name_en || p.sub_name_ar),
      base_price: parseFloat(p.base_price),
      total_discounts_value: parseFloat(p.total_discounts_value || 0),
      final_price: Math.max(0, parseFloat(p.base_price) - parseFloat(p.total_discounts_value || 0)),
      img: p.media?.find(m => m.name === 'product_main_image')?.url || p.key_default_image || '/placeholder.jpg',
      total_rating: p.total_rating || '0.0',
      total_reviews: p.total_reviews || 0,
      in_cart: p.in_cart || false,
      is_stock: p.is_stock,
      isOutOfStock: p.is_stock === 0,
      is_free_shipping: p.is_free_shipping || false,
      is_wished: true
    }))

    pagination.value = {
      current_page: data.current_page,
      last_page: data.last_page,
      links: data.links || []
    }
  } catch (err) {
    error.value = t('favorites.errorLoading')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Actions
const addToCart = async (product) => {
  if (!authStore.authenticatedweb) return router.push({ name: 'AuthLogin' })
  if (product.isOutOfStock || product.in_cart) return

  try {
    await axios.post('/api/cart/add', { product_id: product.id, variant_id: product.variant_id, quantity: 1 })
    product.in_cart = true
  } catch (err) {
    alert(t('cart.error'))
  }
}

const removeFromWishlist = async (product) => {
  try {
    await axios.delete(`/api/wishlists/${product.id}`, {
      data: { variant_id: product.variant_id }
    })
    favorites.value = favorites.value.filter(p =>
      p.id !== product.id || p.variant_id !== product.variant_id
    )
  } catch (err) {
    alert(t('favorites.errorWishlist'))
  }
}

// Lifecycle
onMounted(() => {
  locale.value = localStorage.getItem('appLang') || 'ar'
  fetchFavorites()
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
