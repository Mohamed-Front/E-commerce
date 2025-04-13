<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const user = ref({
  name: '',
  permissions: []
})
const users = ref([])
const roles = ref([])
const updateDialog = ref(false)
const productDialog = ref(false)
const deleteDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)
const delete_id = ref(Number)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)

const fetchData = () => {
  loading.value = true
  axios.get("/api/role", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value
    }
  }).then((res) => {
    loading.value = false
    roles.value = res.data.data.data // Assuming your API returns paginated data
    totalRecords.value = res.data.data.total // Total records count
  });

  axios.get("/api/role/get/permissions").then((res) => {
    users.value = res.data.permissions
  });
}

const onPageChange = (event) => {
  currentPage.value = event.page + 1 // PrimeVue uses 0-based index, API usually expects 1-based
  rowsPerPage.value = event.rows
  fetchData()
}

onBeforeMount(() => {
  initFilters()
})

onMounted(() => {
  fetchData()
})

const openNew = () => {
  router.push({name:'roles-create'})
}

const hideDialog = () => {
  productDialog.value = false
  updateDialog.value = false
  submitted.value = false
}

const update = () => {
  axios.post(`/api/roles/update/${delete_id.value}`, user.value).then((res) => {
    fetchData()
    updateDialog.value = false
    toast.add({severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000})
  });
}

const save = () => {
  axios
    .post('api/roles/create', user.value)
    .then((res) => {
      fetchData()
      productDialog.value = false
      toast.add({severity: 'success', summary: 'Successful', detail: 'Role Created', life: 3000})
      user.value = { name: '', permissions: [] } // Reset form
    })
    .catch((el) => {
      console.log(el)
    })
}

const edit = (id) => {
  router.push({name:'roles-update',params:{id:id}})

}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteProductsDialog.value = true
}

const deleteSelectedProducts = () => {
  axios.delete(`api/role/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteProductsDialog.value = false
      toast.add({severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000})
    })
}

const exportCSV = () => {
  dt.value.exportCSV()
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
      <va-card class="card">
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="new mr-2" @click="openNew"/>
            </div>
          </template>

          <template #end>
            <Button label="Export" icon="pi pi-upload" class="new" @click="exportCSV($event)"/>
          </template>
        </Toolbar>

        <Toast/>

        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="roles"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25, 50]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} roles"
          responsive-layout="scroll"
          @page="onPageChange"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-between md:align-items-center">
              <h5 class="m-0">Manage roles</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="Search..."/>
              </span>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="id" header="Id" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column field="name" header="Name" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
              <Button
                icon="pi pi-trash"
                class="delete mt-2"
                @click="confirmDelete(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span>Are you sure you want to delete this role?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts"/>
          </template>
        </Dialog>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="Create Role"
          :modal="true"
          class="p-fluid"
        >
          <div class="field mb-5">
            <label for="name">Name</label>
            <InputText
              class="mt-3 w-full"
              id="name"
              v-model.trim="user.name"
              required="true"
              autofocus
            />
          </div>
          <div class="card flex justify-content-center">
            <MultiSelect
              v-model="user.permissions"
              display="chip"
              option-value="id"
              :options="users"
              optionLabel="name"
              placeholder="Select Permissions"
              class="w-full md:w-20rem"
            />
          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="save"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" header="Update Role" :modal="true">
          <div class="field mb-5">
            <label for="name">Name</label>
            <InputText
              class="mt-3 w-full"
              id="name"
              v-model.trim="user.name"
              required="true"
              autofocus
            />
          </div>
          <div class="card flex justify-content-center">
            <MultiSelect
              v-model="user.permissions"
              option-value="id"
              :options="users"
              optionLabel="name"
              placeholder="Select Permissions"
              class="w-full md:w-20rem"
            />
          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Update" icon="pi pi-check" class="p-button-text" @click="update"/>
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
  color: white;
}

.delete {
  background: #ef4444;
  border: none;
  color: white;
}
</style>
