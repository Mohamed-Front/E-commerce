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
const customTabs = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedCustomTabs = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)

// Fetch data
const fetchData = () => {
  loading.value = true
  axios.get('api/custom-tab-details')
  axios.get('/api/custom-tabs', {
    params: {
      page: currentPage.value,
      per_page: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
    .then((response) => {
      customTabs.value = response.data.data.data
      totalRecords.value = response.data.data.total
      totalPages.value = response.data.data.last_page
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('customTabs.loadError'),
        life: 3000
      })
      loading.value = false
      console.error('Error fetching custom tabs:', error)
    })
}

// Watch for pagination changes
watch([currentPage, rowsPerPage, searchQuery], () => {
  fetchData()
})

// Delete custom tab
const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteCustomTab = () => {
  axios.delete(`/api/custom-tabs/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('customTabs.deleteSuccess'),
        life: 3000
      })
      fetchData()
      deleteDialog.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('customTabs.deleteError'),
        life: 3000
      })
    })
}

// Export CSV
const exportCSV = () => {
  dt.value.exportCSV()
}

// Navigation functions
const createNewCustomTab = () => {
  router.push({ name: 'custom_tabs_create' })
}

const editCustomTab = (id) => {
  router.push({ name: 'custom_tabs_update', params: { id } })
}
const showCustomTab = (id) => {
  router.push({ name: 'custom_tabs_show', params: { id } })
}

// Get type severity
const getTypeSeverity = (type) => {
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
            <h2 class="text-2xl font-bold">{{ t('customTabs.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('customTabs.search')" />
              </span>
              <Button
                :label="t('customTabs.export')"
                icon="pi pi-upload"
                class="p-export"
                v-can="'list custom tabs'"
                @click="exportCSV"
              />
              <Button

                v-can="'create custom tabs'"
                :label="t('customTabs.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="createNewCustomTab"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="customTabs"
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
            v-can="'list custom tabs'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="name_en" :header="t('customTabs.nameEn')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>

            <Column field="name_ar" :header="t('customTabs.nameAr')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>

            <Column field="model_type" :header="t('customTabs.modelType')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.model_type }}
              </template>
            </Column>

            <Column field="type_description" :header="t('customTabs.typeDescription')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.type_description }}
              </template>
            </Column>



            <Column :header="t('actions')" headerStyle="width: 15rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit custom tabs'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editCustomTab(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete custom tabs'"
                  icon="pi pi-trash"
                  class="p-delete mx-2"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
                 <Button
                  v-can="'delete custom tabs'"
                  icon="pi pi-eye"
                  class="p-detail mx-2"
                  @click="showCustomTab(slotProps.data.id)"
                  v-tooltip.top="t('show')"
                />

              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('customTabs.noData') }}</p>
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
          :header="t('customTabs.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('customTabs.deleteConfirmMessage') }}</span>
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
              @click="deleteCustomTab"
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
