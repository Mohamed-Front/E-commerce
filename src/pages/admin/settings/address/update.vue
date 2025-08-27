```vue
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

// Form Data
const addressData = ref({
  user_id: null,
  address_line_1: '',
  address_line_2: '',
  city: '',
  country: '',
  zip_code: '',
  is_default: false,
  lat: 31.984983325941823, // Default coordinates
  long: 35.900908045672196,
  distance: 1000, // Default distance in meters
});

// Computed property for Google Maps Circle
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

// Fetch users for dropdown
const fetchUsers = () => {
  axios.get('api/user')
    .then((res) => {
      users.value = res.data.data.data;
      fetchAddress();
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('address.failed_to_load_users'),
        life: 3000,
      });
      router.push({ name: 'address' });
    });
};

// Fetch address data
const fetchAddress = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/address/${addressId.value}`);
    addressData.value = {
      ...response.data.data,
      is_default: response.data.data.is_default == '1' ? true : false,
      lat: response.data.data.lat || 31.984983325941823,
      long: response.data.data.long || 35.900908045672196,
      distance: response.data.data.distance || 1000,
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

// Handle map click to update lat and long
function handleMapClick(event) {
  const clickedLatLng = event.latLng;
  addressData.value.lat = clickedLatLng.lat();
  addressData.value.long = clickedLatLng.lng();
}

// Submit form
const submitForm = async () => {
  loading.value = true;
  try {
    // Validation
    if (!addressData.value.user_id || !addressData.value.address_line_1 || !addressData.value.city || !addressData.value.country) {
      toast.add({
        severity: 'error',
        summary: t('validation_error'),
        detail: t('address.required_fields_missing'),
        life: 3000,
      });
      return;
    }
    if (addressData.value.lat < -90 || addressData.value.lat > 90) {
      toast.add({
        severity: 'error',
        summary: t('validation_error'),
        detail: t('address.invalid_lat'),
        life: 3000,
      });
      return;
    }
    if (addressData.value.long < -180 || addressData.value.long > 180) {
      toast.add({
        severity: 'error',
        summary: t('validation_error'),
        detail: t('address.invalid_long'),
        life: 3000,
      });
      return;
    }
    if (addressData.value.distance <= 0) {
      toast.add({
        severity: 'error',
        summary: t('validation_error'),
        detail: t('address.invalid_distance'),
        life: 3000,
      });
      return;
    }

    // Convert is_default to string '1' or '0'
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
  fetchUsers();
});
</script>

<template>
  <div v-can="'edit address'" class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t('address.update_address') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- User Selection -->
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
            :placeholder="$t('user.name')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Country -->
        <div class="space-y-2">
          <label for="country" class="block text-sm font-medium text-gray-700">
            {{ $t('address.country') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="country"
            v-model="addressData.country"
            :placeholder="$t('address.enter_country')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- lat -->
        <div class="space-y-2">
          <label for="lat" class="block text-sm font-medium text-gray-700">
            {{ $t('address.lat') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="lat"
            v-model="addressData.lat"
            :placeholder="$t('address.enter_lat')"
            :min="-90"
            :max="90"
            :step="0.000001"
            :decimalPlaces="6"
            class="w-full"
            required
          />
        </div>

        <!-- long -->
        <div class="space-y-2">
          <label for="long" class="block text-sm font-medium text-gray-700">
            {{ $t('address.long') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="long"
            v-model="addressData.long"
            :placeholder="$t('address.enter_long')"
            :min="-180"
            :max="180"
            :step="0.000001"
            :decimalPlaces="6"
            class="w-full"
            required
          />
        </div>

        <!-- Distance -->
        <div class="space-y-2">
          <label for="distance" class="block text-sm font-medium text-gray-700">
            {{ $t('address.distance') }} (meters) <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="distance"
            v-model="addressData.distance"
            :placeholder="$t('address.enter_distance')"
            :min="0"
            :step="100"
            class="w-full"
            required
          />
        </div>

        <!-- Default Address -->
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="w-5 h-5 mx-2" v-model="addressData.is_default" :binary="true" />
            <span class="text-sm font-medium text-gray-700">{{ $t('address.set_as_default') }}</span>
          </label>
        </div>
      </div>

      <!-- Google Map -->
      <div class="mt-6 card">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('address.select_location') }}</h2>
        <GoogleMap
          @click="handleMapClick"
          style="width: 100%; height: 500px"
          :center="{ lat: parseFloat(addressData.lat), lng: parseFloat(addressData.long) }"
          :zoom="14"
        >
          <Marker :options="{ position: { lat: parseFloat(addressData.lat), lng: parseFloat(addressData.long) } }" />
          <Circle :options="circle" />
        </GoogleMap>
      </div>

      <!-- Action Buttons -->
      <div class="pt-4 flex justify-between">
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
          :disabled="loading"
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
/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

/* Input styling */
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-inputnumber) {
  width: 100%;
}

/* Card styling */
.card {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
```
