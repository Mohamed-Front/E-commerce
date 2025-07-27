<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);
const tabsLoading = ref(false);
const storesLoading = ref(false);
const customTabs = ref([]);
const stores = ref([]);
const errors = ref({});

// Form Data
const formData = ref({
  store_id: null,
  type: null,
  name_ar: '',
  name_en: '',
  row_type: null,
});

// Type options for dropdown
const typeOptions = [
  { label: t('custom_tabs.categories'), value: 1 },
  { label: t('custom_tabs.products'), value: 2 },
];

// Row type options for dropdown
const rowTypeOptions = [
  { label: t('custom_tabs.single_row'), value: 1 },
  { label: t('custom_tabs.double_rows'), value: 2 },
];

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

// Fetch single custom tab by ID
const fetchCustomTabById = async (id) => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/custom-tabs/${id}`);
    const tab = res.data?.data;
    if (tab) {
      formData.value = {
        store_id: tab.store_id,
        type: tab.type,
        name_ar: tab.name_ar,
        name_en: tab.name_en,
        row_type: tab.row_type,
      };
    } else {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('custom_tabs.tab_not_found'),
        life: 3000,
      });
      router.push({ name: 'custom-tabs' });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.fetch_failed'),
      life: 3000,
    });
    router.push({ name: 'custom-tabs' });
  } finally {
    loading.value = false;
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

// Submit form (update)
const submitForm = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.update_failed'),
      life: 3000,
    });
    return;
  }
  loading.value = true;
  try {
    await axios.put(`/api/custom-tabs/${route.params.id}`, formData.value);
    router.push({ name: 'custom-tabs' });
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('custom_tabs.updated_successfully'),
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('custom_tabs.update_failed'),
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStores();
  fetchCustomTabs();
  if (route.params.id) {
    fetchCustomTabById(route.params.id);
  } else {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.invalid_id'),
      life: 3000,
    });
    router.push({ name: 'custom-tabs' });
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 id="form-title" class="text-3xl font-bold text-center mb-8 text-gray-800" role="heading" aria-level="1">
      {{ $t('custom_tabs.edit_tab') }}
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
          <label for="type" class="block text-sm font-medium text-gray-700">
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
            :disabled="tabsLoading || loading"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ $t('custom_tabs.name_ar') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :placeholder="$t('custom_tabs.enter_name_ar')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'border-red-500': errors.name_ar }"
            :disabled="loading"
            aria-describedby="name_ar_error"
            required
          />
          <small v-if="errors.name_ar" id="name_ar_error" class="text-red-500">
            {{ errors.name_ar }}
          </small>
        </div>

        <!-- Name (English) -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ $t('custom_tabs.name_en') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="formData.name_en"
            :placeholder="$t('custom_tabs.enter_name_en')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'border-red-500': errors.name_en }"
            :disabled="loading"
            aria-describedby="name_en_error"
            required
          />
          <small v-if="errors.name_en" id="name_en_error" class="text-red-500">
            {{ errors.name_en }}
          </small>
        </div>

        <!-- Row Type -->
        <div class="space-y-2">
          <label for="row_type" class="block text-sm font-medium text-gray-700">
            {{ $t('custom_tabs.row_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="row_type"
            v-model="formData.row_type"
            :options="rowTypeOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="tabsLoading ? $t('loading') : $t('custom_tabs.select_row_type')"
            :disabled="tabsLoading || loading"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="submit"
          :label="$t('custom_tabs.update_tab')"
          icon="pi pi-check"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ $t('custom_tabs.update_tab') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
        <Button
          type="button"
          :label="$t('cancel')"
          icon="pi pi-times"
          class="px-8 py-3 mx-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          @click="router.push({ name: 'custom-tabs' })"
          :disabled="loading"
        />
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
:deep(.p-inputtext), :deep(.p-dropdown) {
  width: 100%;
}
</style>
