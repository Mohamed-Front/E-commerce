<script setup>
import {useToast} from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount } from 'vue'
import axios from "axios";
const countries = ref([])
const toast = useToast()
const price_id =ref(null)
const loading = ref(true)
const delete_id=ref('')
const user = ref({})
const status =ref(true)

const error = ref('')
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)


const exportCSV = () => {
  dt.value.exportCSV()
}


const delet =(id)=>{

  delete_id.value=id
  deleteProductsDialog.value=true


}
const deleteSelectedProducts = () => {

    axios.get(`/api/delete/${delete_id.value}`)
fetchData()
deleteProductsDialog.value=false
toast.add({severity: 'success', summary: 'Successful', detail: 'user Deleted', life: 3000})
}

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
onBeforeMount(() => {
  initFilters()
})



const fetchData= ()=>{
  axios.get("/api/allUsers").then((res)=>{
    loading.value= false
    users.value= res.data.data

  });
}
onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));

  fetchData()

})

const openNew = () => {
  user.value = ref({})
  error.value = ref('')
  product.value = {}

  productDialog.value = true
}
const createprice =()=>{


  axios
    .post('/api/Register',user.value)
    .then((res) => {
      console.log(res.data)
      fetchData()


      productDialog.value=!(productDialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'price Created', life: 3000})
      user.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteprice = ()=>{
  const body = new FormData();
  body.append("country_id",user.value.country_id);
  body.append("price",user.value.price);
  body.append("fees",user.value.fees);
  body.append("tax",user.value.tax);
  if(status.value == true ){
    status.value =1
    body.append("status",status.value);
  }
  if(status.value == false ){
    status.value =0
    body.append("status",status.value);
  }
  axios.post(`/api/country-price/${price_id.value}/update`,body).then((res) => {
    fetchData()
    deleteDialog.value =!(deleteDialog.value)
    toast.add({severity: 'success', summary: 'Successful', detail: 'update Successful', life: 3000})
    user.value = ref({})
  }).catch((el)=>{
    error.value = el.response.data.errors
    console.log(error.value)
  })
}


const confirmDelete = (id) => {
  price_id.value=id
  error.value=ref('')
  axios.get(`/api/show/${price_id.value}`).then((res) => {
    console.log(res)
    user.value=res.data.data

  })
  deleteDialog.value = true
}



</script>
<template>
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2 ">
              <Button label="New" icon="pi pi-plus" class="new mr-2" @click="openNew"/>


            </div>

          </template>
          <template #end>
            <div class="my-2 ">


              <Button label="Export" icon="pi pi-upload" class="new" @click="exportCSV($event)"/>
            </div>

          </template>
        </Toolbar>
        <Toast/>
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
              <h5 class="m-0 my-auto px-2">users </h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="Search..."/>
              </span>
            </div>
          </template>
          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="name" header="name" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="email" header="email" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.email }}
            </template>
          </Column>

          <Column field="Mobile Number" header="mobile_number" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.mobile_number }}
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
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="confirmDelete(slotProps.data.id)"
              />
              <Button
                icon="pi pi-trash"
                class="delete mt-2"
                @click="delet(slotProps.data.id)"
              />

            </template>
          </Column>
        </DataTable>
        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts"/>
          </template>
        </Dialog>
        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="create price"
          :modal="true"
          class="p-fluid"
        >

          <div class="field mb-5">
            <label for="first">Name </label>
            <div class="flex w-full">
              <InputText

                class="mt-3 w-full"
                id="first"
                v-model="user.name"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">Email </label>
            <div class="flex">
              <InputText

                class="mt-3"
                id="first"
                v-model="user.email"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.email">{{ error.email[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">Password </label>
            <div class="flex">
              <InputText

                class="mt-3"
                id="first"
                v-model="user.password"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">confirme password </label>
            <div class="flex">
              <InputText

                class="mt-3"
                id="first"
                v-model="user.password_confirmation"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">mobile number </label>
            <div class="flex">
              <InputText

                class="mt-3"
                id="first"
                v-model="user.mobile_number"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.mobile_number">{{ error.mobile_number[0] }}</div>
          </div>

          <div class=" flex  mt-4 mb-6">
          </div>
            <!-- <div class="flex ">
                <p class="text-xl px-3">status</p>
                <InputSwitch class="mb-3" v-model="status"/>
            </div> -->
          <div class="w-full "> <Button label="create user"  class="w-full m-auto" @click="createprice"/></div>
        </Dialog>
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="update" :modal="true">
          <div class="field mb-5">
            <label for="first">Name </label>
            <div class="flex">
              <InputText

                class="mt-3 w-full"
                id="first"
                v-model="user.name"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">Email </label>
            <div class="flex">
              <InputText

                class="mt-3 w-full"
                id="first"
                v-model="user.email"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.email">{{ error.email[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">Password </label>
            <div class="flex">
              <InputText

                class="mt-3 w-full"
                id="first"
                v-model="user.password"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">confirme password </label>
            <div class="flex">
              <InputText

                class="mt-3 w-full"
                id="first"
                v-model="user.password_confirmation"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
          </div>
          <div class="field mb-5">
            <label for="first">mobile number </label>
            <div class="flex">
              <InputText

                class="mt-3 w-full"
                id="first"
                v-model="user.mobile_number"
                required="true"
                autofocus
              />

            </div>
            <div class="mt-1 mb-5 text-red-500" v-if="error?.mobile_number">{{ error.mobile_number[0] }}</div>
          </div>

          <div class=" flex  mt-4 mb-6">
          </div>

          <div class="w-full pr-12"> <Button label="update Price"  class="w-full m-auto" @click="deleteprice"/></div>
        </Dialog>
      </va-card>
    </div>
  </div>

</template>
<style scoped lang="scss"></style>
