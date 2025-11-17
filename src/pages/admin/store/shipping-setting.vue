<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from "vue-router";
import { GoogleMap, Marker } from 'vue3-google-map';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);

// Governorates list (Arabic + English)
const governoratesList = [
  { arabic: "عمان", english: "Amman" },
  { arabic: "البلقاء", english: "Balqa" },
  { arabic: "الزرقاء", english: "Zarqa" },
  { arabic: "مادبا", english: "Madaba" },
  { arabic: "إربد", english: "Irbid" },
  { arabic: "جرش", english: "Jerash" },
  { arabic: "عجلون", english: "Ajloun" },
  { arabic: "المفرق", english: "Mafraq" },
  { arabic: "الكرك", english: "Karak" },
  { arabic: "الطفيلة", english: "Tafila" },
  { arabic: "معان", english: "Ma'an" },
  { arabic: "العقبة", english: "Aqaba" }
];

// Form Data
const shippingData = ref({
  store_id: null,
  has_zones: false,
  is_enabled: false,
  is_free: false,
  shipping_time: '',
  free_amount: 0,
  lat: 31.984983325941823,
  long: 35.900908045672196,
  zones: [],
  governorates: [] // { governorate: "amman", fee: 100 }
});

// Computed: Format governorates for MultiSelect
const governorateOptions = computed(() => {
  return governoratesList.map(gov => ({
    label: `${gov.arabic} (${gov.english})`,
    value: gov.english.toLowerCase().replace(/[^a-z]/g, '')
  }));
});

// Fetch shipping setting data
const fetchShippingSetting = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/store/shipping/setting/show/${route.params.id}`);
    const data = response.data.data.store_shipping_setting;

    if (data) {
      shippingData.value = {
        store_id: route.params.id,
        has_zones: !!data.has_zones,
        is_enabled: !!data.is_enabled,
        is_free: !!data.is_free,
        shipping_time: data.shipping_time || '',
        free_amount: parseFloat(data.free_amount) || 0,
        lat: parseFloat(data.lat) || 31.984983325941823,
        long: parseFloat(data.long) || 35.900908045672196,
        zones: data.zones ? data.zones.map(z => ({
          from: parseFloat(z.from),
          to: parseFloat(z.to),
          fee: parseFloat(z.fee),
          express_time: parseInt(z.express_time),
          express_fee: parseFloat(z.express_fee)
        })) : [],
        governorates: data.governorates ? data.governorates.map(g => ({
          governorate: g.governorate,
          fee: parseFloat(g.fee)
        })) : []
      };
    }
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

// Handle map click
function handleMapClick(event) {
  const clickedLatLng = event.latLng;
  shippingData.value.lat = clickedLatLng.lat();
  shippingData.value.long = clickedLatLng.lng();
}

// Add zone
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

// Add governorate with default fee
const addGovernorate = (govValue) => {
  // Check if the MultiSelect value is an array (which it should be on change)
  // And find the governorates that are selected but not yet in the shippingData.governorates
  const currentGovs = shippingData.value.governorates.map(g => g.governorate);
  const selectedGovs = Array.isArray(govValue) ? govValue : [govValue]; // Ensure it's an array

  // Add newly selected governorates
  selectedGovs.forEach(gov => {
    if (!currentGovs.includes(gov)) {
      shippingData.value.governorates.push({ governorate: gov, fee: 0 });
    }
  });

  // Remove governorates that were deselected in the MultiSelect
  shippingData.value.governorates = shippingData.value.governorates.filter(g => selectedGovs.includes(g.governorate));
};

// Watch has_zones to clear zones if false
watch(() => shippingData.value.has_zones, (newVal) => {
  if (!newVal) {
    shippingData.value.zones = [];
  } else if (shippingData.value.zones.length === 0) {
     // If switching ON and zones array is empty, add a default zone
    addZone();
  }
});

// Submit form
const submitForm = async () => {
  loading.value = true;

  // Prepare payload
  const payload = {
    store_id: route.params.id, // Use route.params.id for consistency in update calls
    has_zones: shippingData.value.has_zones ? 1 : 0,
    is_enabled: shippingData.value.is_enabled ? 1 : 0,
    is_free: shippingData.value.is_free ? 1 : 0,
    shipping_time: shippingData.value.shipping_time,
    free_amount: shippingData.value.free_amount,
    lat: shippingData.value.lat.toString(),
    long: shippingData.value.long.toString(),
  };

  // Include zones only if has_zones is true
  if (shippingData.value.has_zones) {
    // Basic validation for zones (e.g., ensure all fields are filled if zones are enabled)
     if (shippingData.value.zones.length === 0) {
        toast.add({
          severity: 'error',
          summary: t("error"),
          detail: t("shippingSetting.atLeastOneZone"), // assuming you have this translation key
          life: 5000
        });
        loading.value = false;
        return;
    }
    payload.zones = shippingData.value.zones;
  }

  // Always include governorates
  payload.governorates = shippingData.value.governorates;

  try {
    await axios.post(`/api/store/shipping/setting/update`, payload);

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
  <div v-can="'edit shipping settings'" class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-100">
      <h1 class="text-4xl font-extrabold text-center mb-10 text-indigo-700 tracking-tight border-b pb-4">
        <i class="pi pi-truck mr-3 text-indigo-500"></i>{{ t('shippingSetting.editTitle') }}
      </h1>

      <form @submit.prevent="submitForm" class="space-y-10">

        <div class="p-6 border border-indigo-200 rounded-xl shadow-lg bg-indigo-50/50">
          <h2 class="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-2 flex items-center">
            <i class="pi pi-cog mr-2"></i>{{ t('shippingSetting.generalSettings') || 'General Settings' }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
              <label class="text-base font-medium text-gray-700">{{ t('shippingSetting.hasZones') }}</label>
              <InputSwitch v-model="shippingData.has_zones" />
            </div>

            <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
              <label class="text-base font-medium text-gray-700">{{ t('shippingSetting.isEnabled') }}</label>
              <InputSwitch v-model="shippingData.is_enabled" />
            </div>

            <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
              <label class="text-base font-medium text-gray-700">{{ t('shippingSetting.isFree') }}</label>
              <InputSwitch v-model="shippingData.is_free" />
            </div>

            <div class="sm:col-span-2 lg:col-span-3 space-y-2">
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
                class="w-full p-inputtext-lg"
                required
              />
            </div>

            <div class="sm:col-span-2 lg:col-span-3 space-y-2">
              <label for="shipping_time" class="block text-sm font-medium text-gray-700">
                {{ t('shippingSetting.shippingTime') }} <span class="text-red-500">*</span>
              </label>
              <InputText
                id="shipping_time"
                v-model="shippingData.shipping_time"
                :placeholder="t('shippingSetting.enterShippingTime')"
                class="w-full p-inputtext-lg"
                required
              />
            </div>
          </div>
        </div>

        <div v-if="shippingData.has_zones" class="p-6 border border-teal-200 rounded-xl shadow-lg bg-teal-50/50">
          <h2 class="text-2xl font-semibold text-teal-700 mb-6 border-b pb-2 flex items-center">
            <i class="pi pi-map-marker mr-2"></i>{{ t('shippingSetting.select_location') }}
          </h2>
          <div class="space-y-4">
            <p class="text-sm text-gray-600">
              {{ t('shippingSetting.locationHint') || 'Click on the map to set your store location (Latitude and Longitude).' }}
            </p>
            <div class="border border-teal-300 rounded-lg overflow-hidden shadow-md">
              <GoogleMap
                @click="handleMapClick"
                style="width: 100%; height: 400px"
                :center="{ lat: parseFloat(shippingData.lat), lng: parseFloat(shippingData.long) }"
                :zoom="12"
              >
                <Marker :options="{ position: { lat: parseFloat(shippingData.lat), lng: parseFloat(shippingData.long) }, label: 'Store' }" />
              </GoogleMap>
            </div>
            <div class="grid grid-cols-2 gap-4">
                 <InputText :value="shippingData.lat.toFixed(6)" readonly placeholder="Latitude" class="font-mono text-sm"/>
                 <InputText :value="shippingData.long.toFixed(6)" readonly placeholder="Longitude" class="font-mono text-sm"/>
            </div>
          </div>
        </div>

        <div class="p-6 border border-orange-200 rounded-xl shadow-lg bg-orange-50/50">
          <h2 class="text-2xl font-semibold text-orange-700 mb-6 border-b pb-2 flex items-center">
            <i class="pi pi-globe mr-2"></i>{{ t('shippingSetting.governorates') }}
          </h2>
          <div class="space-y-4">
            <MultiSelect
              :options="governorateOptions"
              optionLabel="label"
              optionValue="value"
              :modelValue="shippingData.governorates.map(g => g.governorate)"
              @update:modelValue="addGovernorate"
              :placeholder="t('shippingSetting.selectGovernorates')"
              class="w-full p-inputtext-lg"
              display="chip"
            />

            <div v-if="shippingData.governorates.length > 0" class="space-y-3 max-h-80 overflow-y-auto pr-2">
              <div v-for="gov in shippingData.governorates" :key="gov.governorate"
                   class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border shadow-sm hover:border-orange-400 transition duration-200">

                <div class="flex-1">
                  <span class="font-semibold text-lg text-gray-800">
                    {{ governoratesList.find(g => g.english.toLowerCase().replace(/[^a-z]/g, '') === gov.governorate)?.arabic || gov.governorate }}
                  </span>
                  <span class="text-sm text-gray-500 block">({{ gov.governorate }})</span>
                </div>

                <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">{{ t('shippingSetting.fee') }}:</label>
                    <InputNumber
                      v-model="gov.fee"
                      mode="decimal"
                      :minFractionDigits="2"
                      :maxFractionDigits="2"
                      :placeholder="t('shippingSetting.enterFee')"
                      class="p-inputtext-sm"
                      required
                    />
                </div>

              </div>
            </div>
            <div v-else class="p-4 bg-white rounded-lg border border-dashed text-center text-gray-500 italic">
              {{ t('shippingSetting.noGovernoratesSelected') }}
            </div>
          </div>
        </div>

        <div v-if="shippingData.has_zones" class="p-6 border border-red-300 rounded-xl shadow-lg bg-red-50/50">
          <h2 class="text-2xl font-semibold text-red-700 mb-6 border-b pb-2 flex items-center">
            <i class="pi pi-sort-numeric-up mr-2"></i>{{ t('shippingSetting.zones') }}
          </h2>
          <div class="space-y-6">
            <div v-for="(zone, index) in shippingData.zones" :key="index"
                 class="border border-red-200 p-5 rounded-lg bg-white shadow-md relative">

                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-text absolute top-2 right-2"
                    @click="removeZone(index)"
                    :disabled="shippingData.zones.length === 1"
                    v-tooltip.top="shippingData.zones.length === 1 ? t('shippingSetting.atLeastOneZone') : t('deleteZone')"
                />
                <h3 class="text-lg font-medium text-gray-600 mb-4">{{ t('shippingSetting.zone') }} #{{ index + 1 }}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

                  <div class="">
                    <label class="text-sm font-medium text-gray-700">{{ t('shippingSetting.zoneFrom') }}</label>
                    <InputNumber
                      :placeholder="t('shippingSetting.zoneFrom')"
                      v-model="zone.from"
                      mode="decimal"
                      :minFractionDigits="2"
                      required
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">{{ t('shippingSetting.zoneTo') }}</label>
                    <InputNumber
                      :placeholder="t('shippingSetting.zoneTo')"
                      v-model="zone.to"
                      mode="decimal"
                      :minFractionDigits="2"
                      required
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">{{ t('shippingSetting.fee') }}</label>
                    <InputNumber
                      :placeholder="t('shippingSetting.fee')"
                      v-model="zone.fee"
                      mode="decimal"
                      :minFractionDigits="2"
                      required
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">{{ t('shippingSetting.expressTime') }}</label>
                    <InputNumber
                      :placeholder="t('shippingSetting.expressTime')"
                      v-model="zone.express_time"
                      required
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">{{ t('shippingSetting.expressFee') }}</label>
                    <InputNumber
                      :placeholder="t('shippingSetting.expressFee')"
                      v-model="zone.express_fee"
                      mode="decimal"
                      :minFractionDigits="2"
                      required
                      class="w-full"
                    />
                  </div>

                </div>
            </div>

            <Button
              :label="t('shippingSetting.addZone')"
              icon="pi pi-plus"
              class="p-button-outlined p-button-secondary p-button-sm mt-4 hover:bg-red-100"
              @click="addZone"
            />
          </div>
        </div>

        <div class="pt-8 flex justify-center space-x-6 border-t border-gray-200">
          <Button
            type="button"
            :label="t('cancel')"
            icon="pi pi-times"
            @click="router.go(-1)"
            class="p-button-secondary p-button-lg px-6 mx-1 shadow-md hover:shadow-lg transition-all duration-300"
            :disabled="loading"
          />
          <Button
            type="submit"
            :label="t('shippingSetting.updateShipping')"
            icon="pi pi-check"
            :loading="loading"
            class="p-button-success p-button-lg px-8 bg-gradient-to-r from-indigo-500 to-blue-500 border-none hover:from-indigo-600 hover:to-blue-600 shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <span v-if="!loading">{{ t('shippingSetting.updateShipping') }}</span>
            <i v-else class="pi pi-spinner pi-spin"></i>
          </Button>
        </div>
      </form>
    </div>
  </div>
  <Toast />
</template>
