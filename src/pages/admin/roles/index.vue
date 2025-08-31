```vue
<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FilterMatchMode } from 'primevue/api'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// Data and UI states
const loading = ref(true)
const role = ref({
  name: '',
  permissions: []
})
const permissions = ref([])
const roles = ref([])
const createDialog = ref(false)
const deleteDialog = ref(false)
const selectedRoles = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)
const delete_id = ref(null)
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

// Fetch roles and permissions data
const fetchData = () => {
  loading.value = true
  // Fetch roles with pagination
  axios.get('/api/role', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((res) => {
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
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('role.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching roles:', error)
    })

  // Fetch permissions separately
  axios.get('/api/role/get/permissions')
    .then((res) => {
      permissions.value = res.data.permissions
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('role.loadPermissionsError'),
        life: 3000
      })
      console.error('Error fetching permissions:', error)
    })
}

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const changeRowsPerPage = (event) => {
  rowsPerPage.value = event.value
  currentPage.value = 1
  fetchData()
}

// Search watcher
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchData()
})

// CRUD operations
const openNew = () => {
 router.push({name:'roles-create'})
}

const hideDialog = () => {
  createDialog.value = false
  submitted.value = false
}

const save = () => {
  submitted.value = true
  if (!role.value.name.trim()) {
    return
  }
  axios.post('/api/role', role.value)
    .then(() => {
      fetchData()
      createDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('role.createSuccess'),
        life: 3000
      })
      role.value = { name: '', permissions: [] }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('role.createError'),
        life: 3000
      })
      console.error('Error creating role:', error)
    })
}

const edit = (id) => {
  router.push({ name: 'roles-update', params: { id } })
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteRole = () => {
  axios.delete(`/api/role/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('role.deleteSuccess'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('role.deleteError'),
        life: 3000
      })
      console.error('Error deleting role:', error)
    })
}

const exportCSV = () => {
  dt.value.exportCSV()
}

// Lifecycle hooks
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
            <h2 class="text-2xl font-bold">{{ t('role.manage_Roles') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('role.search')" />
              </span>
              <Button
                :label="t('role.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'export roles'"
                @click="exportCSV"
              />
              <Button
                v-can="'create roles'"
                :label="t('role.new')"
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
            v-model:selection="selectedRoles"
            :value="roles"
            :loading="loading"
            data-key="id"
            :paginator="false"
            :rows="rowsPerPage"
            :filters="filters"
            :totalRecords="totalRecords"
            responsive-layout="scroll"
            stripedRows
            showGridlines
            class="p-datatable-sm"
            v-can="'list roles'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column
              field="id"
              :header="t('role.iD')"
              :sortable="true"
              header-style="width:14%; min-width:5rem;"
            >
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column
              field="name"
              :header="t('role.name')"
              :sortable="true"
              header-style="width:14%; min-width:10rem;"
            >
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>

            <Column :header="t('actions')" header-style="min-width:10rem;">
              <template #body="slotProps">
                <Button
                  v-can="'edit roles'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="edit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete roles'"
                  icon="pi pi-trash mx-2"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('role.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="p-paginator p-component p-unselectable-text p-paginator-bottom">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">{{ t('show') }} {{ from }} {{ t('to') }} {{ to }} {{ t('from') }} {{ totalRecords }}</span>
            </div>
            <div class="p-paginator-right-content">
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
                  v-if="link.label && !isNaN(parseInt(link.label))"
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

              <Dropdown
                v-model="rowsPerPage"
                :options="[5, 10, 20, 30]"
                @change="changeRowsPerPage"
                class="ml-2"
                style="width: 80px"
              />
            </div>
          </div>
        </div>


        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '460px' }"
          :header="t('role.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('role.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteRole"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

