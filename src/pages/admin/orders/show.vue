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

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const orderData = ref(null)
const loading = ref(true)

const fetchOrderData = () => {
  loading.value = true
  axios.get(`/api/order/${route.params.id}`)
    .then((res) => {
      orderData.value = res.data.data
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
      console.error('Error fetching order data:', error)
    })
}

const goBack = () => {
  router.push({ name: 'orders' })
}

onMounted(() => {
  fetchOrderData()
});
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toast />

        <div v-if="loading" class="flex justify-content-center align-items-center py-4">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        </div>

        <div v-else-if="orderData">
          <!-- Order Summary Card -->
          <Card class="mb-4">
            <template #title>
              <div class="flex justify-content-between align-items-center">

              </div>
            </template>
            <template #content>
              <div class="grid">
                <div class="col-12 md:col-6">
                  <p class="my-1"><strong>{{ t('order.totalPrice') }}:</strong> ${{ orderData.total_price }}</p>
                  <p>
                    <strong>{{ t('order.status') }}:</strong>
                    <Tag
                      :value="orderData.status === 0 ? t('order.pending') : t('order.completed')"
                      :severity="orderData.status === 0 ? 'warning' : 'success'"
                    />
                  </p>
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
                responsive-layout="scroll"
                stripedRows
                showGridlines
                class="p-datatable-sm"
              >
                <Column field="id" :header="t('order.itemId')" :sortable="true" header-style="width:10%; min-width:8rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.id }}
                  </template>
                </Column>

                <Column field="product.name_en" :header="t('order.productName')" :sortable="true" header-style="width:20%; min-width:12rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.product.name_en }}
                  </template>
                </Column>

                <Column field="quantity" :header="t('order.quantity')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.quantity }}
                  </template>
                </Column>

                <Column field="price" :header="t('order.price')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    ${{ slotProps.data.price }}
                  </template>
                </Column>

                <Column :header="t('order.image')" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    <img
                      v-if="slotProps.data.product.media[0]?.url"
                      :src="slotProps.data.product.media[0].url"
                      alt="Product Image"
                      class="w-1rem h-1rem object-cover border-round"
                    />
                    <span v-else>{{ t('order.noImage') }}</span>
                  </template>
                </Column>

                <template #empty>
                  <div class="text-center py-4">
                    <i class="pi pi-exclamation-circle text-2xl mb-2" />
                    <p class="text-xl">{{ t('order.noItems') }}</p>
                  </div>
                </template>
              </DataTable>
            </template>
          </Card>
        </div>

        <div v-else class="text-center py-4">
          <i class="pi pi-exclamation-circle text-2xl mb-2" />
          <p class="text-xl">{{ t('order.noData') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-8rem {
  width: 8rem;
}
.h-8rem {
  height: 8rem;
}
</style>
