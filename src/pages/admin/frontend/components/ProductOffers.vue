<template>
  <main class="bg-[#FAF7F0]">
    <div class="">
      <section class="mx-auto max-w-7xl">
        <!-- Exclusive Offers -->
        <productsSwiper v-if="exclusive_offers.products.length >= 1" :products="exclusive_offers" />
        <!-- Best Sellers -->
        <productsSwiper v-if="Best_seller.products.length >= 1"  :products="Best_seller" />
        <!-- New Arrivals -->
        <productsSwiper v-if="New_arrival.products.length >= 1"  :products="New_arrival" />
      </section>
    </div>
  </main>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import productsSwiper from '../components/SwiperSlide/productsSwiper.vue'

const { t } = useI18n()
const route = useRoute()

const locale = ref(localStorage.getItem('appLang') || 'ar')
const stor_id = ref(localStorage.getItem('defaultStoreId'))
const categoryId = ref(route.params.id || null)

const exclusive_offers = ref({ title: '', products: [] })
const Best_seller = ref({ title: '', products: [] })
const New_arrival = ref({ title: '', products: [] })
const isLoading = ref(false)
const error = ref(null)

// Helper: Format price
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2)
}

// Helper: Get main image
const getMainImage = (product) => {
  return product.media?.find(m => m.name === 'product_main_image')?.url ||
         product.key_default_image ||
         'https://via.placeholder.com/300x300.png?text=No+Image'
}

// Unified product mapper
const mapProduct = (product) => ({
  id: product.id,
  variant_id: product.variant_id || null,
  name: locale.value === 'ar'
    ? (product.name_ar || product.name_en)
    : (product.name_en || product.name_ar),
  sub_name: locale.value === 'ar'
    ? (product.sub_name_ar || product.sub_name_en || '')
    : (product.sub_name_en || product.sub_name_ar || ''),
  price: formatPrice(product.base_price),
  original_price: formatPrice(product.base_price),
  final_price: formatPrice(
    Number(product.base_price) - Number(product.total_discounts_value || 0)
  ),
  total_discounts_value: formatPrice(product.total_discounts_value),
  is_free_shipping: product.is_free_shipping,
  total_rating: product.total_rating,
  has_discount: Number(product.total_discounts_value || 0) > 0,
  img: getMainImage(product),
  is_wished: product.is_wished || false,
  in_cart: product.in_cart || false,
  is_stock: product.is_stock === 1,
  raw: product
})

// Build endpoint with optional category ID
const buildEndpoint = (base) => {
  const baseUrl = `api/home/${base}/${stor_id.value}`
  return categoryId.value ? `${baseUrl}/${categoryId.value}` : baseUrl
}

const fetchExclusiveOffers = async () => {
  try {
    const response = await axios.get(buildEndpoint('exclusive-offers'))
    const data = response.data.data.data || []

    exclusive_offers.value = {
      title: t('category.exclusive') || 'Exclusive Offers',
      products: data.map(mapProduct)
    }
  } catch (err) {
    console.error('Error fetching exclusive offers:', err)
    error.value = 'Failed to load exclusive offers.'
  }
}

const fetchBestSeller = async () => {
  try {
    const response = await axios.get(buildEndpoint('best-sellers'))
    const data = response.data.data.data || []

    Best_seller.value = {
      title: t('category.bestsellers'),
      products: data.map(mapProduct)
    }
  } catch (err) {
    console.error('Error fetching best sellers:', err)
    error.value = 'Failed to load best sellers.'
  }
}

const fetchNewArrivals = async () => {
  try {
    const response = await axios.get(buildEndpoint('new-arrivals'))
    const data = response.data.data.data || []

    New_arrival.value = {
      title: t('category.newlyarrived') || 'New Arrivals',
      products: data.map(mapProduct)
    }
  } catch (err) {
    console.error('Error fetching new arrivals:', err)
    error.value = 'Failed to load new arrivals.'
  }
}

const loaddata = async () => {
  try {
    await axios.get(`api/home/get-categories/${stor_id.value}`)
    await axios.get('api/home/get-media-link')
  } catch (error) {
    console.error('Error loading additional data:', error)
  }
}

const loadAllData = async () => {
  isLoading.value = true
  await Promise.all([
    fetchNewArrivals(),
    fetchBestSeller(),
    fetchExclusiveOffers(),
    loaddata()
  ])
  isLoading.value = false
}

onBeforeMount(() => {
  categoryId.value = route.params.id || null
  loadAllData()
})

watch(() => route.params.id, (newId) => {
  categoryId.value = newId || null
  loadAllData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

.pro:first-child {
  margin-left: 1rem;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
