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
const addresses = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedAddresses = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)

// Fetch data
const fetchData = () => {
  loading.value = true
  axios.get('/api/address', {
    params: {
      page: currentPage.value,
      per_page: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((response) => {
      addresses.value = response.data.data.data
      totalRecords.value = response.data.data.total
      totalPages.value = response.data.data.last_page
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('address.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching addresses:', error)
    })
}

// Watch for pagination changes
watch([currentPage, rowsPerPage, searchQuery], () => {
  fetchData()
})

// Delete address
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteAddress = () => {
  axios.delete(`/api/address/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('address.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('address.deleteError'),
        life: 3000
      })
    })
}

// Export CSV
const exportCSV = () => {
  dt.value.exportCSV()
}

// Navigation functions
const createNewAddress = () => {
  router.push({ name: 'address-create' })
}

const editAddress = (id) => {
  router.push({ name: 'address-update', params: { id } })
}

// Get default status severity
const getDefaultStatusSeverity = (isDefault) => {
  return isDefault ? 'success' : 'info'
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
            <h2 class="text-2xl font-bold">{{ t('address.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('address.search')" />
              </span>
              <Button
                :label="t('address.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'list address'"
                @click="exportCSV"
              />
              <Button
                v-can="'create address'"
                :label="t('address.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewAddress"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="addresses"
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
            v-can="'list address'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="address_line_1" :header="t('address.line1')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.address_line_1 }}
              </template>
            </Column>

            <Column field="address_line_2" :header="t('address.line2')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.address_line_2 || '-' }}
              </template>
            </Column>

            <Column field="city" :header="t('address.city')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.city }}
              </template>
            </Column>

            <Column field="country" :header="t('address.country')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.country }}
              </template>
            </Column>

            <Column field="zip_code" :header="t('address.zipCode')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.zip_code || '-' }}
              </template>
            </Column>

            <Column field="is_default" :header="t('address.default')" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.is_default ? t('address.defaultYes') : t('address.defaultNo')"
                  :severity="getDefaultStatusSeverity(slotProps.data.is_default)"
                />
              </template>
            </Column>

            <Column :header="t('actions')" headerStyle="width: 12rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit address'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editAddress(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete address'"
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
                <p class="text-xl">{{ t('address.noData') }}</p>
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
          :header="t('address.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('address.deleteConfirmMessage') }}</span>
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
              @click="deleteAddress"
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
