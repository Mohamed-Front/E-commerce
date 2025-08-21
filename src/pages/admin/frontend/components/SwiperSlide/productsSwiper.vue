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
      :autoplay="{ delay: 0, disableOnInteraction: false }"
      :speed="25000"
      :grab-cursor="true"
      class="mt-6 pb-1"
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
        </div>
        <p class="font-sans mt-4  mx-3 text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg truncate w-full">
          {{ truncateName(pro.name, 30) }}
        </p>

           <p v-if=" pro.sub_name" class="font-sans mx-3 text-gray-600 text-sm truncate w-full ">
            {{  pro.sub_name.slice(0, 37)}}
          </p>
        <div class="flex items-center w-full justify-between mx-3">
          <span class="font-sans text-[#A6853B] font-semibold xs:text-base sm:text-lg">
          {{ pro.price }} {{ $t('currencyLabel') }}
          </span>
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
          (pro) => pro.id &&  pro.name &&  pro.sub_name && pro.price && pro.img
        )
      )
    }
  }
})

const addToCart = (product) => {
  // Implement your add to cart logic here
  console.log('Added to cart:', product)
}

// Method to truncate product name to a specific length
const truncateName = (name, maxLength) => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength) + '...'
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

/* Ensure text truncation for long names */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
