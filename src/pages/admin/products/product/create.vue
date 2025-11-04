<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const isDragging = ref(false);
const stores = ref([]);
const categories = ref([]);
const brands = ref([]);
const attributes = ref([]);
const hasVariants = ref(false);

// Image handling
const mainImage = ref(null);
const mainImagePreview = ref(null);
const additionalImages = ref([]);
const additionalImagePreviews = ref([]);

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

// Form Data
const productData = ref({
  store_id: null,
  category_id: null,
  brand_id: null,
  sku: '',
  name_en: '',
  name_ar: '',
  sub_name_en: '',
  sub_name_ar: '',
  description_en: '',
  description_ar: '',
  base_price: null,
  cost_price: null,
  tax: 0,
  is_displayed: true,
  variants: []
});

// Dynamic required fields: SKU required only if no variants
const requiredFields = computed(() => {
  const base = ['store_id', 'category_id', 'brand_id', 'name_en', 'name_ar', 'base_price'];
  if (!hasVariants.value) {
    base.push('sku');
  }
  return base;
});

// Computed property for formatted attributes
const formattedAttributes = computed(() => {
  return attributes.value.map(attr => ({
    label: currentLanguage.value === 'en' ? attr.name_en : attr.name_ar,
    value: attr.id,
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

// Handle drag events for images
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle main image upload
const handleMainImageUpload = (file) => {
  if (file.size > 2 * 1024 * 1024) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageSize'), life: 3000 });
    return;
  }

  if (!file.type.match('image.*')) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageInvalid'), life: 3000 });
    return;
  }

  mainImage.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    mainImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const onMainImageUpload = (event) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file) {
    handleMainImageUpload(file);
  }
  isDragging.value = false;
};

// Remove main image
const removeMainImage = () => {
  mainImage.value = null;
  mainImagePreview.value = null;
};

// Handle additional images upload
const handleAdditionalImagesUpload = (files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.size > 2 * 1024 * 1024) {
      toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageSize'), life: 3000 });
      continue;
    }

    if (!file.type.match('image.*')) {
      toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageInvalid'), life: 3000 });
      continue;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      additionalImages.value.push(file);
      additionalImagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  isDragging.value = false;
};

const onAdditionalImagesUpload = (event) => {
  const files = event.target.files || event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleAdditionalImagesUpload(files);
  }
};

// Remove additional image
const removeAdditionalImage = (index) => {
  additionalImages.value.splice(index, 1);
  additionalImagePreviews.value.splice(index, 1);
};

// Handle variant image upload
const handleVariantImageUpload = (file, variantIndex) => {
  if (file.size > 2 * 1024 * 1024) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageSize'), life: 3000 });
    return;
  }
  if (!file.type.match('image.*')) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.imageInvalid'), life: 3000 });
    return;
  }

  productData.value.variants[variantIndex].variant_image = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    productData.value.variants[variantIndex].variant_image_preview = e.target.result;
  };
  reader.readAsDataURL(file);
};

const onVariantImageUpload = (event, variantIndex) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file) {
    handleVariantImageUpload(file, variantIndex);
  }
};

// Remove variant image
const removeVariantImage = (variantIndex) => {
  productData.value.variants[variantIndex].variant_image = null;
  productData.value.variants[variantIndex].variant_image_preview = null;
};

// Variant management
const toggleVariants = () => {
  hasVariants.value = !hasVariants.value;
  if (hasVariants.value && !productData.value.variants.length) {
    addVariant();
  } else if (!hasVariants.value) {
    productData.value.variants = [];
  }
};

const addVariant = () => {
  productData.value.variants.push({
    sku: '',
    price: '',
    cost_price: null,
    attribute_value_ids: [],
    variant_image: null,
    variant_image_preview: null
  });
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
  // Validate required fields (SKU required only if no variants)
  if (requiredFields.value.some(field => !productData.value[field])) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.requiredFields'), life: 3000 });
    return;
  }

  // Validate main image
  if (!mainImage.value) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.mainImageRequired'), life: 3000 });
    return;
  }

  // Validate variants: price and attributes required, SKU is optional
  if (hasVariants.value) {
    if (productData.value.variants.some(v => !v.price || v.attribute_value_ids.length === 0)) {
      toast.add({ severity: 'error', summary: t('error'), detail: t('validation.variantRequiredFields'), life: 3000 });
      return;
    }
  }

  loading.value = true;
  const formData = new FormData();

  // Append basic product data
  formData.append('store_id', productData.value.store_id);
  formData.append('category_id', productData.value.category_id);
  formData.append('brand_id', productData.value.brand_id);
  formData.append('sku', productData.value.sku || ''); // Optional if variants
  formData.append('name_en', productData.value.name_en);
  formData.append('name_ar', productData.value.name_ar);
  formData.append('sub_name_en', productData.value.sub_name_en || '');
  formData.append('sub_name_ar', productData.value.sub_name_ar || '');
  formData.append('description_en', productData.value.description_en || '');
  formData.append('description_ar', productData.value.description_ar || '');
  formData.append('tax', productData.value.tax);
  formData.append('is_displayed', productData.value.is_displayed ? 1 : 0);
  formData.append('base_price', productData.value.base_price);
  formData.append('cost_price', productData.value.cost_price || 0);

  // Append main image
  formData.append('main_image', mainImage.value);

  // Append additional images
  additionalImages.value.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  // Append variants (SKU is optional)
  if (hasVariants.value) {
    productData.value.variants.forEach((variant, index) => {
      if (variant.sku) formData.append(`variants[${index}][sku]`, variant.sku);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][cost_price]`, variant.cost_price || 0);
      variant.attribute_value_ids.forEach((attrId, attrIndex) => {
        formData.append(`variants[${index}][attribute_value_ids][${attrIndex}]`, attrId);
      });
      if (variant.variant_image) {
        formData.append(`variants[${index}][variant_image]`, variant.variant_image);
      }
    });
  }

  try {
    await axios.post('/api/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    router.push({ name: 'product' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('product.createSuccess'), life: 3000 });
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
  <div v-can="'create products'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg" :dir="isRTL ? 'rtl' : 'ltr'">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('product.createTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Store Selection -->
        <div class="space-y-2">
          <label for="store_id" class="block text-sm font-medium text-gray-700">
            {{ t('product.store') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="store_id"
            v-model="productData.store_id"
            :options="stores"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
            :class="{ 'p-invalid': !productData.store_id }"
          />
        </div>

        <!-- Category Selection -->
        <div class="space-y-2">
          <label for="category_id" class="block text-sm font-medium text-gray-700">
            {{ t('product.category') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="category_id"
            v-model="productData.category_id"
            :options="categories"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
            :class="{ 'p-invalid': !productData.category_id }"
          />
        </div>

        <!-- Brand Selection -->
        <div class="space-y-2">
          <label for="brand_id" class="block text-sm font-medium text-gray-700">
            {{ t('product.brand') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="brand_id"
            v-model="productData.brand_id"
            :options="brands"
            :optionLabel="labelField"
            optionValue="id"
            class="w-full"
            :class="{ 'p-invalid': !productData.brand_id }"
          />
        </div>

        <!-- SKU - Required only if no variants -->
        <div class="space-y-2">
          <label for="sku" class="block text-sm font-medium text-gray-700">
            {{ t('product.sku') }}
            <span v-if="!hasVariants" class="text-red-500">*</span>
          </label>
          <InputText
            id="sku"
            v-model="productData.sku"
            class="w-full"
            :class="{ 'p-invalid': !hasVariants && !productData.sku }"
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
            class="w-full"
            :class="{ 'p-invalid': !productData.name_en }"
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
            class="w-full"
            :class="{ 'p-invalid': !productData.name_ar }"
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
            class="w-full"
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
            class="w-full"
          />
        </div>

        <!-- English Description -->
        <div class="md:col-span-2 space-y-2">
          <label for="description_en" class="block text-sm font-medium text-gray-700">
            {{ t('product.descriptionEn') }}
          </label>
          <Textarea
            id="description_en"
            v-model="productData.description_en"
            rows="4"
            class="w-full"
          />
        </div>

        <!-- Arabic Description -->
        <div class="md:col-span-2 space-y-2">
          <label for="description_ar" class="block text-sm font-medium text-gray-700">
            {{ t('product.descriptionAr') }}
          </label>
          <Textarea
            id="description_ar"
            v-model="productData.description_ar"
            rows="4"
            dir="rtl"
            class="w-full"
          />
        </div>

        <!-- Base Price -->
        <div class="space-y-2">
          <label for="base_price" class="block text-sm font-medium text-gray-700">
            {{ t('product.basePrice') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="base_price"
            v-model="productData.base_price"
            mode="decimal"
            :minFractionDigits="2"
            class="w-full"
            :class="{ 'p-invalid': !productData.base_price }"
          />
        </div>

        <!-- Cost Price -->
        <div class="space-y-2">
          <label for="cost_price" class="block text-sm font-medium text-gray-700">
            {{ t('product.costPrice') }}
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
            {{ t('product.tax') }} (%)
          </label>
          <InputNumber
            id="tax"
            v-model="productData.tax"
            mode="decimal"
            :min="0"
            :max="100"
            :minFractionDigits="2"
            class="w-full"
          />
        </div>

        <!-- Display Status -->
        <div class="space-y-2">
          <label for="is_displayed" class="block text-sm font-medium text-gray-700">
            {{ t('product.displayStatus') }}
          </label>
          <InputSwitch
            id="is_displayed"
            v-model="productData.is_displayed"
          />
        </div>

        <!-- Variants Toggle -->
        <div class="md:col-span-2 space-y-2">
          <div class="flex items-center">
            <Checkbox
              v-model="hasVariants"
              inputId="hasVariants"
              :binary="true"
              @click="toggleVariants"
              class="mr-2"
            />
            <label for="hasVariants" class="text-sm font-medium text-gray-700">
              {{ t('product.hasVariants') }}
            </label>
          </div>
        </div>

        <!-- Variants Section -->
        <div v-if="hasVariants" class="md:col-span-2 space-y-4">
          <div class="border-b pb-2">
            <h3 class="text-lg font-semibold text-gray-800">{{ t('product.variants') }}</h3>
          </div>

          <div v-for="(variant, index) in productData.variants" :key="index" class="p-3 border rounded-lg space-y-3 bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Attribute Values -->
              <div class="space-y-2 md:col-span-2">
                <label :for="'attributes_' + index" class="block text-xs font-medium text-gray-700">
                  {{ t('product.attributes') }} <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  :id="'attributes_' + index"
                  v-model="variant.attribute_value_ids"
                  :options="formattedAttributes"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  :optionLabel="labelField"
                  optionValue="id"
                  class="w-full"
                  :class="{ 'p-invalid': variant.attribute_value_ids.length === 0 }"
                  display="chip"
                  :filter="true"
                  :showToggleAll="false"
                />
              </div>

              <!-- SKU - NOT REQUIRED -->
              <div class="space-y-2">
                <label :for="'sku_' + index" class="block text-xs font-medium text-gray-700">
                  {{ t('product.sku') }}
                </label>
                <InputText
                  :id="'sku_' + index"
                  v-model="variant.sku"
                  class="w-full"
                />
              </div>

              <!-- Price - REQUIRED -->
              <div class="space-y-2">
                <label :for="'price_' + index" class="block text-xs font-medium text-gray-700">
                  {{ t('product.price') }} <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  :id="'price_' + index"
                  v-model="variant.price"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  :class="{ 'p-invalid': !variant.price }"
                />
              </div>

              <!-- Cost Price -->
              <div class="space-y-2">
                <label :for="'cost_price_' + index" class="block text-xs font-medium text-gray-700">
                  {{ t('product.costPrice') }}
                </label>
                <InputNumber
                  :id="'cost_price_' + index"
                  v-model="variant.cost_price"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                />
              </div>

              <!-- Variant Image Upload -->
              <div class="space-y-2">
                <label :for="'variant_image_' + index" class="block text-xs font-medium text-gray-700">
                  {{ t('product.variantImage') }}
                </label>
                <label
                  :for="'variant_image_' + index"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="onVariantImageUpload($event, index)"
                  :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
                  class="cursor-pointer w-full rounded-md border-2 border-dashed transition-colors duration-200 block p-2"
                >
                  <input
                    type="file"
                    :id="'variant_image_' + index"
                    @change="onVariantImageUpload($event, index)"
                    accept="image/*"
                    class="hidden"
                  />
                  <div v-if="variant.variant_image_preview" class="p-2">
                    <div class="relative group">
                      <img
                        :src="variant.variant_image_preview"
                        alt="Variant Preview"
                        class="w-full h-20 object-contain rounded-md shadow-sm"
                      />
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200 rounded-md">
                        <button
                          type="button"
                          @click.stop="removeVariantImage(index)"
                          class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                          :title="t('product.deleteImage')"
                        >
                          <i class="pi pi-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <p class="mt-1 text-center text-xs text-gray-500">{{ t('product.changeImage') }}</p>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center p-2">
                    <div class="bg-blue-100 p-1 rounded-full mb-1">
                      <i class="pi pi-image text-blue-500 text-sm"></i>
                    </div>
                    <p class="text-[10px] text-center text-gray-600">
                      <span class="text-blue-500 font-medium">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
                    </p>
                    <p class="text-[9px] text-gray-400">{{ t('product.imageFormat') }}</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <Button
                type="button"
                icon="pi pi-trash"
                class="p-button-danger p-button-sm text-xs"
                @click="removeVariant(index)"
                :disabled="productData.variants.length === 1"
                :label="t('product.removeVariant')"
              />
            </div>
          </div>

          <Button
            type="button"
            :label="t('product.addVariant')"
            icon="pi pi-plus"
            class="p-button-outlined p-button-secondary text-sm"
            @click="addVariant"
          />
        </div>

        <!-- Main Image Upload -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            {{ t('product.mainImage') }} <span class="text-red-500">*</span>
          </label>
          <label
            for="main_image_upload"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onMainImageUpload"
            :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
            class="cursor-pointer w-full rounded-md border-2 border-dashed transition-colors duration-200 p-3 block"
          >
            <input
              type="file"
              id="main_image_upload"
              @change="onMainImageUpload"
              accept="image/*"
              class="hidden"
            />
            <div v-if="mainImagePreview" class="flex flex-col items-center">
              <div class="relative group">
                <img
                  :src="mainImagePreview"
                  alt="Main Preview"
                  class="w-full h-24 object-contain rounded-md shadow-sm"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200 rounded-md">
                  <button
                    type="button"
                    @click.stop="removeMainImage"
                    class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    :title="t('product.deleteImage')"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <p class="mt-1 text-center text-xs text-gray-500">{{ t('product.changeImage') }}</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center space-y-2 p-2">
              <div class="bg-blue-100 p-2 rounded-full">
                <i class="pi pi-image text-blue-500 text-base"></i>
              </div>
              <p class="text-xs text-center text-gray-600">
                <span class="text-blue-500 font-medium">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
              </p>
              <p class="text-[10px] text-gray-400">{{ t('product.imageFormat') }}</p>
            </div>
          </label>
        </div>

        <!-- Additional Images Upload -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('product.additionalImages') }}</label>
          <label
            for="additional_images_upload"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onAdditionalImagesUpload"
            :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
            class="cursor-pointer w-full rounded-md border-2 border-dashed transition-colors duration-200 p-3 block"
          >
            <input
              type="file"
              id="additional_images_upload"
              @change="onAdditionalImagesUpload"
              accept="image/*"
              multiple
              class="hidden"
            />
            <div v-if="additionalImagePreviews.length > 0" class="space-y-3">
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <div v-for="(preview, index) in additionalImagePreviews" :key="index" class="relative group">
                  <img
                    :src="preview"
                    alt="Additional Preview"
                    class="w-full h-20 object-cover rounded-md shadow-sm"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200 rounded-md">
                    <button
                      type="button"
                      @click.stop="removeAdditionalImage(index)"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      :title="t('product.deleteImage')"
                    >
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="text-center text-xs text-gray-500">{{ t('product.addMoreImages') }}</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center space-y-2 p-2">
              <div class="bg-blue-100 p-2 rounded-full">
                <i class="pi pi-images text-blue-500 text-base"></i>
              </div>
              <p class="text-xs text-center text-gray-600">
                <span class="text-blue-500 font-medium">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
              </p>
              <p class="text-[10px] text-gray-400">{{ t('product.imageFormat') }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('product.cancelButton')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="p-button-outlined mx-3 p-button-secondary text-sm"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('product.createButton')"
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
.p-dropdown, .p-multiselect, .p-inputtext, .p-inputnumber, .p-inputtextarea {
  width: 100%;
}

.p-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.p-invalid {
  border-color: #f44336 !important;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}
</style>
