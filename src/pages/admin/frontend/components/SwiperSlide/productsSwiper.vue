<template>
  <div class=" mx-auto px-4">
    <h2 class="font-bold font-sans text-gray-800 lg:mt-20 xs:mt-10 xs:text-sm sm:text-lg md:text-xl lg:text-2xl">
      {{ products.title }}
    </h2>
    <swiper
      :modules="[Autoplay]"
      :slides-per-view="4"
      :space-between="8"
      :loop="true"
      :autoplay="{ delay: 0, disableOnInteraction: false }"
      :speed="25000"
      :grab-cursor="true"
      class="mt-6"
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
        class="flex flex-col items-start cursor-pointer transition-transform hover:scale-105"
        @click="router.push({ name: 'Product-details', params: { id: pro.id } })"
      >
        <div class="w-full aspect-square overflow-hidden rounded-lg">
          <img :src="pro.img" :alt="pro.name" class="w-full h-full object-cover" />
        </div>
        <p class="font-sans mt-2 mb-1 text-gray-700 xs:text-xs sm:text-sm md:text-base lg:text-lg">
          {{ pro.name }}
        </p>
        <span class="font-sans text-gray-500 xs:text-xs sm:text-sm md:text-base lg:text-lg">
          {{ pro.price }}
        </span>
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
</script>

<style scoped>
/* Tailwind handles most styling, but we can add custom Swiper styles if needed */
.swiper {
  @apply w-full;
}

.swiper-slide {
  @apply flex flex-col;
}
</style>
