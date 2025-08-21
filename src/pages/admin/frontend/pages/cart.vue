<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8  font-inter">
    <div class="flex lg:flex-row flex-col gap-10">
      <section class="flex-1 bg-white rounded-2xl shadow-lg p-6">
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
        <div v-for="product in products" :key="product.id" class="flex items-center mt-6 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <img
            :src="product.img"
            :alt="product.name"
            class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 object-cover rounded-md border border-gray-800"
          />
          <div class="flex flex-col mx-4 gap-2 flex-1">
            <h3 class="text-lg font-bold text-gray-800">{{ product.name }}</h3>
            <p class="text-yellow-600 text-sm">Price: JOD {{ product.price }}</p>
            <div class="flex items-center justify-between">
              <p class="text-yellow-600 text-sm">Quantity: {{ product.quantity }}</p>
              <div class="border border-gray-300 p-2 rounded-md flex items-center gap-3">
                <button @click="pronum('minus', product.id)" class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors">-</button>
                <span class="text-sm font-medium">{{ product.quantity }}</span>
                <button @click="pronum('plus', product.id)" class="text-lg font-semibold text-gray-700 hover:text-yellow-600 transition-colors">+</button>
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
              <h4 class="text-yellow-600 font-semibold">Shipping Period</h4>
              <p class="text-gray-700">3H</p>
            </span>
            <span class="flex justify-between items-center">
              <h4 class="text-yellow-600 font-semibold">Sub-Total</h4>
              <p class="text-gray-700">JOD {{ calculateSubTotal }}</p>
            </span>
            <span class="flex justify-between items-center">
              <h4 class="text-yellow-600 font-semibold">Total</h4>
              <p class="text-gray-700">JOD {{ calculateTotal }}</p>
            </span>
          </div>
          <button class="w-full mt-6 py-3 text-sm sm:text-base lg:text-lg bg-gray-800 rounded-md text-white font-semibold transition-transform duration-150 hover:shadow-lg active:scale-95">
            Check Out
          </button>
        </div>
      </section>
      <section class="lg:w-1/4 w-full p-6 bg-white rounded-2xl shadow-lg">
        <div class="flex flex-col gap-4">
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">SubTotal</h4>
            <p class="text-gray-700">JOD {{ calculateSubTotal }}</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">Shipping Fee</h4>
            <p class="text-gray-700">JOD {{ shippingFee }}</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-yellow-600 font-semibold">Total</h4>
            <p class="text-gray-700">JOD {{ calculateTotal }}</p>
          </span>
        </div>
        <div class="flex flex-col mt-6">
          <input
            v-model="couponCode"
            type="text"
            placeholder="Coupon Code"
            class="bg-amber-50 placeholder-yellow-600 border border-amber-200 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
          />
          <button class="w-full mt-4 py-2 text-sm bg-amber-100 rounded-md text-yellow-600 font-semibold hover:bg-amber-200 transition-all active:scale-95">
            Apply
          </button>
          <button class="w-full mt-4 py-2 text-sm bg-gray-800 rounded-md text-white font-semibold hover:shadow-lg transition-all active:scale-95">
            Check Out All
          </button>
        </div>
      </section>
    </div>
    <div class="w-full mt-8">
      <Swiper :products="Suggestions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swiper from '../components/SwiperSlide/productsSwiper.vue';
import imge3 from '../imges/prand 1.png';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const selectedOption = ref('Store 1');
const couponCode = ref('');
const shippingFee = ref(5); // Example shipping fee

const options = [
  { label: 'Store 1', value: 'Store 1' },
  { label: 'Store 2', value: 'Store 2' },
  { label: 'Store 3', value: 'Store 3' },
];

const products = ref([
  {
    id: 1,
    name: 'Product 1',
    price: 10,
    quantity: 1,
    img: 'https://plus.unsplash.com/premium_photo-1675896084254-dcb626387e1e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 20,
    quantity: 3,
    img: 'https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png',
  },
]);

const removeProduct = (id) => {
  products.value = products.value.filter((product) => product.id !== id);
};

const pronum = (type, id) => {
  const product = products.value.find((p) => p.id === id);
  if (type === 'plus') {
    product.quantity++;
  } else if (type === 'minus' && product.quantity > 1) {
    product.quantity--;
  }
};

const calculateSubTotal = computed(() => {
  return products.value.reduce((total, product) => total + product.price * product.quantity, 0);
});

const calculateTotal = computed(() => {
  return calculateSubTotal.value + shippingFee.value;
});

class Data {
  constructor(name = 'No name', img = '', price = '$$') {
    this.name = name;
    this.img = img;
    this.price = price;
  }
}

const Suggestions = ref({
  title: t('category.suggestions'),
  products: [
    new Data('Product', imge3, '15.00 JD'),
    new Data('Product', imge3, '25.00 JD'),
    new Data('Product', imge3, '35.00 JD'),
    new Data('Product', imge3, '45.00 JD'),
    new Data('Product', imge3, '15.00 JD'),
    new Data('Product', imge3, '25.00 JD'),
    new Data('Product', imge3, '35.00 JD'),
    new Data('Product', imge3, '45.00 JD'),
  ],
});
</script>

