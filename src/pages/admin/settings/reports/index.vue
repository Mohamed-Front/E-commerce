<script setup>
import  Chart  from 'primevue/chart';
import moment from 'moment'
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import {compareStrings} from '../../../../data/maps/lineMapData';
const country_id = ref('')
const countries = ref([])
const toast = useToast()
const router = useRouter()
const chartData = ref()
 const chartOptions = ref()
const products = ref(null)
const elements = ref(null)
const cost = ref("null")
const date = ref()

const langSelected = ref('gb')
const loading = ref(true)
const user = ref({
  end_date: '',
  start_date: '',
  status: '',
  user_type:'',
  country_id:''
})
const country = ref({})
const elememnts = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref(null)
const dt = ref(null)

const filters = ref({})
const submitted = ref(false)
const statuses = ref([
  {label: 'INSTOCK', value: 'instock'},
  {label: 'LOWSTOCK', value: 'lowstock'},
  {label: 'OUTOFSTOCK', value: 'outofstock'},
])
const selectedCity = ref();
const client = ref([
    { name: 'driver', code: '1' },
    { name: 'guides', code: '2' },
    { name: 'All', code: ' ' },

]);
const stutes = ref ([
    { name: 'pending', code: '1' },
    { name: 'approved', code: '2' },
    { name: 'rejected', code: '3' },
    { name: 'expired', code: '4' },
    { name: 'paid', code: '5' },
    { name: 'canceled', code: '6' },
])
const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'mursheed incom',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: [65, 59, 80, 81, 56, 55, 10]
            },
            {
                label: 'mursheed incom',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--red-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: [62, 23, 15, 81, 68, 85, 30]
            },

        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}


// const productService = new ProductService();

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {


  axios.get("/api/orders").then((res) => {
    loading.value = false
    elements.value = res.data.orders

  });


}

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  // productService.getProducts().then((data) => (products.value = data));
  fetchData()

})

axios.get(`/api/countries`).then((res) => {

countries.value = res.data.countries

console.log(countries.value)
})
const formatCurrency = (value) => {
  return value.toLocaleString('gb-US', {style: 'currency', currency: 'USD'})
}
const koko = () => {
  console.log(langSelected.value)
}
const cleare =()=>{
  window.location.reload()
}
const openNew = () => {
  router.push({name: 'offer-create'})
}
const getSeverity = (product) => {


  switch (product.status) {

     case 1:
      return 'warning';
      case 2:
      return 'success';
     case 3:
      return 'primary';
     case 4:
      return 'danger';
      case 5:
      return 'info';
      case 6:
      return 'secondary';
    default:
      return null;
  }
};
const hideDialog = () => {

 if(user.value.start_date){
  user.value.start_date=moment(user.value.start_date).format('YYYY-MM-DD')
 }
 if(user.value.end_date){
  user.value.end_date=moment(user.value.end_date).format('YYYY-MM-DD')
 }

  axios.post('/api/reports/fillter', user.value).then((res) => {
      elements.value=res.data.filterData


    }).catch((el)=>{
      error.value = el.response.data.errors

      console.log(error.value)

    })
}
const show = () => {
  router.push({name:'print' })
}

const save = () => {
  submitted.value = true
  if (!user.value.first_name || !user.value.last_name || !user.value.email || !user.value.mobile_number)
    return


  if (user.value.id) {
    axios
      .post(`/api/accommodition/${accommodition.value.id}/update`, user.value)
      .then((res) => {
        console.log(res.data)
        fetchData()
        toast.add({severity: 'success', summary: 'Successful', detail: 'user updated', life: 3000})
      })
      .catch(() => {
      })
    toast.add({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000})
  } else {
    axios
      .post('/api/users/create', user.value)
      .then((res) => {
        console.log(res.data)
        fetchData()
        toast.add({severity: 'success', summary: 'Successful', detail: 'user Created', life: 3000})
      })
      .catch(() => {
      })

  }
  productDialog.value = false
  user.value = {}
}

const edit = (id) => {
    router.push({ name: 'invioce', params: { id: id } })
    console.log(id)
}

const confirmDelete = (edit) => {
  user.value = edit
  deleteDialog.value = true
}

const deleteAction = () => {
  loading.value = true;
  axios
    .delete(`/api/offers/${user.value.id}/delete`)
    .then((res) => {

      console.log(res.data)
      deleteDialog.value = false
      fetchData()
      loading.value = false
      toast.add({severity: 'success', summary: 'Successful', detail: 'offer deleted', life: 3000})
    })
    .catch(() => {
    })

}

const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i
      break
    }
  }
  return index
}

const createId = () => {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true
}
const deleteSelectedProducts = () => {
  products.value = products.value.filter((val) => !selectedProducts.value.includes(val))
  deleteProductsDialog.value = false
  selectedProducts.value = null
  toast.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000})
}

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <va-card>
        <div class="p-2 my-2">

          <div class="flex flex-column md:flex-row md:justify-between md:align-items-center">


            <div class="flex space-x-3">
              <h3 class="my-auto text-xl">Date :</h3>

              <div ><Calendar v-model="user.start_date"  @update:model-value="hideDialog"  dateFormat="dd/mm/yy"/></div>
              <p class="text-lg my-auto">to</p>
              <div><Calendar v-model="user.end_date" @update:model-value="hideDialog" dateFormat="dd/mm/yy"/></div>
              <div class="card flex justify-content-center">
                <Dropdown @change="hideDialog" v-model="user.user_type" option-value="code" :options="client" optionLabel="name" placeholder="client" class="w-full md:w-14rem" />
              </div>
              <div class="card flex justify-content-center">
                <Dropdown @change="hideDialog" v-model="user.status" option-value="code"  :options="stutes" optionLabel="name" placeholder="status" class="w-full md:w-14rem" />
              </div>
              <div class="flex items-center">

              <Dropdown placeholder="country" @change="hideDialog" v-model="user.country_id" editable :options="countries" optionLabel="country"
                        option-value="country_id"
                        class=" w-48 "/>
              <div class="mt-1 mb-5 text-red-500" v-if="error?.country_id">{{ error.country_id[0] }}</div>

            </div>
              <div class="m-auto"><Button
                label="clear"
                class="new m-auto "
                icon="pi pi-times"
                @click="cleare"

              /></div>
            </div>


            </div>
        </div>

        </va-card>

      <va-card class="card">
        <Toast/>



        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="elements"
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
            <div class="flex ">
              <h5 class=" my-auto px-5 ">  Orders</h5>

              <Button
              style="transform: scale(.8);"
                label="print"
                class="new m-auto "
                icon="pi pi-print"
              @click="show"
              />
              <div class="my-auto px-1">
              <Button style="transform: scale(.8);"  label="Export" icon="pi pi-upload" class="new " @click="exportCSV($event)" />
            </div>
            </div>


              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="Search..."/>
              </span>
            </div>
          </template>


          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="id" header="Id" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.id }}
            </template>
          </Column>


          <Column field="vendor" header="Vendor" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.vendor }}
            </template>
          </Column>
 <Column field="vendor" header="Type" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <p v-if="slotProps.data?.user_type == 'App\\Models\\Driver' ">Driver</p>
              <p v-if="slotProps.data?.user_type == 'App\\Models\\Guides' ">guide</p>

            </template>
          </Column>

          <Column field="tourist" header="Tourist" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.tourist_name }}
            </template>
          </Column>
          <Column field="cost" header="Cost" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.cost }}
            </template>
          </Column>

          <Column field="start date" header="Start date" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.start_date }}
            </template>
          </Column>

          <Column field="end date" header="End date" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.end_date }}
            </template>
          </Column>

          <Column field="status" header="Status" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">

              <Tag :value="slotProps.data.status==1?'pending':slotProps.data.status==2?'approved':slotProps.data.status==3?'rejected':slotProps.data.status==1?'expired ':slotProps.data.status==1?'canceled':'paid'"
                   :severity="getSeverity(slotProps.data)"/>

            </template>01
          </Column>


          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
               
            <router-link class="p-2 text-white rounded-md  bg-[#098071] " :to="{  name: 'invioce', params: { id: slotProps.data.id }}" target="_blank">
INVOICE
</router-link>

            </template>
          </Column>
        </DataTable>
        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '570px' }"
          header="order details"
          :modal="true"
          class="p-fluid"
        >


          <div class="">
            <div v-for="(use,index) in user" class="card ">
              <Accordion :activeIndex="1">
                <AccordionTab>
                  <template #header>
                    <p class="px-1">Day</p>
                    <span>{{ index+1 }}</span>
                    <svg width="34px" height="30px" viewBox="0 0 24 24" fill="#6C757D"
                         xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <rect width="24" height="24" fill="white"></rect>
                        <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#6C757D" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                      </g>
                    </svg>
                    <p>{{ use.date }}</p>
                  </template>
                  <div class="flex justify-between">
                    <div class="flex ">
                      <h2 class="text-lg my-auto">city</h2>
                      <p class="my-auto text-[black] text-xl px-1">:</p>
                      <p class="my-auto">{{ use.state }}</p></div>
                    <div class="flex">
                      <h2 class="text-lg">price</h2>
                      <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <rect width="24" height="24" fill="white"></rect>
                          <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                      </svg>
                      <p class="my-auto">{{ use.price_city }} $</p></div>
                    <div class="flex" v-if="use.routing !=0">
                      <h2 class="text-lg">routing</h2>
                      <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <rect width="24" height="24" fill="white"></rect>
                          <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                      </svg>
                      <p class="my-auto">{{ use.routing }} $</p></div>
                  </div>
                </AccordionTab>
              </Accordion>
            </div>

            <div><p class="text-xl font-bold text-[black] py-2">Invoice information</p></div>
            <div class="flex">
              <h2 class="text-xl">Fees </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ country.fees }} %</p>
            </div>
            <div class="flex">
              <h2 class="text-xl">Tax </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ country.tax }} %</p>
            </div>
            <div class="flex">
              <h2 class="text-xl">Total price </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ country.price }} $</p>
            </div>
            <div class="flex">
              <h2 class="text-xl ">Total cost </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ cost }} $</p>
            </div>


          </div>

        </Dialog>


      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
