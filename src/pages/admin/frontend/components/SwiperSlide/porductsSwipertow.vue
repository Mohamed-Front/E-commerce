<template>
  <h1 class="lg:mt-24 xs:mt-12 mx-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">
    {{ products.title }}
  </h1>
<swiper
  :modules="[Autoplay]"
  :slides-per-view="5"
  :space-between="16"
  :loop="true"
  :autoplay="{ delay: 0, disableOnInteraction: false }"
  :speed="20000"
  grab-cursor
  class="mt-4 px-2"
  :breakpoints="{
    0: { slidesPerView: 3, spaceBetween: 12 },
    768: { slidesPerView: 4, spaceBetween: 14 },
    1024: { slidesPerView: 5, spaceBetween: 16 }
  }"
>
  <SwiperSlide
    v-for="pro in products.products"
    :key="pro.id"
    class="bg-white rounded-lg overflow-hidden flex flex-col justify-between shadow-md transition hover:scale-105 duration-300"
  >
    <img
      :src="pro.img"
      alt=""
      class="w-full object-cover aspect-[3/4] sm:aspect-[4/5] lg:aspect-[1/1] rounded-t-lg"
    />
    <p
      class="text-[var(--main-text-color)] font-bold text-center text-xs sm:text-sm md:text-base lg:text-lg px-3 py-2"
    >
      {{ pro.name }}
    </p>
  </SwiperSlide>
</swiper>
</template>

<script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay } from 'swiper/modules'

  import 'swiper/css'
  const props = defineProps({
    products: {
      type: Object,
      required: true,
    },
  })
</script>
