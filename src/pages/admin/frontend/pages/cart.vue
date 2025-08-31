<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-inter">
    <div class="flex lg:flex-row flex-col gap-10">
      <section class="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <!-- Loading spinner -->
        <div v-if="loading" class="flex justify-center items-center py-4">
          <svg class="animate-spin h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <!-- Cart content -->
        <div v-else>
          <!-- Address Selection -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">اختر عنوان التوصيل</h3>
            <select
              v-model="selectedAddress"
              class="w-full bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
            >
              <option :value="null" disabled>اختر عنوان</option>
              <option v-for="address in addresses" :key="address.id" :value="address.id">
                {{ address.name }} - {{ address.street }}, {{ address.city }}
              </option>
            </select>
          </div>
          <!-- Express Delivery Toggle -->
          <div class="flex items-center gap-4 mb-6">
            <label class="text-gray-800 font-medium">توصيل سريع</label>
            <button
              @click="isExpressed = !isExpressed"
              class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
              :class="isExpressed ? 'bg-yellow-600' : 'bg-gray-300'"
              style="direction: ltr;"
            >
              <span
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                :class="isExpressed ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
          <div v-if="products.length === 0" class="text-center text-gray-600 py-4">
            سلة التسوق فارغة
          </div>
          <div v-else v-for="product in products" :key="product.id" class="flex items-center mt-6 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <img
              :src="product.img"
              :alt="product.name"
              class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 object-cover rounded-md border border-gray-800"
            />
            <div class="flex flex-col mx-4 gap-2 flex-1">
              <h3 class="text-lg font-bold text-gray-800">{{ product.name }}</h3>
              <p class="text-yellow-600 text-sm">السعر: {{ product.price }} د.أ</p>
              <div class="flex items-center justify-between">
                <p class="text-yellow-600 text-sm">الكمية: {{ product.quantity }}</p>
                <div class="border border-gray-300 p-2 rounded-md flex items-center gap-3">
                  <button @click="updateQuantity('minus', product.id, product.product_id, product.variant_id, product.quantity)" class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors">-</button>
                  <span class="text-sm font-medium">{{ product.quantity }}</span>
                  <button @click="updateQuantity('plus', product.id, product.product_id, product.variant_id, product.quantity)" class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors">+</button>
                </div>
                <button @click="clearProduct(product.id, product.product_id, product.variant_id)" class="text-white bg-yellow-600 px-3 py-1 text-sm rounded-md hover:bg-yellow-700 transition-all">
                  {{ $t('remove') }}
                </button>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 p-6 mt-6 rounded-lg shadow-inner">
            <div class="flex flex-col gap-4">
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">مدة الشحن</h4>
                <p class="text-gray-700">{{ orderDetails.time }} ساعات</p>
              </span>
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">المجموع الفرعي</h4>
                <p class="text-gray-700">{{ orderDetails.order_without_tax }} د.أ</p>
              </span>
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">الضريبة</h4>
                <p class="text-gray-700">{{ orderDetails.order_tax }} د.أ</p>
              </span>
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">الإجمالي</h4>
                <p class="text-gray-700">{{ orderDetails.total }} د.أ</p>
              </span>
            </div>
            <button
              :disabled="!selectedAddress"
              @click="submitOrder"
              class="w-full mt-6 py-3 text-sm sm:text-base lg:text-lg bg-gray-800 rounded-md text-white font-semibold transition-transform duration-150 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              إتمام الشراء
            </button>
          </div>
        </div>
      </section>
      <section class="lg:w-1/4 w-full p-6 bg-white rounded-2xl shadow-lg">
        <div class="flex flex-col gap-4">
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">المجموع الفرعي</h4>
            <p class="text-gray-700">{{ orderDetails.order_without_tax }} د.أ</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">الضريبة</h4>
            <p class="text-gray-700">{{ orderDetails.order_tax }} د.أ</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">الإجمالي</h4>
            <p class="text-gray-700">{{ orderDetails.total }} د.أ</p>
          </span>
        </div>
        <div class="flex flex-col mt-6">
          <input
            v-model="couponCode"
            type="text"
            placeholder="كود الخصم"
            class="bg-amber-50 placeholder-yellow-600 border border-amber-200 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
          />
          <button
            @click="applyCoupon"
            class="w-full mt-4 py-2 text-sm bg-amber-100 rounded-md text-yellow-600 font-semibold hover:bg-amber-200 transition-all active:scale-95"
          >
            تطبيق
          </button>
          <button
            :disabled="!selectedAddress"
            @click="submitOrder"
            class="w-full mt-4 py-2 text-sm bg-gray-800 rounded-md text-white font-semibold hover:shadow-lg transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            إتمام الشراء الكلي
          </button>
        </div>
      </section>
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import imge3 from '../imges/prand 1.png';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const couponCode = ref('');
const products = ref([]);
const loading = ref(true);
const toast = useToast();
const addresses = ref([]);
const selectedAddress = ref(null);
const isExpressed = ref(false);
const orderDetails = ref({
  delivery: 0,
  time: 0,
  coupon: 0,
  order_tax: 0,
  order_without_tax: 0,
  total: 0,
});

const fetchAddresses = async () => {
  try {
    const response = await axios.get('/api/home/address');
    if (response.data.is_success) {
      addresses.value = response.data.data;
      if (addresses.value.length > 0) {
        selectedAddress.value = addresses.value[0].id; // Select first address by default
      }
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل العناوين',
      life: 3000,
    });
    console.error('Error fetching addresses:', error);
  }
};

const fetchCart = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/cart');
    if (response.data.is_success) {
      products.value = response.data.data.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        name: item.product.name_ar || item.product.name_en,
        img: item.product.media && item.product.media.length > 0
          ? item.product.media[0].url
          : item.product.key_default_image || imge3,
        price: item.variant && item.variant.price
          ? parseFloat(item.variant.price).toFixed(2)
          : parseFloat(item.product.base_price).toFixed(2) || 0.00,
        quantity: item.quantity,
      }));
      await fetchOrderTotals();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل بيانات سلة التسوق',
      life: 3000,
    });
    console.error('Error fetching cart:', error);
  } finally {
    loading.value = false;
  }
};

const fetchOrderTotals = async () => {
  try {
    const payload = {
      is_expressed: isExpressed.value,
      address_id: selectedAddress.value,
      view: true,
      items: products.value.map(product => ({
        product_id: product.product_id,
        variant_id: product.variant_id,
        quantity: product.quantity,
      })),
    };
    if (couponCode.value) {
      payload.coupon = couponCode.value;
    }
    const response = await axios.post('/api/order/view', payload);
    if (response.data.is_success) {
      orderDetails.value = {
        delivery: parseFloat(response.data.data.delivery || 0).toFixed(2),
        time: response.data.data.time || 0,
        coupon: parseFloat(response.data.data.coupon || 0).toFixed(2),
        order_tax: parseFloat(response.data.data.order_tax || 0).toFixed(2),
        order_without_tax: parseFloat(response.data.data.order_without_tax || 0).toFixed(2),
        total: parseFloat(response.data.data.total || 0).toFixed(2),
      };
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل إجمالي الطلب',
      life: 3000,
    });
    console.error('Error fetching order totals:', error);
  }
};

const applyCoupon = async () => {
  try {
    await fetchOrderTotals();
    toast.add({
      severity: 'success',
      summary: 'نجاح',
      detail: 'تم تطبيق كود الخصم',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تطبيق كود الخصم',
      life: 3000,
    });
    console.error('Error applying coupon:', error);
  }
};

const updateQuantity = async (type, id, product_id, variant_id, quantity) => {
  const product = products.value.find((p) => p.id === id);
  if (!product) return;

  try {
    if (type === 'plus') {
      await axios.post(`/api/cart/update`, {
        product_id: product_id,
        variant_id: variant_id,
        quantity: quantity + 1,
      });
      product.quantity += 1;
    } else if (type === 'minus' && product.quantity > 1) {
      await axios.post(`/api/cart/update`, {
        product_id: product_id,
        variant_id: variant_id,
        quantity: quantity - 1,
      });
      product.quantity -= 1;
    }
    await fetchOrderTotals();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: `فشل ${type === 'plus' ? 'زيادة' : 'تقليل'} الكمية`,
      life: 3000,
    });
    console.error(`Error ${type === 'plus' ? 'increasing' : 'decreasing'} quantity:`, error);
  }
};

const clearProduct = async (id, product_id, variant_id) => {
  try {
    await axios.delete(`/api/cart/clear`, {
      data: { product_id, variant_id },
    });
    products.value = products.value.filter((product) => product.id !== id);
    await fetchOrderTotals();
    toast.add({
      severity: 'success',
      summary: 'نجاح',
      detail: 'تم إزالة المنتج من السلة',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل إزالة المنتج من السلة',
      life: 3000,
    });
    console.error('Error clearing product:', error);
  }
};

const submitOrder = async () => {
  if (!selectedAddress.value) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'يرجى اختيار عنوان للتوصيل',
      life: 3000,
    });
    return;
  }

  try {
    const payload = {
      is_expressed: isExpressed.value,
      address_id: selectedAddress.value,
      items: products.value.map(product => ({
        product_id: product.product_id,
        variant_id: product.variant_id,
        quantity: product.quantity,
      })),
    };
    if (couponCode.value) {
      payload.coupon = couponCode.value;
    }

    const response = await axios.post('/api/order', payload);
    if (response.data.is_success) {
      products.value = []; // Clear cart after successful order
      orderDetails.value = {
        delivery: 0,
        time: 0,
        coupon: 0,
        order_tax: 0,
        order_without_tax: 0,
        total: 0,
      };
      toast.add({
        severity: 'success',
        summary: 'نجاح',
        detail: 'تم إرسال الطلب بنجاح',
        life: 3000,
      });
    } else {
      throw new Error('Order submission failed');
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل إرسال الطلب',
      life: 3000,
    });
    console.error('Error submitting order:', error);
  }
};

onMounted(() => {
  fetchAddresses();
  fetchCart();
});
</script>

<style scoped>
/* Custom styles are not necessary here, as all styling is handled by Tailwind CSS utility classes */
</style>
