<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 class="font-bold font-sans text-gray-800 text-2xl md:text-3xl lg:text-4xl mb-6">
      {{ products.title }}
    </h2>

    <swiper
      :modules="[Autoplay]"
      :slides-per-view="4"
      :space-between="20"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :speed="4000"
      :grab-cursor="true"
      :touch-ratio="1.5"
      class="product-swiper"
      :breakpoints="{
        320: { slidesPerView: 2, spaceBetween: 5, centeredSlides: true },
        480: { slidesPerView: 2, spaceBetween: 5 },
        640: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 }
      }"
    >
      <SwiperSlide v-for="(pro, i) in products.products" :key="i" class="py-4">
        <a
          :href="`/product-details/${pro.id}`"

          rel="noopener noreferrer"
          class="block h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300  cursor-pointer overflow-hidden group"
          @click.prevent.stop="handleCardClick($event, pro)"
        >
          <!-- Image Container -->
          <div class="relative aspect-square overflow-hidden bg-gray-50">
            <!-- Best Seller Badge -->
            <div
              v-if="pro.is_best_seller"
              class="absolute top-3 left-3 z-10 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider"
            >
              Best Seller
            </div>

            <!-- Product Image -->
            <img
              :src="pro.img || '/placeholder-image.jpg'"
              :alt="pro.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

            <!-- Wishlist Button -->
            <button
              v-if="authStore.authenticatedweb"
              @click.stop.prevent="toggleFavorite(pro)"
              class="absolute top-3 right-3 z-20 p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              :class="{ 'text-red-500': pro.is_wished }"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex flex-col ">
            <!-- Product Name -->
            <h3 class="font-semibold text-gray-900 text-lg line-clamp-2 leading-tight mb-2">
              {{ truncateName(pro.name, 50) }}
            </h3>

            <!-- Description / Sub Name - NOW VISIBLE -->
            <p v-if="pro.sub_name" class="text-gray-600 text-sm line-clamp-2 mb-3 leading-snug">
              {{ pro.sub_name }}
            </p>

            <!-- Rating -->
            <div class="flex items-center gap-1 ">
              <span class="text-yellow-500 font-bold text-sm">{{ pro.total_rating || '0' }}</span>
              <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"/>
              </svg>
              <span class="text-gray-500 text-xs">({{ pro.total_rating || 0 }})</span>
            </div>

            <!-- Price & Discount -->
            <div class="mt-auto">
              <div class="flex  justify-between">
                <div class="flex items-baseline gap-2">
                  <span class="lg:text-2xl m-auto font-bold text-gray-900">
                    {{ $t('currencyLabel') }} {{parseFloat( pro.price-pro.total_discounts_value ).toFixed(2)}}
                  </span>

                  <span
                    v-if="pro.total_discounts_value !=0"
                    class=" font-bold my-auto text-base line-through text-[#0b3baa] px-2 py-0.5 rounded"
                  >
                    {{ pro.price }}
                  </span>
                </div>

                <!-- Add to Cart Button -->
                <button
                  @click.stop.prevent="addToCart(pro)"
                  :disabled="pro.is_stock === 1"
                  :class="[
                    'p-3 rounded-full my-auto transition-all duration-300 shadow-md',
                    pro.in_cart
                      ? 'bg-[#0b3baa] text-white'
                      : pro.is_stock === 1
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
              <div v-if="pro.is_free_shipping == 1" class="flex items-center text-[#0b3baa] text-xs font-medium">
                <a  class="pi pi-truck"></a>
                {{ $t("products.Free_Delivery") }}
              </div>
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

const { t } = useI18n();
const authStore = useAuthStore();

const props = defineProps({
  products: {
    type: Object,
    required: true,
  },
});

const handleCardClick = (event, product) => {
  if (event.target.closest('button')) return;
  window.open(`/product-details/${product.id}`, '_blank', 'noopener,noreferrer');
};

const addToCart = async (product) => {
  if (product.is_stock === 1 || product.in_cart) return;
  if (!authStore.authenticatedweb) {
    alert(t('auth.required') || 'Please log in to add items to cart.');
    return;
  }

  try {
    await axios.post('/api/cart/add', {
      product_id: product.id,
      variant_id: product.variant_id || null,
      quantity: 1,
    });
    product.in_cart = true;
  } catch (error) {
    alert(t('cart.error') || 'Failed to add to cart.');
  }
};

const toggleFavorite = async (product) => {
  if (!authStore.authenticatedweb) {
    alert(t('auth.required') || 'Please log in to manage wishlist.');
    return;
  }

  const wasWished = product.is_wished;
  try {
    if (wasWished) {
      await axios.delete(`/api/wishlists/${product.id}`, { data: { product_id: product.id } });
    } else {
      await axios.post('/api/wishlists', { product_id: product.id });
    }
    product.is_wished = !wasWished;
  } catch (error) {
    product.is_wished = wasWished;
    alert(t('wishlist.error') || 'Failed to update wishlist.');
  }
};

const truncateName = (name, length) => {
  return name.length > length ? name.slice(0, length) + '...' : name;
};
</script>

<style scoped>
.product-swiper {
  padding-bottom: 2rem;
}

.swiper-slide {
  height: auto;
}

/* Line Clamp Polyfill for all browsers */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
