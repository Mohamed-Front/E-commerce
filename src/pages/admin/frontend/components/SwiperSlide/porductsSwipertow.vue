<template>
 <h1 class="lg:mt-24 xs:mt-12 mr-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">
          {{ products.title }}
        </h1>
        <swiper
          :modules="[Autoplay]"
          :slides-per-view="5"
          :space-between="10"
          :loop="true"
          :autoplay="{ delay: 0, disableOnInteraction: false }"
          :speed="25000"
          grab-cursor
          class="max-h-[405px] mt-3 p-4"
        >
          <SwiperSlide class="bg-white text-center rounded-md pb-3" v-for="pro in products.products">
            <img :src="pro.img" alt="" class="h-[87%] rounded-md" />
            <p
              class="text-[var(--main-text-color)] font-bold m-[calc((13%)/2)] xs:text-[.3rem] sm:text-[.5rem] md:text-[.7rem] lg:text-[1rem] p-2"
            >
              {{ pro.name }}
            </p>
          </SwiperSlide>
        </swiper>
</template>


<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
const props = defineProps({
  products: {
    type: Object,
    required: true
  }
});

</script>
