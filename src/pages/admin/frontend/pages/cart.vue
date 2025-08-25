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
          <img src="../imges/banner2.png" alt="Cart Banner" class="w-full h-40 object-cover rounded-lg mb-4" />
          <div class="flex gap-3 flex-wrap">
            <div
              v-for="option in options"
              :key="option.value"
              @click="selectedOption = option.value"
              class="cursor-pointer border rounded-lg px-4 py-2 flex items-center justify-between gap-3 transition-all duration-300 hover:shadow-md hover:scale-105"
              :class="selectedOption === option.value ? 'border-yellow-600 bg-yellow-600 text-white' : 'border-gray-300 bg-white'"
            >
              <span class="font-medium text-sm">{{ option.label }}</span>
              <div
                class="w-5 h-5 border rounded flex items-center justify-center bg-white"
                :class="selectedOption === option.value ? 'border-white' : 'border-gray-400'"
              >
                <svg
                  v-if="selectedOption === option.value"
                  class="w-3 h-3 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="py-4 border border-yellow-600 rounded-lg text-center text-yellow-600 font-semibold text-lg mt-4 bg-gradient-to-r from-yellow-50 to-amber-100">
            {{ selectedOption }}
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
                  <button @click="updateQuantity('minus', product.id)" class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors">-</button>
                  <span class="text-sm font-medium">{{ product.quantity }}</span>
                  <button @click="updateQuantity('plus', product.id)" class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors">+</button>
                </div>
                <button @click="removeProduct(product.id)" class="text-white bg-yellow-600 px-3 py-1 text-sm rounded-md hover:bg-yellow-700 transition-all">
                  {{ $t('remove') }}
                </button>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 p-6 mt-6 rounded-lg shadow-inner">
            <div class="flex flex-col gap-4">
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">مدة الشحن</h4>
                <p class="text-gray-700">3 ساعات</p>
              </span>
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">المجموع الفرعي</h4>
                <p class="text-gray-700">{{ calculateSubTotal }} د.أ</p>
              </span>
              <span class="flex justify-between items-center">
                <h4 class="text-yellow-600 font-semibold">الإجمالي</h4>
                <p class="text-gray-700">{{ calculateTotal }} د.أ</p>
              </span>
            </div>
            <button class="w-full mt-6 py-3 text-sm sm:text-base lg:text-lg bg-gray-800 rounded-md text-white font-semibold transition-transform duration-150 hover:shadow-lg active:scale-95">
              إتمام الشراء
            </button>
          </div>
        </div>
      </section>
      <section class="lg:w-1/4 w-full p-6 bg-white rounded-2xl shadow-lg">
        <div class="flex flex-col gap-4">
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">المجموع الفرعي</h4>
            <p class="text-gray-700">{{ calculateSubTotal }}  د.أ</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">رسوم الشحن</h4>
            <p class="text-gray-700">{{ shippingFee }} د.أ</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">الإجمالي</h4>
            <p class="text-gray-700">{{ calculateTotal }} د.أ</p>
          </span>
        </div>
        <div class="flex flex-col mt-6">
          <input
            v-model="couponCode"
            type="text"
            placeholder="كود الخصم"
            class="bg-amber-50 placeholder-yellow-600 border border-amber-200 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
          />
          <button class="w-full mt-4 py-2 text-sm bg-amber-100 rounded-md text-yellow-600 font-semibold hover:bg-amber-200 transition-all active:scale-95">
            تطبيق
          </button>
          <button class="w-full mt-4 py-2 text-sm bg-gray-800 rounded-md text-white font-semibold hover:shadow-lg transition-all active:scale-95">
            إتمام الشراء الكلي
          </button>
        </div>
      </section>
    </div>
    <div class="w-full mt-8">
      <Swiper :products="Suggestions" />
    </div>
    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swiper from '../components/SwiperSlide/productsSwiper.vue';
import imge3 from '../imges/prand 1.png';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast'


const { t } = useI18n();
const selectedOption = ref('Store 1');
const couponCode = ref('');
const shippingFee = ref(5);
const products = ref([]);
const loading = ref(true);
const toast = useToast();

const options = [
  { label: 'المتجر 1', value: 'Store 1' },
  { label: 'المتجر 2', value: 'Store 2' },
  { label: 'المتجر 3', value: 'Store 3' },
];

const fetchCart = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/cart');
    products.value = response.data.data.map(item => ({
      id: item.id,
      name: item.name,
      img: item.img || imge3, // Fallback to default image if none provided
      price: parseFloat(item.price),
      quantity: item.quantity
    }));
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل بيانات سلة التسوق',
      life: 3000
    });
    console.error('Error fetching cart:', error);
  } finally {
    loading.value = false;
  }
};

const removeProduct = async (id) => {
  try {
    await axios.delete(`/api/cart/${id}`);
    products.value = products.value.filter((product) => product.id !== id);
    toast.add({
      severity: 'success',
      summary: 'نجاح',
      detail: 'تم إزالة المنتج من السلة',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل إزالة المنتج من السلة',
      life: 3000
    });
    console.error('Error removing product:', error);
  }
};

const updateQuantity = async (type, id) => {
  const product = products.value.find((p) => p.id === id);
  if (!product) return;

  const newQuantity = type === 'plus' ? product.quantity + 1 : product.quantity - 1;
  if (newQuantity < 1) return;

  try {
    await axios.put(`/api/cart/${id}`, { quantity: newQuantity });
    product.quantity = newQuantity;
    toast.add({
      severity: 'success',
      summary: 'نجاح',
      detail: 'تم تحديث الكمية بنجاح',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحديث الكمية',
      life: 3000
    });
    console.error('Error updating quantity:', error);
  }
};

const calculateSubTotal = computed(() => {
  return products.value.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
});

const calculateTotal = computed(() => {
  return (parseFloat(calculateSubTotal.value) + shippingFee.value).toFixed(2);
});

class Data {
  constructor(name = 'بدون اسم', img = imge3, price = '15.00') {
    this.name = name;
    this.img = img;
    this.price = price;
  }
}

const Suggestions = ref({
  title: t('category.suggestions'),
  products: [
    new Data('منتج', imge3, '15.00'),
    new Data('منتج', imge3, '25.00'),
    new Data('منتج', imge3, '35.00'),
    new Data('منتج', imge3, '45.00'),
    new Data('منتج', imge3, '15.00'),
    new Data('منتج', imge3, '25.00'),
    new Data('منتج', imge3, '35.00'),
    new Data('منتج', imge3, '45.00'),
  ],
});

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
/* Custom styles are not necessary here, as all styling is handled by Tailwind CSS utility classes */
</style>
