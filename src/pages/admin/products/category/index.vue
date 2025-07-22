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
    store_name_ar: 'شفت 7',
    store_name_en: 'Shift7',
    category_name_ar: 'الأحذية',
    category_name_en: 'Shoes',
    sub_category_name_ar: 'أحذية نسائية رسمية',
    sub_category_name_en: "Women's Formal Shoes",
    sub_sub_category_name_ar: 'كريم واقي للشمس',
    sub_sub_category_name_en: 'Sunblock & Cream'
  },
  {
    store_name_ar: 'شفت مارت',
    store_name_en: 'Shift Mart',
    category_name_ar: 'الخضار والفواكة',
    category_name_en: 'Vegetables & Fruits',
    sub_category_name_ar: 'الفواكة الطازجة',
    sub_category_name_en: 'Fresh Fruits',
    sub_sub_category_name_ar: 'كريم واقي للشمس',
    sub_sub_category_name_en: 'Sunblock & Cream'
  }
])

// Fetch categories data
const fetchData = () => {
  loading.value = true
  axios.get('/api/category', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value || undefined
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

// Import categories
const openImportDialog = () => {
  importDialog.value = true
  selectedFile.value = null
}

const onFileSelect = (event) => {
  selectedFile.value = event.files[0]
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
      importLoading.value = false
      selectedFile.value = null
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('category.importError'),
        life: 3000
      })
      importLoading.value = false
      console.error('Error importing categories:', error)
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
              <Button
                :label="t('category.import')"
                icon="pi pi-download"
                class="exite"
                @click="openImportDialog"
              />
              <Button
                :label="t('category.export')"
                icon="pi pi-upload"
              class="exite"
                @click="exportCategories"
              />
              <Button
                :label="t('category.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewCategory"
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
            <Column field="name_en" :header="t('id')" :sortable="true" header-style="width:5%; min-width:5rem;">
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

            <Column field="parent.name_en" :header="t('category.parent')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.parent?.name_en || t('category.noParent') }}
              </template>
            </Column>
            <Column field="store.name_en" :header="t('category.store')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.store?.name_en || t('category.noStore') }}
              </template>
            </Column>
            <Column :header="t('actions')" header-style="width:12rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                 class="p-detail"
                  @click="editCategory(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  icon="pi pi-trash"
                    class="p-delete"
                     @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
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
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteCategory"
            />
          </template>
        </Dialog>

        <!-- Import Dialog -->
        <Dialog
          v-model:visible="importDialog"
          :style="{ width: '800px' }"
          :header="t('category.importInstructions')"
          :modal="true"
        >
          <div class="flex flex-column gap-3">
            <div>
              <DataTable
                :value="exampleData"
                responsive-layout="scroll"
                stripedRows
                showGridlines
                class="p-datatable-sm"
              >
                <Column field="store_name_ar" :header="t('category.storeNameAr')" />
                <Column field="store_name_en" :header="t('category.storeNameEn')" />
                <Column field="category_name_ar" :header="t('category.nameAr')" />
                <Column field="category_name_en" :header="t('category.nameEn')" />
                <Column field="sub_category_name_ar" :header="t('category.subCategoryNameAr')" />
                <Column field="sub_category_name_en" :header="t('category.subCategoryNameEn')" />
                <Column field="sub_sub_category_name_ar" :header="t('category.subSubCategoryNameAr')" />
                <Column field="sub_sub_category_name_en" :header="t('category.subSubCategoryNameEn')" />
              </DataTable>
            </div>

          </div>
          <template #footer>

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
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text mt-3"
              @click="importDialog = false"
            />
            <Button
              :label="t('import')"
              icon="pi pi-check"
              class="p-button-success"
              @click="importCategories"
              :disabled="!selectedFile"
              :loading="importLoading"
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
