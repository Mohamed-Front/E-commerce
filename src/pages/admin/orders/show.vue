<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import Divider from 'primevue/divider'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const orderData = ref(null)
const loading = ref(true)
const isGeneratingInvoice = ref(false)

/**
 * Fetches order data from the API based on the route parameter ID.
 */
const fetchOrderData = () => {
  loading.value = true
  axios.get(`/api/order/${route.params.id}`)
    .then((res) => {
      if (res.data && res.data.data) {
        orderData.value = res.data.data
      } else {
        toast.add({
          severity: 'warn',
          summary: t('warning'),
          detail: t('order.noData'),
          life: 3000
        })
        orderData.value = null
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.loadError'),
        life: 3000
      })
      console.error('Error fetching order data:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * Generate invoice for the current order
 */
const generateInvoice = () => {
  if (!orderData.value?.id) return

  isGeneratingInvoice.value = true
  axios.post('/api/invoice', { order_id: orderData.value.id })
    .then((res) => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('order.invoiceSuccess'),
        life: 5000
      })

      // Optional: Open generated invoice if URL is returned
      if (res.data?.invoice_url) {
        window.open(res.data.invoice_url, '_blank')
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.invoiceError'),
        life: 5000
      })
      console.error('Error generating invoice:', error)
    })
    .finally(() => {
      isGeneratingInvoice.value = false
    })
}

/**
 * Go back to orders list
 */
const goBack = () => {
  router.push({ name: 'orders' })
}

onMounted(() => {
  fetchOrderData()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">

        <Toast />

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-content-center align-items-center py-8">
          <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="5" />
        </div>

        <!-- Order Data Loaded -->
        <div v-else-if="orderData">
          <!-- Header Actions -->
          <div class="flex justify-content-between align-items-center mb-5">
            <Button
              :label="t('common.back')"
              icon="pi pi-arrow-left"
              @click="goBack"
              class="p-button-text p-button-secondary"
            />
            <Button
              :label="t('order.generateInvoice')"
              icon="pi pi-file-pdf"
              @click="generateInvoice"
              :loading="isGeneratingInvoice"
              class="p-button-success"
            />
          </div>

          <!-- Order Summary Card -->
          <Card class="mb-5">
            <template #title>
              <div class="flex align-items-center gap-3">
                <span class="text-2xl font-bold">{{ t('order.detailTitle') }}</span>
                <small class="text-500">ID: {{ orderData.id }}</small>
              </div>
            </template>

            <template #content>
              <div class="grid">
                <!-- Financial Summary -->
                <div class="col-12 lg:col-6">
                  <h4 class="text-lg font-semibold mb-3 text-primary">
                    {{ t('order.financialSummary') }}
                  </h4>
                  <div class="space-y-2">
                    <p><strong>{{ t('order.subTotalPrice') }}:</strong> {{ orderData.sub_total_price }} {{ $t('currencyLabel') }}</p>
                    <p><strong>{{ t('order.taxFee') }}:</strong> {{ orderData.tax_fee }} {{ $t('currencyLabel') }}</p>
                    <p><strong>{{ t('order.serviceFee') }}:</strong> {{ orderData.service_fee }} {{ $t('currencyLabel') }}</p>
                    <p><strong>{{ t('order.deliveryFee') }}:</strong> {{ orderData.delivery_fee }} {{ $t('currencyLabel') }}</p>
                    <p><strong>{{ t('order.coupon') }}:</strong> -{{ orderData.coupon }} {{ $t('currencyLabel') }}</p>
                    <Divider class="my-3" />
                    <p class="text-xl font-bold text-primary">
                      {{ t('order.totalPrice') }}: {{ orderData.total_price }} {{ $t('currencyLabel') }}
                    </p>
                  </div>
                </div>

                <!-- General Info -->
                <div class="col-12 lg:col-6">
                  <h4 class="text-lg font-semibold mb-3 text-primary">
                    {{ t('order.generalInfo') }}
                  </h4>
                  <div class="space-y-3">
                    <p><strong>{{ t('order.userId') }}:</strong> {{ orderData.user_id }}</p>
                    <p class="flex align-items-center gap-2">
                      <strong>{{ t('order.status') }}:</strong>
                      <Tag
                        :value="orderData.status === 0 ? t('order.pending') : t('order.completed')"
                        :severity="orderData.status === 0 ? 'warning' : 'success'"
                        class="font-medium"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Order Items Table -->
          <Card>
            <template #title>
              <h3 class="text-xl font-bold">{{ t('order.items') }}</h3>
            </template>

            <template #content>
              <DataTable
                :value="orderData.order_items"
                responsiveLayout="scroll"
                stripedRows
                showGridlines
                class="p-datatable-sm"
                :pt="{ table: { class: 'text-sm' } }"
              >
                <Column field="id" :header="t('order.itemId')" sortable style="width: 10%">
                  <template #body="{ data }">{{ data.id }}</template>
                </Column>

                <Column :header="t('order.productName')" sortable style="width: 35%">
                  <template #body="{ data }">
                    {{ data.product.name_en || data.product.name || t('order.noName') }}
                  </template>
                </Column>

                <Column field="quantity" :header="t('order.quantity')" sortable style="width: 12%">
                  <template #body="{ data }">{{ data.quantity }}</template>
                </Column>

                <Column field="price" :header="t('order.price')" sortable style="width: 15%">
                  <template #body="{ data }">
                    {{ data.price }} {{ $t('currencyLabel') }}
                  </template>
                </Column>

                <Column :header="t('order.image')" style="width: 15%">
                  <template #body="{ data }">
                    <img
                      v-if="data.product.media?.[0]?.url"
                      :src="data.product.media[0].url"
                      alt="Product"
                      class="product-image shadow-2 border-round"
                    />
                    <span v-else class="text-500">{{ t('order.noImage') }}</span>
                  </template>
                </Column>

                <template #empty>
                  <div class="text-center py-6 text-600">
                    <i class="pi pi-shopping-cart text-4xl mb-3 opacity-30" />
                    <p class="text-lg font-medium">{{ t('order.noItems') }}</p>
                  </div>
                </template>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- No Data / Error State -->
        <div v-else class="text-center py-8">
          <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4 opacity-70" />
          <p class="text-xl font-medium text-700">{{ t('order.noData') }}</p>
          <Button
            :label="t('common.back')"
            icon="pi pi-arrow-left"
            @click="goBack"
            class="mt-4 p-button-outlined"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid var(--surface-200);
}

.space-y-2 > * + *,
.space-y-3 > * + * {
  margin-top: 0.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>
