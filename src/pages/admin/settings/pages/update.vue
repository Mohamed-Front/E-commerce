<template>

  <va-card class="card">

    <div class=" flex justify-center">
      <form @submit.prevent="onSubmit" class="flex flex-col  w-3/4 py-9">
        <h2 class="pb-4 text-center va-text-bold">
          Update Page
       

        </h2>
        <div class="">
          <label for="password">Title </label>
          <InputText v-model="page.title" type="text" class="mt-3 w-full mb-3"/>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
        </div>

        <div class="">
          <label for="password">Description </label>
            <Editor v-model="page.description" editorStyle="height: 150px"  class="my-2"/>

          <div class="mt-1 mb-5 text-red-500" v-if="error?.description">{{ error.description[0] }}</div>
        </div>
       
        <Button type="submit" label="Submit" class="mt-3"/>
      </form>
    </div>
    <Toast/>
  </va-card>


</template>

<script setup>
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {ref, watch, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import {registerPlugin} from "filepond";
import Editor from 'primevue/editor';

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

registerPlugin(FilePondPluginFileEncode);
// import 'http://localhost:8000/media/152/AuxKJM3B9InTqZlXdlHwcgIpKsXMNfNepudOtbxd.png'
import vueFilePond from "vue-filepond";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

const toast = useToast()

const page = ref({
  title: '',
  description: ''
})

const pond = ref(null)
const myFiles = ref([])
const route = useRoute();
const entred = ref(0)
const file = ref('')
const url = ref([])
const dataEntred = ref({})

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const lang = ref([
  {name: 'en', value: "gb"},
  {name: 'ar', value: "sa"},
  {name: 'az', value: "az"},
  {name: 'ge', value: "ge"},
  {name: 'ru', value: "ru"},
  {name: 'tr', value: "tr"},
])


const langSelected = ref('gb')
const error = ref('')

const handleFileUpload = (e) => {
  console.log(e.files[0])
  files.value = e.files;
  file.value = e.files;

  for (let  i =0 ;i < files.value.length ; i++)
  {
    // console.log(URL.createObjectURL(files.value[i]))
    url.value.push(URL.createObjectURL(files.value[i])) ;
  }
  console.log(url.value)

};
const onSubmit = () => {

  const body = new FormData();
  for(let i=0; i<files.value.length ;i++){
    body.append('images[]', files.value[i])
  }
  // body.append("images", file.value);
  // body.append("images", files.value[0]);
  body.append("title", page.value.title);
  body.append("description", page.value.description);


  axios.defaults.headers.common['local'] = langSelected.value

  axios.post(`/api/pages/${dataEntred.value.id}/update`, body).then((res) => {
    error.value = []
    entred.value = 1
    let media= dataEntred.value.media
    dataEntred.value = res.data.page
    dataEntred.value.media = media
    toast.add({severity: 'success', summary: 'Successful', detail: 'Page Updated', life: 3000})

  }).catch((el) => {
    error.value = el.response.data.errors

    console.log(error.value)

  })

}


watch(langSelected, async (newValue, oldQuestion) => {
  console.log(dataEntred.value)

  page.value.title = dataEntred.value?.title[newValue] == undefined ? '' : dataEntred.value?.title[newValue]
  page.value.description = dataEntred.value?.description[newValue] == undefined ? '' : dataEntred.value?.description[newValue]

})
const computedFiles = computed(() => {
  return myFiles.value
})

onMounted(() => {

  axios.get(`/api/pages/${route.params.id}`).then((res) => {
    page.value.title = res.data.page.title[langSelected.value]
    page.value.description = res.data.page.description[langSelected.value]
    dataEntred.value = res.data.page



  })
  const handleFileUpload = (e) => {

    files.value = e.files
    file.value = e.files[0]
    console.log(file.value)
    url.value = URL.createObjectURL(file.value);
  };



  //
  // for( let i =0 ;i< dataEntred.value.media.length ;i++)
  // {
  //   console.log(hidImg[i].src)
  // }


})


</script>

<style scoped>

</style>
