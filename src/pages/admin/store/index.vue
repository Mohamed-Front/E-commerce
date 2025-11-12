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

// Export stores
const exportStores = () => {
  axios.get('/api/export/store', {
    responseType: 'blob' // Important for handling file downloads
  })
    .then((response) => {
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'text/csv' })
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob)
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'stores_export.csv') // Set the file name
      document.body.appendChild(link)
      link.click()
      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('store.exportSuccess'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('store.exportError'),
        life: 3000
      })
      console.error('Error exporting stores:', error)
    })
}

    const delet = (id) => {
      delete_id.value = id
      deleteStoresDialog.value = true
    }
    const goToShippingSettings = (storeId) => {
      router.push({ name: 'store-shipping-settings', params: { id: storeId } })
    }
const deleteSelectedStore = () => {
  axios.delete(`/api/store/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteStoresDialog.value = false
      toast.add({severity: 'success', summary: t('success'), detail: t('store.deletedSuccess'), life: 3000})
    })
    .catch(() => {
      toast.add({severity: 'error', summary: t('error'), detail: t('store.deleteError'), life: 3000})
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
const goToMediaLinks = (id) => {
  router.push({ name: 'media-links', params: { id: id, type:1 } });
};
const fetchData = () => {
  loading.value = true
  axios.get("/api/store", {
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
      detail: t('store.loadError'),
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
})

const openNew = () => {
  router.push({name:'store-create'})
}

const confirmEdit = (id) => {
  router.push({name:'store-edit',params:{id:id}})
};

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
            <h2 class="text-2xl font-bold">{{ t('store.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('store.search')" />
              </span>
              <Button
                :label="t('store.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'list stores'"
                @click="exportStores"
              />
              <Button
                v-can="'create stores'"
                :label="t('store.new')"
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
            v-can="'list stores'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="name_en" :header="t('store.nameEn')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>

            <Column field="name_ar" :header="t('store.nameAr')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>

            <Column field="is_default" :header="t('store.isDefault')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.is_default ? t('store.yes') : t('store.no')"
                  :severity="slotProps.data.is_default ? 'success' : 'info'"
                />
              </template>
            </Column>

            <Column field="has_market" :header="t('store.hasMarket')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.has_market ? t('store.yes') : t('store.no')"
                  :severity="slotProps.data.has_market ? 'success' : 'info'"
                />
              </template>
            </Column>

            <Column :header="t('actions')" headerStyle="width: 15rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit stores'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="confirmEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete stores'"
                  icon="pi pi-trash"
                  class="p-delete mx-2"
                  @click="delet(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
                  <Button
                  v-can="'edit inventory'"
                  icon="pi pi-images"
                  class="p-detail"
                  @click="goToMediaLinks(slotProps.data.id)"

                />
                <Button

                  icon="pi pi-truck"
                  class="p-button-warning mx-1"
                  @click="goToShippingSettings(slotProps.data.id)"
                  v-tooltip.top="t('store.shippingSettings')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('store.noData') }}</p>
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
          :header="t('store.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('store.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteStoresDialog = false"
            />
            <Button
              :variant="outline"
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteSelectedStore"
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
</style>
