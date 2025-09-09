<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from "axios";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()
const loading = ref(true)
const delete_id = ref('')
const store = ref({})
const stores = ref(null)
const storeDialog = ref(false)
const deleteDialog = ref(false)
const deleteStoresDialog = ref(false)
const selectedStores = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const inventoryForm = ref({ id: null, name: '', store_id: null })
const isEdit = ref(false)
const availableStores = ref([])

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

// Fetch available stores for dropdown
const fetchStores = async () => {
  try {
    const response = await axios.get('/api/store')
    availableStores.value = response.data.data.data // Adjust based on API structure
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('store.loadStoresError'),
      life: 3000
    })
    console.error('Error fetching stores:', error)
  }
}

// Export inventories
const exportStores = () => {
  axios.get('/api/export/inventory', {
    responseType: 'blob'
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'inventory_export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('inventory.exportSuccess'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('inventory.exportError'),
        life: 3000
      })
      console.error('Error exporting inventory:', error)
    })
}

const delet = (id) => {
  delete_id.value = id
  deleteStoresDialog.value = true
}

const deleteSelectedStore = () => {
  axios.delete(`/api/inventory/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteStoresDialog.value = false
      toast.add({severity: 'success', summary: t('success'), detail: t('inventory.deletedSuccess'), life: 3000})
    })
    .catch(() => {
      toast.add({severity: 'error', summary: t('error'), detail: t('inventory.deleteError'), life: 3000})
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
  axios.get("/api/inventory", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    stores.value = res.data.data.data
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
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('inventory.loadError'),
      life: 3000
    })
    console.error("Error fetching data:", error)
  })
}

watch(searchQuery, (newVal) => {
  currentPage.value = 1
  fetchData()
})

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

onMounted(() => {
  fetchData()
  fetchStores()
})

const openNew = () => {
  inventoryForm.value = { id: null, name: '', store_id: null }
  isEdit.value = false
  storeDialog.value = true
}

const confirmEdit = (id) => {
  const inventory = stores.value?.find(item => item.id === id)
  if (!inventory) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('inventory.loadError'),
      life: 3000
    })
    return
  }
  inventoryForm.value = { id: inventory.id, name: inventory.name, store_id: inventory.store_id }
  isEdit.value = true
  storeDialog.value = true
}

const saveInventory = () => {
  if (!inventoryForm.value.name || !inventoryForm.value.store_id) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('inventory.formIncomplete'),
      life: 3000
    })
    return
  }

  const url = isEdit.value ? `/api/inventory/${inventoryForm.value.id}` : '/api/inventory'
  const method = isEdit.value ? 'put' : 'post'

  axios[method](url, inventoryForm.value)
    .then(() => {
      fetchData()
      storeDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: isEdit.value ? t('inventory.updatedSuccess') : t('inventory.createdSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: isEdit.value ? t('inventory.updateError') : t('inventory.createError'),
        life: 3000
      })
      console.error('Error saving inventory:', error)
    })
}

const goToQuantityPage = (id) => {
  router.push({ name: 'inventory-quantity', params: { id } })
}

// Format date for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('inventory.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('inventory.search')" />
              </span>
              <Button
                :label="t('inventory.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'list inventory'"
                @click="exportStores"
              />
              <Button
                v-can="'create inventory'"
                :label="t('inventory.new')"
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
            :value="stores"
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
            v-can="'list inventory'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="name" :header="t('inventory.name')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>

            <Column field="store.name_en" :header="t('inventory.storeNameEn')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.store.name_en }}
              </template>
            </Column>

            <Column field="store.name_ar" :header="t('inventory.storeNameAr')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.store.name_ar }}
              </template>
            </Column>
             <Column field="total_products" :header="t('inventory.total_products')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.total_products }}
              </template>
            </Column>



            <Column :header="t('actions')" headerStyle="width: 15rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit inventory'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="confirmEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete inventory'"
                  icon="pi pi-trash"
                  class="p-delete mx-2"
                  @click="delet(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
                <Button
                  v-can="'edit inventory'"
                  icon="pi pi-plus-circle"
                  class="p-button-info"
                  @click="goToQuantityPage(slotProps.data.id)"
                  v-tooltip.top="t('inventory.increaseQuantity')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('inventory.noData') }}</p>
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

              <Dropdown
                filter
                v-model="rowsPerPage"
                :options="[5, 10, 20, 30]"
                optionLabel=""
                @change="changeRowsPerPage"
                class="ml-2"
                style="width: 80px"
              />
            </div>
          </div>
        </div>

        <Dialog
          v-model:visible="deleteStoresDialog"
          :style="{ width: '450px' }"
          :header="t('inventory.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('inventory.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteStoresDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteSelectedStore"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="storeDialog"
          :style="{ width: '450px' }"
          :header="isEdit ? t('inventory.editTitle') : t('inventory.createTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field">
              <label for="name">{{ t('inventory.name') }}</label>
              <InputText id="name" v-model="inventoryForm.name" required />
            </div>
            <div class="field">
              <label for="store_id">{{ t('inventory.store') }}</label>
              <Dropdown
                id="store_id"
                v-model="inventoryForm.store_id"
                :options="availableStores"
                optionLabel="name_en"
                optionValue="id"
                :placeholder="t('inventory.selectStore')"
                required
              />
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="storeDialog = false"
            />
            <Button
              :label="isEdit ? t('update') : t('create')"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="saveInventory"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Custom styles for better table display */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: var(--hoverColor);
}

/* Responsive adjustments */
@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}

/* Form field styling */
.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
</style>
