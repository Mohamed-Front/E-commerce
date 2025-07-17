<template>
          <h2 class="font-bold font-sans lg:mt-20 xs:mt-10 xs:text-[.7rem] sm:text-[.9rem] md:text-[1.1rem]">{{ products.title }}</h2>
        <swiper :modules="[Autoplay]" :slides-per-view="4" :space-between="8" :loop="true"
          :autoplay="{ delay: 0, disableOnInteraction: false }" :speed="25000" grab-cursor class="mt-6">
          <SwiperSlide class="text-end cursor-pointer" v-for="(pro, i) in products.products" :key="i"
          @click="router.push({name : 'Product' , query: {pro:JSON.stringify(pro)}})"
          >
            <img :src="pro.img" alt="">
            <p class="font-sans mt-2 mb-1 xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.name + " " +
              Number(i + 1) }}</p>
            <span class="font-sans text-[var(--main-text-color)] xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.price }}</span>
          </SwiperSlide>
        </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import { useRouter } from 'vue-router';
import 'swiper/css';

const router = useRouter();
const props = defineProps({
  products: {
    type: Object,
    required: true
  }
});

</script>
