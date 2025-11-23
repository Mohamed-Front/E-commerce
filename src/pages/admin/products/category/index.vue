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

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

// State variables
const loading = ref(true)
const categories = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedCategories = ref(null)
const importDialog = ref(false)
const selectedFile = ref(null)
const importLoading = ref(false)
const stores = ref([])
const selectedStore = ref(null)
const lang=ref(localStorage.getItem('appLang'))
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

// Fetch stores for dropdown
const fetchStores = () => {
  axios.get('/api/store')
    .then((response) => {
      stores.value = response.data.data.data
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('store.loadError'),
        life: 3000
      })
      console.error('Error fetching stores:', error)
    })
}
const goToMediaLinks = (id) => {
  router.push({ name: 'media-links', params: { id: id, type:2 } });
};
// Fetch categories data
const fetchData = () => {
  loading.value = true
  axios.get('/api/category', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value || undefined,
      store_id: selectedStore.value?.id || undefined
    }
  })
    .then((response) => {
      categories.value = response.data.data.data
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
        detail: t('category.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching categories:', error)
    })
}

// Watch for pagination, search, and store changes
watch([searchQuery, rowsPerPage, selectedStore], () => {
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

// Delete category
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteCategory = () => {
  axios.delete(`/api/category/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('category.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
      deleteId.value = null
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('category.deleteError'),
        life: 3000
      })
      console.error('Error deleting category:', error)
    })
}

// Export categories
const exportCategories = () => {
  axios.get('/api/export/category', {
    responseType: 'blob'
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'categories_export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('category.exportError'),
        life: 3000
      })
      console.error('Error exporting categories:', error)
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
    link.setAttribute('download', 'category_import_example.xlsx')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

// Import categories
const openImportDialog = () => {
  importDialog.value = true
  selectedFile.value = null
}

const onFileSelect = (event) => {
  selectedFile.value = event.files[0]
}

    const goToShippingSettings = (storeId) => {
      router.push({ name: 'category-shipping-settings', params: { id: storeId } })
    }
const importCategories = () => {
  if (!selectedFile.value) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('category.importNoFile'),
      life: 3000
    })
    return
  }

  importLoading.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  axios.post('/api/import/store', formData)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('category.importSuccess'),
        life: 3000
      })
      fetchData()
      importDialog.value = false
      selectedFile.value = null
      const fileUpload = document.querySelector('.p-fileupload input[type="file"]')
      if (fileUpload) fileUpload.value = ''
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('category.importError'),
        life: 3000
      })
      console.error('Error importing categories:', error)
    })
    .finally(() => {
      importLoading.value = false
    })
}

// Navigation functions
const createNewCategory = () => {
  router.push({ name: 'category-create' })
}

const editCategory = (id) => {
  router.push({ name: 'category-update', params: { id } })
}

// Lifecycle hooks
onMounted(() => {
  fetchStores()
  fetchData()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('category.managementTitle') }}</h2>
          </template>
          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('category.search')" />
              </span>
              <Dropdown
                v-model="selectedStore"
                :options="stores"
                optionLabel="name_en"
                :placeholder="t('category.selectStore')"
                class="w-12rem"
                :showClear="true"
                aria-label="Filter by store"
              />
              <Button
                :label="t('category.import')"
                icon="pi pi-download"
                class="exite"
                @click="openImportDialog"
                aria-label="Import categories"
              />
              <Button
                :label="t('category.export')"
                icon="pi pi-upload"
                class="exite"
                @click="exportCategories"
                aria-label="Export categories"
              />
              <Button
                :label="t('category.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewCategory"
                aria-label="Create new category"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="categories"
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
            <Column field="name_en" :header="t('category.nameEn')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>
            <Column field="name_ar" :header="t('category.nameAr')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>
            <Column field="belongs_to" :header="t('category.store')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ lang === 'ar' ? slotProps.data.belongs_to_ar : slotProps.data.belongs_to_en || t('category.noStore') }}
              </template>
            </Column>
            <Column :header="t('actions')" header-style="width:12rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editCategory(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                  aria-label="Edit category"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                  aria-label="Delete category"
                />
                  <Button
                  v-can="'edit inventory'"
                  icon="pi pi-images"
                  class="p-detail"
                  @click="goToMediaLinks(slotProps.data.id)"

                />

              </template>
            </Column>
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('category.noData') }}</p>
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
          :header="t('category.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('category.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              text
              @click="deleteDialog = false"
              aria-label="Cancel delete"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              text
              severity="danger"
              @click="deleteCategory"
              aria-label="Confirm delete"
            />
          </template>
        </Dialog>

        <!-- Import Dialog -->
        <Dialog
          v-model:visible="importDialog"
          :style="{ width: '500px' }"
          :header="t('category.importInstructions')"
          :modal="true"
        >
          <div class="flex flex-column gap-3">
            <div>
              <Button
                :label="t('category.downloadExample')"
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
              :chooseLabel="t('category.chooseFile')"
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
              text
              @click="importDialog = false"
              aria-label="Cancel import"
            />
            <Button
              :label="t('import')"
              icon="pi pi-check"
              class="p-button-success"
              @click="importCategories"
              :disabled="!selectedFile"
              :loading="importLoading"
              aria-label="Import categories"
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
