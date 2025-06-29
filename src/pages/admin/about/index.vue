<template>
  <va-card class="card w-[100%]  p-[2%] m-auto">

    <form  class="flex flex-col  m-auto w-3/4 py-9">
        <h1 class="py-2 font-bold text-xl">About us</h1>
        <div class="">
          <label for="password">title </label>
          <InputText required v-model="title" type="text" class="mt-3 w-full mb-3"/>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>

        </div>

        <div class="w-full">
          <label for="password">Description </label>
          <Textarea required v-model="description"  rows="5" cols="30" class="mt-3 w-full mb-3" />

          <div class="mt-1 mb-5 text-red-500" v-if="error?.description">{{ error.description[0] }}</div>

        </div>



        <Button  @click="cproduct" label="update"  class="mt-3"/>
      </form>
      <Toast/>
  </va-card>
</template>

<script setup>

import axios from "axios";
import {useToast} from 'primevue/usetoast'
const toast = useToast()
import {ref, watch ,onMounted} from "vue";
import {useRoute} from "vue-router";
const route = useRoute();
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
const value =ref(2)
const title=ref('')
const description=ref('')
const about_data=ref({})
const fetch=()=>{
  axios.get(`/api/About/show/1`).then((res)=>{
    console.log(res)
    title.value=res.data.data.title
    description.value=res.data.data.description
  });

}
onMounted(() => {
  fetch()
})

const cproduct=()=>{
  axios
    .post('api/About/update/1',{
      title:title.value,
      description:description.value

    })
    .then((res) => {
      fetch()
      toast.add({severity: 'success', summary: 'Successful', detail: ' Successful', life: 3000})
    })
    .catch((er) => {
      console.log(er)
      error.value=er.response.data.errors

    })
}


</script>

<style scoped>

</style>
