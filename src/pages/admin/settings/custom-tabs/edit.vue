<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

// Form state
const formData = ref({
  id: null,
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
const markets = ref([]);

// Search queries for server-side filtering
const storeSearchQuery = ref('');
const categorySearchQuery = ref('');
const marketSearchQuery = ref('');

// Selected model data
const selectedModel = ref(null);

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

// Loading states
const loading = ref(false);
const loadingData = ref(true);

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Fetch dropdown data
const fetchStores = async () => {
  try {
    const response = await axios.get('/api/store', {
      params: {
        search: storeSearchQuery.value || undefined
      }
    });
    stores.value = response.data.data.data || response.data.data || [];
    if (selectedModel.value && formData.value.belongs_to === 'store' && !stores.value.some(item => item.id === selectedModel.value.id)) {
      stores.value.push(selectedModel.value);
    }
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
    categories.value = response.data.data.data || response.data.data || [];
    if (selectedModel.value && formData.value.belongs_to === 'category' && !categories.value.some(item => item.id === selectedModel.value.id)) {
      categories.value.push(selectedModel.value);
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.categoryLoad'), life: 3000 });
  }
};

const fetchMarkets = async () => {
  try {
    const response = await axios.get('/api/market', {
      params: {
        search: marketSearchQuery.value || undefined
      }
    });
    markets.value = response.data.data.data || response.data.data || [];
    if (selectedModel.value && formData.value.belongs_to === 'market' && !markets.value.some(item => item.id === selectedModel.value.id)) {
      markets.value.push(selectedModel.value);
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.marketLoad'), life: 3000 });
  }
};

// Debounced fetch functions
const debouncedFetchStores = debounce(fetchStores, 300);
const debouncedFetchCategories = debounce(fetchCategories, 300);
const debouncedFetchMarkets = debounce(fetchMarkets, 300);

// Handle model filter input for server-side search
const onModelFilter = (event) => {
  const searchValue = event.value;
  if (formData.value.belongs_to === 'store') {
    storeSearchQuery.value = searchValue;
    debouncedFetchStores();
  } else if (formData.value.belongs_to === 'category') {
    categorySearchQuery.value = searchValue;
    debouncedFetchCategories();
  } else if (formData.value.belongs_to === 'market') {
    marketSearchQuery.value = searchValue;
    debouncedFetchMarkets();
  }
};

// Fetch custom tab data by ID
const fetchCustomTab = async (id) => {
  try {
    const response = await axios.get(`/api/custom-tabs/${id}`);
    const customTab = response.data.data;
    formData.value = {
      id: customTab.id,
      belongs_to: customTab.belongs_to,
      model_id: customTab.model?.id || null,
      name_en: customTab.name_en || '',
      name_ar: customTab.name_ar || '',
      type: customTab.type,
      row_type: customTab.row_type
    };

    if (customTab.model && customTab.belongs_to) {
      selectedModel.value = {
        id: customTab.model.id,
        name_en: customTab.model.name_en,
        name_ar: customTab.model.name_ar
      };
    }

    // Fetch the lists after setting the form data and selected model
    await Promise.all([fetchStores(), fetchCategories(), fetchMarkets()]);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.fetchCustomTab'),
      life: 3000
    });
    router.push({ name: 'custom-tabs' });
  } finally {
    loadingData.value = false;
  }
};

// Reset form fields when belongs_to changes
const resetFormFields = () => {
  formData.value.model_id = null;
  formData.value.type = null;
  storeSearchQuery.value = '';
  categorySearchQuery.value = '';
  marketSearchQuery.value = '';
};

// Computed property for model dropdown options
const modelDropdownOptions = computed(() => {
  switch (formData.value.belongs_to) {
    case 'store':
      return stores.value;
    case 'category':
      return categories.value;
    case 'market':
      return markets.value;
    default:
      return [];
  }
});

// Form submission for update
const submitForm = async () => {
  const requiredFields = ['belongs_to', 'model_id', 'name_en', 'name_ar', 'type', 'row_type'];

  // Validate required fields
  if (requiredFields.some(field => !formData.value[field] && formData.value[field] !== 0)) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.requiredFields'), life: 3000 });
    return;
  }

  loading.value = true;
  try {
    await axios.put(`/api/custom-tabs/${formData.value.id}`, formData.value);
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('customTabs.updateSuccess'),
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.updateError'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Watch for route ID changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadingData.value = true;
    fetchCustomTab(newId);
  }
}, { immediate: true });

</script>

<template>
  <div v-can="'update custom tabs'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg" :dir="isRTL ? 'rtl' : 'ltr'">
    <div v-if="loadingData" class="flex justify-center items-center h-64">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-500"></i>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('customTabs.updateTitle') }}</h1>

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
              :disabled="loading"
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
              :class="{ 'p-invalid': !formData.type && formData.type !== 0 }"
              :disabled="loading"
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
              :options="modelDropdownOptions"
              :optionLabel="labelField"
              optionValue="id"
              class="w-full"
              :class="{ 'p-invalid': !formData.model_id && formData.model_id !== 0 }"
              :disabled="!formData.belongs_to || loading"
              filter
              filterPlaceholder="Search"
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
              :class="{ 'p-invalid': !formData.row_type && formData.row_type !== 0 }"
              :disabled="loading"
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
              :disabled="loading"
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
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="pt-4 flex justify-center space-x-4">
          <Button
            type="button"
            :label="t('customTabs.cancelButton')"
            icon="pi pi-times"
            @click="router.push({ name: 'custom-tabs' })"
            class="p-button-outlined p-button-secondary text-sm mx-2"
            :disabled="loading || loadingData"
          />
          <Button
            type="submit"
            :label="t('customTabs.updateButton')"
            icon="pi pi-check"
            :loading="loading"
            class="p-button-success text-sm mx-2"
            :disabled="loadingData"
          />
        </div>
      </form>
    </div>

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
