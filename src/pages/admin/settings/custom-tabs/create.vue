<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

// Form state
const formData = ref({
  belongs_to: null,
  model_id: null,
  name_en: '',
  name_ar: '',
  type: null,
  row_type: null
});

// Dropdown options
const belongsToOptions = ref([
  { label: 'Store', value: 'store' },
  { label: 'Category', value: 'category' },
  { label: 'Market', value: 'market' }
]);

const typeOptions = ref([
  { label: 'Categories', value: 1 },
  { label: 'Products', value: 2 },
  { label: 'Brand', value: 3 }
]);

const rowTypeOptions = ref([
  { label: 'Single Row', value: 1 },
  { label: 'Double Rows', value: 2 }
]);

const stores = ref([]);
const categories = ref([]);
const markets = ref([]); // Renamed from brands for consistency
const modelOptions = ref([]);

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

// Loading state
const loading = ref(false);

// Search queries for server-side filtering
const storeSearchQuery = ref('');
const categorySearchQuery = ref('');
const marketSearchQuery = ref('');

// Fetch dropdown data
const fetchStores = async () => {
  try {
    const response = await axios.get('/api/store', {
      params: {
        search: storeSearchQuery.value || undefined
      }
    });
    stores.value = response.data.data.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.storeLoad'), life: 3000 });
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/category', {
      params: {
        search: categorySearchQuery.value || undefined
      }
    });
    categories.value = response.data.data.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.categoryLoad'), life: 3000 });
  }
};

const fetchMarkets = async () => { // Renamed from fetchmarket
  try {
    const response = await axios.get('/api/market', {
      params: {
        search: marketSearchQuery.value || undefined
      }
    });
    markets.value = response.data.data.data; // Renamed from brands
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.marketLoad'), life: 3000 }); // Updated detail
  }
};

const fetchModelOptions = async () => {
  try {
    let endpoint = '';
    if (formData.value.type === 1) endpoint = '/api/category';
    else if (formData.value.type === 2) endpoint = '/api/product';
    else if (formData.value.type === 3) endpoint = '/api/brand';

    if (endpoint) {
      const response = await axios.get(endpoint);
      modelOptions.value = response.data.data.data;
    } else {
      modelOptions.value = [];
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.modelLoad'), life: 3000 });
  }
};

// Handle model filter input for server-side search
const onModelFilter = (event) => {
  const searchValue = event.value;
  if (formData.value.belongs_to === 'store') {
    storeSearchQuery.value = searchValue;
    fetchStores();
  } else if (formData.value.belongs_to === 'category') {
    categorySearchQuery.value = searchValue;
    fetchCategories();
  } else if (formData.value.belongs_to === 'market') {
    marketSearchQuery.value = searchValue;
    fetchMarkets();
  }
};

// Watch for changes in belongs_to to reset model_id and type, and reset search queries
const resetFormFields = () => {
  formData.value.model_id = null;
  formData.value.type = null;
  modelOptions.value = [];
  // Reset search queries when belongs_to changes
  storeSearchQuery.value = '';
  categorySearchQuery.value = '';
  marketSearchQuery.value = '';
};

// Watch for changes in type to fetch model options
const updateModelOptions = async () => {
  if (formData.value.type) {
    await fetchModelOptions();
  } else {
    modelOptions.value = [];
    formData.value.model_id = null;
  }
};

// Fetch initial data on mount
onMounted(() => {
  fetchStores();
  fetchCategories();
  fetchMarkets();
});

// Form submission
const submitForm = async () => {
  const requiredFields = ['belongs_to', 'model_id', 'name_en', 'name_ar', 'type', 'row_type'];

  // Validate required fields
  if (requiredFields.some(field => !formData.value[field])) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.requiredFields'), life: 3000 });
    return;
  }

  loading.value = true;
  try {
    await axios.post('/api/custom-tabs', formData.value);

    toast.add({ severity: 'success', summary: t('success'), detail: t('customTabs.createSuccess'), life: 3000 });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.createError'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-can="'create custom tabs'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg" :dir="isRTL ? 'rtl' : 'ltr'">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('customTabs.createTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Belongs To Selection -->
        <div class="space-y-2">
          <label for="belongs_to" class="block text-sm font-medium text-gray-700">
            {{ t('customTabs.belongsTo') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="belongs_to"
            v-model="formData.belongs_to"
            :options="belongsToOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            :class="{ 'p-invalid': !formData.belongs_to }"
            @change="resetFormFields"
          />
        </div>

        <!-- Type Selection -->
        <div class="space-y-2">
          <label for="type" class="block text-sm font-medium text-gray-700">
            {{ t('customTabs.type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="type"
            v-model="formData.type"
            :options="typeOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            :class="{ 'p-invalid': !formData.type }"
            @change="updateModelOptions"
          />
        </div>

        <!-- Model ID Selection -->
        <div class="space-y-2">
          <label for="model_id" class="block text-sm font-medium text-gray-700">
            {{ t('customTabs.modelId') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="model_id"
            v-model="formData.model_id"
            :options="formData.belongs_to === 'store' ? stores : formData.belongs_to === 'category' ? categories : markets"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
            :class="{ 'p-invalid': !formData.model_id }"
            :disabled="!formData.belongs_to"
            filter
            @filter="onModelFilter"
          />
        </div>

        <!-- Row Type Selection -->
        <div class="space-y-2">
          <label for="row_type" class="block text-sm font-medium text-gray-700">
            {{ t('customTabs.rowType') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="row_type"
            v-model="formData.row_type"
            :options="rowTypeOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            :class="{ 'p-invalid': !formData.row_type }"
          />
        </div>

        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ t('customTabs.nameEn') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="formData.name_en"
            class="w-full"
            :class="{ 'p-invalid': !formData.name_en }"
          />
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('customTabs.nameAr') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            dir="rtl"
            class="w-full"
            :class="{ 'p-invalid': !formData.name_ar }"
          />
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('customTabs.cancelButton')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="p-button-outlined p-button-secondary text-sm mx-1"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('customTabs.createButton')"
          icon="pi pi-check"
          :loading="loading"
          class="p-button-success text-sm"
        />
      </div>
    </form>

    <Toast />
  </div>
</template>

<style scoped>
.p-dropdown, .p-inputtext {
  width: 100%;
}

.p-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.p-invalid {
  border-color: #bab0af !important;
}
</style>
