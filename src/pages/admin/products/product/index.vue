<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from "axios";

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

// State variables
const loading = ref(true)
const products = ref([]) // Changed from models to products
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedProducts = ref(null) // Changed from selectedModels to selectedProducts

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)

// Fetch data
const fetchData = () => {
  loading.value = true
  axios.get('/api/product', {
    params: {
      page: currentPage.value,
      per_page: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((response) => {
      products.value = response.data.data.data
      totalRecords.value = response.data.data.total
      totalPages.value = response.data.data.last_page
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('product.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching products:', error)
    })
}

// Watch for pagination changes
watch([currentPage, rowsPerPage, searchQuery], () => {
  fetchData()
})

// Delete product
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteProduct = () => {
  axios.delete(`/api/product/${deleteId.value}`) // Updated endpoint to /api/product
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('product.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('product.deleteError'),
        life: 3000
      })
    })
}

// Export CSV
const exportCSV = () => {
  dt.value.exportCSV()
}

// Navigation functions
const createNewProduct = () => {
  router.push({ name: 'product-create' }) // Updated route name
}

const editProduct = (id) => {
  router.push({ name: 'product-update', params: { id } }) // Updated route name
}

// Lifecycle hooks
onMounted(() => {
  fetchData()
});
</script>
<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('product.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('product.search')" />
              </span>
              <Button
                :label="t('product.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'list products'"
                @click="exportCSV"
              />
              <Button
                v-can="'create products'"
                :label="t('product.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewProduct"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="products"
            :loading="loading"
            data-key="id"
            :paginator="true"
            :rows="rowsPerPage"
            :filters="filters"
            :totalRecords="totalRecords"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 20, 30]"
            :current-page-report-template="`${t('show')} {first} ${t('to')} {last} ${t('from')} {totalRecords}`"
            responsive-layout="scroll"
            stripedRows
            showGridlines
            class="p-datatable-sm"
            v-can="'list products'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="name_ar" :header="t('product.nameAr')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>

            <Column field="name_en" :header="t('product.nameEn')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>

            <Column field="base_price" :header="t('product.basePrice')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.base_price }}
              </template>
            </Column>

            <Column field="is_displayed" :header="t('product.isDisplayed')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.is_displayed ? t('yes') : t('no') }}
              </template>
            </Column>

            <Column :header="t('actions')" headerStyle="width: 12rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit products'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editProduct(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete products'"
                  icon="pi pi-trash"
                  class="mx-2 p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="py-4 text-center">
                <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                <p class="text-xl">{{ t('product.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex py-4 justify-content-center align-items-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('product.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('product.deleteConfirmMessage') }}</span>
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
              @click="deleteProduct"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
