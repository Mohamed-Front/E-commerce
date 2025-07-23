<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);
const tabsLoading = ref(false);
const storesLoading = ref(false);
const customTabs = ref([]);
const stores = ref([]);
const errors = ref({});

// Get app language from localStorage, default to 'en'
const appLanguage = ref(localStorage.getItem('appLang') || 'en');

// Form Data
const formData = ref({
  store_id: [], // Changed to array for MultiSelect
  type: null,
  name_ar: '',
  name_en: '',
  row_type: null,
});

// Type options for dropdown
const typeOptions = ref([
  { label: t('custom_tabs.categories'), value: 1 },
  { label: t('custom_tabs.products'), value: 2 },
]);

// Row type options for dropdown
const rowTypeOptions = ref([
  { label: t('custom_tabs.single_row'), value: 1 },
  { label: t('custom_tabs.double_rows'), value: 2 },
]);

// Computed property to dynamically select store name based on language
const storeNameKey = computed(() => (appLanguage.value === 'ar' ? 'name_ar' : 'name_en'));

// Fetch stores
const fetchStores = async () => {
  storesLoading.value = true;
  try {
    const res = await axios.get('/api/store');
    stores.value = res.data?.data.data || [];
    if (!stores.value.length) {
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('custom_tabs.no_stores_found'),
        life: 3000,
      });
    }
  } catch (error) {
    stores.value = [];
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.fetch_stores_failed'),
      life: 3000,
    });
  } finally {
    storesLoading.value = false;
  }
};

// Fetch existing custom tabs
const fetchCustomTabs = async () => {
  tabsLoading.value = true;
  try {
    const res = await axios.get('/api/custom-tabs');
    customTabs.value = res.data?.data.data || [];
    if (!customTabs.value.length) {
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('custom_tabs.no_tabs_found'),
        life: 3000,
      });
    }
  } catch (error) {
    customTabs.value = [];
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.fetch_failed'),
      life: 3000,
    });
  } finally {
    tabsLoading.value = false;
  }
};

// Validate form
const validateForm = () => {
  errors.value = {};
  if (!formData.value.store_id) errors.value.store_id = t('custom_tabs.store_id_required');
  if (![1, 2].includes(formData.value.type)) errors.value.type = t('custom_tabs.type_required');
  if (!formData.value.name_ar) errors.value.name_ar = t('custom_tabs.name_ar_required');
  if (!formData.value.name_en) errors.value.name_en = t('custom_tabs.name_en_required');
  if (![1, 2].includes(formData.value.row_type)) errors.value.row_type = t('custom_tabs.row_type_required');
  return Object.keys(errors.value).length === 0;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.creation_failed'),
      life: 3000,
    });
    return;
  }
  loading.value = true;
  try {
    // Send store_id as an array
    await axios.post('/api/custom-tabs', {
      ...formData.value,
      store_id: formData.value.store_id, // API should expect an array
    });
    router.push({ name: 'custom_tabs' });
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('custom_tabs.created_successfully'),
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('custom_tabs.creation_failed'),
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  formData.value = {
    store_id: [],
    type: null,
    name_ar: '',
    name_en: '',
    row_type: null,
  };
  errors.value = {};
};

onMounted(() => {
  fetchStores();
  fetchCustomTabs();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" :dir="$t('dir')">
    <Toast position="top-right" />
    <div class="max-w-3xl mx-auto card transform hover:scale-[1.01] transition-transform duration-300">
      <h1
        id="form-title"
        class="text-3xl font-bold text-center mb-8 text-gray-800"
        :class="{ 'text-right': $t('dir') === 'rtl' }"
        role="heading"
        aria-level="1"
      >
        {{ $t('custom_tabs.create_new_tab') }}
      </h1>

      <form @submit.prevent="submitForm" class="space-y-6" role="form" aria-labelledby="form-title">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Store ID -->
         <div class="space-y-2">
          <label for="store_id" class="block text-sm font-medium text-gray-700">
            {{ $t('custom_tabs.store_id') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="store_id"
            v-model="formData.store_id"
            :options="stores"
            optionLabel="name_en"
            optionValue="id"
            :placeholder="storesLoading ? $t('loading') : $t('custom_tabs.select_store')"
            :disabled="storesLoading || loading"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.store_id }"
            aria-describedby="store_id_error"
            required
          />
          <small v-if="errors.store_id" id="store_id_error" class="text-red-500">
            {{ errors.store_id }}
          </small>
        </div>


          <!-- Type -->
          <div class="space-y-2">
            <label
              for="type"
              class="block text-sm font-medium text-gray-700"
              :class="{ 'text-right': $t('dir') === 'rtl' }"
            >
              {{ $t('custom_tabs.type') }} <span class="text-red-500">*</span>
            </label>
            <Dropdown
              filter
              id="type"
              v-model="formData.type"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="tabsLoading ? $t('loading') : $t('custom_tabs.select_type')"
              :disabled="tabsLoading"
              class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.type }"
              aria-describedby="type_error"
              required
            />
            <small v-if="errors.type" id="type_error" class="text-red-500">
              {{ errors.type }}
            </small>
          </div>

          <!-- Name (Arabic) -->
          <div class="space-y-2">
            <label
              for="name_ar"
              class="block text-sm font-medium text-gray-700"
              :class="{ 'text-right': $t('dir') === 'rtl' }"
            >
              {{ $t('custom_tabs.name_ar') }} <span class="text-red-500">*</span>
            </label>
            <InputText
              id="name_ar"
              v-model="formData.name_ar"
              :placeholder="$t('custom_tabs.enter_name_ar')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.name_ar }"
              aria-describedby="name_ar_error"
              required
            />
            <small v-if="errors.name_ar" id="name_ar_error" class="text-red-500">
              {{ errors.name_ar }}
            </small>
          </div>

          <!-- Name (English) -->
          <div class="space-y-2">
            <label
              for="name_en"
              class="block text-sm font-medium text-gray-700"
              :class="{ 'text-right': $t('dir') === 'rtl' }"
            >
              {{ $t('custom_tabs.name_en') }} <span class="text-red-500">*</span>
            </label>
            <InputText
              id="name_en"
              v-model="formData.name_en"
              :placeholder="$t('custom_tabs.enter_name_en')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.name_en }"
              aria-describedby="name_en_error"
              required
            />
            <small v-if="errors.name_en" id="name_en_error" class="text-red-500">
              {{ errors.name_en }}
            </small>
          </div>

          <!-- Row Type -->
          <div class="space-y-2">
            <label
              for="row_type"
              class="block text-sm font-medium text-gray-700"
              :class="{ 'text-right': $t('dir') === 'rtl' }"
            >
              {{ $t('custom_tabs.row_type') }} <span class="text-red-500">*</span>
            </label>
            <Dropdown
              filter
              id="row_type"
              v-model="formData.row_type"
              :options="rowTypeOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="tabsLoading ? $t('loading') : $t('custom_tabs.select_row_type')"
              :disabled="tabsLoading"
              class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.row_type }"
              aria-describedby="row_type_error"
              required
            />
            <small v-if="errors.row_type" id="row_type_error" class="text-red-500">
              {{ errors.row_type }}
            </small>
          </div>
        </div>

        <!-- Submit and Cancel Buttons -->
        <div class="pt-6 flex justify-center space-x-4" :class="{ 'space-x-reverse': $t('dir') === 'rtl' }">
          <Button
            type="submit"
            :label="$t('custom_tabs.create_tab')"
            icon="pi pi-plus"
            :loading="loading"
            class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            :class="{ 'space-x-reverse': $t('dir') === 'rtl' }"
            :disabled="loading"
          >
            <span v-if="!loading">{{ $t('custom_tabs.create_tab') }}</span>
            <i v-else class="pi pi-spinner pi-spin"></i>
          </Button>
          <Button
            type="button"
            :label="$t('custom_tabs.cancel')"
            icon="pi pi-times"
            class="px-8 py-3 mx-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            :class="{ 'space-x-reverse': $t('dir') === 'rtl' }"
            @click="router.push({ name: 'custom-tabs' }); resetForm()"
            :disabled="loading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply bg-white p-6 rounded-xl shadow-lg;
}
:deep(.p-inputtext), :deep(.p-multiselect), :deep(.p-dropdown) {
  @apply w-full;
}
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}
</style>
