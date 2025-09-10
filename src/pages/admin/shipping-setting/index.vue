<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch ,computed} from 'vue'
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
import MultiSelect from 'primevue/multiselect'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()
const loading = ref(true)
const delete_id = ref('')
const shippingSetting = ref({})
const shippingSettings = ref(null)
const shippingSettingDialog = ref(false)
const deleteDialog = ref(false)
const deleteShippingSettingsDialog = ref(false)
const selectedShippingSettings = ref(null)
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

// Days options for MultiSelect
// Days options for MultiSelect
const dayOptions = computed(() => [
  { label: t('days.sunday'), value: 0 },
  { label: t('days.monday'), value: 1 },
  { label: t('days.tuesday'), value: 2 },
  { label: t('days.wednesday'), value: 3 },
  { label: t('days.thursday'), value: 4 },
  { label: t('days.friday'), value: 5 },
  { label: t('days.saturday'), value: 6 }
]);
// Export shipping settings
const exportShippingSettings = () => {
  axios.get('/api/export/shipping-setting', {
    responseType: 'blob'
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'shipping_settings_export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('shippingSetting.exportSuccess'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('shippingSetting.exportError'),
        life: 3000
      })
      console.error('Error exporting shipping settings:', error)
    })
}

const delet = (id) => {
  delete_id.value = id
  deleteShippingSettingsDialog.value = true
}

const deleteSelectedShippingSetting = () => {
  axios.delete(`/api/shipping-setting/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteShippingSettingsDialog.value = false
      toast.add({severity: 'success', summary: t('success'), detail: t('shippingSetting.deletedSuccess'), life: 3000})
    })
    .catch(() => {
      toast.add({severity: 'error', summary: t('error'), detail: t('shippingSetting.deleteError'), life: 3000})
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
  axios.get("/api/shipping-setting", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    shippingSettings.value = res.data.data.data
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
      detail: t('shippingSetting.loadError'),
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
  router.push({name:'shipping-create'})
}

const confirmEdit = (id) => {
  router.push({name:'shipping-update',params:{id:id}})
};

// Format date for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Format days for display
const formatDays = (days) => {
  return days?.map(day => dayOptions.value.find(option => option.value === day)?.label || day).join(', ')
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('shippingSetting.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('shippingSetting.search')" />
              </span>
              <Button
                :label="t('shippingSetting.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'list shipping settings'"
                @click="exportShippingSettings"
              />
              <Button
                v-can="'create shipping settings'"
                :label="t('shippingSetting.new')"
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
            :value="shippingSettings"
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
            v-can="'list shipping settings'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="store.name_en" :header="t('shippingSetting.storeNameEn')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.store.name_en }}
              </template>
            </Column>

            <Column field="store.name_ar" :header="t('shippingSetting.storeNameAr')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.store.name_ar }}
              </template>
            </Column>

            <Column field="is_enabled" :header="t('shippingSetting.isEnabled')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.is_enabled ? t('shippingSetting.yes') : t('shippingSetting.no')"
                  :severity="slotProps.data.is_enabled ? 'success' : 'info'"
                />
              </template>
            </Column>

            <Column field="min_amount" :header="t('shippingSetting.minAmount')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.min_amount }}
              </template>
            </Column>

            <Column field="free_amount" :header="t('shippingSetting.freeAmount')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.free_amount }}
              </template>
            </Column>

            <Column field="express_enabled" :header="t('shippingSetting.expressEnabled')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.express_enabled ? t('shippingSetting.yes') : t('shippingSetting.no')"
                  :severity="slotProps.data.express_enabled ? 'success' : 'info'"
                />
              </template>
            </Column>

            <Column field="days" :header="t('shippingSetting.days')" :sortable="false">
              <template #body="slotProps">
                <MultiSelect
                  :modelValue="slotProps.data.days"
                  :options="dayOptions"
                  optionLabel="label"
                  optionValue="value"
                  :disabled="true"
                  :placeholder="t('shippingSetting.selectDays')"
                  class="w-full"
                >
                  <template #value="slotProps">
                    {{ formatDays(slotProps.value) }}
                  </template>
                </MultiSelect>
              </template>
            </Column>

            <Column field="from" :header="t('shippingSetting.fromTime')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.from }}
              </template>
            </Column>

            <Column field="to" :header="t('shippingSetting.toTime')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.to }}
              </template>
            </Column>

            <Column :header="t('actions')" headerStyle="width: 12rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit shipping settings'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="confirmEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete shipping settings'"
                  icon="pi pi-trash"
                  class="p-delete mx-2"
                  @click="delet(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('shippingSetting.noData') }}</p>
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
          v-model:visible="deleteShippingSettingsDialog"
          :style="{ width: '450px' }"
          :header="t('shippingSetting.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('shippingSetting.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteShippingSettingsDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteSelectedShippingSetting"
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
