<script setup>
import { useToast } from 'primevue/usetoast'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'

const productSearch = ref('')
const router = useRouter()
const route = useRoute()
const toast = useToast()
const { t } = useI18n()

// State variables
const loading = ref(false)
const products = ref([])
const variants = ref([])
const appLanguage = ref(localStorage.getItem('appLang') || 'en')
const form = ref({
  product_id: null,
  variant_id: null,
  inventory_id: route.params.id,
  quantity: null
})

// Fetch products
const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/product', {
      params: {
        search: productSearch.value || undefined
      }
    })
    const lang = appLanguage.value
    products.value = response.data.data.data.map(product => ({
      label: lang === 'en' ? product.name_en : product.name_ar,
      value: product.id,
      variants: product.variants?.map(variant => ({
        label: lang === 'en' ? variant.name_en : variant.name_ar,
        value: variant.id
      })) || []
    }))
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('product.loadError'),
      life: 3000
    })
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

// Update variants when product changes
watch(() => form.value.product_id, (newProductId) => {
  const selectedProduct = products.value.find(p => p.value === newProductId)
  variants.value = selectedProduct ? selectedProduct.variants : []
  form.value.variant_id = null // Reset variant when product changes
})

// Watch for language changes
watch(appLanguage, () => {
  fetchProducts()
})

// Handle product search filter
const searchProducts = (event) => {
  productSearch.value = event.value // Correctly extract the search query from the filter event
  fetchProducts()
}

// Submit quantity update
const submitQuantity = () => {
  if (!form.value.product_id || !form.value.quantity) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('inventory.quantityFormIncomplete'),
      life: 3000
    })
    return
  }

  loading.value = true
  const payload = {
    product_id: form.value.product_id,
    inventory_id: form.value.inventory_id,
    quantity: form.value.quantity,
    variant_id: form.value.variant_id || undefined
  }

  axios.put('/api/inventory/update/product', payload)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('inventory.quantityUpdatedSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('inventory.quantityUpdateError'),
        life: 3000
      })
      console.error('Error updating quantity:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

// Navigate back to inventory list
const goBack = () => {
  router.push({ name: 'inventory-list' })
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="grid">
    <div class="col-12 md:col-6 md:col-offset-3">
      <Card class="p-4 shadow-2 border-round">
        <template #title>
          <h2 class="text-2xl font-bold">{{ t('inventory.quantityTitle') }}</h2>
        </template>
        <template #content>
          <Toast />
          <div v-if="loading" class="flex justify-content-center align-items-center py-4">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          </div>

          <div v-else class="p-fluid">
            <div class="field">
              <label for="product_id">{{ t('inventory.product') }}</label>
              <Dropdown
                id="product_id"
                v-model="form.product_id"
                :options="products"
                filter
                optionLabel="label"
                optionValue="value"
                :placeholder="t('inventory.selectProduct')"
                required
                @filter="searchProducts"
                v-can="'edit inventory'"
              />
            </div>
            <div class="field" v-if="variants.length > 0">
              <label for="variant_id">{{ t('inventory.variant') }}</label>
              <Dropdown
                id="variant_id"
                v-model="form.variant_id"
                :options="variants"
                optionLabel="label"
                optionValue="value"
                :placeholder="t('inventory.selectVariant')"
                :showClear="true"
                v-can="'edit inventory'"
              />
            </div>
            <div class="field">
              <label for="quantity">{{ t('inventory.quantity') }}</label>
              <InputNumber
                id="quantity"
                v-model="form.quantity"
                :min="1"
                showButtons
                required
                v-can="'edit inventory'"
              />
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-2 justify-content-end">
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="goBack"
            />
            <Button
              :label="t('save')"
              icon="pi pi-check"
              class="p-button-success"
              @click="submitQuantity"
              :disabled="loading"
              v-can="'edit inventory'"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
