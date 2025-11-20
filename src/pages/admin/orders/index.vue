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
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// State variables
const loading = ref(true)
const delete_id = ref('')
const deleteDialog = ref(false)
const rejectDialog = ref(false)
const rejectOrderId = ref(null)

const orders = ref(null)
const selectedOrders = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)
const links = ref([])

// Initialize filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

// Fetch data
const fetchData = () => {
  loading.value = true
  axios.get('/api/order', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((res) => {
      orders.value = res.data.data.data
      totalRecords.value = res.data.data.total
      totalPages.value = res.data.data.last_page
      from.value = res.data.data.from
      to.value = res.data.data.to
      links.value = res.data.data.links
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching data:', error)
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
  rowsPerPage.value = event.value || event.target.value
  currentPage.value = 1
  fetchData()
}

// Change order status (Accept or Reject)
const changeOrderStatus = (orderId, status, isReject = false) => {
  if (isReject) {
    rejectOrderId.value = orderId
    rejectDialog.value = true
    return
  }

  // Direct accept
  performStatusChange(orderId, status)
}

const performStatusChange = (orderId, status) => {
  loading.value = true
  axios.post(`/api/order/change-status/${orderId}`, null, {
    params: { status }
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: status === 1
          ? t('order.statusAccepted')
          : t('order.statusRejected'),
        life: 3000
      })
      fetchData() // Refresh list
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.statusChangeError'),
        life: 5000
      })
      console.error('Status change failed:', error)
    })
    .finally(() => {
      loading.value = false
      rejectDialog.value = false
    })
}

// Confirm Reject
const confirmReject = () => {
  if (rejectOrderId.value) {
    performStatusChange(rejectOrderId.value, 2)
    rejectOrderId.value = null
  }
}

// Delete order
const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteOrder = () => {
  axios.delete(`/api/order/${delete_id.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('order.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.deleteError'),
        life: 3000
      })
    })
}

// Export CSV
const exportCSV = () => {
  dt.value.exportCSV()
}

// Navigation function
const viewOrder = (id) => {
  router.push({ name: 'order-show', params: { id } })
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
            <h2 class="text-2xl font-bold">{{ t('order.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('order.search')" />
              </span>
              <Button
                :label="t('order.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'export orders'"
                @click="exportCSV"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="orders"
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
            v-can="'list orders'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="id" :header="t('order.id')" :sortable="true" header-style="width:10%; min-width:6rem;">
              <template #body="slotProps">
                #{{ slotProps.data.id }}
              </template>
            </Column>

            <Column field="total_price" :header="t('order.totalPrice')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.total_price }} {{ $t("currencyLabel") }}
              </template>
            </Column>

            <Column field="status" :header="t('order.status')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status === 0 ? t('order.pending') :
                         slotProps.data.status === 1 ? t('order.completed') : t('order.rejected')"
                  :severity="slotProps.data.status === 0 ? 'warning' :
                             slotProps.data.status === 1 ? 'success' : 'danger'"
                />
              </template>
            </Column>

            <Column :header="t('actions')" header-style="min-width:14rem;">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <!-- View Button -->
                  <Button
                    v-can="'show orders'"
                    icon="pi pi-eye"
                    class="p-button-rounded p-detail p-button-sm"
                    @click="viewOrder(slotProps.data.id)"
                    v-tooltip.top="t('view')"
                  />

                  <!-- Accept Button (only if pending) -->
                  <Button
                    v-if="slotProps.data.status === 0"
                    v-can="'update orders'"
                    icon="pi pi-check"
                    class="p-button-rounded p-detail p-button-sm"
                    @click="changeOrderStatus(slotProps.data.id, 1)"
                    v-tooltip.top="t('order.accept')"
                  />

                  <!-- Reject Button (only if pending) -->
                  <Button
                    v-if="slotProps.data.status === 0"
                    v-can="'update orders'"
                    icon="pi pi-times"
                    class="p-button-rounded p-delete"
                    @click="changeOrderStatus(slotProps.data.id, 2, true)"
                    v-tooltip.top="t('order.reject')"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('order.noData') }}</p>
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

        <!-- Reject Confirmation Dialog -->
        <Dialog
          v-model:visible="rejectDialog"
          :style="{ width: '450px' }"
          :header="t('order.rejectConfirmTitle')"
          :modal="true"
          :closable="false"
        >
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem; color: var(--red-500)" />
            <span>{{ t('order.rejectConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="rejectDialog = false"
            />
            <Button
              :label="t('yesReject')"
              icon="pi pi-check"
              class="p-button-danger"
              @click="confirmReject"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('order.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('order.deleteConfirmMessage') }}</span>
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
              @click="deleteOrder"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

