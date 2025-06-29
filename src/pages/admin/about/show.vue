<template>
  <va-card class="card w-[100%]  p-[2%] m-auto">
    <div class="w-full"><p class="w-full text-2xl  m-auto py-[1%]">guide details</p></div>
    <div style="border: 1px solid rgb(217, 214, 214);" class="grid grid-cols-1 gap-2 lg:grid-cols-6 p-[1%] rounded-md">
      <div class="col-span-1">
        <img :src="driver_data?.personal_photo" class="w-[200px] rounded-md h-[200px] m-auto">
      </div>
      <div class=" col-span-5">
        <div class="flex">
          <p class="text-xl md:text-2xl font-bold px-4 ">{{ driver_data.name }}</p>
          <div class="card flex justify-content-center">

           <Rating v-model="driver_data.total_rate" :cancel="false" readonly  />

          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 xl:w-[100%] lg:w-full p-[1%]" >
        <div class="flex ">
          <i class="bg-[#DE4915] p-1 rounded-full my-auto  text-[white]  pi pi-check"></i>
          <p class="text-xl  px-1 my-auto">{{ driver_data.name }}</p>
        </div>
        <div class="flex " v-if="driver_data.gender">
          <i class="bg-[#DE4915] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >{{driver_data.gender}}</p>
     
        </div>
        
        <div v-if="driver_data?.languages != ''"  class="flex ">
          <i class="bg-[#DE4915] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <div class="flex" v-for="lan in driver_data?.languages " :key="lan" >
            <p  class="text-xl md:text-xl px-1 my-auto">{{ lan.language?.lang }}</p>
            <p class="font-bold text-xl">&</p>
          </div>
          
        </div> 
        <div class="flex " v-if="driver_data.country">
          <i class="bg-[#DE4915] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto">{{ driver_data.country }}</p>
        </div>
        <div class="flex " v-if="driver_data.state">
          <i class="bg-[#DE4915] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto">{{ driver_data.state }}</p>
        </div>
        <div class="flex " v-if="driver_data?.nationality ">
          <i class="bg-[#DE4915] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto">{{ driver_data?.nationality }}</p>
        </div>

      </div>
      <div class="px-[2%]">
        <p class="text-xl font-bold">Description :<label class="text-base px-2 text-[#696666]" >{{ driver_data.bio }}</label></p>
      </div>
      </div>

    </div>
    <div v-if=" driver_data.priceServices != ''" class="w-full"><p class="w-full text-2xl  m-auto py-[1%]">price details</p></div>
    <div v-if=" driver_data.priceServices != ''" style="border: 1px solid rgb(217, 214, 214);" class=" p-[1%] rounded-md">

    
     

      <div   class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 xl:w-[100%] lg:w-full p-[1%]" >
      
        <div v-for="driv in driver_data.priceServices" class="flex ">
          <i class="bg-[#DE4915] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
           <p class="text-xl  px-1 my-auto font-bold">{{ driv.state_name }}</p>
          <p class="text-xl md:text-xl px-1 my-auto">{{ driv.price }} $</p>
         
        </div>
        
      </div>

     

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
const value =ref(2)
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const modules = [Pagination, Navigation, Autoplay];
const driver_data=ref({})
onMounted(() => {
  axios.get(`/api/guides/show/${route.params.id}`).then((res)=>{
    console.log(res)
    driver_data.value=res.data.user
    console.log(driver_data)
  });

})



</script>

<style scoped>

</style>
