<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-inter">
    <div class="flex lg:flex-row flex-col gap-10">
      <!-- Cart Items Section -->
      <section class="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12 gap-4">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" class="text-yellow-600" />
          <p class="text-lg text-gray-700">{{ t('loading') }}</p>
        </div>

        <div v-else>
          <!-- Store Selection -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ t('cart.selectStore') }}</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="store in stores"
                :key="store.unique_store_id"
                @click="toggleStore(store.unique_store_id)"
                class="px-5 py-3 rounded-lg text-sm font-medium transition-all"
                :class="selectedStores.includes(store.unique_store_id)
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-amber-50 text-yellow-700 hover:bg-amber-100'"
              >
                {{ store.display_name }}
                <span v-if="store.market_name" class="text-xs block opacity-80">
                  ({{ store.market_name }})
                </span>
              </button>

              <button
                v-if="stores.length > 1"
                @click="selectAllStores"
                class="px-5 py-3 rounded-lg text-sm font-medium bg-amber-50 text-yellow-700 hover:bg-amber-100 transition-all"
              >
                {{ t('cart.selectAllStores') }}
              </button>
            </div>
          </div>

          <!-- Address Selection -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ t('cart.selectAddress') }}</h3>
            <select
              v-model="selectedAddress"
              class="w-full bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              <option :value="null" disabled>{{ t('cart.selectAddressPlaceholder') }}</option>
              <option v-for="address in addresses" :key="address.id" :value="address.id">
                {{ address.address_line_1 }}, {{ address.city }}
              </option>
            </select>
          </div>

          <!-- Empty Cart -->
          <div v-if="filteredProducts.length === 0" class="text-center py-16 text-gray-500 text-lg">
            {{ selectedStores.length === 0 ? t('cart.selectStorePrompt') : t('cart.emptyCart') }}
          </div>

          <!-- Products List -->
          <div v-else>
            <div
              v-for="product in filteredProducts"
              :key="product.uniqueId"
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-gray-50 rounded-xl mb-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                :src="product.img || '/images/placeholder-product.png'"
                :alt="product.name"
                class="w-24 h-24 object-cover rounded-lg border border-gray-200"
                loading="lazy"
              />

              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-lg">{{ product.name }}</h4>
                <p class="text-yellow-700 text-sm mt-1">
                  {{ t('cart.price') }}: {{ product.price }} {{ t('cart.currency') }}
                </p>

                <div class="flex flex-wrap items-center gap-6 mt-4">
                  <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      @click="updateQuantity(product, product.quantity - 1)"
                      :disabled="product.quantity <= 1"
                      class="w-12 h-10 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>
                    <span class="w-16 text-center font-medium py-2">{{ product.quantity }}</span>
                    <button
                      @click="updateQuantity(product, product.quantity + 1)"
                      class="w-12 h-10 text-gray-600 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    @click="removeProduct(product)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium transition"
                  >
                    {{ t('cart.remove') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Per Store Summary -->
            <div
              v-for="order in storeOrders"
              :key="order.unique_store_id"
              class="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 mt-8 rounded-xl border border-amber-200"
            >
              <h3 class="text-xl font-bold text-gray-800 mb-4">
                {{ t('cart.orderFrom') }} {{ getStoreDisplayName(order.unique_store_id) }}
              </h3>

              <div v-if="order.delivery_message" class="mb-4 p-4 bg-yellow-100 text-yellow-900 rounded-lg text-sm">
                {{ order.delivery_message }}
              </div>

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ t('cart.shippingTime') }}</span>
                  <span class="font-medium">{{ order.delivery_time || t('cart.notAvailable') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ t('cart.subtotal') }}</span>
                  <span>{{ Number(order.subtotal).toFixed(2) }} {{ t('cart.currency') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ t('cart.tax') }}</span>
                  <span>{{ Number(order.tax).toFixed(2) }} {{ t('cart.currency') }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-amber-300">
                  <span>{{ t('cart.total') }}</span>
                  <span>{{ Number(order.total).toFixed(2) }} {{ t('cart.currency') }}</span>
                </div>
              </div>

              <!-- زر طلب هذا المتجر فقط -->
              <button
                @click="submitSingleStoreOrder(order.unique_store_id)"
                :disabled="!selectedAddress"
                class="w-full mt-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md"
              >
                {{ t('cart.checkoutThisStoreOnly') || 'اطلب من هذا المتجر فقط' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Order Summary Sidebar -->
      <aside class="lg:w-96 w-full bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">{{ t('cart.orderSummary') }}</h3>

        <div class="space-y-4 text-sm border-b pb-6">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('cart.subtotal') }}</span>
            <span>{{ totalOrderSummary.subtotal.toFixed(2) }} {{ t('cart.currency') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('cart.tax') }}</span>
            <span>{{ totalOrderSummary.tax.toFixed(2) }} {{ t('cart.currency') }}</span>
          </div>
          <div class="flex justify-between text-xl font-bold pt-4 text-gray-900">
            <span>{{ t('cart.total') }}</span>
            <span class="text-yellow-700">{{ totalOrderSummary.total.toFixed(2) }} {{ t('cart.currency') }}</span>
          </div>
        </div>

        <!-- Coupon -->
        <div class="mt-8">
          <input
            v-model="couponCode"
            type="text"
            :placeholder="t('cart.couponPlaceholder')"
            class="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
          />
          <button
            @click="applyCoupon"
            :disabled="!couponCode.trim()"
            class="w-full mt-3 py-3 bg-amber-100 text-yellow-700 font-semibold rounded-lg hover:bg-amber-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {{ t('cart.applyCoupon') }}
          </button>
        </div>

        <!-- Checkout All Button -->
        <button
          @click="submitOrder"
          :disabled="!canCheckout"
          class="w-full mt-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {{ t('cart.checkoutAll') || 'إتمام الطلب (الكل)' }}
        </button>
      </aside>
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

// Reactive state
const loading = ref(true)
const addresses = ref([])
const selectedAddress = ref(null)
const couponCode = ref('')
const products = ref([])
const stores = ref([])
const selectedStores = ref([])
const storeOrders = ref([])

// Generate unique store ID
const generateUniqueStoreId = (store) => `${store.store_id}-${store.market_id || 'default'}`

const fetchAddresses = async () => {
  try {
    const { data } = await axios.get('/api/home/address')
    if (data.is_success) {
      addresses.value = data.data
      if (addresses.value.length > 0) selectedAddress.value = addresses.value[0].id
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.addressLoadError'), life: 4000 })
  }
}

const fetchCart = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/cart')

    if (!data.is_success) return

    const allProducts = []
    const uniqueStoresMap = new Map()

    data.data.stores.forEach(storeGroup => {
      const unique_store_id = generateUniqueStoreId(storeGroup)

      if (!uniqueStoresMap.has(unique_store_id)) {
        uniqueStoresMap.set(unique_store_id, {
          unique_store_id,
          store_id: storeGroup.store_id,
          display_name: locale.value === 'ar' ? storeGroup.store_name_ar : storeGroup.store_name_en,
          market_name: locale.value === 'ar' ? storeGroup.market_name_ar : storeGroup.market_name_en,
        })
      }

      storeGroup.items.forEach(item => {
        const price = item.variant?.price || item.product.base_price || 0
        const img = item.product.media?.[0]?.url || item.product.key_default_image || '/images/placeholder-product.png'

        allProducts.push({
          uniqueId: `${item.product_id}-${item.variant_id || 'novar'}-${unique_store_id}-${Date.now()}`,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          name: locale.value === 'ar' ? item.product.name_ar : item.product.name_en,
          img,
          price: Number(price).toFixed(2),
          quantity: item.quantity,
          store_id: storeGroup.store_id,
          unique_store_id,
        })
      })
    })

    stores.value = Array.from(uniqueStoresMap.values())
    products.value = allProducts

    if (stores.value.length > 0) {
      selectedStores.value = stores.value.map(s => s.unique_store_id)
    }

    await fetchOrderTotals()
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.cartLoadError'), life: 4000 })
  } finally {
    loading.value = false
  }
}

// Computed
const filteredProducts = computed(() => {
  if (selectedStores.value.length === 0) return []
  return products.value.filter(p => selectedStores.value.includes(p.unique_store_id))
})

const totalOrderSummary = computed(() => {
  if (storeOrders.value.length === 0) {
    return { subtotal: 0, tax: 0, total: 0 }
  }
  return storeOrders.value.reduce((acc, order) => ({
    subtotal: acc.subtotal + Number(order.subtotal || 0),
    tax: acc.tax + Number(order.tax || 0),
    total: acc.total + Number(order.total || 0),
  }), { subtotal: 0, tax: 0, total: 0 })
})

const canCheckout = computed(() => {
  return selectedAddress.value && filteredProducts.value.length > 0
})

const fetchOrderTotals = async () => {
  if (!selectedAddress.value || filteredProducts.value.length === 0) {
    storeOrders.value = []
    return
  }

  try {
    const payload = {
      address_id: selectedAddress.value,
      view: true,
      items: filteredProducts.value.map(p => ({
        product_id: p.product_id,
        variant_id: p.variant_id,
        quantity: p.quantity,
      })),
    }

    if (couponCode.value.trim()) payload.coupon = couponCode.value.trim()

    const { data } = await axios.post('/api/order/view', payload)

    if (data.is_success) {
      storeOrders.value = data.data.map(order => ({
        ...order,
        unique_store_id: generateUniqueStoreId({
          store_id: order.store_id,
          market_id: order.market_id,
        }),
      }))
    }
  } catch (err) {
    console.error('Failed to fetch order totals:', err)
    storeOrders.value = []
  }
}

const getStoreDisplayName = (unique_store_id) => {
  const store = stores.value.find(s => s.unique_store_id === unique_store_id)
  return store ? `${store.display_name}${store.market_name ? ` (${store.market_name})` : ''}` : t('cart.unknownStore')
}

const toggleStore = (id) => {
  selectedStores.value = selectedStores.value.includes(id)
    ? selectedStores.value.filter(s => s !== id)
    : [...selectedStores.value, id]
}

const selectAllStores = () => {
  selectedStores.value = stores.value.map(s => s.unique_store_id)
}

const updateQuantity = async (product, newQty) => {
  if (newQty < 1) return

  try {
    await axios.post('/api/cart/update', {
      product_id: product.product_id,
      variant_id: product.variant_id,
      quantity: newQty,
    })

    product.quantity = newQty
    await fetchOrderTotals()

    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: newQty > product.quantity ? t('cart.quantityIncreased') : t('cart.quantityDecreased'),
      life: 2000,
    })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.quantityUpdateError'), life: 4000 })
  }
}

const removeProduct = async (product) => {
  try {
    await axios.post('/api/cart/remove', {
      product_id: product.product_id,
      variant_id: product.variant_id,
    })

    products.value = products.value.filter(p => p.uniqueId !== product.uniqueId)
    await fetchOrderTotals()

    toast.add({ severity: 'success', summary: t('success'), detail: t('cart.removeSuccess'), life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.removeError'), life: 4000 })
  }
}

const applyCoupon = async () => {
  await fetchOrderTotals()
  toast.add({ severity: 'success', summary: t('success'), detail: t('cart.couponApplied'), life: 3000 })
}

// دالة جديدة: طلب من متجر واحد فقط
const submitSingleStoreOrder = async (unique_store_id) => {
  if (!selectedAddress.value) {
    toast.add({ severity: 'warn', summary: t('warning'), detail: t('cart.selectAddressFirst'), life: 4000 })
    return
  }

  const itemsInThisStore = filteredProducts.value.filter(p => p.unique_store_id === unique_store_id)

  if (itemsInThisStore.length === 0) {
    toast.add({ severity: 'info', summary: t('info'), detail: t('cart.noItemsInStore'), life: 3000 })
    return
  }

  try {
    const payload = {
      address_id: selectedAddress.value,
      items: itemsInThisStore.map(p => ({
        product_id: p.product_id,
        variant_id: p.variant_id,
        quantity: p.quantity,
      })),
    }
    if (couponCode.value.trim()) payload.coupon = couponCode.value.trim()

    const { data } = await axios.post('/api/order', payload)

    if (data.is_success) {
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.orderSuccessStore', { store: getStoreDisplayName(unique_store_id) }), life: 5000 })

      // حذف المنتجات من هذا المتجر فقط من السلة
      products.value = products.value.filter(p => p.unique_store_id !== unique_store_id)
      selectedStores.value = selectedStores.value.filter(id => id !== unique_store_id)
      await fetchOrderTotals()
    }
  } catch (err) {
    const msg = err.response?.data?.message || t('cart.orderError')
    toast.add({ severity: 'error', summary: t('error'), detail: msg, life: 5000 })
  }
}

// طلب كل المتاجر (الزر الأصلي في الـ Sidebar)
const submitOrder = async () => {
  if (!canCheckout.value) {
    toast.add({ severity: 'warn', summary: t('warning'), detail: t('cart.cannotCheckout'), life: 4000 })
    return
  }

  try {
    const payload = {
      address_id: selectedAddress.value,
      items: filteredProducts.value.map(p => ({
        product_id: p.product_id,
        variant_id: p.variant_id,
        quantity: p.quantity,
      })),
    }
    if (couponCode.value.trim()) payload.coupon = couponCode.value.trim()

    const { data } = await axios.post('/api/order', payload)

    if (data.is_success) {
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.orderSuccess'), life: 5000 })
      products.value = products.value.filter(p => !selectedStores.value.includes(p.unique_store_id))
      storeOrders.value = []
      selectedStores.value = []
    }
  } catch (err) {
    const msg = err.response?.data?.message || t('cart.orderError')
    toast.add({ severity: 'error', summary: t('error'), detail: msg, life: 5000 })
  }
}

// Watchers
watch(() => [selectedAddress.value, selectedStores.value, couponCode.value], fetchOrderTotals, { deep: true })

// Lifecycle
onMounted(() => {
  fetchAddresses()
  fetchCart()
})
</script>

<style scoped>
[dir="rtl"] .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}
</style>
