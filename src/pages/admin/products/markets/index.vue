<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
import FileUpload from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

// State variables
const loading = ref(true)
const markets = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedMarkets = ref(null)
const importDialog = ref(false)
const selectedFile = ref(null)
const importLoading = ref(false)
const service_feeDialog = ref(false)
const selectedMarketId = ref(null)
const service_fee = ref(0)

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

// Example data for import template
const exampleData = ref([
  {
    id: 'شفت 7',
    arabic_name: 'Shift7',
    english_name: 'الأحذية',
    Top_Parent: 'shift7',
  },
])
    const goToShippingSettings = (storeId) => {
      router.push({ name: 'market-shipping-settings', params: { id: storeId } })
    }
// Fetch markets data
const fetchData = () => {
  loading.value = true
  axios.get('/api/market', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((response) => {
      markets.value = response.data.data.data
      totalRecords.value = response.data.data.total
      totalPages.value = response.data.data.last_page
      firstPageUrl.value = response.data.data.first_page_url
      lastPageUrl.value = response.data.data.last_page_url
      nextPageUrl.value = response.data.data.next_page_url
      prevPageUrl.value = response.data.data.prev_page_url
      from.value = response.data.data.from
      to.value = response.data.data.to
      links.value = response.data.data.links
      currentPage.value = response.data.data.current_page
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('market.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching markets:', error)
    })
}

// Watch for pagination and search changes
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchData()
})

// Handle page navigation
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

// Handle rows per page change
const changeRowsPerPage = (event) => {
  rowsPerPage.value = event.value
  currentPage.value = 1
  fetchData()
}

// Delete market
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteMarket = () => {
  axios.delete(`/api/market/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('market.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('market.deleteError'),
        life: 3000
      })
      console.error('Error deleting market:', error)
    })
}

// Export markets
const exportMarkets = () => {
  axios.get('/api/export/market', {
    responseType: 'blob'
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'markets_export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('market.exportError'),
        life: 3000
      })
      console.error('Error exporting markets:', error)
    })
}

// Download example CSV
const downloadExample = () => {
  const csvContent = 'id,Arabic Name,English Name,Top Parent / Store\n' +
    exampleData.value.map(row =>
      `"${row.id}","${row.arabic_name}","${row.english_name}","${row.Top_Parent}",`
    ).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'market_import_example.xlsx')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

// Import markets
const openImportDialog = () => {
  importDialog.value = true
  selectedFile.value = null
}

const onFileSelect = (event) => {
  selectedFile.value = event.files[0]
}

const importMarkets = () => {
  if (!selectedFile.value) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('market.importNoFile'),
      life: 3000
    })
    return
  }

  importLoading.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  axios.post('/api/import/markets', formData)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('market.importSuccess'),
        life: 3000
      })
      fetchData()
      importDialog.value = false
      selectedFile.value = null
      // Reset FileUpload
      const fileUpload = document.querySelector('.p-fileupload input[type="file"]')
      if (fileUpload) fileUpload.value = ''
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('market.importError'),
        life: 3000
      })
      console.error('Error importing markets:', error)
    })
    .finally(() => {
      importLoading.value = false
    })
}

// Service fee functions
const openservice_feeDialog = (data) => {
  selectedMarketId.value = data.id
  service_fee.value = data.service_fee // Reset or fetch current if needed
  service_feeDialog.value = true
}

const addservice_fee = () => {
  axios.post(`/api/market/service/fee/${selectedMarketId.value}`, {
    service_fee: service_fee.value
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('market.serviceFeeSuccess'),
        life: 3000
      })
      service_feeDialog.value = false
      fetchData() // Optional refresh
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('market.service_feeError'),
        life: 3000
      })
      console.error('Error adding service fee:', error)
    })
}

// Navigation functions
const createNewMarket = () => {
  router.push({ name: 'market-create' })
}

const editMarket = (id) => {
  router.push({ name: 'market-update', params: { id } })
}

// Lifecycle hooks
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
            <h2 class="text-2xl font-bold">{{ t('market.managementTitle') }}</h2>
          </template>
          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('market.search')" />
              </span>
              <Button
                :label="t('market.import')"
                icon="pi pi-download"
                class="exite"
                @click="openImportDialog"
                aria-label="Import markets"
              />
              <Button
                :label="t('market.export')"
                icon="pi pi-upload"
                class="exite"
                @click="exportMarkets"
                aria-label="Export markets"
              />
              <Button
                :label="t('market.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewMarket"
                aria-label="Create new market"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="markets"
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
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>
            <Column field="id" :header="t('id')" :sortable="true" header-style="width:5%; min-width:5rem;">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>
            <Column field="name_en" :header="t('market.nameEn')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>
            <Column field="name_ar" :header="t('market.nameAr')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>
            <Column field="parent.name_en" :header="t('market.parent')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.parent?.name_en || t('market.noParent') }}
              </template>
            </Column>
            <Column field="store.name_en" :header="t('market.store')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.store?.name_en || t('market.noStore') }}
              </template>
            </Column>
             <Column field="store.service_fee" :header="t('market.serviceFee')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data?.service_fee || 0   }} {{ $t("currencyLabel") }}
              </template>
            </Column>
            <Column :header="t('actions')" header-style="width:14rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editMarket(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                  aria-label="Edit market"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                  aria-label="Delete market"
                />
                <Button
                  icon="pi pi-money-bill"
                  class="p-button-info ml-2"
                  @click="openservice_feeDialog(slotProps.data)"
                  v-tooltip.top="t('market.addServiceFee')"
                  aria-label="Add service fee"
                />
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('market.noData') }}</p>
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
                aria-label="First page"
              >
                <span class="p-paginator-icon pi pi-angle-double-left"></span>
              </button>
              <button
                class="p-paginator-prev p-paginator-element p-link"
                :disabled="!prevPageUrl"
                @click="goToPage(currentPage - 1)"
                aria-label="Previous page"
              >
                <span class="p-paginator-icon pi pi-angle-left"></span>
              </button>
              <template v-for="(link, index) in links" :key="index">
                <button
                  v-if="link.label && !isNaN(parseInt(link.label))"
                  class="p-paginator-page p-paginator-element p-link"
                  :class="{ 'p-highlight': link.active }"
                  @click="goToPage(parseInt(link.label))"
                  :aria-label="`Page ${link.label}`"
                >
                  {{ link.label }}
                </button>
                <span v-else-if="link.label === '...'" class="p-paginator-dots">...</span>
              </template>
              <button
                class="p-paginator-next p-paginator-element p-link"
                :disabled="!nextPageUrl"
                @click="goToPage(currentPage + 1)"
                aria-label="Next page"
              >
                <span class="p-paginator-icon pi pi-angle-right"></span>
              </button>
              <button
                class="p-paginator-last p-paginator-element p-link"
                :disabled="currentPage === totalPages"
                @click="goToPage(totalPages)"
                aria-label="Last page"
              >
                <span class="p-paginator-icon pi pi-angle-double-right"></span>
              </button>
              <Dropdown
                v-model="rowsPerPage"
                :options="[5, 10, 20, 30]"
                @change="changeRowsPerPage"
                class="ml-2"
                style="width: 80px"
                aria-label="Rows per page"
              />
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('market.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('market.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
              aria-label="Cancel delete"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteMarket"
              aria-label="Confirm delete"
            />
          </template>
        </Dialog>

        <!-- Import Dialog -->
        <Dialog
          v-model:visible="importDialog"
          :style="{ width: '500px' }"
          :header="t('market.importInstructions')"
          :modal="true"
        >
          <div class="flex flex-column gap-3">
            <div>
              <Button
                :label="t('market.downloadExample')"
                icon="pi pi-download"
                class="p-button-outlined"
                @click="downloadExample"
                aria-label="Download example CSV"
              />
            </div>

            <FileUpload
              mode="basic"
              name="file"
              accept=".xlsx,.xls,.csv"
              :maxFileSize="10000000"
              :chooseLabel="t('market.chooseFile')"
              @select="onFileSelect"
              :auto="false"
              :disabled="importLoading"
              class="mb-3"
            />
            <div v-if="selectedFile" class="mt-2">
              <p class="font-semibold">{{ t('selectedFile') }}: {{ selectedFile.name }}</p>
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="importDialog = false"
              aria-label="Cancel import"
            />
            <Button
              :label="t('market.import')"
              icon="pi pi-check"
              class="p-button-success"
              @click="importMarkets"
              :disabled="!selectedFile"
              :loading="importLoading"
              aria-label="Import markets"
            />
          </template>
        </Dialog>

        <!-- Service Fee Dialog -->
        <Dialog
          v-model:visible="service_feeDialog"
          :style="{ width: '450px' }"
          :header="t('market.addServiceFee')"
          :modal="true"
        >
          <div class=" gap-3">
            <p for="service_fee" class="my-1">{{ t('market.serviceFee') }}</p>
            <InputNumber class="w-full" id="service_fee" v-model="service_fee" :min="0" :step="0.01"  />
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="service_feeDialog = false"
              aria-label="Cancel"
            />
            <Button
              :label="t('save')"
              icon="pi pi-check"
              class="p-button-success"
              @click="addservice_fee"
              aria-label="Save service fee"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-fileupload-choose) {
  width: 100%;
}
.p-button.p-fileupload-choose .p-icon {
  visibility: hidden !important;
}
</style>
