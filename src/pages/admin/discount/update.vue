<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import moment from 'moment';

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const models = ref([]);

// Form Data
const discountData = ref({
  model_id: '',
  model_type: '',
  discount_type: null,
  discount_value: '',
  expires_at: ''
});

onMounted(() => {
  getModels();
  getDiscount();
});

// Fetch models
const getModels = () => {
  axios.get('api/model').then((res) => {
    models.value = res.data.data.data;
  });
};

// Fetch discount data by ID
const getDiscount = () => {
  const id = route.params.id;
  axios.get(`/api/discount/${id}`).then((res) => {
    const data = res.data.data;
    discountData.value = {
      model_id: data.model_id,
      model_type: data.model_type,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      expires_at: moment(data.expires_at).toDate() // Convert to Date object for Calendar
    };
  }).catch((error) => {
    console.error("Error fetching discount:", error);
    toast.add({ severity: 'error', summary: t("error"), detail: t("discount.fetch_error"), life: 3000 });
  });
};

// Submit form for update
const submitForm = async () => {
  loading.value = true;
  discountData.value.expires_at = moment(discountData.value.expires_at).format('YYYY-MM-DD');

  const formData = new FormData();
  formData.append('model_id', discountData.value.model_id);
  formData.append('model_type', discountData.value.model_type);
  formData.append('discount_type', discountData.value.discount_type);
  formData.append('discount_value', discountData.value.discount_value);
  formData.append('expires_at', discountData.value.expires_at);
  formData.append('_method', 'PUT'); // Laravel convention for PUT requests

  try {
    await axios.post(`/api/discount/${route.params.id}`, formData);
    router.push({ name: 'discount' });
    toast.add({ severity: 'success', summary: t("success"), detail: t("discount.updated_successfully"), life: 3000 });
  } catch (error) {
    console.error("Error:", error);
    toast.add({ severity: 'error', summary: t("error"), detail: error.response?.data?.message || 'An error occurred', life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div  class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t("discount.update_discount") }}</h1>

    <Form ref="form" @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Model ID -->
        <div class="space-y-2">
          <label for="model_id" class="block text-sm font-medium text-gray-700">
            {{ $t("discount.model_id") }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="model_id"
            v-model="discountData.model_id"
            :options="models"
            :optionLabel="labelField"
            optionValue="id"
            :placeholder='$t("discount.enter_model_id")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.model_id">{{ form.errors.model_id[0] }}</small>
        </div>

        <!-- Model Type -->
        <div class="space-y-2">
          <label for="model_type" class="block text-sm font-medium text-gray-700">
            {{ $t("discount.model_type") }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="model_type"
            v-model="discountData.model_type"
            :options="['product', 'category']"
            :placeholder='$t("discount.select_model_type")'
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.model_type">{{ form.errors.model_type[0] }}</small>
        </div>

        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="discount_type" class="block text-sm font-medium text-gray-700">
            {{ $t("discount.discount_type") }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="discount_type"
            v-model="discountData.discount_type"
            :options="[
              { label: $t('discount.fixed_amount'), value: 1 },
              { label: $t('discount.percentage'), value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder='$t("discount.select_discount_type")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.discount_type">{{ form.errors.discount_type[0] }}</small>
        </div>

        <!-- Discount Value -->
        <div class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ $t("discount.discount_value") }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="discount_value"
            v-model="discountData.discount_value"
            :min="0"
            :max="discountData.discount_type === 2 ? 100 : null"
            :placeholder='$t("discount.enter_discount_value")'
            class="w-full px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
          <small class="text-gray-500 text-xs" v-if="discountData.discount_type === 2">
            {{ $t("discount.percentage_note") }}
          </small>
          <small class="text-red-500 text-xs" v-if="form?.errors?.discount_value">{{ form.errors.discount_value[0] }}</small>
        </div>

        <!-- Expires At -->
        <div class="space-y-2">
          <label for="expires_at" class="block text-sm font-medium text-gray-700">
            {{ $t("discount.expiration_date") }} <span class="text-red-500">*</span>
          </label>
          <Calendar
            id="expires_at"
            v-model="discountData.expires_at"
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            :placeholder='$t("discount.select_expiration_date")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.expires_at">{{ form.errors.expires_at[0] }}</small>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="$t('discount.cancel')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 mx-2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('discount.update_discount')"
          icon="pi pi-check"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ $t("discount.update_discount") }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </Form>
  </div>
  <Toast/>
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

/* Image hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
.group:hover .group-hover\:bg-opacity-30 {
  background-color: rgba(0, 0, 0, 0.3);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
.group:hover .group-hover\:translate-y-0 {
  transform: translateY(0);
}

/* Button gradient animation */
button.bg-gradient-to-r:hover {
  background-size: 150% 100%;
}

/* Custom scrollbar for dropdowns */
:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: #3b82f6;
  border-radius: 3px;
}

/* Calendar styling */
:deep(.p-calendar) {
  width: 100%;
}
:deep(.p-datepicker) {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
