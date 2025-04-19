<script setup>
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const toast = useToast()

// Data and UI states
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
const searchQuery = ref('')

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const firstPageUrl = ref('')
const lastPageUrl = ref('')
const nextPageUrl = ref('')
const prevPageUrl = ref('')
const from = ref(0)
const to = ref(0)
const links = ref([])

// Initialize filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

// Fetch roles data with pagination
const fetchData = () => {
  loading.value = true
  axios.get("/api/role", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    roles.value = res.data.data.data
    totalRecords.value = res.data.data.total
    totalPages.value = res.data.data.last_page
    firstPageUrl.value = res.data.data.first_page_url
    lastPageUrl.value = res.data.data.last_page_url
    nextPageUrl.value = res.data.data.next_page_url
    prevPageUrl.value = res.data.data.prev_page_url
    from.value = res.data.data.from
    to.value = res.data.data.to
    links.value = res.data.data.links
  }).catch(error => {
    loading.value = false
    console.error("Error fetching roles:", error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load roles',
      life: 3000
    })
  })

  // Fetch permissions separately
  axios.get("/api/role/get/permissions").then((res) => {
    users.value = res.data.permissions
  }).catch(error => {
    console.error("Error fetching permissions:", error)
  })
}

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const changeRowsPerPage = (rows) => {
  rowsPerPage.value = rows.value
  currentPage.value = 1
  fetchData()
}

// Search watcher
watch(searchQuery, (newVal) => {
  currentPage.value = 1
  fetchData()
})

// CRUD operations
const openNew = () => {
  router.push({ name: 'roles-create' })
}

const hideDialog = () => {
  productDialog.value = false
  updateDialog.value = false
  submitted.value = false
}

const save = () => {
  submitted.value = true
  axios.post('api/roles/create', user.value)
    .then((res) => {
      fetchData()
      productDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Role Created',
        life: 3000
      })
      user.value = { name: '', permissions: [] }
    })
    .catch((error) => {
      console.error("Error creating role:", error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create role',
        life: 3000
      })
    })
}

const edit = (id) => {
  router.push({ name: 'roles-update', params: { id: id } })
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
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Role Deleted',
        life: 3000
      })
    })
    .catch((error) => {
      console.error("Error deleting role:", error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete role',
        life: 3000
      })
    })
}

const exportCSV = () => {
  dt.value.exportCSV()
}

// Initialize component
onBeforeMount(() => {
  initFilters()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button
              v-can="'create roles'"
                label="New"
                icon="pi pi-plus"
                class="new mr-2"
                @click="openNew"
              />
            </div>
          </template>

          <template #end>
            <div  v-can="'list roles'" class="my-2 flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="Search..."
                />
              </span>
              <Button
                label="Export"
                icon="pi pi-upload"
                class="new"
                @click="exportCSV($event)"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="roles"
          :loading="loading"
          data-key="id"
          :paginator="false"
          :rows="rowsPerPage"
          :filters="filters"
          responsive-layout="scroll"
           v-can="'list roles'"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-between md:align-items-center">
              <h5 class="m-0">Manage Roles</h5>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>

          <Column
            field="id"
            header="ID"
            :sortable="true"
            header-style="width:14%; min-width:5rem;"
          >
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column
            field="name"
            header="Name"
            :sortable="true"
            header-style="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button
              v-can="'edit roles'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
              <Button
              v-can="'delete roles'"
                icon="pi pi-trash"
                class="delete mt-2"
                @click="confirmDelete(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>

        <!-- Custom Pagination -->
        <div class="p-paginator p-component p-unselectable-text mt-3">
          <div class="p-paginator-left-content">
            <span class="p-paginator-current">
              Showing {{ from }} to {{ to }} of {{ totalRecords }} entries
            </span>
          </div>
          <div class="p-paginator-right-content">
            <span class="p-paginator-pages">
              <button
                class="p-paginator-first p-paginator-element p-link"
                :disabled="currentPage === 1"
                @click="goToPage(1)"
              >
                <span class="p-paginator-icon pi pi-angle-double-left"></span>
              </button>
              <button
                class="p-paginator-prev p-paginator-element p-link"
                :disabled="!prevPageUrl"
                @click="goToPage(currentPage - 1)"
              >
                <span class="p-paginator-icon pi pi-angle-left"></span>
              </button>

              <template v-for="(link, index) in links" :key="index">
                <button
                  v-if="link.label && !isNaN(link.label)"
                  class="p-paginator-page p-paginator-element p-link"
                  :class="{ 'p-highlight': link.active }"
                  @click="goToPage(parseInt(link.label))"
                >
                  {{ link.label }}
                </button>
                <span v-else-if="link.label === '...'" class="p-paginator-dots">...</span>
              </template>

              <button
                class="p-paginator-next p-paginator-element p-link"
                :disabled="!nextPageUrl"
                @click="goToPage(currentPage + 1)"
              >
                <span class="p-paginator-icon pi pi-angle-right"></span>
              </button>
              <button
                class="p-paginator-last p-paginator-element p-link"
                :disabled="currentPage === totalPages"
                @click="goToPage(totalPages)"
              >
                <span class="p-paginator-icon pi pi-angle-double-right"></span>
              </button>
            </span>

            <span class="p-paginator-rpp-options">
              <Dropdown
                v-model="rowsPerPage"
                :options="[5, 10, 20, 30]"
                @change="changeRowsPerPage"
                class="ml-2"
                style="width: 100px"
              />
            </span>
          </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteProductsDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Are you sure you want to delete this role?</span>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductsDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedProducts"
            />
          </template>
        </Dialog>

        <!-- Create Role Dialog -->
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
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="p-button-text"
              @click="save"
            />
          </template>
        </Dialog>

        <!-- Update Role Dialog -->
        <Dialog
          v-model:visible="updateDialog"
          :style="{ width: '450px' }"
          header="Update Role"
          :modal="true"
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
              option-value="id"
              :options="users"
              optionLabel="name"
              placeholder="Select Permissions"
              class="w-full md:w-20rem"
            />
          </div>

          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Update"
              icon="pi pi-check"
              class="p-button-text"
              @click="update"
            />
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

.p-paginator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 3px;

  .p-paginator-left-content {
    color: #6c757d;
  }

  .p-paginator-right-content {
    display: flex;
    align-items: center;

    .p-paginator-pages {
      display: flex;
      margin: 0 0.5rem;

      button {
        text-align: center;
        min-width: 2.357rem;
        height: 2.357rem;
        margin: 0.143rem;
        border: 0 none;
        color: #6c757d;
        background: transparent;
        border-radius: 50%;
        transition: background-color 0.2s;

        &:hover {
          background: #e9ecef;
        }

        &.p-highlight {
          color: #ffffff;
          background: #E28C3F;
        }

        &:disabled {
          opacity: 0.5;
          cursor: default;
        }
      }
    }

    .p-paginator-dots {
      min-width: 2.357rem;
      height: 2.357rem;
      margin: 0.143rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
