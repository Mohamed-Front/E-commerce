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
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{$t("role.manage_Roles")}}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder='$t("user.search")' />
              </span>
              <Button
                :label='$t("user.export")'
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                v-can="'create roles'"
                :label='$t("user.new")'
                icon="pi pi-plus"
                class="p-button-success"
                @click="openNew"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
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
            stripedRows
            showGridlines
            class="p-datatable-sm"
            v-can="'list roles'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column
              field="id"
              :header='$t("role.iD")'
              :sortable="true"
              header-style="width:14%; min-width:5rem;"
            >
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column
              field="name"
              :header='$t("role.name")'
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
                  class="p-detail"
                  @click="edit(slotProps.data.id)"
                  v-tooltip.top="$t('edit')"
                />
                <Button
                  v-can="'delete roles'"
                  icon="pi pi-trash mx-2"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="$t('delete')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ $t('role.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="p-paginator p-component p-unselectable-text mt-3">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ $t('showing') }} {{ from }} {{ $t('to') }} {{ to }} {{ $t('of') }} {{ totalRecords }} {{ $t('entries') }}
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
                  optionLabel="label"
                  optionValue="value"
                  @change="changeRowsPerPage"
                  class="ml-2"
                  style="width: 100px"
                />
              </span>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteProductsDialog"
          :style="{ width: '450px' }"
          :header="$t('role.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ $t('role.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="$t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductsDialog = false"
            />
            <Button
              :label="$t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
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
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable) {
  font-size: 0.9rem;

  .p-datatable-thead > tr > th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }

  .p-datatable-tbody > tr {
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--surface-hover);
    }
  }
}

.p-paginator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 3px;

  .p-paginator-left-content {
    color: var(--text-color-secondary);
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
        color: var(--text-color-secondary);
        background: transparent;
        border-radius: 50%;
        transition: background-color 0.2s;

        &:hover {
          background: var(--surface-hover);
        }

        &.p-highlight {
          color: var(--primary-color-text);
          background: var(--primary-color);
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
      color: var(--text-color-secondary);
    }
  }
}

@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }

  .p-paginator {
    flex-direction: column;
    gap: 1rem;

    .p-paginator-left-content {
      order: 2;
    }

    .p-paginator-right-content {
      order: 1;
    }
  }
}

.p-detail {
  background: var(--primary-color);
  border: none;
  color: white;
}

.p-delete {
  background: var(--red-500);
  border: none;
  color: white;
}

.p-export {
  background: var(--primary-color);
  border: none;
  color: white;
}
</style>
