<template>
  <div class="grid">
    <div class="col-12">
      <Toast />
      <Card class="shadow-4">
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <div>
              <h2 class="m-0">{{ t('invoice.details') }} #{{ invoice?.number }}</h2>
            </div>
            <div>
              <Button
                :label="t('print')"
                icon="pi pi-print"
                class="p-button-success mr-2"
                @click="printInvoice"
              />

            </div>
          </div>
        </template>

        <template #content>
          <!-- Loading -->
          <div v-if="loading" class="flex justify-content-center py-8">
            <ProgressSpinner />
          </div>

          <!-- Invoice Content -->
          <div v-else-if="invoice" class="invoice-content" dir="auto">
            <!-- Header -->
            <div class="grid mb-5">
              <div class="col-6">
                <h3 class="text-primary">{{ t('invoice.invoice') }}</h3>
                <p><strong>{{ t('invoice.number') }}:</strong> {{ invoice.number }}</p>
                <p><strong>{{ t('invoice.date') }}:</strong> {{ invoice.created_at}}</p>
              </div>
              <div class="col-6 text-right">
                <p><strong>{{ t('name') }}:</strong> {{ invoice.user?.name || '-' }}</p>

              </div>
            </div>

            <Divider />

            <!-- Items Table -->
            <h4 class="mb-3">{{ t('invoice.items') }}</h4>
            <DataTable :value="invoice.items" responsiveLayout="scroll">
              <Column header="#" headerStyle="width: 3rem">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>

              <Column :header="t('product')">
                <template #body="slotProps">
                  <div class="flex align-items-center gap-3">

                    <div>
                      <div class="font-medium">
                        {{ getProductName(slotProps.data.product) }}
                      </div>
                      <small class="text-500">
                        {{ lang === 'ar' ? slotProps.data.product.sub_name_ar : slotProps.data.product.sub_name_en }}
                      </small>
                    </div>
                  </div>
                </template>
              </Column>

              <Column field="quantity" :header="t('quantity')" style="width: 100px; text-align: center" />

              <Column :header="t('price')">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.price) }}
                </template>
              </Column>

              <Column :header="t('total')">
                <template #body="slotProps">
                  <strong>{{ formatCurrency(parseFloat(slotProps.data.price) * slotProps.data.quantity) }}</strong>
                </template>
              </Column>
            </DataTable>

            <Divider />

            <!-- Summary -->
            <div class="grid">
              <div class="col-12 md:col-6"></div>
              <div class="col-12 md:col-6">
                <div class="bg-gray-50 border-round p-4">
                  <div class="flex justify-content-between mb-2">
                    <span>{{ t('invoice.subTotal') }}</span>
                    <strong>{{ formatCurrency(invoice.sub_total_price) }}</strong>
                  </div>
                  <div class="flex justify-content-between mb-2">
                    <span>{{ t('invoice.tax') }}</span>
                    <strong>{{ formatCurrency(invoice.tax_fee) }}</strong>
                  </div>
                  <div class="flex justify-content-between mb-2">
                    <span>{{ t('invoice.deliveryFee') }}</span>
                    <strong>{{ formatCurrency(invoice.delivery_fee) }}</strong>
                  </div>
                  <div class="flex justify-content-between mb-2">
                    <span>{{ t('invoice.serviceFee') }}</span>
                    <strong>{{ formatCurrency(invoice.service_fee) }}</strong>
                  </div>
                  <div class="flex justify-content-between mb-2">
                    <span>{{ t('invoice.coupon') }}</span>
                    <strong>-{{ formatCurrency(invoice.coupon) }}</strong>
                  </div>

                  <Divider class="my-3" />

                  <div class="flex justify-content-between text-xl">
                    <strong>{{ t('invoice.total') }}</strong>
                    <strong class="text-primary">{{ formatCurrency(invoice.total_price) }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Note -->
            <div class="text-center mt-6 text-600">
              <p>{{ t('invoice.thankYou') }}</p>
            </div>
          </div>

          <!-- No Data -->
          <div v-else class="text-center py-8 text-600">
            <i class="pi pi-exclamation-triangle text-5xl mb-3"></i>
            <p class="text-xl">{{ t('invoice.notFound') }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>

  <!-- Print Window (Hidden) -->
  <div id="print-section" class="hidden">
    <div class="p-8" dir="auto">
      <h1 class="text-3xl font-bold text-center mb-6">{{ t('invoice.invoice') }} #{{ invoice?.number }}</h1>
      <div class="grid">
        <div class="col-6">
          <p><strong>{{ t('invoice.number') }}:</strong> {{ invoice?.number }}</p>
          <p><strong>{{ t('invoice.date') }}:</strong> {{ formatDate(invoice?.created_at) }}</p>
        </div>
        <div class="col-6 text-right">
          <p><strong>{{ t('customer') }}:</strong> {{ invoice?.user?.name }}</p>
        </div>
      </div>
      <table class="w-full mt-6 border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-3 text-left">#</th>
            <th class="border p-3 text-left">{{ t('product') }}</th>
            <th class="border p-3 text-center">{{ t('quantity') }}</th>
            <th class="border p-3 text-right">{{ t('price') }}</th>
            <th class="border p-3 text-right">{{ t('total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in invoice?.items" :key="i">
            <td class="border p-3">{{ i + 1 }}</td>
            <td class="border p-3">{{ getProductName(item.product) }}</td>
            <td class="border p-3 text-center">{{ item.quantity }}</td>
            <td class="border p-3 text-right">{{ formatCurrency(item.price) }}</td>
            <td class="border p-3 text-right font-bold">
              {{ formatCurrency(parseFloat(item.price) * item.quantity) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-right mt-6 text-xl">
        <p><strong>{{ t('invoice.total') }}:</strong> {{ formatCurrency(invoice?.total_price) }}</p>
      </div>
      <div class="text-center mt-8 text-gray-600">
        <p>{{ t('invoice.thankYou') }}</p>
      </div>
    </div>
  </div>
</template>

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
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const invoice = ref(null)
const loading = ref(true)
const lang = localStorage.getItem('appLang') || 'en'

const fetchInvoice = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/invoice/${route.params.id}`)
    if (res.data?.is_success && res.data?.data) {
      invoice.value = res.data.data
    } else {
      throw new Error(res.data?.message || 'No data')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invoice.loadError') || 'Failed to load invoice',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const getProductName = (product) => {
  return lang === 'ar' ? product.name_ar : product.name_en
}

const getProductImage = (product) => {
  if (product.media?.[0]?.url) return product.media[0].url
  return product.key_default_image || '/images/no-image.png'
}

const formatCurrency = (value) => {
  return `${parseFloat(value || 0).toFixed(2)} ${t('currencyLabel')}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar' : 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const printInvoice = () => {
  const printContent = document.getElementById('print-section').innerHTML
  const win = window.open('', '', 'height=800,width=1000')
  win.document.write(`
    <html>
      <head>
        <title>Invoice ${invoice.value?.number}</title>
        <style>
          body { font-family: DejaVu Sans, sans-serif; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f4f4f4; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}

const goBack = () => {
  router.push({ name: 'invoices' }) // or 'orders'
}

onMounted(() => {
  fetchInvoice()
})
</script>

<style scoped>
@media print {
  .hidden {
    display: block !important;
  }
  body > *:not(#print-section) {
    display: none !important;
  }
  #print-section {
    display: block !important;
  }
}
</style>
