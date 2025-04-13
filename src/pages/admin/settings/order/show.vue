<template>
 <va-card>
  df
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
const driver_data=ref({})
onMounted(() => {
  axios.get(`/api/orders/${route.params.id}`).then((res)=>{
    console.log(res)

  });

})



</script>

<style scoped>

</style>

