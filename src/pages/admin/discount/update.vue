<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const models = ref([]);
const categories = ref([]);
const products = ref([]);
const discountId = ref(route.params.id);

// Form Data
const discountData = ref({
  products: [],
  model_ids: [],
  model_type: '',
  discount_type: null,
  discount_value: '',
  expires_at: null
});

// Computed property for category options
const categoryOptions = computed(() => {
  return categories.value.map(category => ({
    id: category.id,
    name: category[labelField.value] || category.name_en || category.name_ar || 'Unnamed Category'
  }));
});

// Fetch discount data
const fetchDiscount = async () => {
  try {
    const response = await axios.get(`/api/discount/${discountId.value}`);
    const data = response.data.data;

    discountData.value = {
      model_ids: Array.isArray(data.model_ids) ? data.model_ids : [],
      model_type: data.model_type || '',
      discount_type: data.discount_type || null,
      discount_value: parseFloat(data.discount_value) || '',
      expires_at: data.expires_at ? new Date(data.expires_at) : null,
      products: data.model_type === 'product' ? (Array.isArray(data.model_ids) ? data.model_ids : []) : []
    };

    if (data.model_type === 'product' && data.model_ids.length > 0) {
      await fetchCategories();
      await fetchProductCategory(data.model_ids[0]);
    } else if (data.model_type === 'category') {
      await fetchCategories();
      // Ensure model_ids are valid category IDs
      discountData.value.model_ids = data.model_ids.filter(id =>
        categories.value.some(category => category.id === id)
      );
    }
  } catch (error) {
    console.error('Error fetching discount:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_discount'), life: 3000 });
    router.push({ name: 'discount' });
  }
};

// Fetch product's category (reverse lookup)
const fetchProductCategory = async (productId) => {
  try {
    const response = await axios.get(`/api/product/${productId}`);
    const product = response.data.data;
    if (product.category_id) {
      discountData.value.model_ids = [product.category_id];
      await fetchProducts([product.category_id]);
    }
  } catch (error) {
    console.error('Error fetching product category:', error);
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await axios.get('api/category');
    categories.value = response.data.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_categories'), life: 3000 });
  }
};

// Fetch products
const fetchProducts = async (categoryIds) => {
  try {
    const response = await axios.post(`api/category/products`, {
      ids: categoryIds
    });
    products.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Watch for changes in model_type
watch(() => discountData.value.model_type, (newType) => {
  discountData.value.model_ids = [];
  discountData.value.products = [];
  products.value = [];
  if (newType === 'category' || newType === 'product') {
    fetchCategories();
  }
});

// Watch for changes in model_ids when model_type is 'product'
watch(() => discountData.value.model_ids, (newModelIds) => {
  if (discountData.value.model_type === 'product' && newModelIds.length > 0) {
    fetchProducts(newModelIds);
  } else {
    products.value = [];
  }
}, { deep: true });

// Watch for changes in categories to ensure model_ids are reflected
watch(categories, () => {
  if (discountData.value.model_type === 'category' && discountData.value.model_ids.length > 0) {
    // Filter model_ids to only include valid category IDs
    discountData.value.model_ids = discountData.value.model_ids.filter(id =>
      categories.value.some(category => category.id === id)
    );
  }
}, { deep: true });

// Fetch models
const getModels = async () => {
  try {
    const response = await axios.get('api/model');
    models.value = response.data.data.data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_models'), life: 3000 });
  }
};

// Submit form
const submitForm = async () => {
  loading.value = true;
  const data = {
    expires_at: discountData.value.expires_at ? moment(discountData.value.expires_at).format('YYYY-MM-DD') : null,
    discount_value: discountData.value.discount_value,
    discount_type: discountData.value.discount_type,
    model_type: discountData.value.model_type,
    model_ids: discountData.value.model_type === 'product' ? discountData.value.products : discountData.value.model_ids,
    _method: 'PUT'
  };

  try {
    await axios.post(`/api/discount/${discountId.value}`, data);
    router.push({ name: 'discount' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('discount.updated_successfully'), life: 3000 });
  } catch (error) {
    console.error('Error:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('error_occurred'), life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getModels();
  fetchDiscount();
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t('discount.update_discount') }}</h1>

    <Form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Model Type -->
        <div class="space-y-2">
          <label for="model_type" class="block text-sm font-medium text-gray-700">
            {{ $t('discount.model_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="model_type"
            v-model="discountData.model_type"
            :options="['product', 'category']"
            :placeholder="$t('discount.select_model_type')"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            :disabled="loading"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.model_type">{{ form.errors.model_type[0] }}</small>
        </div>

        <!-- Model ID (Category or Product selection) -->
        <div class="space-y-2">
          <label for="model_ids" class="block text-sm font-medium text-gray-700">
            {{ $t(discountData.model_type === 'product' ? 'discount.select_category' : 'discount.select_model') }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            filter
            id="model_ids"
            v-model="discountData.model_ids"
            :options="categoryOptions"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t(discountData.model_type === 'product' ? 'discount.select_category' : 'discount.select_model')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            :disabled="loading || !discountData.model_type"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.model_ids">{{ form.errors.model_ids[0] }}</small>
        </div>

        <!-- Product Selection (only shown if model_type is 'product') -->
        <div v-if="discountData.model_type === 'product'" class="space-y-2">
          <label for="product_id" class="block text-sm font-medium text-gray-700">
            {{ $t('discount.select_product') }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            filter
            id="product_id"
            v-model="discountData.products"
            :options="products"
            :optionLabel="labelField"
            optionValue="id"
            :placeholder="$t('discount.select_product')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            :disabled="loading || discountData.model_ids.length === 0"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.products">{{ form.errors.products[0] }}</small>
        </div>

        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="discount_type" class="block text-sm font-medium text-gray-700">
            {{ $t('discount.discount_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="discount_type"
            v-model="discountData.discount_type"
            :options="[
              { label: $t('discount.fixed_amount'), value: 1 },
              { label: $t('discount.percentage'), value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('discount.select_discount_type')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            :disabled="loading"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.discount_type">{{ form.errors.discount_type[0] }}</small>
        </div>

        <!-- Discount Value -->
        <div class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ $t('discount.discount_value') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="discount_value"
            v-model="discountData.discount_value"
            :min="0"
            :max="discountData.discount_type === 2 ? 100 : null"
            :placeholder="$t('discount.enter_discount_value')"
            class="w-full px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            :disabled="loading"
          />
          <small class="text-gray-500 text-xs" v-if="discountData.discount_type === 2">
            {{ $t('discount.percentage_note') }}
          </small>
          <small class="text-red-500 text-xs" v-if="form?.errors?.discount_value">{{ form.errors.discount_value[0] }}</small>
        </div>

        <!-- Expires At -->
        <div class="space-y-2">
          <label for="expires_at" class="block text-sm font-medium text-gray-700">
            {{ $t('discount.expiration_date') }} <span class="text-red-500">*</span>
          </label>
          <Calendar
            id="expires_at"
            v-model="discountData.expires_at"
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            :placeholder="$t('discount.select_expiration_date')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            :disabled="loading"
            :showIcon="true"
            inputId="expires_at_input"
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
          <span v-if="!loading">{{ $t('discount.update_discount') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </Form>
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

/* Fix for calendar input */
:deep(#expires_at_input) {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
</style>
