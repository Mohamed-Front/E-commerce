<template>
  <div class="min-h-screen p-8 font-tajawal" >
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
        <ul class="space-y-2">
          <li @click="router.push({ name: 'profile' })"
              class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer"
              role="button" :aria-label="t('profile.account')">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.55556 4.44444C5.55556 3.2657 6.02381 2.13524 6.8573 1.30175C7.6908 0.468252 8.82126 0 10 0C11.1787 0 12.3092 0.468252 13.1427 1.30175C13.9762 2.13524 14.4444 3.2657 14.4444 4.44444C14.4444 5.62318 13.9762 6.75365 13.1427 7.58714C12.3092 8.42064 11.1787 8.88889 10 8.88889C8.82126 8.88889 7.6908 8.42064 6.8573 7.58714C6.02381 6.75365 5.55556 5.62318 5.55556 4.44444ZM5.55556 11.1111C4.08213 11.1111 2.66905 11.6964 1.62718 12.7383C0.585316 13.7802 0 15.1932 0 16.6667C0 17.5507 0.35119 18.3986 0.976311 19.0237C1.60143 19.6488 2.44928 20 3.33333 20H16.6667C17.5507 20 18.3986 19.6488 19.0237 19.0237C19.6488 18.3986 20 17.5507 20 16.6667C20 15.1932 19.4147 13.7802 18.3728 12.7383C17.3309 11.6964 15.9179 11.1111 14.4444 11.1111H5.55556Z"
                fill="#807575"/>
            </svg>
            <span>{{ t('profile.account') }}</span>
          </li>

          <li class="p-3 rounded-lg flex items-center gap-4 bg-yellow-100 text-yellow-700 font-medium cursor-default"
              role="button" aria-current="page">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M0.837143 0.689412C-8.51495e-08 1.37882 0 2.48706 0 4.70588V15.2941C0 17.5129 -8.51495e-08 18.6212 0.837143 19.3106C1.67429 20 3.02 20 5.71429 20H14.2857C16.98 20 18.3257 20 19.1629 19.3106C20 18.6212 20 17.5129 20 15.2941V4.70588C20 2.48706 20 1.37882 19.1629 0.689412C18.3257 -7.01231e-08 16.98 0 14.2857 0H5.71429C3.02 0 1.67429 -7.01231e-08 0.837143 0.689412ZM5.71429 4.70588C5.33541 4.70588 4.97204 4.82983 4.70413 5.05046C4.43622 5.27109 4.28571 5.57033 4.28571 5.88235C4.28571 6.19437 4.43622 6.49361 4.70413 6.71424C4.97204 6.93487 5.33541 7.05882 5.71429 7.05882H14.2857C14.6646 7.05882 15.028 6.93487 15.2959 6.71424C15.5638 6.49361 15.7143 6.19437 15.7143 5.88235C15.7143 5.57033 15.5638 5.27109 15.2959 5.05046C15.028 4.82983 14.6646 4.70588 14.2857 4.70588H5.71429ZM5.71429 9.41177C5.33541 9.41177 4.97204 9.53571 4.70413 9.75635C4.43622 9.97698 4.28571 10.2762 4.28571 10.5882C4.28571 10.9003 4.43622 11.1995 4.70413 11.4201C4.97204 11.6408 5.33541 11.7647 5.71429 11.7647H14.2857C14.6646 11.7647 15.028 11.6408 15.2959 11.4201C15.5638 11.1995 15.7143 10.9003 15.7143 10.5882C15.7143 10.2762 15.5638 9.97698 15.2959 9.75635C15.028 9.53571 14.6646 9.41177 14.2857 9.41177H5.71429ZM5.71429 14.1176C5.33541 14.1176 4.97204 14.2416 4.70413 14.4622C4.43622 14.6829 4.28571 14.9821 4.28571 15.2941C4.28571 15.6061 4.43622 15.9054 4.70413 16.126C4.97204 16.3466 5.33541 16.4706 5.71429 16.4706H11.4286C11.8075 16.4706 12.1708 16.3466 12.4387 16.126C12.7066 15.9054 12.8571 15.6061 12.8571 15.2941C12.8571 14.9821 12.7066 14.6829 12.4387 14.4622C12.1708 14.2416 11.8075 14.1176 11.4286 14.1176H5.71429Z"
                fill="#F9C006"/>
            </svg>
            <span>{{ t('profile.orders') }}</span>
          </li>

          <li @click="router.push({ name: 'addres' })"
              class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer"
              role="button" :aria-label="t('profile.addresses')">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0C6.61392 0.00245748 4.32637 0.831051 2.63915 2.30402C0.951939 3.77699 0.0028245 5.77405 9.57508e-06 7.85714C-0.00284824 9.55945 0.634084 11.2156 1.8131 12.5714C1.8131 12.5714 2.05855 12.8536 2.09864 12.8943L9 20L15.9046 12.8907C15.9406 12.8529 16.1869 12.5714 16.1869 12.5714L16.1877 12.5693C17.3661 11.214 18.0028 9.55866 18 7.85714C17.9972 5.77405 17.0481 3.77699 15.3608 2.30402C13.6736 0.831051 11.3861 0.00245748 9 0ZM9 10.7143C8.35272 10.7143 7.71997 10.5467 7.18177 10.2328C6.64358 9.91882 6.2241 9.4726 5.9764 8.95052C5.72869 8.42845 5.66388 7.85397 5.79016 7.29974C5.91644 6.74551 6.22814 6.23642 6.68583 5.83684C7.14353 5.43726 7.72668 5.16514 8.36152 5.0549C8.99637 4.94466 9.6544 5.00124 10.2524 5.21749C10.8504 5.43374 11.3616 5.79994 11.7212 6.2698C12.0808 6.73965 12.2727 7.29205 12.2727 7.85714C12.2716 8.61461 11.9265 9.34079 11.313 9.8764C10.6994 10.412 9.86765 10.7133 9 10.7143Z"
                fill="#807575"/>
            </svg>
            <span>{{ t('profile.addresses') }}</span>
          </li>

          <li @click="logout"
              class="p-3 rounded-lg flex items-center gap-4 text-red-500 hover:bg-gray-50 cursor-pointer"
              role="button" :aria-label="t('profile.logout')">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20V0H9V2.22222H2V17.7778H9V20H0ZM13 15.5556L11.625 13.9444L14.175 11.1111H6V8.88889H14.175L11.625 6.05556L13 4.44444L18 10L13 15.5556Z"
                fill="#FF1212"/>
            </svg>
            <span>{{ t('profile.logout') }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-white rounded-xl shadow-md p-8">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" class="text-blue-600" />
          <span class="mr-3 text-lg">{{ t('loading') }}</span>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-center py-12 text-red-600">
          <p>{{ error }}</p>
          <button @click="fetchOrders()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {{ t('orders.retry') }}
          </button>
        </div>

        <!-- No Orders -->
        <div v-if="!loading && !error && orders.length === 0" class="text-center py-16 text-gray-500 text-xl">
          {{ t('orders.noOrders') }}
        </div>

        <!-- Orders List -->
        <div v-if="orders.length > 0" class="space-y-6">
          <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('orders.title') }}</h1>

          <div v-for="order in orders" :key="order.id" class="border border-gray-200 rounded-xl overflow-hidden">
            <!-- Order Summary Row (Clickable) -->
            <div @click="toggleDetails(order.id)"
                 class="p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="flex ">
                  <div v-for="(item, index) in order.order_items.slice(0, 3)" :key="index"
                       class="w-16 h-16 rounded-lg border-2 border-white overflow-hidden bg-gray-200">
                    <img :src="getProductImage(item.product)" :alt="getProductName(item.product)"
                         class="w-full h-full object-cover" />
                  </div>
                  <div v-if="order.order_items.length > 3"
                       class="w-16 h-16 mx-1 rounded-lg bg-yellow-500 text-white flex items-center justify-center text-sm font-bold border-2 border-white">
                    +{{ order.order_items.length - 3 }}
                  </div>
                </div>

                <div class="text-left">
                  <p class="text-lg font-semibold text-gray-800">
                    {{ t('orders.orderNumber') }} #{{ order.id }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(order.created_at) }} • {{ order.order_items.length }} {{ t('orders.items') }}
                  </p>
                </div>
              </div>

              <div class="text-center md:text-right">
                <p :class="{
                  'text-yellow-600': order.status === 0,
                  'text-green-600': order.status === 1,
                  'text-red-600': order.status === 2
                }" class="font-bold text-lg">
                  {{ getStatusMessage(order.status, order.created_at, order.cancelled_at || null) }}
                </p>
                <p class="text-xl font-bold text-gray-800 mt-1">
                  {{ order.total_price }} {{ t('currencyLabel') }}
                </p>
              </div>

              <svg :class="{ 'rotate-180': expandedOrders.includes(order.id) }"
                   class="w-6 h-6 text-gray-600 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Expanded Details -->
            <transition name="fade">
              <div v-if="expandedOrders.includes(order.id)" class="border-t border-gray-200 bg-white p-6">
                <h3 class="font-bold text-lg mb-4 text-gray-700">{{ t('orders.orderDetails') }}</h3>
                <div class="space-y-4">
                  <div v-for="item in order.order_items" :key="item.id"
                       class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img :src="getProductImage(item.product)" :alt="getProductName(item.product)"
                         class="w-20 h-20 rounded-lg object-cover border" />

                    <div class="flex-1">
                      <p class="font-medium text-gray-800">{{ getProductName(item.product) }}</p>
                      <p class="text-sm text-gray-500">SKU: {{ item.product.sku }}</p>
                    </div>

                    <div class="text-right">
                      <p class="font-semibold">{{ item.quantity }} × {{ item.price }} {{ t('currencyLabel') }}</p>
                      <p class="text-sm text-gray-600">
                        {{ (item.quantity * item.price).toFixed(2) }} {{ t('currencyLabel') }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-300 flex justify-between font-bold text-lg">
                  <span>{{ t('orders.total') }}</span>
                  <span>{{ order.total_price }} {{ t('currencyLabel') }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="mt-12 flex justify-center items-center gap-3 flex-wrap">
          <button @click="fetchOrders(pagination.current_page - 1)"
                  :disabled="pagination.current_page === 1"
                  class="px-5 py-3 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition">
            {{ t('orders.previous') }}
          </button>

          <button v-for="link in pagination.links" :key="link.label"
                  @click="link.url && fetchOrders(getPageNumber(link.url))"
                  :class="{ 'bg-yellow-500 text-white': link.active, 'bg-gray-200 text-gray-700': !link.active && link.url, 'text-gray-400': !link.url }"
                  class="px-4 py-3 rounded-lg min-w-12 transition"
                  :disabled="!link.url">
            <span v-html="link.label"></span>
          </button>

          <button @click="fetchOrders(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.last_page"
                  class="px-5 py-3 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition">
            {{ t('orders.next') }}
          </button>
        </div>
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '../../../../../stores/WebAuth'
import moment from 'moment'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const authStore = useAuthStore()

// Data
const orders = ref([])
const loading = ref(true)
const error = ref(null)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  links: []
})
const expandedOrders = ref([]) // Track expanded order IDs

// Toggle order details
const toggleDetails = (orderId) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

// Format date
const formatDate = (dateString) => {
  return moment(dateString).format('DD MMMM YYYY - hh:mm A')
}

// Get product name based on locale
const getProductName = (product) => {

  return localStorage.getItem('appLang') === 'ar' ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar)
}

// Get product image
const getProductImage = (product) => {
  return product.media?.[0]?.url || product.key_default_image || 'https://placehold.co/80x80/f1f1e7/585858?text=No+Image'
}

// Get status message
const getStatusMessage = (status, createdAt, cancelledAt) => {
  switch (status) {
    case 0: return t('orders.statusPending', { date: formatDate(createdAt) })
    case 1: return t('orders.statusDelivered')
    case 2: return t('orders.statusCancelled', { date: formatDate(cancelledAt) })
    default: return t('orders.statusUnknown')
  }
}

// Extract page number
const getPageNumber = (url) => {
  if (!url) return null
  try {
    return new URL(url).searchParams.get('page')
  } catch {
    return null
  }
}

// Fetch orders
const fetchOrders = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get(`/api/profile/orders?page=${page}&limit=4`)
    orders.value = res.data.data.data
    pagination.value = {
      current_page: res.data.data.current_page,
      last_page: res.data.data.last_page,
      links: res.data.data.links
    }
  } catch (err) {
    error.value = err.response?.status === 404
      ? t('orders.noOrdersAvailable')
      : t('orders.loadError')
    toast.add({ severity: 'error', summary: t('error'), detail: error.value, life: 5000 })
  } finally {
    loading.value = false
  }
}

// Logout
const logout = async () => {
  try {
    await axios.post('/api/logout')
    authStore.handleLogout()
    toast.add({ severity: 'success', summary: t('success'), detail: t('profile.logoutSuccess'), life: 3000 })
    router.push({ name: 'login' })
  } catch {
    toast.add({ severity: 'error', summary: t('error'), detail: t('profile.logoutError'), life: 3000 })
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  max-height: 1000px;
}
[dir="rtl"] .rotate-180 {
  transform: rotate(180deg);
}
</style>
