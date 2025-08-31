<template>
  <div class="mx-auto px-4 max-w-7xl">
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
      :speed="5000"
      :grab-cursor="true"
      :css-mode="true"
      :simulate-touch="true"
      :touch-start-prevent-default="false"
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
        class="group flex flex-col items-start cursor-pointer h-full bg-white transition-all pb-[1%] rounded-lg shadow-lg duration-300 hover:-translate-y-2"
        @click="router.push({ name: 'Product-details', params: { id: pro.id } })"
      >
        <div class="w-full h-full aspect-square overflow-hidden rounded-xl shadow-sm relative">
          <img
            :src="pro.img"
            :alt="pro.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

          <button
            v-if="authStore.authenticatedweb"
            class="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
            @click.stop="toggleFavorite(pro)"
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
        <p class="font-sans mt-4 mx-3 text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg truncate w-full">
          {{ truncateName(pro.name, 30) }}
        </p>

        <p v-if="pro.sub_name" class="font-sans mx-3 text-gray-600 text-sm truncate w-full">
          {{ pro.sub_name.slice(0, 37) }}
        </p>
        <div class="flex items-center w-full justify-between mx-3 mt-auto">
          <span class="font-sans text-[#A6853B] font-semibold xs:text-base sm:text-lg">
            {{ pro.price }} {{ $t('currencyLabel') }}
          </span>

          <button
            v-if="authStore.authenticatedweb"
            class="p-2 rounded-full mx-6 bg-gray-100 text-[#A6853B] hover:bg-[#A6853B] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A6853B] focus:ring-offset-2"
            @click.stop="addToCart(pro)"
            aria-label="Add to cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.708.707 1.708H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
      </SwiperSlide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../../../stores/WebAuth';

const authStore = useAuthStore();
const router = useRouter();
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
          (pro) => pro.id && pro.name && pro.sub_name && pro.price && pro.img && typeof pro.is_wished === 'boolean'
        )
      );
    },
  },
});

// Method to handle adding a product to the cart via API
const addToCart = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }

  try {
    const payload = {
      product_id: product.data.id,
      variant_id: product.variant_id,
      quantity: 1,
    };
    const response = await axios.post('/api/cart/add', payload);
    console.log('Added to cart successfully:', response.data);
    alert('Product added to cart!');
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// Method to handle adding/removing a product from the wishlist
const toggleFavorite = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }

  const isCurrentlyFavorited = product.is_wished;
  const method = isCurrentlyFavorited ? 'delete' : 'post';
  const url = isCurrentlyFavorited ? `/api/wishlists/${product.id}` : '/api/wishlists';
  const payload = { product_id: product.data.id };

  try {
    let response;
    if (method === 'post') {
      response = await axios.post(url, payload);
    } else {
      response = await axios.delete(url, { data: payload });
    }

    // Update the is_wished property
    product.is_wished = !isCurrentlyFavorited;

    console.log(`Product ${isCurrentlyFavorited ? 'removed from' : 'added to'} wishlist successfully:`, response.data);
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    // Revert the state if the API call fails
    product.is_wished = isCurrentlyFavorited;
  }
};

// Method to truncate product name to a specific length
const truncateName = (name, maxLength) => {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
};
</script>

<style scoped>
/* Custom scrollbar for swiper */
.swiper {
  @apply w-full pb-8;
}

.swiper-slide {
  @apply flex flex-col h-auto; /* Ensure slides have auto height for grid layout */
}

/* Optional: Custom scrollbar for the container */
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
