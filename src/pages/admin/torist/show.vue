<template>

  <va-card class="card lg:w-[70%] p-[2%] m-auto">
      <div class="flex space-x-4 w-full">
        <div class="w-[90%]">
          <label for="password"> Nationality</label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      <div class="w-[90%]">
          <label for="password">name </label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      </div>
      <div class="flex space-x-4 w-full">
        <div class="w-[90%]">
          <label for="password"> mail </label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      <div class="w-[90%]">
          <label for="password">Password </label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      </div>
      <div class="flex space-x-4 w-full">
        <div class="w-[90%]">
          <label for="password"> Gender</label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      <div class="w-[90%]">
          <label for="password">Country_id </label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      </div>
      <div class="flex space-x-4 w-full">
        <div class="w-[90%]">
          <label for="password"> City_id</label>
          <InputText type="text" class="mt-3 w-full mb-3"/>
      </div>
      <div class="w-[90%]">

      </div>
      </div>
      <div class="w-[90%] m-auto p-[1%]">
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
            {{ doctor }}
          </div>

        </div>
        <!-- Doctor -->
      </SwiperSlide>
    </swiper>
      </div>
  </va-card>
</template>

<script setup>

import axios from "axios";
import {ref, watch ,onMounted} from "vue";
import {useRoute} from "vue-router";
const route = useRoute();
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const modules = [Pagination, Navigation, Autoplay];

onMounted(() => {
  axios.get(`/api/tourists/${route.params.id}`).then((res)=>{
    console.log(res)
  });

})



</script>

<style scoped>

</style>
