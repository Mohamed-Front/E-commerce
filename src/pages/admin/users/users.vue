<script setup>
import {useToast} from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from "axios";
import {useRouter} from "vue-router";
const router = useRouter()
const countries = ref([])
const toast = useToast()
const price_id = ref(null)
const loading = ref(true)
const delete_id = ref('')
const user = ref({})
const status = ref(true)
const error = ref('')
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)

const exportCSV = () => {
  dt.value.exportCSV()
}

const delet = (id) => {
  delete_id.value = id
  deleteProductsDialog.value = true
}

const deleteSelectedProducts = () => {
  axios.get(`/api/delete/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteProductsDialog.value = false
      toast.add({severity: 'success', summary: 'Successful', detail: 'user Deleted', life: 3000})
    })
}

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/user", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value // إضافة بارامتر البحث
    }
  }).then((res) => {
    loading.value = false
    users.value = res.data.data.data
    totalRecords.value = res.data.data.total
  }).catch(error => {
    loading.value = false
    console.error("Error fetching data:", error)
  })
}

// مشاهدة تغيرات البحث وإعادة جلب البيانات
watch(searchQuery, (newVal) => {
  currentPage.value = 1 // إعادة التعيين للصفحة الأولى عند البحث
  fetchData()
})

const onPageChange = (event) => {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchData()
}

onMounted(() => {
  fetchData()
})

const openNew = () => {
  router.push({name:'user-create'})
}

const createprice = () => {
  axios
    .post('/api/Register', user.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      productDialog.value = false
      toast.add({severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000})
      user.value = {}
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const deleteprice = () => {
  const body = new FormData();
  body.append("country_id", user.value.country_id);
  body.append("price", user.value.price);
  body.append("fees", user.value.fees);
  body.append("tax", user.value.tax);
  if (status.value == true) {
    status.value = 1
    body.append("status", status.value);
  }
  if (status.value == false) {
    status.value = 0
    body.append("status", status.value);
  }
  axios.post(`/api/country-price/${price_id.value}/update`, body)
    .then((res) => {
      fetchData()
      deleteDialog.value = false
      toast.add({severity: 'success', summary: 'Successful', detail: 'update Successful', life: 3000})
      user.value = {}
    })
    .catch((el) => {
      error.value = el.response.data.errors
      console.log(error.value)
    })
}

const confirmDelete = (id) => {
  price_id.value = id
  error.value = ''
  axios.get(`/api/show/${price_id.value}`)
    .then((res) => {
      console.log(res)
      user.value = res.data.data
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
            <div class="my-2 flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="searchQuery" placeholder="Search..." />
              </span>
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
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25, 50]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} users"
          responsive-layout="scroll"
          @page="onPageChange"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-between md:align-items-center">
              <h5 class="m-0 my-auto px-2">Users</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="Search..."/>
              </span>
            </div>
          </template>
          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="name" header="Name" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="email" header="Email" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.email }}
            </template>
          </Column>

          <Column field="phone" header="Mobile Number" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.phone }}
            </template>
          </Column>

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
            <span v-if="product">Are you sure you want to delete the selected user?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts"/>
          </template>
        </Dialog>


      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.new {
  background: #3b82f6;
  border: none;
}

.delete {
  background: #ef4444;
  border: none;
}
</style>
