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
const coupons = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedCoupons = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)

// Fetch data
const fetchData = () => {
  loading.value = true
  axios.get('/api/coupon', {
    params: {
      page: currentPage.value,
      per_page: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((response) => {
      coupons.value = response.data.data.data
      totalRecords.value = response.data.data.total
      totalPages.value = response.data.data.last_page
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('coupon.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching coupons:', error)
    })
}

// Watch for pagination changes
watch([currentPage, rowsPerPage, searchQuery], () => {
  fetchData()
})

// Delete coupon
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteCoupon = () => {
  axios.delete(`/api/coupon/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('coupon.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('coupon.deleteError'),
        life: 3000
      })
    })
}

// Export CSV
const exportCSV = () => {
  dt.value.exportCSV()
}

// Navigation functions
const createNewCoupon = () => {
  router.push({ name: 'coupon-create' })
}

const editCoupon = (id) => {
  router.push({ name: 'coupon-update', params: { id } })
}

// Get discount type severity
const getDiscountTypeSeverity = (type) => {
  return type === 1 ? 'success' : 'info'
}

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
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
            <h2 class="text-2xl font-bold">{{ t('coupon.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('coupon.search')" />
              </span>
              <Button
                :label="t('coupon.export')"
                icon="pi pi-upload"
                class="p-export"
                 v-can="'list coupons'"
                @click="exportCSV"
              />
              <Button
                v-can="'create coupons'"
                :label="t('coupon.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewCoupon"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="coupons"
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
            v-can="'list coupons'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="code" :header="t('coupon.code')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.code }}
              </template>
            </Column>

            <Column field="discount_type_description" :header="t('coupon.type')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.discount_type_description"
                  :severity="getDiscountTypeSeverity(slotProps.data.discount_type)"
                />
              </template>
            </Column>

            <Column field="discount_value" :header="t('coupon.value')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.discount_value }}
              </template>
            </Column>

            <Column field="expires_at" :header="t('coupon.expiry')" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.expires_at) }}
              </template>
            </Column>

            <Column :header="t('actions')" headerStyle="width: 12rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit coupons'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editCoupon(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete coupons'"
                  icon="pi pi-trash"
                  class="p-delete mx-2"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('coupon.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('coupon.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('coupon.deleteConfirmMessage') }}</span>
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
              @click="deleteCoupon"
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
