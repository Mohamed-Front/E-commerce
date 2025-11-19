<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import moment from 'moment';
import { debounce } from 'lodash';

// ──────────────────────────────────────────────────────────────
// i18n & Helpers
// ──────────────────────────────────────────────────────────────
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();

// ──────────────────────────────────────────────────────────────
// Form State
// ──────────────────────────────────────────────────────────────
const loading = ref(false);
const errors = ref({});
const isEdit = computed(() => !!route.params.id);

const discountData = ref({
  type: 'category',           // 'category' | 'product'
  ids: [],                    // category ids (when type=category)
  products: [],               // product ids (when type=product)
  discount_type: 1,           // 1 = fixed, 2 = percentage
  discount_value: null,
  expires_at: null
});

// ──────────────────────────────────────────────────────────────
// Data Sources
// ──────────────────────────────────────────────────────────────
const categories = ref([]);
const products = ref([]);
const categorySearchQuery = ref('');
const productSearchQuery = ref('');
const categoryLoading = ref(false);
const productLoading = ref(false);

// ──────────────────────────────────────────────────────────────
// Validation Class
// ──────────────────────────────────────────────────────────────
class Validation {
  constructor(errorsRef, t) {
    this.errors = errorsRef;
    this.t = t;
  }

  required(value, fieldName) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      this.errors.value[fieldName] = this.t('validation.requiredFields', { field: this.t(`discount.${fieldName}`) });
      return false;
    }
    return true;
  }

  numericRange(value, fieldName, min, max) {
    if (value === null || value === undefined || isNaN(value)) {
      this.errors.value[fieldName] = this.t('validation.requiredFields', { field: this.t(`discount.${fieldName}`) });
      return false;
    }
    if (min !== null && value < min) {
      this.errors.value[fieldName] = this.t('validation.minValue', { field: this.t(`discount.${fieldName}`), min });
      return false;
    }
    if (max !== null && value > max) {
      this.errors.value[fieldName] = this.t('validation.maxValue', { field: this.t(`discount.${fieldName}`), max });
      return false;
    }
    return true;
  }

  validDate(value, fieldName) {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      this.errors.value[fieldName] = this.t('validation.invalidDate', { field: this.t(`discount.${fieldName}`) });
      return false;
    }
    return true;
  }

  isValid() {
    return Object.keys(this.errors.value).length === 0;
  }
}

// ──────────────────────────────────────────────────────────────
// Fetch Categories
// ──────────────────────────────────────────────────────────────
const fetchCategories = async () => {
  categoryLoading.value = true;
  try {
    const { data } = await axios.get('/api/category', {
      params: { search: categorySearchQuery.value || undefined }
    });
    categories.value = data.data?.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.categoryLoad'), life: 3000 });
  } finally {
    categoryLoading.value = false;
  }
};

const debouncedFetchCategories = debounce(fetchCategories, 300);
const onCategoryFilter = (event) => {
  categorySearchQuery.value = event.value;
  debouncedFetchCategories();
};

// ──────────────────────────────────────────────────────────────
// Fetch Products (only when type=product and categories selected)
// ──────────────────────────────────────────────────────────────
const fetchProducts = async () => {

  try {
    const { data } = await axios.get('/api/product', {
      params: {
        search: productSearchQuery.value || undefined,
        category_ids: discountData.value.ids.join(',')
      }
    });
    products.value = data.data?.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.productLoad'), life: 3000 });
  } finally {
    productLoading.value = false;
  }
};

const debouncedFetchProducts = debounce(fetchProducts, 300);
const onProductFilter = (event) => {
  productSearchQuery.value = event.value;
  debouncedFetchProducts();
};

// ──────────────────────────────────────────────────────────────
// Load Existing Discount (Edit Mode)
// ──────────────────────────────────────────────────────────────
const loadDiscount = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`/api/discount/${route.params.id}`);
    const d = data.data;

    discountData.value = {
      type: d.type,
      ids: d.type === 'category' ? d.ids : [],
      products:  d.products ,
      discount_type: d.discount_type,
      discount_value: d.discount_value ,
      expires_at: d.expires_at ? new Date(d.expires_at) : null
    };
    fetchProducts()
    // Preload categories


  } catch (error) {
    console.error('Error loading discount:', error);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.loadError'),
      life: 3000
    });
    router.push({ name: 'discount' });
  } finally {
    loading.value = false;
  }
};

// ──────────────────────────────────────────────────────────────
// Watchers
// ──────────────────────────────────────────────────────────────
watch(() => discountData.value.type, (newType) => {
  discountData.value.ids = [];
  discountData.value.products = [];
  products.value = [];
  errors.value = {};
});

watch(() => discountData.value.ids, (newIds) => {
  if (discountData.value.type === 'product') {
    discountData.value.products = [];
    if (newIds.length > 0) {
      fetchProducts();
    } else {
      products.value = [];
    }
  }
}, { deep: true });

// ──────────────────────────────────────────────────────────────
// Submit Form (Create / Update)
// ──────────────────────────────────────────────────────────────
const submitForm = async () => {
  errors.value = {};
  const validator = new Validation(errors, t);

  validator.required(discountData.value.type, 'type');

  if (discountData.value.type === 'category') {
    validator.required(discountData.value.ids, 'select_category');
  } else if (discountData.value.type === 'product') {
    validator.required(discountData.value.ids, 'select_category');
    validator.required(discountData.value.products, 'select_product');
  }

  validator.required(discountData.value.discount_type, 'discount_type');
  validator.numericRange(
    discountData.value.discount_value,
    'discount_value',
    0,
    discountData.value.discount_type === 2 ? 100 : null
  );
  validator.validDate(discountData.value.expires_at, 'expiration_date');

  if (!validator.isValid()) {
    const firstError = Object.values(errors.value)[0];
    toast.add({ severity: 'error', summary: t('error'), detail: firstError, life: 3000 });
    return;
  }

  loading.value = true;
  const payload = {
    type: discountData.value.type,
    ids: discountData.value.type === 'product' ? discountData.value.products : discountData.value.ids,
    discount_type: discountData.value.discount_type,
    discount_value: discountData.value.discount_value,
    expires_at: moment(discountData.value.expires_at).format('YYYY-MM-DD')
  };

  try {
    if (isEdit.value) {
      await axios.put(`/api/discount/${route.params.id}`, payload);
      toast.add({ severity: 'success', summary: t('success'), detail: t('discount.updated_successfully'), life: 3000 });
    } else {
      await axios.post('/api/discount', payload);
      toast.add({ severity: 'success', summary: t('success'), detail: t('discount.created_successfully'), life: 3000 });
    }
    router.push({ name: 'discount' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.saveError'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// ──────────────────────────────────────────────────────────────
// Lifecycle
// ──────────────────────────────────────────────────────────────
onMounted(() => {
  fetchCategories();
  if (isEdit.value) {
    loadDiscount();
  }
});
</script>

<template>
  <div
    v-can="'create discounts'"
    class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ isEdit ? t('discount.edit_discount') : t('discount.create_new_discount') }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Type Selector -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2 hidden">
          <label class="block text-sm font-medium text-gray-700">
            {{ t('discount.discount_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            v-model="discountData.type"
            :options="[
              { label: t('discount.category'), value: 'category' },
              { label: t('discount.product'), value: 'product' }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('discount.select_type')"
            class="w-full"
            :class="{ 'p-invalid': errors.type }"
          />
          <small v-if="errors.type" class="p-error">{{ errors.type }}</small>
        </div>

        <!-- Discount Type (Fixed / Percentage) -->
        <div class="space-y-2 hidden">
          <label class="block text-sm font-medium text-gray-700">
            {{ t('discount.discount_method') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            v-model="discountData.discount_type"
            :options="[
              { label: t('discount.fixed_amount'), value: 1 },
              { label: t('discount.percentage'), value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('discount.select_method')"
            class="w-full"
            :class="{ 'p-invalid': errors.discount_type }"
          />
          <small v-if="errors.discount_type" class="p-error">{{ errors.discount_type }}</small>
        </div>
      </div>


      <!-- Products (Only when type = product) -->
      <div v-if="discountData.type === 'product'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('discount.select_product') }} <span class="text-red-500">*</span>
        </label>
        <Dropdown
          v-model="discountData.products[0]"
          :options="products"
          :optionLabel="labelField"
          optionValue="id"
          filter
          :filterPlaceholder="t('discount.searchProducts')"
          :placeholder="t('discount.select_products')"
          :loading="productLoading"
          class="w-full"
          :class="{ 'p-invalid': errors.select_product }"
          @filter="onProductFilter"
        />
        <small v-if="errors.select_product" class="p-error">{{ errors.select_product }}</small>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Discount Value -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            {{ t('discount.discount_value') }}
            <span v-if="discountData.discount_type === 1">({{ t('discount.fixed_amount') }})</span>
            <span v-else>(%)</span>
            <span class="text-red-500">*</span>
          </label>
          <InputText
          type="number"
                    v-model="discountData.discount_value"
            :placeholder="t('discount.enter_discount_value')"
            class="w-full"
            :class="{ 'p-invalid': errors.discount_value }"
          />
          <small v-if="errors.discount_value" class="p-error">{{ errors.discount_value }}</small>
        </div>

        <!-- Expiration Date -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            {{ t('discount.expiration_date') }} <span class="text-red-500">*</span>
          </label>
          <Calendar
            v-model="discountData.expires_at"
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            :placeholder="t('discount.select_expiration_date')"
            class="w-full"
            :class="{ 'p-invalid': errors.expiration_date }"
            showIcon
          />
          <small v-if="errors.expiration_date" class="p-error">{{ errors.expiration_date }}</small>
        </div>
      </div>

      <!-- Buttons -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('discount.cancel')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 mx-2 text-gray-700 rounded-lg shadow-md"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="isEdit ? t('discount.update_discount') : t('discount.create_discount')"
          icon="pi pi-check"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md"
        />
      </div>
    </form>

    <Toast />
  </div>
</template>

<style scoped>
.p-invalid {
  @apply border-red-500 ring-red-500;
}

.p-error {
  @apply text-red-600 text-xs;
}

:deep(.p-multiselect-panel .p-multiselect-items-wrapper),
:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}

:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar),
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar) {
  @apply w-1.5;
}

:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar-track),
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  @apply bg-gray-100 rounded;
}

:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar-thumb),
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  @apply bg-blue-500 rounded;
}

[dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 1rem;
  margin-right: 0;
}
</style>
