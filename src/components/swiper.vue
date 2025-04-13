<template>
  <swiper
@slideChange="onSlideChange"
:modules="modules"
:scrollbar="{ draggable: true }"
:autoplay="{
  delay: 2000,
  disableOnInteraction: false,
}"
:breakpoints="{
  320: {
    slidesPerView: 1,
    spaceBetween: 10,
  },
  480: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 1,
    spaceBetween: 10,
  },
}"
>
<SwiperSlide v-for="doctor in 4">
  <div class="text-center bg-teal-100 rounded-3xl m-2">
    <!-- Doctor -->
    <div class="bg-white rounded-3xl">
     <p>{{ doctor }}</p>
    </div>

  </div>
  <!-- Doctor -->
</SwiperSlide>
</swiper>
</template>
<script setup>

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const modules = [Pagination, Navigation, Autoplay];




</script>
