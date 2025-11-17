<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { GoogleMap, Marker, Circle } from 'vue3-google-map';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);
const addressId = ref(route.params.id);
const users = ref([]);

// Jordanian Governorates (Arabic + English)
const governorates = [
  { label: 'عمان (Amman)', value: 'amman' },
  { label: 'البلقاء (Balqa)', value: 'balqa' },
  { label: 'الزرقاء (Zarqa)', value: 'zarqa' },
  { label: 'مادبا (Madaba)', value: 'madaba' },
  { label: 'إربد (Irbid)', value: 'irbid' },
  { label: 'جرش (Jerash)', value: 'jerash' },
  { label: 'عجلون (Ajloun)', value: 'ajloun' },
  { label: 'المفرق (Mafraq)', value: 'mafraq' },
  { label: 'الكرك (Karak)', value: 'karak' },
  { label: 'الطفيلة (Tafila)', value: 'tafila' },
  { label: 'معان (Ma\'an)', value: 'maan' },
  { label: 'العقبة (Aqaba)', value: 'aqaba' }
];

// Form Data
const addressData = ref({
  user_id: null,
  address_line_1: '',
  address_line_2: '',
  governorate: '',
  city: '',
  zip_code: '',
  is_default: false,
  lat: 31.984983325941823,
  long: 35.900908045672196,
  distance: 1000,
});

// Google Maps Circle
const circle = computed(() => {
  const distance = Number(addressData.value.distance) || 1000;
  return {
    center: { lat: Number(addressData.value.lat), lng: Number(addressData.value.long) },
    radius: distance,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  };
});

// Fetch Users
const fetchUsers = async () => {
  try {
    const res = await axios.get('api/user');
    users.value = res.data.data.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('address.failed_to_load_users'),
      life: 3000,
    });
    router.push({ name: 'address' });
  }
};

// Fetch Address for Edit
const fetchAddress = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/address/${addressId.value}`);
    const data = response.data.data;

    addressData.value = {
      user_id: data.user_id,
      address_line_1: data.address_line_1 || '',
      address_line_2: data.address_line_2 || '',
      governorate: data.governorate || '',
      city: data.city || '',
      country: data.country || 'Jordan',
      zip_code: data.zip_code || '',
      is_default: data.is_default === '1',
      lat: parseFloat(data.lat) || 31.984983325941823,
      long: parseFloat(data.long) || 35.900908045672196,
      distance: parseInt(data.distance) || 1000,
    };
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('address.load_error'),
      life: 3000,
    });
    router.push({ name: 'address' });
  } finally {
    loading.value = false;
  }
};

// Map Click Handler
function handleMapClick(event) {
  const clickedLatLng = event.latLng;
  addressData.value.lat = clickedLatLng.lat();
  addressData.value.long = clickedLatLng.lng();
}

// Submit Update
const submitForm = async () => {
  loading.value = true;
  try {
    // Validation
    if (!addressData.value.user_id) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.user_required'), life: 3000 });
      return;
    }
    if (!addressData.value.address_line_1) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.line1_required'), life: 3000 });
      return;
    }
    if (!addressData.value.governorate) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.governorate_required'), life: 3000 });
      return;
    }
    if (!addressData.value.city) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.city_required'), life: 3000 });
      return;
    }
    if (!addressData.value.country) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.country_required'), life: 3000 });
      return;
    }
    if (addressData.value.lat < -90 || addressData.value.lat > 90) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.invalid_lat'), life: 3000 });
      return;
    }
    if (addressData.value.long < -180 || addressData.value.long > 180) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.invalid_long'), life: 3000 });
      return;
    }
    if (addressData.value.distance <= 0) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.invalid_distance'), life: 3000 });
      return;
    }

    const payload = {
      ...addressData.value,
      is_default: addressData.value.is_default ? '1' : '0',
    };

    await axios.put(`/api/address/${addressId.value}`, payload);
    router.push({ name: 'address' });
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('address.updated_successfully'),
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('address.update_error'),
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers().then(() => {
    if (addressId.value) fetchAddress();
  });
});
</script>

<template>
  <div v-can="'edit address'" class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t('address.update_address') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <!-- User -->
        <div class="space-y-2">
          <label for="user_id" class="block text-sm font-medium text-gray-700">
            {{ $t('user.name') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            v-model="addressData.user_id"
            :options="users"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('user.select_user')"
            class="w-full"
            required
            :loading="loading"
          />
        </div>

        <!-- Address Line 1 -->
        <div class="space-y-2">
          <label for="address_line_1" class="block text-sm font-medium text-gray-700">
            {{ $t('address.line1') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="address_line_1"
            v-model="addressData.address_line_1"
            :placeholder="$t('address.enter_line1')"
            class="w-full"
            required
          />
        </div>

        <!-- Address Line 2 -->
        <div class="space-y-2">
          <label for="address_line_2" class="block text-sm font-medium text-gray-700">
            {{ $t('address.line2') }}
          </label>
          <InputText
            id="address_line_2"
            v-model="addressData.address_line_2"
            :placeholder="$t('address.enter_line2')"
            class="w-full"
          />
        </div>

        <!-- Governorate -->
        <div class="space-y-2">
          <label for="governorate" class="block text-sm font-medium text-gray-700">
            {{ $t('address.governorate') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            v-model="addressData.governorate"
            :options="governorates"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('address.select_governorate')"
            class="w-full"
            required
          />
        </div>

        <!-- City -->
        <div class="space-y-2">
          <label for="city" class="block text-sm font-medium text-gray-700">
            {{ $t('address.city') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="city"
            v-model="addressData.city"
            :placeholder="$t('address.enter_city')"
            class="w-full"
            required
          />
        </div>



        <!-- ZIP Code -->
        <div class="space-y-2">
          <label for="zip_code" class="block text-sm font-medium text-gray-700">
            {{ $t('address.zip_code') }}
          </label>
          <InputText
            id="zip_code"
            v-model="addressData.zip_code"
            :placeholder="$t('address.enter_zip_code')"
            class="w-full"
          />
        </div>

        <!-- Latitude -->
        <div class="space-y-2">
          <label for="lat" class="block text-sm font-medium text-gray-700">
            {{ $t('address.lat') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="lat"
            v-model="addressData.lat"
            :min="-90"
            :max="90"
            :step="0.000001"
            mode="decimal"
            :minFractionDigits="6"
            :maxFractionDigits="6"
            class="w-full"
            required
          />
        </div>

        <!-- Longitude -->
        <div class="space-y-2">
          <label for="long" class="block text-sm font-medium text-gray-700">
            {{ $t('address.long') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="long"
            v-model="addressData.long"
            :min="-180"
            :max="180"
            :step="0.000001"
            mode="decimal"
            :minFractionDigits="6"
            :maxFractionDigits="6"
            class="w-full"
            required
          />
        </div>

        <!-- Distance -->
        <div class="space-y-2">
          <label for="distance" class="block text-sm font-medium text-gray-700">
            {{ $t('address.distance') }} ({{ $t('address.meters') }}) <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="distance"
            v-model="addressData.distance"
            :min="1"
            :placeholder="$t('address.enter_distance')"
            class="w-full"
            required
          />
        </div>

        <!-- Default Address -->
        <div class="flex items-center space-y-2 col-span-1 lg:col-span-2">
          <input type="checkbox" v-model="addressData.is_default" class="w-5 h-5 text-blue-600 rounded" />
          <label class="ml-2 text-sm font-medium text-gray-700">{{ $t('address.set_as_default') }}</label>
        </div>
      </div>

      <!-- Google Map -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('address.select_location') }}</h2>
        <GoogleMap
          @click="handleMapClick"
          style="width: 100%; height: 500px"
          :center="{ lat: Number(addressData.lat), lng: Number(addressData.long) }"
          :zoom="14"
        >
          <Marker :options="{ position: { lat: Number(addressData.lat), lng: Number(addressData.long) } }" />
          <Circle :options="circle" />
        </GoogleMap>
      </div>

      <!-- Action Buttons -->
      <div class="pt-6 flex justify-between">
        <Button
          type="button"
          :label="$t('cancel')"
          icon="pi pi-times"
          @click="router.push({ name: 'address' })"
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow transition-all duration-300"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('update')"
          icon="pi pi-check"
          :loading="loading"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <span v-if="!loading">{{ $t('update') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
  </div>
  <Toast />
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber .p-inputtext) {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition;
}
</style>
