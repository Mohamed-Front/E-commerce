<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import moment from 'moment';

// Validation Class
class Validation {
  constructor(errorsRef, t) {
    this.errors = errorsRef; // Use reactive ref for errors
    this.t = t; // Translation function
  }

  // Validate required fields
  required(value, fieldName) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      this.errors.value[fieldName] = this.t('validation.requiredFields', { field: this.t(`discount.${fieldName}`) });
      return false;
    }
    return true;
  }

  // Validate numeric range
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

  // Check if valid
  isValid() {
    return Object.keys(this.errors.value).length === 0;
  }
}

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);
const categories = ref([]);
const products = ref([]);
const categorySearchQuery = ref('');
const productSearchQuery = ref('');
const errors = ref({}); // Reactive errors for field-specific display

// Form Data
const discountData = ref({
  type: '',
  ids: [], // Array for multiple category IDs
  products: [], // Array for product IDs
  discount_type: null,
  discount_value: null,
  expires_at: null
});

// Fetch categories with search
const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/category', {
      params: {
        search: categorySearchQuery.value || undefined
      }
    });
    categories.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.categoryLoad'), life: 3000 });
  }
};

// Fetch products with search and category filter
const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/product', {
      params: {
        search: productSearchQuery.value || undefined,
        category_ids: discountData.value.ids.length > 0 ? discountData.value.ids.join(',') : undefined
      }
    });
    products.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.productLoad'), life: 3000 });
  }
};

// Handle category filter input
const onCategoryFilter = (event) => {
  categorySearchQuery.value = event.value;
  fetchCategories();
};

// Handle product filter input
const onProductFilter = (event) => {
  productSearchQuery.value = event.value;
  fetchProducts();
};

// Watch for changes in type to fetch categories or clear products
watch(() => discountData.value.type, (newType) => {
  discountData.value.ids = [];
  discountData.value.products = [];
  products.value = [];
  errors.value = {}; // Clear errors on type change
  if (newType === 'category' || newType === 'product') {
    fetchCategories();
  }
});

// Watch for changes in ids when type is 'product' to fetch products
watch(() => discountData.value.ids, (newCategoryIds) => {
  if (discountData.value.type === 'product' && newCategoryIds.length > 0) {
    fetchProducts();
  } else {
    products.value = [];
    discountData.value.products = [];
  }
}, { deep: true });

// Submit form
const submitForm = async () => {
  errors.value = {}; // Clear previous errors
  const validator = new Validation(errors, t);

  // Validate fields
  validator.required(discountData.value.type, 'type');
  validator.required(discountData.value.ids, 'select_category');
  if (discountData.value.type === 'product') {
    validator.required(discountData.value.products, 'select_product');
  }
  validator.required(discountData.value.discount_type, 'discount_type');
  validator.numericRange(discountData.value.discount_value, 'discount_value', 0, discountData.value.discount_type === 2 ? 100 : null);
  validator.required(discountData.value.expires_at, 'expiration_date');

  if (!validator.isValid()) {
    const errorMessage = Object.values(errors.value).join(', ');
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: errorMessage,
      life: 3000
    });
    return;
  }

  loading.value = true;
  const data = {
    type: discountData.value.type,
    ids: discountData.value.type === 'product' ? discountData.value.products : discountData.value.ids,
    discount_type: discountData.value.discount_type,
    discount_value: discountData.value.discount_value,
    expires_at: moment(discountData.value.expires_at).format('YYYY-MM-DD')
  };

  try {
    await axios.post('/api/discount', data);
    router.push({ name: 'discount' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('discount.created_successfully'), life: 3000 });
  } catch (error) {
    console.error('Error:', error);
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

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div v-can="'create discounts'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg" :dir="isRTL ? 'rtl' : 'ltr'">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('discount.create_new_discount') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="type" class="block text-sm font-medium text-gray-700">
            {{ t('discount.type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="type"
            v-model="discountData.type"
            :options="['product', 'category']"
            :placeholder="t('discount.select_type')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.type }"
          />
        </div>

        <!-- Category Selection -->
        <div class="space-y-2">
          <label for="ids" class="block text-sm font-medium text-gray-700">
            {{ t('discount.select_category') }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            filter
            id="ids"
            v-model="discountData.ids"
            :options="categories"
            :optionLabel="labelField"
            optionValue="id"
            :placeholder="t('discount.searchCategories')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.select_category }"
            @filter="onCategoryFilter"
            display="chip"
          />
        </div>

        <!-- Product Selection (only shown if type is 'product') -->
        <div v-if="discountData.type === 'product'" class="space-y-2">
          <label for="product_id" class="block text-sm font-medium text-gray-700">
            {{ t('discount.select_product') }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            filter
            id="product_id"
            v-model="discountData.products"
            :options="products"
            :optionLabel="labelField"
            optionValue="id"
            :placeholder="t('discount.searchProducts')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.select_product }"
            @filter="onProductFilter"
            display="chip"
          />
        </div>

        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="discount_type" class="block text-sm font-medium text-gray-700">
            {{ t('discount.discount_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="discount_type"
            v-model="discountData.discount_type"
            :options="[
              { label: t('discount.fixed_amount'), value: 1 },
              { label: t('discount.percentage'), value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('discount.select_discount_type')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.discount_type }"
          />
        </div>

        <!-- Discount Value -->
        <div class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ t('discount.discount_value') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="discount_value"
            v-model="discountData.discount_value"
            :min="0"
            :max="discountData.discount_type === 2 ? 100 : null"
            :placeholder="t('discount.enter_discount_value')"
            class="w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.discount_value }"
          />

        </div>

        <!-- Expires At -->
        <div class="space-y-2">
          <label for="expires_at" class="block text-sm font-medium text-gray-700">
            {{ t('discount.expiration_date') }} <span class="text-red-500">*</span>
          </label>
          <Calendar
            id="expires_at"
            v-model="discountData.expires_at"
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            :placeholder="t('discount.select_expiration_date')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.expiration_date }"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('discount.cancel')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 mx-2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('discount.create_discount')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('discount.create_discount') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
    <Toast />
  </div>
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

/* Button gradient animation */
button.bg-gradient-to-r:hover {
  background-size: 150% 100%;
}

/* RTL support */
[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]) {
  margin-right: 0.5rem;
  margin-left: 0;
}

/* Invalid input styling */
.p-invalid {
  border-color: #f44336 !important;
}

/* Custom scrollbar for dropdowns */
:deep(.p-dropdown-panel .p-dropdown-items-wrapper),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
:deep(.p-dropdown-panel .p-multiselect-items-wrapper::-webkit-scrollbar-thumb),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar-thumb) {
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
