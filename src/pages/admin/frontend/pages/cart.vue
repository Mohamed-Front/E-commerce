<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-inter" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="flex lg:flex-row flex-col gap-10">
      <section class="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <div v-if="loading" class="flex justify-center items-center py-4">
          <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" class="text-yellow-600" />
          <p class="ml-2">{{ t('loading') }}</p>
        </div>
        <div v-else>
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ t('cart.selectStore') }}</h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="store in stores"
                :key="store.unique_store_id"
                @click="toggleStore(store.unique_store_id)"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="selectedStores.includes(store.unique_store_id) ? 'bg-yellow-600 text-white' : 'bg-amber-50 text-yellow-600'"
              >
                {{ store.display_name }}
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
          <div v-if="filteredProducts.length === 0" class="text-center text-gray-600 py-4">
            {{ t('cart.emptyCart') }}
          </div>
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
            <div
              v-for="storeOrder in storeOrders"
              :key="storeOrder.store_id"
              class="bg-gray-100 p-6 mt-6 rounded-lg shadow-inner"
            >
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                {{ t('cart.orderFrom') }} {{ getStoreDisplayName(storeOrder.unique_store_id) }}
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
// Stores now includes market info and a unique ID for selection
const stores = ref([])
const selectedStores = ref([])
const addresses = ref([])
const selectedAddress = ref(null)
const couponCode = ref('')
const storeOrders = ref([])

// Generate a unique identifier for store/market combination (store_id-market_id or store_id-0)
const getUniqueStoreId = (store) => {
  return `${store.store_id}-${store.market_id || 'no-market'}`
}

// Generate the display name based on locale and if a market exists
const getDisplayName = (store) => {
  const storeName = locale.value === 'ar' ? store.store_name_ar : store.store_name_en
  const marketName = locale.value === 'ar' ? store.market_name_ar : store.market_name_en

  if (store.market_id && marketName) {
    // Check if marketName is different from storeName before adding the hyphen
    if (storeName && marketName && storeName.toLowerCase() !== marketName.toLowerCase()) {
      return `${storeName} - ${marketName}`
    }
    // If marketName is the same or storeName is missing, just use the market name (which is often more specific)
    return marketName || storeName
  }
  return storeName || t('store.unknown')
}

// Display products only from the selected unique_store_ids
const filteredProducts = computed(() => {
  if (selectedStores.value.length === 0) return []
  return products.value.filter(p => selectedStores.value.includes(p.unique_store_id))
})

// Combined total order summary (for the sidebar)
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

// Fetch addresses
const fetchAddresses = async () => {
  try {
    // Mock API call based on assumption: /api/home/address
    // const { data } = await axios.get('/api/home/address')

    // Mock Data for Addresses (Since original data was not provided)
    const mockAddresses = {
      is_success: true,
      data: [
        { id: 1, address_line_1: '123 Main St', city: 'Amman' },
        { id: 2, address_line_1: '456 Side Rd', city: 'Irbid' }
      ]
    }
    const data = mockAddresses

    if (data.is_success) {
      addresses.value = data.data
      if (addresses.value.length > 0) selectedAddress.value = addresses.value[0].id
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.addressLoadError'), life: 3000 })
  }
}

// Fetch Cart
const fetchCart = async () => {
  try {
    loading.value = true
    // Mock API call based on provided JSON structure
    // const { data } = await axios.get('/api/cart')
    const mockCartData = {
      "is_success": true,
      "message": "Cart details",
      "data": {
        "stores": [
          {
            "store_id": 4,
            "market_id": null,
            "store_name_ar": "شفت 7 مول",
            "store_name_en": "Shift7 Mall",
            "market_name_en": null,
            "market_name_ar": null,
            "items": [
              {
                "product_id": 26007,
                "variant_id": null,
                "quantity": 3,
                "product": { "id": 26007, "store_id": 4, "name_ar": "سلة غسيل بورسيف سكوير - 2", "name_en": "Bursev Square Laundry Basket-2", "base_price": "1.00", "media": [{ "url": "https:\/\/shift.test.visualinnovate.net\/public\/storage\/uploads\/products\/product-26007-product_image-1.jpg" }] }
              },
              {
                "product_id": 26006,
                "variant_id": null,
                "quantity": 1,
                "product": { "id": 26006, "store_id": 4, "name_ar": "سلة بورسيف بيرل متعددة الأغراض مع غطاء 1,25 لتر", "name_en": "Bursev Pearl Multipurpose Basket With Lid 1,25lt", "base_price": "1.00", "media": [{ "url": "https:\/\/shift.test.visualinnovate.net\/public\/storage\/uploads\/products\/product-26006-product_image-1.jpg" }] }
              },
            ]
          },
          {
            "store_id": 5,
            "market_id": 482,
            "store_name_ar": "سوبر ماركت",
            "store_name_en": "Super Market",
            "market_name_en": "centro market",
            "market_name_ar": "سينترو ماركت",
            "items": [
              {
                "product_id": 32405,
                "variant_id": null,
                "quantity": 1,
                "product": { "id": 32405, "store_id": 5, "name_ar": "قهوة تركية بن العميد وسط بدون هيل منزوعة الكافيين، 250 جرام", "name_en": "Al Ameed Decaf Turkish Coffee Medium without Cardamom, 250g", "base_price": "4.90", "media": [] }
              },
            ]
          },
          {
            "store_id": 5,
            "market_id": 1126,
            "store_name_ar": "سوبر ماركت",
            "store_name_en": "Super Market",
            "market_name_en": "Shift Mart",
            "market_name_ar": "شفت مارت",
            "items": [
              {
                "product_id": 255,
                "variant_id": null,
                "quantity": 1,
                "product": { "id": 255, "store_id": 5, "name_ar": "مياه فولفيك معدنية - 500 مل", "name_en": "Volvic Mineral Water - 500 ml", "base_price": "1.00", "media": [{ "url": "https:\/\/shift.test.visualinnovate.net\/public\/storage\/uploads\/products\/product-255-product_image-1_jpg.jpg" }] }
              }
            ]
          }
        ]
      }
    }
    const data = mockCartData

    if (data.is_success) {
      const tempStores = []
      const tempProducts = []

      // Process stores and products from the API response
      data.data.stores.forEach(s => {
        const uniqueStoreId = getUniqueStoreId(s)
        const displayName = getDisplayName(s)

        // Only add the unique store/market combination once to the stores list
        if (!tempStores.some(ts => ts.unique_store_id === uniqueStoreId)) {
          tempStores.push({
            unique_store_id: uniqueStoreId,
            store_id: s.store_id,
            market_id: s.market_id,
            store_name_ar: s.store_name_ar,
            store_name_en: s.store_name_en,
            market_name_ar: s.market_name_ar,
            market_name_en: s.market_name_en,
            display_name: displayName,
          })
        }

        // Process products for the current store/market
        s.items.forEach(item => {
          const product = item.product
          const img = product.media?.[0]?.url || product.key_default_image || '/images/placeholder-product.png'
          const price = item.variant?.price ? parseFloat(item.variant.price) : parseFloat(product.base_price) || 0

          tempProducts.push({
            uniqueId: `${item.product_id}-${item.variant_id || 'no-var'}-${uniqueStoreId}`, // Add uniqueStoreId to uniqueId for robustness
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: locale.value === 'ar' ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar),
            img,
            price: price.toFixed(2),
            quantity: item.quantity,
            store_id: product.store_id, // Original store_id
            market_id: s.market_id, // Original market_id
            unique_store_id: uniqueStoreId, // The new unique identifier for filtering
          })
        })
      })

      stores.value = tempStores
      products.value = tempProducts

      // Select the first unique store/market combination automatically
      if (stores.value.length > 0) {
        selectedStores.value = [stores.value[0].unique_store_id]
      }

      await fetchOrderTotals()
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.cartLoadError'), life: 3000 })
  } finally {
    loading.value = false
  }
}

// Get the display name from the 'stores' array
const getStoreDisplayName = (uniqueStoreId) => {
  const store = stores.value.find(s => s.unique_store_id === uniqueStoreId)
  return store?.display_name || t('store.unknown')
}

// Fetch order totals for the currently selected stores and address
const fetchOrderTotals = async () => {
  if (!selectedAddress.value || filteredProducts.value.length === 0) {
    storeOrders.value = []
    return
  }

  // Group filtered products by unique_store_id
  const ordersByStore = filteredProducts.value.reduce((acc, product) => {
    const key = product.unique_store_id;
    if (!acc[key]) {
      acc[key] = {
        unique_store_id: key,
        store_id: product.store_id,
        market_id: product.market_id,
        items: []
      };
    }
    acc[key].items.push({
      product_id: product.product_id,
      variant_id: product.variant_id,
      quantity: product.quantity
    });
    return acc;
  }, {});

  // The API call expects items to be grouped by store, but the mock response only includes one list of totals.
  // For a real-world scenario, the backend API should accept the full cart and return totals per unique store/market group.

  const payload = {
    address_id: selectedAddress.value,
    items: filteredProducts.value.map(p => ({
      product_id: p.product_id,
      variant_id: p.variant_id,
      quantity: p.quantity,
      // Pass unique identifier to the backend to get correct totals back
      unique_store_id: p.unique_store_id
    }))
  }

  if (couponCode.value) payload.coupon = couponCode.value

  try {
    // Mock API call (assuming a successful response structure)
    // const { data } = await axios.post('/api/order/view', payload)

    // Mock response for /api/order/view (Must return one total per selected unique_store_id)
    const mockOrderViewData = {
        is_success: true,
        data: Object.keys(ordersByStore).map((key, index) => ({
            // This is crucial: the response must echo the unique_store_id used in the request
            unique_store_id: key,
            delivery_time: `30 - ${30 + index * 10} min`,
            delivery_message: index % 2 === 0 ? `Free delivery for orders over 100 ${t('cart.currency')}` : null,
            subtotal: (index + 1) * 10.00,
            tax: (index + 1) * 0.50,
            total: (index + 1) * 10.50,
        }))
    }
    const data = mockOrderViewData

    if (data.is_success) {
      // Ensure the storeOrders list uses the unique_store_id for mapping
      storeOrders.value = data.data.map(order => ({
        ...order,
        // Map the unique identifier to the storeOrders list for proper display in the template
        unique_store_id: order.unique_store_id
      }))
    }
  } catch (err) {
    // Note: If the backend returns an error (e.g., store not deliverable), the error handling should be here.
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.orderTotalsError'), life: 3000 })
    storeOrders.value = [] // Clear totals on error
  }
}

const toggleStore = (uniqueStoreId) => {
  if (selectedStores.value.includes(uniqueStoreId)) {
    selectedStores.value = selectedStores.value.filter(id => id !== uniqueStoreId)
  } else {
    selectedStores.value.push(uniqueStoreId)
  }
  // Re-fetch totals when selection changes
  fetchOrderTotals()
}

const selectAllStores = () => {
  selectedStores.value = stores.value.map(s => s.unique_store_id)
  // Re-fetch totals when selection changes
  fetchOrderTotals()
}

const updateQuantity = async (action, product) => {
  const newQty = action === 'plus' ? product.quantity + 1 : product.quantity - 1
  if (newQty < 1) return
  try {
    // Mock API call for update cart
    // await axios.post('/api/cart/update', { ... })

    // Update local state immediately
    product.quantity = newQty

    await fetchOrderTotals()
    toast.add({ severity: 'success', summary: t('success'), detail: t('cart.quantityUpdated'), life: 2000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.quantityUpdateError'), life: 3000 })
  }
}

const clearProduct = async (product) => {
  try {
    // Mock API call for remove product
    // await axios.post('/api/cart/remove', { ... })

    // Update local state
    products.value = products.value.filter(p => p.uniqueId !== product.uniqueId)

    // Also remove the store if it has no remaining products
    const remainingProductsForStore = products.value.filter(p => p.unique_store_id === product.unique_store_id).length
    if (remainingProductsForStore === 0) {
      selectedStores.value = selectedStores.value.filter(id => id !== product.unique_store_id)
      stores.value = stores.value.filter(s => s.unique_store_id !== product.unique_store_id)
    }

    await fetchOrderTotals()
    toast.add({ severity: 'success', summary: t('success'), detail: t('cart.removeSuccess'), life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.removeError'), life: 3000 })
  }
}

const applyCoupon = async () => {
  // Coupon logic is handled inside fetchOrderTotals when couponCode is present
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
        quantity: p.quantity,
        // Pass unique store identifier
        unique_store_id: p.unique_store_id
      }))
    }

    if (couponCode.value) payload.coupon = couponCode.value

    // Mock API call for order submission
    // const { data } = await axios.post('/api/order', payload)

    // Mock success response
    const data = { is_success: true }


    if (data.is_success) {
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.orderSuccess'), life: 5000 })

      // Clear cart items related to the selected stores
      products.value = products.value.filter(p => !selectedStores.value.includes(p.unique_store_id))
      stores.value = stores.value.filter(s => !selectedStores.value.includes(s.unique_store_id))
      storeOrders.value = []
      selectedStores.value = []
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('cart.orderError'), life: 4000 })
  }
}

// Watchers
watch(() => selectedAddress.value, fetchOrderTotals)
// Note: Changed the coupon watcher to only call fetchOrderTotals if couponCode is NOT empty to avoid unnecessary calls on initial load/clearing
watch(() => couponCode.value, (newVal) => {
  if (newVal) {
    fetchOrderTotals();
  } else if (storeOrders.value.length > 0) {
    // If the coupon is cleared, re-calculate totals without it
    fetchOrderTotals();
  }
})

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
