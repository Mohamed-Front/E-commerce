<template>
  <div class="mx-auto px-4 max-w-7xl">
    <div class="flex items-center justify-between mb-6">
      <h2 class="font-bold font-sans text-gray-800 lg:mt-20 xs:mt-10 xs:text-lg sm:text-xl md:text-2xl lg:text-3xl">
        {{ products.title }}
      </h2>

    </div>

    <swiper
      :modules="[Autoplay]"
      :slides-per-view="4"
      :space-between="8"
      :loop="true"
      :autoplay="{ delay: 0, disableOnInteraction: false }"
      :speed="25000"
      :grab-cursor="true"
      class="mt-6 pb-8"
      :breakpoints="{
        320: { slidesPerView: 2, spaceBetween: 8 },
        640: { slidesPerView: 2, spaceBetween: 12 },
        768: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 4, spaceBetween: 20 }
      }"
    >
      <SwiperSlide
        v-for="(pro, i) in products.products"
        :key="i"
        class="group flex flex-col items-start cursor-pointer transition-all duration-300 hover:-translate-y-2"
        @click="router.push({ name: 'Product-details', params: { id: pro.id } })"
      >
        <div class="w-full aspect-square overflow-hidden rounded-xl shadow-md relative">
          <img
            :src="pro.img"
            :alt="pro.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <p class="font-sans mt-4 mb-1 text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg">
          {{ pro.name }}
        </p>
        <div class="flex items-center w-full justify-between">
          <span class="font-sans text-gray-900 font-semibold xs:text-base sm:text-lg">
            {{ pro.price }}
          </span>
          <button
            class="text-primary hover:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            @click.stop="addToCart(pro)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </SwiperSlide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import { useRouter } from 'vue-router'
import 'swiper/css'

const router = useRouter()

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
          (pro) => pro.id && pro.name && pro.price && pro.img
        )
      )
    }
  }
})

const addToCart = (product) => {
  // Implement your add to cart logic here
  console.log('Added to cart:', product)
}
</script>

<style scoped>
/* Custom scrollbar for swiper */
.swiper {
  @apply w-full pb-8;
}

.swiper-slide {
  @apply flex flex-col;
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
