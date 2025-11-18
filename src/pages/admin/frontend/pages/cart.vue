<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-inter" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="flex lg:flex-row flex-col gap-10">
      <section class="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <!-- Loading spinner -->
        <div v-if="loading" class="flex justify-center items-center py-4">
          <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" class="text-yellow-600" />
          <p class="ml-2">{{ t('loading') }}</p>
        </div>

        <!-- Cart content when not loading -->
        <div v-else>
          <!-- Store Selection -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ t('cart.selectStore') }}</h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="store in stores"
                :key="store.store_id"
                @click="toggleStore(store.store_id)"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="selectedStores.includes(store.store_id) ? 'bg-yellow-600 text-white' : 'bg-amber-50 text-yellow-600'"
              >
                {{ $i18n.locale === 'ar' ? store.store_name_ar : store.store_name_en }}
              </button>
              <button
                v-if="stores.length > 1"
                @click="selectAllStores"
                class="px-4 py-2 rounded-md text-sm font-medium bg-amber-50 text-yellow-600 hover:bg-amber-100 transition-colors"
              >
                {{ t('cart.selectAllStores') }}
              </button>
            </div>
          </div>

          <!-- Address Selection -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ t('cart.selectAddress') }}</h3>
            <select
              v-model="selectedAddress"
              @change="fetchOrderTotals"
              class="w-full bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
            >
              <option :value="null" disabled>{{ t('cart.selectAddressPlaceholder') }}</option>
              <option v-for="address in addresses" :key="address.id" :value="address.id">
                {{ address.address_line_1 }}, {{ address.city }}
              </option>
            </select>
          </div>

          <!-- Empty Cart -->
          <div v-if="filteredProducts.length === 0" class="text-center text-gray-600 py-4">
            {{ t('cart.emptyCart') }}
          </div>

          <!-- Products List -->
          <div v-else>
            <div
              v-for="product in filteredProducts"
              :key="product.uniqueId"
              class="flex items-center mt-6 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                :src="product.img"
                :alt="product.name"
                class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 object-cover rounded-md border border-gray-800"
              />
              <div class="flex flex-col mx-4 gap-2 flex-1">
                <h3 class="text-lg font-bold text-gray-800">{{ product.name }}</h3>
                <p class="text-yellow-600 text-sm">{{ t('cart.price') }}: {{ product.price }} {{ t('cart.currency') }}</p>
                <div class="flex items-center justify-between">
                  <p class="text-yellow-600 text-sm">{{ t('cart.quantity') }}: {{ product.quantity }}</p>
                  <div class="border border-gray-300 p-2 rounded-md flex items-center gap-3">
                    <button
                      @click="updateQuantity('minus', product)"
                      class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors"
                      :disabled="product.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="text-sm font-medium">{{ product.quantity }}</span>
                    <button
                      @click="updateQuantity('plus', product)"
                      class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    @click="clearProduct(product)"
                    class="text-white bg-yellow-600 px-3 py-1 text-sm rounded-md hover:bg-yellow-700 transition-all"
                  >
                    {{ t('cart.remove') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Order summary for each store -->
            <div
              v-for="storeOrder in storeOrders"
              :key="storeOrder.store_id"
              class="bg-gray-100 p-6 mt-6 rounded-lg shadow-inner"
            >
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                {{ t('cart.orderFrom') }} {{ getStoreName(storeOrder.store_id) }}
              </h3>
              <div v-if="storeOrder.delivery_message" class="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                {{ storeOrder.delivery_message }}
              </div>
              <div class="flex flex-col gap-4">
                <span class="flex justify-between items-center">
                  <h4 class="text-yellow-600 font-semibold">{{ t('cart.shippingTime') }}</h4>
                  <p class="text-gray-700">{{ storeOrder.delivery_time || t('cart.notAvailable') }}</p>
                </span>
                <span class="flex justify-between items-center">
                  <h4 class="text-yellow-600 font-semibold">{{ t('cart.subtotal') }}</h4>
                  <p class="text-gray-700">{{ Number(storeOrder.subtotal).toFixed(2) }} {{ t('cart.currency') }}</p>
                </span>
                <span class="flex justify-between items-center">
                  <h4 class="text-yellow-600 font-semibold">{{ t('cart.tax') }}</h4>
                  <p class="text-gray-700">{{ Number(storeOrder.tax).toFixed(2) }} {{ t('cart.currency') }}</p>
                </span>
                <span class="flex justify-between items-center">
                  <h4 class="text-yellow-600 font-semibold">{{ t('cart.total') }}</h4>
                  <p class="text-gray-700">{{ Number(storeOrder.total).toFixed(2) }} {{ t('cart.currency') }}</p>
                </span>
              </div>
              <button
                :disabled="!selectedAddress || filteredProducts.length === 0"
                @click="submitOrder"
                class="w-full mt-6 py-3 text-sm sm:text-base lg:text-lg bg-gray-800 rounded-md text-white font-semibold transition-transform duration-150 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ t('cart.checkout') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Sidebar Summary -->
      <section class="lg:w-1/4 w-full p-6 bg-white rounded-2xl shadow-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ t('cart.orderSummary') }}</h3>
        <div class="flex flex-col gap-4">
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">{{ t('cart.subtotal') }}</h4>
            <p class="text-gray-700">{{ totalOrderSummary.order_without_tax }} {{ t('cart.currency') }}</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">{{ t('cart.tax') }}</h4>
            <p class="text-gray-700">{{ totalOrderSummary.tax }} {{ t('cart.currency') }}</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">{{ t('cart.total') }}</h4>
            <p class="text-gray-700">{{ totalOrderSummary.total }} {{ t('cart.currency') }}</p>
          </span>
        </div>
        <div class="flex flex-col mt-6">
          <input
            v-model="couponCode"
            type="text"
            :placeholder="t('cart.couponPlaceholder')"
            class="bg-amber-50 placeholder-yellow-600 border border-amber-200 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
          />
          <button
            @click="applyCoupon"
            class="w-full mt-4 py-2 text-sm bg-amber-100 rounded-md text-yellow-600 font-semibold hover:bg-amber-200 transition-all active:scale-95"
          >
            {{ t('cart.applyCoupon') }}
          </button>
          <button
            :disabled="!selectedAddress || filteredProducts.length === 0"
            @click="submitOrder"
            class="w-full mt-4 py-2 text-sm bg-gray-800 rounded-md text-white font-semibold hover:shadow-lg transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ t('cart.checkout') }}
          </button>
        </div>
      </section>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'

const { t, locale } = useI18n()
const toast = useToast()

const loading = ref(true)
const products = ref([])
const stores = ref([])
const selectedStores = ref([])
const addresses = ref([])
const selectedAddress = ref(null)
const couponCode = ref('')
const storeOrders = ref([])

// عرض المنتجات حسب المتاجر المختارة
const filteredProducts = computed(() => {
  if (selectedStores.value.length === 0) return []
  return products.value.filter(p => selectedStores.value.includes(p.store_id))
})

// إجمالي الطلب الكلي (للـ sidebar)
const totalOrderSummary = computed(() => {
  if (storeOrders.value.length === 0) {
    return { order_without_tax: '0.00', tax: '0.00', total: '0.00' }
  }
  const summary = storeOrders.value.reduce((acc, order) => ({
    order_without_tax: acc.order_without_tax + Number(order.subtotal || 0),
    tax: acc.tax + Number(order.tax || 0),
    total: acc.total + Number(order.total || 0)
  }), { order_without_tax: 0, tax: 0, total: 0 })

  return {
    order_without_tax: summary.order_without_tax.toFixed(2),
    tax: summary.tax.toFixed(2),
    total: summary.total.toFixed(2)
  }
})

// جلب العناوين
const fetchAddresses = async () => {
  try {
    const { data } = await axios.get('/api/home/address')
    if (data.is_success) {
      addresses.value = data.data
      if (addresses.value.length > 0) selectedAddress.value = addresses.value[0].id
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.addressLoadError'), life: 3000 })
  }
}

// جلب السلة
const fetchCart = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/cart')
    if (data.is_success) {
      // المتاجر
      stores.value = data.data.stores.map(s => ({
        store_id: s.store_id,
        store_name_ar: s.store_name_ar,
        store_name_en: s.store_name_en
      }))

      // المنتجات
      products.value = data.data.items.map(item => {
        const product = item.product
        const img = product.media?.[0]?.url || product.key_default_image || '/images/placeholder-product.png'
        const price = item.variant?.price ? parseFloat(item.variant.price) : parseFloat(product.base_price) || 0

        return {
          uniqueId: `${item.product_id}-${item.variant_id || 'no-var'}`,
          product_id: item.product_id,
          variant_id: item.variant_id,
          name: locale.value === 'ar' ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar),
          img,
          price: price.toFixed(2),
          quantity: item.quantity,
          store_id: product.store_id
        }
      })

      // اختيار أول متجر تلقائياً
      if (stores.value.length > 0) {
        selectedStores.value = [stores.value[0].store_id]
      }

      await fetchOrderTotals()
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.cartLoadError'), life: 3000 })
  } finally {
    loading.value = false
  }
}

// جلب إجماليات الطلبات لكل متجر
const fetchOrderTotals = async () => {
  if (!selectedAddress.value || filteredProducts.value.length === 0) {
    storeOrders.value = []
    return
  }

  try {
    const payload = {
      address_id: selectedAddress.value,
      items: filteredProducts.value.map(p => ({
        product_id: p.product_id,
        variant_id: p.variant_id,
        quantity: p.quantity
      }))
    }
    if (couponCode.value) payload.coupon = couponCode.value

    const { data } = await axios.post('/api/order/view', payload)
    if (data.is_success) {
      storeOrders.value = data.data
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.orderTotalsError'), life: 3000 })
  }
}

const getStoreName = (storeId) => {
  const store = stores.value.find(s => s.store_id === storeId)
  return locale.value === 'ar' ? store?.store_name_ar : store?.store_name_en || t('store.unknown')
}

const toggleStore = (storeId) => {
  if (selectedStores.value.includes(storeId)) {
    selectedStores.value = selectedStores.value.filter(id => id !== storeId)
  } else {
    selectedStores.value.push(storeId)
  }
  fetchOrderTotals()
}

const selectAllStores = () => {
  selectedStores.value = stores.value.map(s => s.store_id)
  fetchOrderTotals()
}

const updateQuantity = async (action, product) => {
  const newQty = action === 'plus' ? product.quantity + 1 : product.quantity - 1
  if (newQty < 1) return

  try {
    await axios.post('/api/cart/update', {
      product_id: product.product_id,
      variant_id: product.variant_id,
      quantity: newQty
    })
    product.quantity = newQty
    await fetchOrderTotals()
    toast.add({ severity: 'success', summary: t('success'), detail: t('cart.quantityUpdated'), life: 2000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.quantityUpdateError'), life: 3000 })
  }
}

const clearProduct = async (product) => {
  try {
    await axios.post('/api/cart/remove', {
      product_id: product.product_id,
      variant_id: product.variant_id
    })
    products.value = products.value.filter(p => p.uniqueId !== product.uniqueId)
    await fetchOrderTotals()
    toast.add({ severity: 'success', summary: t('success'), detail: t('cart.removeSuccess'), life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.removeError'), life: 3000 })
  }
}

const applyCoupon = async () => {
  await fetchOrderTotals()
  toast.add({ severity: 'info', summary: t('info'), detail: t('cart.couponApplied'), life: 3000 })
}

const submitOrder = async () => {
  if (!selectedAddress.value || filteredProducts.value.length === 0) {
    toast.add({ severity: 'warn', summary: t('warning'), detail: t('cart.cannotCheckout'), life: 3000 })
    return
  }

  try {
    const payload = {
      address_id: selectedAddress.value,
      items: filteredProducts.value.map(p => ({
        product_id: p.product_id,
        variant_id: p.variant_id,
        quantity: p.quantity
      }))
    }
    if (couponCode.value) payload.coupon = couponCode.value

    const { data } = await axios.post('/api/order', payload)
    if (data.is_success) {
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.orderSuccess'), life: 5000 })
      // مسح السلة بعد الطلب
      products.value = products.value.filter(p => !selectedStores.value.includes(p.store_id))
      storeOrders.value = []
      selectedStores.value = []
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.orderError'), life: 4000 })
  }
}

watch(() => selectedAddress.value, fetchOrderTotals)
watch(() => couponCode.value, () => { if (couponCode.value) fetchOrderTotals() })

onMounted(() => {
  fetchAddresses()
  fetchCart()
})
</script>

<style scoped>
[dir="rtl"] .flex {
  direction: rtl;
}
</style>
