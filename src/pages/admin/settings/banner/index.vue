
<script setup>



const deleteDialog = ref(false)
const showbanner = ref(false)

import { FilterMatchMode } from 'primevue/api'
  import { ref, onMounted, onBeforeMount } from 'vue'
  // import ProductService from '@/service/ProductService';
  import { useToast } from 'primevue/usetoast'
  import axios from 'axios'
  const router = useRouter()
  const toast = useToast()
  import { useRouter } from 'vue-router'
  import moment from 'moment'

  const loading = ref(true)

  const users = ref(null)

  const selectedProducts = ref(null)
  const dt = ref(null)
  const filters = ref({})
  const submitted = ref(false)


const file = ref('')
const url = ref([])
const dataEntred = ref({})
const banner_detailes = ref({})
const error = ref('')
const files = ref([]);
const handleFileUpload = (e) => {
  console.log(e.files[0])
  files.value=''
  files.value = e.files;
  file.value = e.files;
  console.log(file.value)

  for (let  i =0 ;i < files.value.length ; i++)
  {
    // console.log(URL.createObjectURL(files.value[i]))
    url.value.push(URL.createObjectURL(files.value[i])) ;
  }
  console.log(url.value)
};
const ermove =()=>{

}
const onSubmit = () => {

const body = new FormData();
for(let i=0; i<files.value.length; i++){
  body.append('images[]', files.value[i])
}







  axios.post('/api/banners/create', body).then((res) => {
    deleteDialog.value=!(deleteDialog.value)
    fetchData()
    console.log(dataEntred.value)
    toast.add({severity: 'success', summary: 'Successful', detail: 'banner Created', life: 3000})

  }).catch((el)=>{
      error.value = el.response.data.errors

      console.log(error.value)

    })
}









  // const productService = new ProductService();

  onBeforeMount(() => {
    initFilters()
  })

  const fetchData = () => {
    axios.get('/api/banners').then((res) => {
      loading.value = false
      users.value = res.data.banners
      console.log(users.value)
    })
  }
const update = (id) => {
console.log(id)
const body = new FormData();
for(let i=0; i<files.value.length ;i++){
  body.append('images[]', files.value[i])
}
// body.append("images", file.value);
axios.post(`/api/banners/${id}/update`, body).then((res) => {
  fetchData()
toast.add({severity: 'success', summary: 'Successful', detail: 'update banner', life: 3000})
showbanner.value=!(showbanner.value)

}).catch((el)=>{
  error.value = el.response.data.errors

  console.log(error.value)

})

}






  onMounted(() => {
    // productService.getProducts().then((data) => (products.value = data));
    fetchData()
  })

  const show = (id) => {
    error.value=ref({})
    showbanner.value=!(showbanner.value)
    axios.get(`/api/banners/${id}`).then((res) => {
    console.log(res.data)
    console.log(id)
    banner_detailes.value = res.data.banner
    console.log(banner_detailes.value)

  });

  }
  const openNew = () => {
    error.value=ref({})
    deleteDialog.value=!(deleteDialog.value)

  }

  const deletebanner = (id) => {

    axios.delete(`/api/banners/${id}/delete`)
    .then((res) => {
      console.log(res.data)

      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'banner deleted', life: 3000})
    })

  }










  const initFilters = () => {
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    }
  }




</script>

<template>
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <!--              <Button label="New" icon="pi pi-plus" class="new mr-2" @click="openNew"/>-->
              <!--              <Button-->
              <!--                label="Delete"-->
              <!--                icon="pi pi-trash"-->
              <!--                class="p-button-danger"-->
              <!--                :disabled="!selectedProducts || !selectedProducts.length"-->
              <!--                @click="confirmDeleteSelected"-->
              <!--              />-->
              <Button @click="openNew()" label="New" icon="pi pi-plus" class="new"  />

            </div>
          </template>


        </Toolbar>

        <Toast />

        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="users"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} products"
          responsive-layout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-between md:align-items-center">
              <h5 class="m-0">Banner pictures </h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search..." />
              </span>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="images" header="Images" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">

              <img :src="slotProps.data.media[0]?.original_url">

            </template>
          </Column>
          <Column field="create time" header="Create time" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{   moment(slotProps.data.created_at).format('DD-MM-YYYY')}}
            </template>
          </Column>
          <Column field="updated time" header="Updated time" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{   moment(slotProps.data.updated_at).format(' DD-MM-YYYY')}}
            </template>
          </Column>





          <Column header-style="min-width:10rem;">
            <template >
              <div>

              </div>
            </template>
          </Column>
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="flex space-x-5">

                <Button

                icon="pi pi-pencil"
                  class="p-button-rounded mr-2"
                  :class="'p-button-danger'"
                  @click="show(slotProps.data.id)"
                />
                <Button
                  icon="pi pi-trash"
                  class="delete mr-2"
                  :class="slotProps.data.status == 0 ? 'p-button-success' : 'p-button-danger'"
                  @click="deletebanner(slotProps.data.id)"
                  />
              </div>
            </template>
          </Column>



          <!--          <Column header="Image" header-style="width:14%; min-width:10rem;">-->
          <!--            <template #body="slotProps">-->
          <!--              <span class="p-column-title">Image</span>-->
          <!--              <img-->
          <!--                :src="'demo/images/product/' + slotProps.data.image"-->
          <!--                :alt="slotProps.data.image"-->
          <!--                class="shadow-2"-->
          <!--                width="100"-->
          <!--              />-->
          <!--            </template>-->
          <!--          </Column>-->
        </DataTable>
        <Dialog v-model:visible="deleteDialog" :style="{ width: '650px' }" header="Create banner" :modal="true">
          <div>
            <FileUpload id="password" @uploader="handleFileUpload" accept="image/*" required="true" :multiple="false"
                        :custom-upload="true" autofocus >
              <template #empty>
                <img v-if="file!= ''" v-for="u in url " :src="u" class="w-[200px] h-[90px]  mb-3"  >
              <img v-else-if="dataEntred?.media?.length" v-for="data in dataEntred?.media" :src="data.original_url" class="w-[200px] h-[90px]">
              </template>
            </FileUpload>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.images">{{error.images[0]}}</div>

            <Button @click="onSubmit()" type="submit" label="Submit" class="mt-3"/>
          </div>

        </Dialog>
        <Dialog v-model:visible="showbanner" :style="{ width: '650px' }" header="update banner" :modal="true">
          <div>
            <FileUpload @change="ermove" id="password" @uploader="handleFileUpload" accept="image/*" required="true" :multiple="false"
                        :custom-upload="true" autofocus >
              <template #empty>
                <img v-if="file.value != ''" v-for="u in url " :src="u" class="w-[200px] h-[90px]  mb-3"  >


                <img v-if="file == '' " :src="banner_detailes.pictures?.photos[0]?.original_url" class="w-[200px] h-[90px] mb-3">
              </template>
            </FileUpload>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.images">{{error.images[0]}}</div>

            <Button @click="update(banner_detailes.id)" type="submit" label="Submit" class="mt-3"/>
          </div>

        </Dialog>



      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
