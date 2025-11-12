<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment'; // Import Moment.js
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from "vue-router";
import { GoogleMap, Marker, Circle } from 'vue3-google-map';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);

// Form Data
const shippingData = ref({
  category_id: null,
  is_enabled: false,
  min_amount: 0,
  free_amount: 0,
  express_enabled: false,
  days: [],
  from: '',
  to: '',
  lat: 31.984983325941823, // Default coordinates
  long: 35.900908045672196,
  distance: 1000, // Default distance in meters
  zones: []
});

// Computed property for Google Maps Circle
const circle = computed(() => {
  const distance = Number(shippingData.value.distance) || 1000;
  return {
    center: { lat: Number(shippingData.value.lat), lng: Number(shippingData.value.long) },
    radius: distance,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  };
});

// Available stores
const stores = ref([]);

// Days options for MultiSelect
// Days options for MultiSelect
const dayOptions = computed(() => [
  { label: t('days.sunday'), value: 0 },
  { label: t('days.monday'), value: 1 },
  { label: t('days.tuesday'), value: 2 },
  { label: t('days.wednesday'), value: 3 },
  { label: t('days.thursday'), value: 4 },
  { label: t('days.friday'), value: 5 },
  { label: t('days.saturday'), value: 6 }
]);
// Fetch stores
;

// Fetch shipping setting data
const fetchShippingSetting = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/category/shipping/setting/show/${route.params.id}`);
    const data = response.data.data.category_shipping_setting;
    shippingData.value.category_id=route.params.id
    if(response.data.data.category_shipping_setting)
    shippingData.value = {
      category_id:route.params.id,
      is_enabled: data.is_enabled,
      min_amount: parseFloat(data.min_amount),
      free_amount: parseFloat(data.free_amount),
      express_enabled: data.express_enabled,
      days: Array.isArray(data.days) ? data.days : JSON.parse(data.days || '[]'), // Ensure days is an array
      from: data.from ? moment(data.from, 'H:mm').format('HH:mm') : '', // Format time with Moment.js
      to: data.to ? moment(data.to, 'H:mm').format('HH:mm') : '', // Format time with Moment.js
      lat: parseFloat(data.lat),
      long: parseFloat(data.long),
      distance: parseFloat(data.distance || 1000),
      zones: data.zones.map(zone => ({
        from: parseFloat(zone.from),
        to: parseFloat(zone.to),
        fee: parseFloat(zone.fee),
        express_time: parseInt(zone.express_time),
        express_fee: parseFloat(zone.express_fee)
      }))
    };
  } catch (error) {
    console.error('Error fetching shipping setting:', error);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('shippingSetting.loadError'),
      life: 3000
    });
    router.push({ name: 'shipping-settings' });
  } finally {
    loading.value = false;
  }
};

// Handle map click to update lat and long
function handleMapClick(event) {
  const clickedLatLng = event.latLng;
  shippingData.value.lat = clickedLatLng.lat();
  shippingData.value.long = clickedLatLng.lng();
}

// Add new zone
const addZone = () => {
  shippingData.value.zones.push({ from: 0, to: 0, fee: 0, express_time: 0, express_fee: 0 });
};

// Remove zone
const removeZone = (index) => {
  if (shippingData.value.zones.length > 1) {
    shippingData.value.zones.splice(index, 1);
  } else {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('shippingSetting.atLeastOneZone'),
      life: 3000
    });
  }
};



// Submit form
const submitForm = async () => {
  loading.value = true;
  try {



    await axios.post(`/api/category/shipping/setting/update`, shippingData.value, {

    });

    toast.add({
      severity: 'success',
      summary: t("success"),
      detail: t("shippingSetting.updatedSuccess"),
      life: 3000
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error.response?.data?.message || t("shippingSetting.updateError");
    const errors = error.response?.data?.errors || {};
    let detailedError = errorMessage;
    if (Object.keys(errors).length > 0) {
      detailedError = Object.values(errors).flat().join(' ');
    }
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: detailedError,
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchShippingSetting();
});
</script>

<template>
  <div v-can="'edit shipping settings'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('shippingSetting.editTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">



        <!-- Min Amount -->
        <div class="space-y-2">
          <label for="min_amount" class="block text-sm font-medium text-gray-700">
            {{ t('shippingSetting.minAmount') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="min_amount"
            v-model="shippingData.min_amount"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :placeholder="t('shippingSetting.enterMinAmount')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Free Amount -->
        <div class="space-y-2">
          <label for="free_amount" class="block text-sm font-medium text-gray-700">
            {{ t('shippingSetting.freeAmount') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="free_amount"
            v-model="shippingData.free_amount"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :placeholder="t('shippingSetting.enterFreeAmount')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>



        <!-- Days -->
        <div class="space-y-2">
          <label for="days" class="block text-sm font-medium text-gray-700">
            {{ t('shippingSetting.days') }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            id="days"
            v-model="shippingData.days"
            :options="dayOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('shippingSetting.selectDays')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- From Time -->
        <div class="space-y-2">
          <label for="from" class="block text-sm font-medium text-gray-700">
            {{ t('shippingSetting.fromTime') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="from"
            v-model="shippingData.from"
            type="time"
            :placeholder="t('shippingSetting.enterFromTime')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- To Time -->
        <div class="space-y-2">
          <label for="to" class="block text-sm font-medium text-gray-700">
            {{ t('shippingSetting.toTime') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="to"
            v-model="shippingData.to"
            type="time"
            :placeholder="t('shippingSetting.enterToTime')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

 <!-- Is Enabled -->
       <div class="flex ">
         <div class="space-y-4 my-auto">
          <div class="flex items-center space-x-4">
            <label class="block text-sm font-medium text-gray-700 mx-2">{{ t('shippingSetting.isEnabled') }}</label>
            <InputSwitch v-model="shippingData.is_enabled" />
          </div>
        </div>
        <!-- Express Enabled -->
        <div class="space-y-4 my-auto">
          <div class="flex items-center space-x-4">
            <label class="block text-sm font-medium text-gray-700 mx-2">{{ t('shippingSetting.expressEnabled') }}</label>
            <InputSwitch v-model="shippingData.express_enabled" />
          </div>
        </div>
       </div>


        <!-- Google Map -->
        <div class="space-y-2 md:col-span-2">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ t('shippingSetting.select_location') }}</h2>
          <GoogleMap
            @click="handleMapClick"
            style="width: 100%; height: 500px"
            :center="{ lat: parseFloat(shippingData.lat), lng: parseFloat(shippingData.long) }"
            :zoom="14"
          >
            <Marker :options="{ position: { lat: parseFloat(shippingData.lat), lng: parseFloat(shippingData.long) } }" />
            <Circle :options="circle" />
          </GoogleMap>
        </div>

        <!-- Zones -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('shippingSetting.zones') }}</label>
          <div v-for="(zone, index) in shippingData.zones" :key="index" class="border p-4 rounded-lg mb-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label :for="'zone_from_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('shippingSetting.zoneFrom') }}
                </label>
                <InputNumber
                  :id="'zone_from_' + index"
                  v-model="zone.from"
                  mode="decimal"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  :placeholder="t('shippingSetting.enterZoneFrom')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div class="space-y-2">
                <label :for="'zone_to_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('shippingSetting.zoneTo') }}
                </label>
                <InputNumber
                  :id="'zone_to_' + index"
                  v-model="zone.to"
                  mode="decimal"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  :placeholder="t('shippingSetting.enterZoneTo')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div class="space-y-2">
                <label :for="'zone_fee_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('shippingSetting.fee') }}
                </label>
                <InputNumber
                  :id="'zone_fee_' + index"
                  v-model="zone.fee"
                  mode="decimal"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  :placeholder="t('shippingSetting.enterFee')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div class="space-y-2">
                <label :for="'zone_express_time_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('shippingSetting.expressTime') }}
                </label>
                <InputNumber
                  :id="'zone_express_time_' + index"
                  v-model="zone.express_time"
                  :placeholder="t('shippingSetting.enterExpressTime')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div class="space-y-2">
                <label :for="'zone_express_fee_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('shippingSetting.expressFee') }}
                </label>
                <InputNumber
                  :id="'zone_express_fee_' + index"
                  v-model="zone.express_fee"
                  mode="decimal"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  :placeholder="t('shippingSetting.enterExpressFee')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div class="flex items-center">
                <Button
                  icon="pi pi-trash"
                  class="p-button-danger p-button-text"
                  @click="removeZone(index)"
                  :disabled="shippingData.zones.length === 1"
                />
              </div>
            </div>
          </div>
          <Button
            :label="t('shippingSetting.addZone')"
            icon="pi pi-plus"
            class="p-button-outlined"
            @click="addZone"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('cancel')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 py-3 bg-gray-200 mx-2 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('shippingSetting.updateShipping')"
          icon="pi pi-check"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r mx-2 from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('shippingSetting.updateShipping') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
  </div>
  <Toast/>
</template>
