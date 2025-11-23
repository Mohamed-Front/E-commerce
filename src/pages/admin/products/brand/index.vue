```vue
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
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'

// Permission directive
const vCan = {
  mounted(el, binding) {
    // Placeholder for permission checking
    // Replace with actual permission logic based on your auth system
    const hasPermission = true // Replace with actual permission check
    if (!hasPermission) {
      el.style.display = 'none'
    }
  }
}

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

// State variables
const loading = ref(true)
const brands = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedBrands = ref(null)
const importDialog = ref(false)
const selectedFile = ref(null)
const importLoading = ref(false)

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
    id:"1",
    brand_name_ar: 'ليستر',
    brand_name_en: 'Luster'
  },
  {
     id:"2",
    brand_name_ar: 'لوكس',
    brand_name_en: 'Lux'
  },
  {
     id:"3",
    brand_name_ar: 'مارفلوس',
    brand_name_en: 'Marvelous'
  }
])

// Fetch data
const fetchData = () => {
  loading.value = true
  axios.get('/api/brand', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value || ''
    }
  })
    .then((response) => {
      brands.value = response.data.data.data
      totalRecords.value = response.data.data.total
      totalPages.value = response.data.data.last_page
      firstPageUrl.value = response.data.data.first_page_url
      lastPageUrl.value = response.data.data.last_page_url
      nextPageUrl.value = response.data.data.next_page_url
      prevPageUrl.value = response.data.data.prev_page_url
      from.value = response.data.data.from
      to.value = response.data.data.to
      links.value = response.data.data.links
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('brand.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching brands:', error)
    })
}

// Watch for search and rows per page changes
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

// Delete brand
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteBrand = () => {
  axios.delete(`/api/brand/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('brand.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('brand.deleteError'),
        life: 3000
      })
      console.error('Error deleting brand:', error)
    })
}

// Export brands
const exportBrands = () => {
  axios.get('/api/export/brands', {
    responseType: 'blob'
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'brands_export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('brand.exportError'),
        life: 3000
      })
      console.error('Error exporting brands:', error)
    })
}

// Download example CSV
const downloadExample = () => {
  const csvContent = 'id,Arabic Name,English Name\n' +
    exampleData.value.map(row => `"${row.id}","${row.brand_name_ar}","${row.brand_name_en}"`).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'brand_import_example.xlsx')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

// Import brands
const openImportDialog = () => {
  importDialog.value = true
  selectedFile.value = null
}

const onFileSelect = (event) => {
  selectedFile.value = event.files[0]
}

const importBrands = () => {
  if (!selectedFile.value) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('brand.importNoFile'),
      life: 3000
    })
    return
  }

  importLoading.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  axios.post('/api/import/brands', formData)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('brand.importSuccess'),
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
        detail: t('brand.importError'),
        life: 3000
      })
      console.error('Error importing brands:', error)
    })
    .finally(() => {
      importLoading.value = false
    })
}

// Navigation functions
const createNewBrand = () => {
  router.push({ name: 'brand-create' })
}

const editBrand = (id) => {
  router.push({ name: 'brand-edit', params: { id } })
}

// Get market type severity
const getMarketTypeSeverity = (type) => {
  return type === 1 ? 'success' : 'info'
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
            <h2 class="text-2xl font-bold">{{ t('brand.managementTitle') }}</h2>
          </template>
          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('brand.search')" />
              </span>
              <Button
                v-can="'import brands'"
                :label="t('brand.import')"
                icon="pi pi-download"
                class="other"
                @click="openImportDialog"
                aria-label="Import brands"
              />
              <Button
                v-can="'export brands'"
                :label="t('brand.export')"
                icon="pi pi-upload"
                class="exite"
                @click="exportBrands"
                aria-label="Export brands"
              />
              <Button
                v-can="'create brands'"
                :label="t('brand.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewBrand"
                aria-label="Create new brand"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="brands"
            v-model:selection="selectedBrands"
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
            v-can="'list brands'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>
            <Column field="id" :header="t('id')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>
            <Column field="name_en" :header="t('brand.nameEn')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>
            <Column field="name_ar" :header="t('brand.nameAr')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>
            <Column :header="t('actions')" header-style="width: 12rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit brands'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editBrand(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                  aria-label="Edit brand"
                />
                <Button
                  v-can="'delete brands'"
                  icon="pi pi-trash"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                  aria-label="Delete brand"
                />
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('brand.noData') }}</p>
              </div>
            </template>
            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

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

        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('brand.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('brand.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
              aria-label="Cancel delete"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteBrand"
              aria-label="Confirm delete"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="importDialog"
          :style="{ width: '600px' }"
          :header="t('brand.importInstructions')"
          :modal="true"
        >
          <div class="flex flex-column gap-3">
            <div>
              <Button
                :label="t('brand.downloadExample')"
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
              :chooseLabel="t('brand.chooseFile')"
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
              :label="t('import')"
              icon="pi pi-check"
              class="p-button-success"
              @click="importBrands"
              :disabled="!selectedFile"
              :loading="importLoading"
              aria-label="Import brands"
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
```
