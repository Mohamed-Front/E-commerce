<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import Toast from 'primevue/toast'
import FileUpload from 'primevue/fileupload'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import InputSwitch from 'primevue/inputswitch'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

// State variables
const loading = ref(true)
const products = ref([])
const deleteDialog = ref(false)
const deleteId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const selectedProducts = ref(null)
const importDialog = ref(false)
const selectedFile = ref(null)
const importLoading = ref(false)
const categories = ref([])
const stores = ref([])
const markets = ref([])
const selectedCategory = ref(null)
const selectedStore = ref(null)
const selectedMarket = ref(null)
const categorySearchQuery = ref('')
const marketSearchQuery = ref('')
const appLanguage = ref(localStorage.getItem('appLang') || 'en')

// --- NEW PRICE UPDATE STATE ---
const priceUpdateDialog = ref(false)
const selectedPriceFile = ref(null)
const priceUpdateLoading = ref(false)
// ------------------------------

// --- TOGGLE LOADING MAP ---
const toggleLoading = ref({}) // { productId: true/false }
// --------------------------------

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

// Fetch categories with search support
const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/category', {
            params: {
                search: categorySearchQuery.value || undefined
            }
        })
        const lang = appLanguage.value
        categories.value = response.data.data.data.map(category => ({
            label: lang === 'en'
                ? `${category.name_en} `
                : `${category.name_ar} `,
            value: category.id
        }))
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('category.loadError'),
            life: 3000
        })
        console.error('Error fetching categories:', error)
    }
}

// Fetch stores
const fetchStores = async () => {
    try {
        const response = await axios.get('/api/store')
        const lang = appLanguage.value
        stores.value = response.data.data.data.map(store => ({
            label: lang === 'en'
                ? `${store.name_en} `
                : `${store.name_ar} `,
            value: store.id
        }))
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('store.loadError'),
            life: 3000
        })
        console.error('Error fetching stores:', error)
    }
}

// Fetch markets with search support
const fetchMarkets = async () => {
    try {
        const response = await axios.get('/api/market', {
            params: {
                search: marketSearchQuery.value || undefined
            }
        })
        const lang = appLanguage.value
        markets.value = response.data.data.data.map(market => ({
            label: lang === 'en'
                ? `${market.name_en} `
                : `${market.name_ar} `,
            value: market.id
        }))
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('market.loadError'),
            life: 3000
        })
        console.error('Error fetching markets:', error)
    }
}

// Fetch data
const fetchData = () => {
    loading.value = true
    axios.get('/api/product', {
        params: {
            page: currentPage.value,
            limit: rowsPerPage.value,
            search: searchQuery.value || undefined,
            category_id: selectedCategory.value || undefined,
            store_id: selectedStore.value || undefined,
            market_id: selectedMarket.value || undefined
        }
    })
    .then((response) => {
        products.value = response.data.data.data
        totalRecords.value = response.data.data.total
        totalPages.value = response.data.data.last_page
        firstPageUrl.value = response.data.data.first_page_url
        lastPageUrl.value = response.data.data.last_page_url
        nextPageUrl.value = response.data.data.next_page_url
        prevPageUrl.value = response.data.data.prev_page_url
        from.value = response.data.data.from
        to.value = response.data.data.to
        links.value = response.data.data.links
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

// Watch for pagination, search, and filter changes
watch([searchQuery, rowsPerPage, selectedCategory, selectedStore, selectedMarket], () => {
    currentPage.value = 1
    fetchData()
})

// Watch for language changes
watch(appLanguage, () => {
    fetchCategories()
    fetchStores()
    fetchMarkets()
})

// Handle category filter input
const onCategoryFilter = (event) => {
    categorySearchQuery.value = event.value
    fetchCategories()
}

// Handle market filter input
const onMarketFilter = (event) => {
    marketSearchQuery.value = event.value
    fetchMarkets()
}

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

// Delete product
const confirmDelete = (id) => {
    deleteId.value = id
    deleteDialog.value = true
}

const deleteProduct = () => {
    axios.delete(`/api/product/${deleteId.value}`)
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
        console.error('Error deleting product:', error)
    })
}

// Export CSV with filters
const exportCSV = () => {
    const params = new URLSearchParams({
        search: searchQuery.value || '',
        category_id: selectedCategory.value || '',
        store_id: selectedStore.value || '',
        market_id: selectedMarket.value || ''
    })

    const url = `/api/export/products?${params.toString()}`

    axios.get(url, { responseType: 'blob' })
        .then((response) => {
            const blob = new Blob([response.data], { type: 'text/csv' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'products_export.csv'
            link.click()
            URL.revokeObjectURL(link.href)

            toast.add({
                severity: 'success',
                summary: t('success'),
                detail: t('product.exportSuccess'),
                life: 3000
            })
        })
        .catch((error) => {
            toast.add({
                severity: 'error',
                summary: t('error'),
                detail: t('product.exportError'),
                life: 3000
            })
            console.error('Error exporting products:', error)
        })
}

// Download example CSV for full product import
const downloadExample = () => {
    const csvContent = 'store_id,category_id,market_id,name_en,name_ar,sku,brand_id,sub_name_en,sub_name_ar,description_en,description_ar,base_price,cost_price,tax\n' +
        '1,1,1,Demo Product 1,منتج تجريبي 1,SKU001,1,Sub Demo 1,تجريبي فرعي 1,Description of Demo Product 1,وصف المنتج التجريبي 1,15.50,10.00,0.05\n' +
        '2,2,2,Demo Product 2,منتج تجريبي 2,SKU002,2,Sub Demo 2,تجريبي فرعي 2,Description of Demo Product 2,وصف المنتج التجريبي 2,22.00,15.00,0.05';

    const blob = new Blob([csvContent], { type: 'text/xlsx;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'product_import_example.xlsx')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

// Download example CSV for price update
const downloadPriceExample = () => {
    const csvContent = 'id,price,cost_price\n' +
        '1,16.00,10.50\n' +
        '2,23.50,15.00';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'product_price_update_example.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

// Handle file selection for full product import
const onFileSelect = (event) => {
    selectedFile.value = event.files[0]
}

// Handle file selection for price update
const onPriceFileSelect = (event) => {
    selectedPriceFile.value = event.files[0]
}

// Import products (full)
const importProducts = () => {
    if (!selectedFile.value) {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('validation.fileRequired'),
            life: 3000
        })
        return
    }

    importLoading.value = true
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    axios.post('/api/import/products', formData)
    .then(() => {
        toast.add({
            severity: 'success',
            summary: t('success'),
            detail: t('product.importSuccess'),
            life: 3000
        })
        fetchData()
        importDialog.value = false
        selectedFile.value = null
    })
    .catch((error) => {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('product.importError'),
            life: 3000
        })
        console.error('Error importing products:', error)
    })
    .finally(() => {
        importLoading.value = false
    })
}

// Update Prices
const updatePrices = () => {
    if (!selectedPriceFile.value) {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('validation.fileRequired'),
            life: 3000
        })
        return
    }

    priceUpdateLoading.value = true
    const formData = new FormData()
    formData.append('file', selectedPriceFile.value)

    axios.post('/api/product/update/prices', formData)
    .then(() => {
        toast.add({
            severity: 'success',
            summary: t('success'),
            detail: t('product.priceUpdateSuccess'),
            life: 3000
        })
        fetchData()
        priceUpdateDialog.value = false
        selectedPriceFile.value = null
    })
    .catch((error) => {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('product.priceUpdateError'),
            life: 3000
        })
        console.error('Error updating prices:', error)
    })
    .finally(() => {
        priceUpdateLoading.value = false
    })
}

// FIXED: Toggle Free Shipping (Safe & Reactive)
const toggleFreeShipping = async (product) => {
    const productId = product.id
    const currentValue = product.is_free_shipping
    const newValue = currentValue === 1 ? 0 : 1

    // Show loading
    toggleLoading.value[productId] = true

    try {
        await axios.post(`/api/product/is/free/shipping/${productId}`, {
            is_free_shipping: newValue
        })

        // Success: update locally
        product.is_free_shipping = newValue

        toast.add({
            severity: 'success',
            summary: t('success'),
            detail: newValue === 1 ? t('product.freeShippingEnabled') : t('product.freeShippingDisabled'),
            life: 3000
        })
    } catch (error) {
        // Revert on error
        product.is_free_shipping = currentValue

        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('product.freeShippingUpdateError'),
            life: 3000
        })
        console.error('Error updating free shipping:', error)
    } finally {
        toggleLoading.value[productId] = false
    }
}

// Navigation functions
const createNewProduct = () => {
    router.push({ name: 'product-create' })
}

const editProduct = (id) => {
    router.push({ name: 'product-update', params: { id } })
}

// Lifecycle hooks
onMounted(() => {
    Promise.all([fetchCategories(), fetchStores(), fetchMarkets(), fetchData()])
})
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-4 shadow-2 border-round">
                <Toolbar class="mb-4">
                    <template #start>
                        <h2 class="text-2xl font-bold">{{ t('product.managementTitle') }}</h2>
                    </template>

                    <template #end>
                        <div class="flex gap-2 align-items-center">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="searchQuery" :placeholder="t('product.search')" />
                            </span>
                            <Dropdown
                                v-model="selectedCategory"
                                :options="categories"
                                optionLabel="label"
                                optionValue="value"
                                :placeholder="t('product.categoryFilter')"
                                class="w-12rem"
                                :showClear="true"
                                filter
                                filterPlaceholder="Search categories"
                                @filter="onCategoryFilter"
                            />
                            <Dropdown
                                v-model="selectedStore"
                                :options="stores"
                                optionLabel="label"
                                optionValue="value"
                                :placeholder="t('product.storeFilter')"
                                class="w-12rem"
                                :showClear="true"
                            />
                            <Dropdown
                                v-model="selectedMarket"
                                :options="markets"
                                optionLabel="label"
                                optionValue="value"
                                :placeholder="t('product.marketFilter')"
                                class="w-12rem"
                                :showClear="true"
                                filter
                                filterPlaceholder="Search markets"
                                @filter="onMarketFilter"
                            />

                            <Button
                                :label="t('product.updatePrice')"
                                icon="pi pi-dollar"
                                class="p-button-warning p-button-outlined"
                                @click="priceUpdateDialog = true"
                            />
                            <Button
                                :label="t('product.import')"
                                icon="pi pi-download"
                                class="p-import"
                                @click="importDialog = true"
                            />
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
                        :paginator="false"
                        :rows="rowsPerPage"
                        :filters="filters"
                        :totalRecords="totalRecords"
                        responsive-layout="scroll"
                        stripedRows
                        showGridlines
                        class="p-datatable-sm"
                        v-can="'list products'"
                    >
                        <Column field="id" :header="t('id')" :sortable="true" header-style="width:6%; min-width:4rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.id }}
                            </template>
                        </Column>

                        <Column field="name_ar" :header="t('product.nameAr')" :sortable="true" header-style="width:14%; min-width:13rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.name_ar }}
                            </template>
                        </Column>

                        <Column field="name_en" :header="t('product.nameEn')" :sortable="true" header-style="width:14%; min-width:13rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.name_en }}
                            </template>
                        </Column>

                        <Column field="base_price" :header="t('product.basePrice')" :sortable="true" header-style="width:8%; min-width:8rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.base_price }}
                            </template>
                        </Column>

                        <Column field="total_discounts_value" :header="t('product.Price after discount')" :sortable="true" header-style="width:10%; min-width:10rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.base_price - slotProps.data.total_discounts_value }}
                            </template>
                        </Column>

                        <Column field="is_displayed" :header="t('product.isDisplayed')" :sortable="true" header-style="width:7%; min-width:7rem;">
                            <template #body="slotProps">
                                <Tag
                                    :value="slotProps.data.is_displayed ? t('yes') : t('no')"
                                    :severity="slotProps.data.is_displayed ? 'success' : 'info'"
                                />
                            </template>
                        </Column>

                        <!-- FIXED: Free Shipping Toggle Column -->
                        <Column :header="t('product.freeShipping')" header-style="width:10%; min-width:8rem;">
                            <template #body="slotProps">
                                <div class="flex justify-content-center align-items-center">
                                    <InputSwitch
                                        :model-value="slotProps.data.is_free_shipping === 1"
                                        :disabled="toggleLoading[slotProps.data.id]"
                                        @update:model-value="toggleFreeShipping(slotProps.data)"
                                        v-tooltip.top="slotProps.data.is_free_shipping === 1 ? t('product.freeShipping') : t('product.notFreeShipping')"
                                    />
                                    <ProgressSpinner
                                        v-if="toggleLoading[slotProps.data.id]"
                                        style="width: 20px; height: 20px"
                                        class="ml-2"
                                        strokeWidth="5"
                                    />
                                </div>
                            </template>
                        </Column>

                        <Column :header="t('actions')" header-style="width:14rem">
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
                                    icon="pi pi-trash mx-2"
                                    class="p-delete"
                                    @click="confirmDelete(slotProps.data.id)"
                                    v-tooltip.top="t('delete')"
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center py-4">
                                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                                <p class="text-xl">{{ t('product.noData') }}</p>
                            </div>
                        </template>

                        <template #loading>
                            <div class="flex justify-content-center align-items-center py-4">
                                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                            </div>
                        </template>
                    </DataTable>

                    <!-- Pagination -->
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

                <!-- Delete Dialog -->
                <Dialog
                    v-model:visible="deleteDialog"
                    :style="{ width: '450px' }"
                    :header="t('product.deleteConfirmTitle')"
                    :modal="true"
                >
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
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

                <!-- Import Dialog -->
                <Dialog
                    v-model:visible="importDialog"
                    :style="{ width: '450px' }"
                    :header="t('product.importTitle')"
                    :modal="true"
                >
                    <div class="flex flex-column gap-3">
                        <Button
                            :label="t('product.downloadExample')"
                            icon="pi pi-download"
                            class="p-button-outlined"
                            @click="downloadExample"
                        />
                        <FileUpload
                            mode="basic"
                            :custom-upload="true"
                            @select="onFileSelect"
                            :maxFileSize="10000000"
                            chooseLabel="Select File"
                        />
                        <div v-if="selectedFile" class="mt-2">
                            <p class="font-semibold">{{ t('selectedFile') }}: {{ selectedFile.name }}</p>
                        </div>
                    </div>
                    <template #footer>
                        <Button
                            :label="t('cancel')"
                            icon="pi pi-times"
                            class="p-button-text"
                            @click="importDialog = false"
                        />
                        <Button
                            :label="t('product.importButton')"
                            icon="pi pi-check"
                            :loading="importLoading"
                            :disabled="!selectedFile"
                            @click="importProducts"
                        />
                    </template>
                </Dialog>

                <!-- Price Update Dialog -->
                <Dialog
                    v-model:visible="priceUpdateDialog"
                    :style="{ width: '450px' }"
                    :header="t('product.updatePriceTitle')"
                    :modal="true"
                >
                    <div class="flex flex-column gap-3">
                        <Button
                            :label="t('product.downloadPriceExample')"
                            icon="pi pi-download"
                            class="p-button-outlined p-button-warning"
                            @click="downloadPriceExample"
                        />
                        <FileUpload
                            mode="basic"
                            :custom-upload="true"
                            @select="onPriceFileSelect"
                            :maxFileSize="10000000"
                            chooseLabel="Select Price File"
                        />
                    </div>
                    <template #footer>
                        <Button
                            :label="t('cancel')"
                            icon="pi pi-times"
                            class="p-button-text"
                            @click="priceUpdateDialog = false"
                        />
                        <Button
                            :label="t('product.updatePriceButton')"
                            icon="pi pi-check"
                            :loading="priceUpdateLoading"
                            :disabled="!selectedPriceFile"
                            @click="updatePrices"
                        />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
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

@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}
</style>
