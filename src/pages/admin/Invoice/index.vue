<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FilterMatchMode } from 'primevue/api'
import axios from 'axios'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// State
const loading = ref(true)
const invoices = ref([])
const selectedInvoices = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const totalRecords = ref(0)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)
const links = ref([])

// Initialize filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

// Fetch invoices
const fetchData = () => {
  loading.value = true
  axios.get('/api/invoice', {
    params: {
      page: currentPage.value,
      limit: 10, // or use rowsPerPage if you want dynamic
      search: searchQuery.value || undefined
    }
  })
  .then((res) => {
    if (res.data.is_success && res.data.data) {
      invoices.value = res.data.data.data
      totalRecords.value = res.data.data.total
      totalPages.value = res.data.data.last_page
      from.value = res.data.data.from || 0
      to.value = res.data.data.to || 0
      links.value = res.data.data.links || []
    }
    loading.value = false
  })
  .catch((error) => {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invoice.loadError') || 'Failed to load invoices',
      life: 4000
    })
    console.error('Error fetching invoices:', error)
    loading.value = false
  })
}

// Watch search
watch(searchQuery, () => {
  currentPage.value = 1
  fetchData()
})

// Pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchData()
  }
}

// Export CSV
const exportCSV = () => {
  dt.value.exportCSV()
}

// View invoice detail (optional - create route if needed)
const viewInvoice = (id) => {
  router.push({ name: 'invoice-show', params: { id } }) // adjust route name
}

// Lifecycle
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
            <h2 class="text-2xl font-bold">{{ t('invoice.managementTitle') || 'Invoice Management' }}</h2>
          </template>

          <template #end>
            <div class="flex gap-3 align-items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('search') + '...'" />
              </span>

              <Button
                :label="t('role.export')"
                icon="pi pi-upload"
                class="p-button-outlined"
                @click="exportCSV"
                v-can="'export invoices'"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <DataTable
          ref="dt"
          :value="invoices"
          :loading="loading"
          data-key="id"
          :paginator="false"
          :rows="10"
          :filters="filters"
          :totalRecords="totalRecords"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          v-can="'list invoices'"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>



          <Column field="number" :header="t('invoice.number')" sortable>
            <template #body="slotProps">
              <strong>{{ slotProps.data.number }}</strong>
            </template>
          </Column>



          <Column field="total_price" :header="t('invoice.total')" sortable>
            <template #body="slotProps">
              <strong>{{ slotProps.data.total_price }} {{ $t("currencyLabel") }}</strong>
            </template>
          </Column>

          <Column field="sub_total_price" :header="t('invoice.subTotal')">
            <template #body="slotProps">
              {{ slotProps.data.sub_total_price }} {{ $t("currencyLabel") }}
            </template>
          </Column>

          <Column field="tax_fee" :header="t('invoice.tax')">
            <template #body="slotProps">
              {{ slotProps.data.tax_fee }} {{ $t("currencyLabel") }}
            </template>
          </Column>

          <Column :header="t('actions')" headerStyle="width: 8rem; text-align: center">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-detail"
                @click="viewInvoice(slotProps.data.id)"
                v-tooltip.top="t('view')"
                v-can="'show invoices'"
              />
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-6 text-600">
              <i class="pi pi-inbox text-4xl mb-3"></i>
              <p class="text-xl">{{ t('invoice.noData') || 'No invoices found' }}</p>
            </div>
          </template>

          <template #loading>
            <div class="flex justify-content-center py-6">
              <ProgressSpinner />
            </div>
          </template>
        </DataTable>

        <!-- Custom Paginator -->
         <div class="p-paginator p-component p-unselectable-text p-paginator-bottom">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ t('show') }} {{ from }} {{ t('to') }} {{ to }} {{ t('from') }} {{ totalRecords }}
              </span>
            </div>
            <div class="p-paginator-right-content flex align-items-center gap-3">
              <button
                class="p-paginator-first p-paginator-element p-link"
                :disabled="currentPage === 1"
                @click="goToPage(1)"
              >
                <span class="p-paginator-icon pi pi-angle-double-left"></span>
              </button>
              <button
                class="p-paginator-prev p-paginator-element p-link"
                :disabled="currentPage === 1"
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
                :disabled="currentPage === totalPages"
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
                :options="[5, 10, 20, 30, 50]"
                @change="changeRowsPerPage"
                class="ml-3"
                style="width: 80px"
              />
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
