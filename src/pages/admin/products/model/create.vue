<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);
const isDragging = ref(false);
const stores = ref([]);
const categories = ref([]);
const brands = ref([]);
const attributes = ref([]);
const hasVariants = ref(false);
const isDisplayed = ref(true); // New toggle for is_displayed

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

// Form Data
const productData = ref({
  store_id: null,
  category_id: null,
  brand_id: null,
  name_en: '',
  name_ar: '',
  sub_name_en: '',
  sub_name_ar: '',
  description_en: '',
  description_ar: '',
  base_price: null,
  cost_price: null, // New cost_price field
  tax: null, // New tax field
  is_displayed: true, // New is_displayed field
  variants: []
});

// Computed property for formatted attributes
const formattedAttributes = computed(() => {
  return attributes.value.map(attr => ({
    label: currentLanguage.value === 'en' ? attr.name_en : attr.name_ar,
    items: attr.values.map(val => ({
      id: val.id,
      [labelField.value]: currentLanguage.value === 'en' ? val.value_en : val.value_ar
    }))
  }));
});

// Fetch data for dropdowns
const fetchStores = async () => {
  try {
    const response = await axios.get('/api/store');
    stores.value = response.data.data.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.storeLoad'), life: 3000 });
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/category');
    categories.value = response.data.data.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.categoryLoad'), life: 3000 });
  }
};

const fetchBrands = async () => {
  try {
    const response = await axios.get('/api/brand');
    brands.value = response.data.data.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.brandLoad'), life: 3000 });
  }
};

const fetchAttributes = async () => {
  try {
    const response = await axios.get('/api/product/create/data');
    attributes.value = response.data.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.attributeLoad'), life: 3000 });
  }
};

onMounted(() => {
  fetchStores();
  fetchCategories();
  fetchBrands();
  fetchAttributes();
});

// Handle drag events
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle image upload
const handleImageUpload = (file) => {
  if (file.size > 2 * 1024 * 1024) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageSize'), life: 3000 });
    return;
  }
  if (!file.type.match('image.*')) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageInvalid'), life: 3000 });
    return;
  }
  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  isDragging.value = false;
};

const onImageUpload = (event) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file) {
    handleImageUpload(file);
  }
};

// Remove image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Variant management
const toggleVariants = () => {
  hasVariants.value = !hasVariants.value;
  if (hasVariants.value && !productData.value.variants.length) {
    productData.value.variants.push({ sku_ar: '', sku_en: '', price: '', attribute_value_ids: [] });
  } else if (!hasVariants.value) {
    productData.value.variants = [];
  }
};

const addVariant = () => {
  productData.value.variants.push({ sku_ar: '', sku_en: '', price: '', attribute_value_ids: [] });
};

const removeVariant = (index) => {
  if (productData.value.variants.length > 1) {
    productData.value.variants.splice(index, 1);
  } else {
    toast.add({ severity: 'warn', summary: t('error'), detail: t('validation.atLeastOneVariant'), life: 3000 });
  }
};

// Submit form
const submitForm = async () => {
  const requiredFields = ['store_id', 'category_id', 'brand_id', 'name_en', 'name_ar'];

  // Validate required fields
  if (requiredFields.some(field => !productData.value[field])) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.requiredFields'), life: 3000 });
    return;
  }

  // Validate variants or base_price/cost_price
  if (hasVariants.value) {
    if (productData.value.variants.some(v => !v.sku_en || !v.sku_ar || !v.price || !v.attribute_value_ids.length)) {
      toast.add({ severity: 'error', summary: t('error'), detail: t('validation.variantRequiredFields'), life: 3000 });
      return;
    }
  } else if (!productData.value.base_price || !productData.value.cost_price) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.baseAndCostPriceRequired'), life: 3000 });
    return;
  }

  loading.value = true;
  const formData = new FormData();
  formData.append('store_id', productData.value.store_id);
  formData.append('category_id', productData.value.category_id);
  formData.append('brand_id', productData.value.brand_id);
  formData.append('name_en', productData.value.name_en);
  formData.append('name_ar', productData.value.name_ar);
  formData.append('sub_name_en', productData.value.sub_name_en || '');
  formData.append('sub_name_ar', productData.value.sub_name_ar || '');
  formData.append('description_en', productData.value.description_en || '');
  formData.append('description_ar', productData.value.description_ar || '');
  formData.append('tax', productData.value.tax || 0); // Append tax
  formData.append('is_displayed', productData.value.is_displayed ? 1 : 0); // Append is_displayed

  if (hasVariants.value) {
    formData.append('variants', JSON.stringify(productData.value.variants));
  } else {
    formData.append('base_price', productData.value.base_price);
    formData.append('cost_price', productData.value.cost_price); // Append cost_price
  }

  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  try {
    await axios.post('/api/product', formData);
    router.push({ name: 'product' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('product.createSuccess'), life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('error.createError'), life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-can="'create products'" class="max-w-5xl p-6 mx-auto bg-white shadow-lg rounded-xl" :dir="isRTL ? 'rtl' : 'ltr'">
    <h1 class="mb-8 text-3xl font-bold text-center text-gray-800">{{ t('product.createTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Store Selection -->
        <div class="space-y-2">
          <label for="store_id" class="block text-sm font-medium text-gray-700">
            {{ t('product.store') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="store_id"
            v-model="productData.store_id"
            :options="stores"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
          />
        </div>

        <!-- Category Selection -->
        <div class="space-y-2">
          <label for="category_id" class="block text-sm font-medium text-gray-700">
            {{ t('product.category') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="category_id"
            v-model="productData.category_id"
            :options="categories"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
          />
        </div>

        <!-- Brand Selection -->
        <div class="space-y-2">
          <label for="brand_id" class="block text-sm font-medium text-gray-700">
            {{ t('product.brand') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="brand_id"
            v-model="productData.brand_id"
            :options="brands"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
          />
        </div>

        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ t('product.nameEn') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="productData.name_en"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('product.nameAr') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="productData.name_ar"
            dir="rtl"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- English Sub-Name -->
        <div class="space-y-2">
          <label for="sub_name_en" class="block text-sm font-medium text-gray-700">
            {{ t('product.subNameEn') }}
          </label>
          <InputText
            id="sub_name_en"
            v-model="productData.sub_name_en"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Arabic Sub-Name -->
        <div class="space-y-2">
          <label for="sub_name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('product.subNameAr') }}
          </label>
          <InputText
            id="sub_name_ar"
            v-model="productData.sub_name_ar"
            dir="rtl"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- English Description -->
        <div class="space-y-2 md:col-span-2">
          <label for="description_en" class="block text-sm font-medium text-gray-700">
            {{ t('product.descriptionEn') }}
          </label>
          <Textarea
            id="description_en"
            v-model="productData.description_en"
            rows="4"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Arabic Description -->
        <div class="space-y-2 md:col-span-2">
          <label for="description_ar" class="block text-sm font-medium text-gray-700">
            {{ t('product.descriptionAr') }}
          </label>
          <Textarea
            id="description_ar"
            v-model="productData.description_ar"
            rows="4"
            dir="rtl"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Base Price (when no variants) -->
        <div v-if="!hasVariants" class="space-y-2">
          <label for="base_price" class="block text-sm font-medium text-gray-700">
            {{ t('product.basePrice') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="base_price"
            v-model="productData.base_price"
            mode="decimal"
            :minFractionDigits="2"
            class="w-full"
          />
        </div>

        <!-- Cost Price (when no variants) -->
        <div v-if="!hasVariants" class="space-y-2">
          <label for="cost_price" class="block text-sm font-medium text-gray-700">
            {{ t('product.costPrice') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="cost_price"
            v-model="productData.cost_price"
            mode="decimal"
            :minFractionDigits="2"
            class="w-full"
          />
        </div>

        <!-- Tax -->
        <div class="space-y-2">
          <label for="tax" class="block text-sm font-medium text-gray-700">
            {{ t('product.tax') }}
          </label>
          <InputNumber
            id="tax"
            v-model="productData.tax"
            mode="decimal"
            :minFractionDigits="2"
            class="w-full"
          />
        </div>

        <!-- Is Displayed Toggle -->
        <div class="space-y-2">
          <Checkbox
            v-model="productData.is_displayed"
            inputId="isDisplayed"
            :binary="true"
          />
          <label for="isDisplayed" class="ml-2 text-sm font-medium text-gray-700">
            {{ t('product.isDisplayed') }}
          </label>
        </div>

        <!-- Variants Toggle -->
        <div class="space-y-2 md:col-span-2">
          <Checkbox
            v-model="hasVariants"
            inputId="hasVariants"
            :binary="true"
            @click="toggleVariants"
          />
          <label for="hasVariants" class="ml-2 text-sm font-medium text-gray-700">
            {{ t('product.hasVariants') }}
          </label>
        </div>

        <!-- Variants -->
        <div v-if="hasVariants" class="space-y-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('product.variants') }}</label>
          <div v-for="(variant, index) in productData.variants" :key="index" class="p-4 space-y-4 border rounded-lg">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- SKU English -->
              <div class="space-y-2">
                <label :for="'sku_en_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.skuEn') }} <span class="text-red-500">*</span>
                </label>
                <InputText
                  :id="'sku_en_' + index"
                  v-model="variant.sku_en"
                  class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- SKU Arabic -->
              <div class="space-y-2">
                <label :for="'sku_ar_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.skuAr') }} <span class="text-red-500">*</span>
                </label>
                <InputText
                  :id="'sku_ar_' + index"
                  v-model="variant.sku_ar"
                  dir="rtl"
                  class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Price -->
              <div class="space-y-2">
                <label :for="'price_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.price') }} <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  :id="'price_' + index"
                  v-model="variant.price"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                />
              </div>

              <!-- Attribute Values -->
              <div class="space-y-2">
                <label :for="'attributes_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.attributes') }} <span class="text-red-500">*</span>
                </label>
                <MultiSelect
                  :id="'attributes_' + index"
                  v-model="variant.attribute_value_ids"
                  :options="formattedAttributes"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  :optionLabel="labelField"
                  optionValue="id"
                  class="w-full"
                />
              </div>
            </div>
            <Button
              type="button"
              icon="pi pi-trash"
              class="p-button-danger"
              @click="removeVariant(index)"
              :disabled="productData.variants.length === 1"
            />
          </div>
          <Button
            type="button"
            :label="t('product.addVariant')"
            icon="pi pi-plus"
            class="p-button-secondary"
            @click="addVariant"
          />
        </div>

        <!-- Image Upload -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('product.image') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="onImageUpload"
              :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
              class="w-full max-w-md transition-colors duration-300 border-2 border-dashed cursor-pointer rounded-xl"
            >
              <input type="file" @change="onImageUpload" accept="image/*" class="hidden">
              <div v-if="imagePreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="object-contain w-full h-64 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                  />
                  <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                    <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage"
                        class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        :title="t('product.deleteImage')"
                      >
                        <i class="text-sm pi pi-trash"></i>
                      </button>
                      <button
                        type="button"
                        class="p-2 text-gray-700 transition bg-white rounded-full hover:bg-gray-100"
                        :title="t('product.editImage')"
                      >
                        <i class="text-sm pi pi-pencil"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-sm text-center text-gray-500">{{ t('product.changeImage') }}</p>
              </div>
              <div v-else class="flex flex-col items-center justify-center p-8">
                <div class="p-4 mb-4 bg-blue-100 rounded-full">
                  <i class="text-2xl text-blue-500 pi pi-image"></i>
                </div>
                <p class="mb-1 text-sm text-center text-gray-600">
                  <span class="font-medium text-blue-500">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
                </p>
                <p class="text-xs text-gray-400">{{ t('product.imageFormat') }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-4 space-x-4">
        <Button
          type="button"
          :label="t('product.cancelButton')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="flex items-center justify-center px-6 py-3 mx-2 space-x-2 text-gray-700 transition-all duration-300 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('product.createButton')"
          icon="pi pi-plus"
          :loading="loading"
          class="flex items-center justify-center px-8 py-3 mx-2 space-x-2 text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('product.createButton') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
    <Toast />
  </div>
</template>