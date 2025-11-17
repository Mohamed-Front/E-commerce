<template>
  <div class="min-h-screen p-8 font-inter bg-gray-50" dir="rtl">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
        <ul class="space-y-2">
          <li @click="router.push({ name: 'profile' })"
              class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.55556 4.44444C5.55556 3.2657 6.02381 2.13524 6.8573 1.30175C7.6908 0.468252 8.82126 0 10 0C11.1787 0 12.3092 0.468252 13.1427 1.30175C13.9762 2.13524 14.4444 3.2657 14.4444 4.44444C14.4444 5.62318 13.9762 6.75365 13.1427 7.58714C12.3092 8.42064 11.1787 8.88889 10 8.88889C8.82126 8.88889 7.6908 8.42064 6.8573 7.58714C6.02381 6.75365 5.55556 5.62318 5.55556 4.44444ZM5.55556 11.1111C4.08213 11.1111 2.66905 11.6964 1.62718 12.7383C0.585316 13.7802 0 15.1932 0 16.6667C0 17.5507 0.35119 18.3986 0.976311 19.0237C1.60143 19.6488 2.44928 20 3.33333 20H16.6667C17.5507 20 18.3986 19.6488 19.0237 19.0237C19.6488 18.3986 20 17.5507 20 16.6667C20 15.1932 19.4147 13.7802 18.3728 12.7383C17.3309 11.6964 15.9179 11.1111 14.4444 11.1111H5.55556Z"
                    fill="#807575"/>
            </svg>
            <span>حسابي</span>
          </li>
          <li @click="router.push({ name: 'orders' })"
              class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.837143 0.689412C-8.51495e-08 1.37882 0 2.48706 0 4.70588V15.2941C0 17.5129 -8.51495e-08 18.6212 0.837143 19.3106C1.67429 20 3.02 20 5.71429 20H14.2857C16.98 20 18.3257 20 19.1629 19.3106C20 18.6212 20 17.5129 20 15.2941V4.70588C20 2.48706 20 1.37882 19.1629 0.689412C18.3257 -7.01231e-08 16.98 0 14.2857 0H5.71429C3.02 0 1.67429 -7.01231e-08 0.837143 0.689412ZM5.71429 4.70588C5.33541 4.70588 4.97204 4.82983 4.70413 5.05046C4.43622 5.27109 4.28571 5.57033 4.28571 5.88235C4.28571 6.19437 4.43622 6.49361 4.70413 6.71424C4.97204 6.93487 5.33541 7.05882 5.71429 7.05882H14.2857C14.6646 7.05882 15.028 6.93487 15.2959 6.71424C15.5638 6.49361 15.7143 5.88235C15.7143 5.57033 15.5638 5.27109 15.2959 5.05046C15.028 4.82983 14.6646 4.70588 14.2857 4.70588H5.71429ZM5.71429 9.41177C5.33541 9.41177 4.97204 9.53571 4.70413 9.75635C4.43622 9.97698 4.28571 10.2762 4.28571 10.5882C4.28571 10.9003 4.43622 11.1995 4.70413 11.4201C4.97204 11.6408 5.33541 11.7647 5.71429 11.7647H14.2857C14.6646 11.7647 15.028 11.6408 15.2959 11.4201C15.5638 11.1995 15.7143 10.9003 15.7143 10.5882C15.7143 10.2762 15.5638 9.97698 15.2959 9.75635C15.028 9.53571 14.6646 9.41177 14.2857 9.41177H5.71429ZM5.71429 14.1176C5.33541 14.1176 4.97204 14.2416 4.70413 14.4622C4.43622 14.6829 4.28571 14.9821 4.28571 15.2941C4.28571 15.6061 4.43622 15.9054 4.70413 16.126C4.97204 16.3466 5.33541 16.4706 5.71429 16.4706H11.4286C11.8075 16.4706 12.1708 16.3466 12.4387 16.126C12.7066 15.9054 12.8571 15.6061 12.8571 15.2941C12.8571 14.9821 12.7066 14.6829 12.4387 14.4622C12.1708 14.2416 11.8075 14.1176 11.4286 14.1176H5.71429Z"
                    fill="#807575"/>
            </svg>
            <span>طلباتي</span>
          </li>
          <li @click="router.push({ name: 'addres' })"
              class="p-3 rounded-lg flex items-center gap-4 bg-yellow-100 text-yellow-700 font-medium cursor-pointer">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0C6.61392 0.00245748 4.32637 0.831051 2.63915 2.30402C0.951939 3.77699 0.0028245 5.77405 9.57508e-06 7.85714C-0.00284824 9.55945 0.634084 11.2156 1.8131 12.5714C1.8131 12.5714 2.05855 12.8536 2.09864 12.8943L9 20L15.9046 12.8907C15.9406 12.8529 16.1869 12.5714 16.1869 12.5714L16.1877 12.5693C17.3661 11.214 18.0028 9.55866 18 7.85714C17.9972 5.77405 17.0481 3.77699 15.3608 2.30402C13.6736 0.831051 11.3861 0.00245748 9 0ZM9 10.7143C8.35272 10.7143 7.71997 10.5467 7.18177 10.2328C6.64358 9.91882 6.2241 9.4726 5.9764 8.95052C5.72869 8.42845 5.66388 7.85397 5.79016 7.29974C5.91644 6.74551 6.22814 6.23642 6.68583 5.83684C7.14353 5.43726 7.72668 5.16514 8.36152 5.0549C8.99637 4.94466 9.6544 5.00124 10.2524 5.21749C10.8504 5.43374 11.3616 5.79994 11.7212 6.2698C12.0808 6.73965 12.2727 7.29205 12.2727 7.85714C12.2716 8.61461 11.9265 9.34079 11.313 9.8764C10.6994 10.412 9.86765 10.7133 9 10.7143Z"
                    fill="#F9C006"/>
            </svg>
            <span>دليل العناوين</span>
          </li>
          <li @click="authStore.handleLogout()"
              class="p-3 rounded-lg flex items-center gap-4 text-red-500 hover:bg-gray-50 cursor-pointer">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20V0H9V2.22222H2V17.7778H9V20H0ZM13 15.5556L11.625 13.9444L14.175 11.1111H6V8.88889H14.175L11.625 6.05556L13 4.44444L18 10L13 15.5556Z"
                    fill="#FF1212"/>
            </svg>
            <span>تسجيل الخروج</span>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-white rounded-xl shadow-md p-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
          {{ isEditing ? $t('address.update_address') : $t('address.create_new_address') }}
        </h1>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

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
                filter
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

            <!-- Country -->
            <div class="space-y-2">
              <label for="country" class="block text-sm font-medium text-gray-700">
                {{ $t('address.country') }} <span class="text-red-500">*</span>
              </label>
              <InputText
                id="country"
                v-model="addressData.country"
                placeholder="الأردن"
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





            <!-- Default Address -->
            <div class="flex items-center">
              <input type="checkbox" v-model="addressData.is_default" class="w-5 h-5 text-blue-600 rounded" />
              <label class="mr-3 text-sm font-medium text-gray-700">
                {{ $t('address.set_as_default') }}
              </label>
            </div>
          </div>

          <!-- Google Map -->
          <div class="mt-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              {{ $t('address.select_location') }}
            </h2>
            <GoogleMap
              @click="handleMapClick"
              class="google-map rounded-lg shadow"
              :center="{ lat: Number(addressData.lat), lng: Number(addressData.long) }"
              :zoom="10"
            >
              <Marker :options="{ position: { lat: Number(addressData.lat), lng: Number(addressData.long) } }" />
              <Circle :options="circle" />
            </GoogleMap>
          </div>



          <!-- Submit Button -->
          <div class="pt-6 flex justify-center gap-4">
            <Button
              type="button"
              :label="$t('cancel')"
              icon="pi pi-times"
              @click="router.push({ name: 'addres' })"
              class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700"
            />
            <Button
              type="submit"
              :label="isEditing ? $t('address.update_address') : $t('address.create_address')"
              icon="pi pi-check"
              :loading="loading"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              <span v-if="!loading">
                {{ isEditing ? $t('address.update_address') : $t('address.create_address') }}
              </span>
              <i v-else class="pi pi-spinner pi-spin"></i>
            </Button>
          </div>
        </form>
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { GoogleMap, Marker, Circle } from 'vue3-google-map';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);
const isEditing = ref(false);

// Jordan Governorates
const governorates = [
  { label: 'عمان', value: 'amman' },
  { label: 'الزرقاء', value: 'zarqa' },
  { label: 'إربد', value: 'irbid' },
  { label: 'العقبة', value: 'aqaba' },
  { label: 'جرش', value: 'jerash' },
  { label: 'عجلون', value: 'ajloun' },
  { label: 'المفرق', value: 'mafraq' },
  { label: 'البلقاء', value: 'balqa' },
  { label: 'مادبا', value: 'madaba' },
  { label: 'الكرك', value: 'karak' },
  { label: 'الطفيلة', value: 'tafila' },
  { label: 'معان', value: 'maan' }
];

const addressData = ref({
  id: null,
  address_line_1: '',
  address_line_2: '',
  governorate: '',
  city: '',
  country: 'الأردن',
  zip_code: '',
  is_default: false,
  lat: 31.9539,
  long: 35.9106,
  distance: 2000,
});

const circle = computed(() => ({
  center: { lat: Number(addressData.value.lat), lng: Number(addressData.value.long) },
  radius: Number(addressData.value.distance) || 2000,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
}));

onMounted(() => {
  if (route.query.id) {
    isEditing.value = true;
    fetchAddress(route.query.id);
  }
});

const fetchAddress = async (id) => {
  try {
    loading.value = true;
    const { data } = await axios.get(`/api/address/${id}`);
    Object.assign(addressData.value, {
      id: data.data.id,
      address_line_1: data.data.address_line_1 || '',
      address_line_2: data.data.address_line_2 || '',
      governorate: data.data.governorate || '',
      city: data.data.city || '',
      country: data.data.country || 'الأردن',
      zip_code: data.data.zip_code || '',
      is_default: data.data.is_default === '1',
      lat: parseFloat(data.data.lat) || 31.9539,
      long: parseFloat(data.data.long) || 35.9106,
      distance: parseInt(data.data.distance) || 2000,
    });
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('address.fetch_failed'), life: 3000 });
  } finally {
    loading.value = false;
  }
};

function handleMapClick(event) {
  const { lat, lng } = event.latLng;
  addressData.value.lat = lat();
  addressData.value.long = lng();
}

const geocodeAddress = async () => {
  const address = `${addressData.value.address_line_1}, ${addressData.value.city}, ${addressData.value.governorate}, الأردن`;
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address, key: 'YOUR_GOOGLE_MAPS_API_KEY' } // استبدل بالمفتاح الحقيقي
    });
    if (data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      addressData.value.lat = lat;
      addressData.value.long = lng;
      toast.add({ severity: 'success', summary: t('success'), detail: t('address.location_found'), life: 3000 });
    } else {
      toast.add({ severity: 'warn', summary: t('warning'), detail: t('address.no_location_found'), life: 3000 });
    }
  } catch {
    toast.add({ severity: 'error', summary: t('error'), detail: t('address.geocode_failed'), life: 3000 });
  }
};

const submitForm = async () => {
  loading.value = true;
  try {
    if (!addressData.value.address_line_1 || !addressData.value.city || !addressData.value.governorate) {
      toast.add({ severity: 'error', summary: t('validation_error'), detail: t('address.required_fields_missing'), life: 3000 });
      return;
    }

    const payload = {
      ...addressData.value,
      is_default: addressData.value.is_default ? '1' : '0',
    };

    if (isEditing.value) {
      await axios.put(`/api/address/${addressData.value.id}`, payload);
      toast.add({ severity: 'success', summary: t('success'), detail: t('address.updated_successfully'), life: 3000 });
    } else {
      await axios.post('/api/address', payload);
      toast.add({ severity: 'success', summary: t('success'), detail: t('address.created_successfully'), life: 3000 });
      addressData.value = { ...addressData.value, address_line_1: '', address_line_2: '', city: '', zip_code: '', is_default: false };
    }
    router.push({ name: 'addres' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || (isEditing.value ? t('address.failed_to_update') : t('address.failed_to_create')),
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 450px;
}
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber .p-inputtext) {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition;
}
</style>
