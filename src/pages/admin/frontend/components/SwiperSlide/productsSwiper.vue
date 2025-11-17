<template>
  <div class="mx-auto max-w-7xl">
    <div class="flex items-center justify-between">
      <h2 class="font-bold font-sans text-gray-800 lg:mt-4 xs:mt-2 xs:text-lg sm:text-xl md:text-2xl lg:text-3xl">
        {{ products.title }}
      </h2>
    </div>

    <swiper
      :modules="[Autoplay]"
      :slides-per-view="4"
      :space-between="8"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :speed="4000"
      :grab-cursor="true"
      :touch-ratio="1.5"
      class="mt-6 pb-1"
      :breakpoints="{
        320: { slidesPerView: 1, spaceBetween: 8 },
        480: { slidesPerView: 1.5, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 12 },
        768: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 4, spaceBetween: 20 }
      }"
    >
      <SwiperSlide
        v-for="(pro, i) in products.products"
        :key="i"
        class="group"
      >
        <!-- Clickable Card – opens product details in NEW TAB (except buttons) -->
        <a
          :href="`/product-details/${pro.id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="block h-full bg-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          @click.prevent.stop="handleCardClick($event, pro)"
        >
          <!-- Image Container -->
          <div class="w-full h-full aspect-square overflow-hidden rounded-xl shadow-sm relative">
            <img
              :src="pro.img"
              :alt="pro.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-100"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

            <!-- Wishlist Button -->
            <button
              v-if="authStore.authenticatedweb"
              @click.stop.prevent="toggleFavorite(pro)"
              class="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
              aria-label="Add to wishlist"
            >
              <svg
                class="w-5 h-5"
                :class="{ 'text-red-500': pro.is_wished }"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>

          <!-- Product Info -->
          <div class="p-3 flex flex-col h-[140px]">
            <p class="font-sans mt-2 text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg line-clamp-2">
              {{ truncateName(pro.name, 30) }}
            </p>

            <p v-if="pro.sub_name" class="font-sans text-gray-600 text-sm line-clamp-1 mt-1">
              {{ pro.sub_name.slice(0, 37) }}
            </p>

            <div class="flex items-center justify-between mt-auto">
              <span class="font-sans text-[#A6853B] font-semibold xs:text-base sm:text-lg">
                {{ pro.price }} {{ $t('currencyLabel') }}
              </span>

              <!-- Add to Cart Button -->
              <button
                v-if="authStore.authenticatedweb"
                @click.stop.prevent="addToCart(pro)"
                class="p-2 rounded-full bg-gray-100 text-[#A6853B] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A6853B] focus:ring-offset-2"
                :class="{
                  'hover:bg-[#A6853B] hover:text-white': !pro.in_cart && pro.is_stock !== 1,
                  'bg-gray-300 text-gray-500 cursor-not-allowed': pro.is_stock === 1,
                }"
                :disabled="pro.is_stock === 1"
                :aria-label="pro.in_cart ? 'In cart' : pro.is_stock === 1 ? 'Out of stock' : 'Add to cart'"
              >
                <svg
                  v-if="pro.in_cart"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0 .984.984 0 0 0 0 1.4l4.2 4.2c.39.39 1.01.39 1.4 0l8.4-8.4a.984.984 0 0 0 0-1.4.984.984 0 0 0-1.4 0L9 16.2z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.708.707 1.708H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </a>
      </SwiperSlide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../../../stores/WebAuth';

const authStore = useAuthStore();
const { t } = useI18n();

const props = defineProps({
  products: {
    type: Object,
    required: true,
    validator: (products) => {
      return (
        products &&
        typeof products.title === 'string' &&
        Array.isArray(products.products) &&
        products.products.every(
          (pro) =>
            pro.id &&
            pro.name &&
            typeof pro.sub_name === 'string' &&
            pro.price &&
            pro.img &&
            typeof pro.is_wished === 'boolean' &&
            typeof pro.in_cart === 'boolean' &&
            typeof pro.is_stock === 'number'
        )
      );
    },
  },
});

/* ----------  إدارة نقرة البطاقة (فتح في تبويب جديد فقط إذا لم يكن زر) ---------- */
const handleCardClick = (event, product) => {
  // إذا كان النقر على زر داخل البطاقة → لا تفعل شيئًا (الأزرار تُدار بواسطة @click.stop.prevent)
  // إذا كان النقر على أي مكان آخر → افتح الرابط في تبويب جديد
  if (event.target.closest('button')) return;

  const url = `/product-details/${product.id}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/* ----------  إضافة للسلة ---------- */
const addToCart = async (product) => {
  if (!authStore.authenticatedweb) {
    alert(t('auth.required') || 'Please log in to add to cart.');
    return;
  }

  try {
    const payload = {
      product_id: product.id,
      variant_id: product.variant_id || null,
      quantity: 1,
    };
    await axios.post('/api/cart/add', payload);
    product.in_cart = true;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    alert(t('cart.error') || 'Failed to add to cart.');
  }
};

/* ----------  تبديل المفضلة ---------- */
const toggleFavorite = async (product) => {
  if (!authStore.authenticatedweb) {
    alert(t('auth.required') || 'Please log in to manage wishlist.');
    return;
  }

  const isCurrentlyFavorited = product.is_wished;
  const method = isCurrentlyFavorited ? 'delete' : 'post';
  const url = isCurrentlyFavorited ? `/api/wishlists/${product.id}` : '/api/wishlists';
  const payload = { product_id: product.id };

  try {
    if (method === 'post') {
      await axios.post(url, payload);
    } else {
      await axios.delete(url, { data: payload });
    }

    product.is_wished = !isCurrentlyFavorited;

  } catch (error) {
    console.error('Error toggling wishlist:', error);
    product.is_wished = isCurrentlyFavorited; // إعادة القيمة الأصلية
    alert(t('wishlist.error') || 'Failed to update wishlist.');
  }
};

/* ----------  تقطيع اسم المنتج ---------- */
const truncateName = (name, maxLength) => {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
};
</script>

<style scoped>
.swiper {
  @apply w-full pb-8;
}

.swiper-slide {
  @apply h-auto;
}

/* Consistent card height */
a {
  @apply flex flex-col h-full;
}

/* Line clamp for text overflow */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
