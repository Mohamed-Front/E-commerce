<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
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
const mainImages = ref([]);
const mainImagePreviews = ref([]);

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
  cost_price: null,
  tax: 0,
  is_displayed: true,
  variants: []
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

// Fetch product data
const fetchProduct = async () => {
  try {
    const response = await axios.get(`/api/product/${route.params.id}`);
    const data = response.data.data;

    productData.value = {
      store_id: data.store_id,
      category_id: data.category_id,
      brand_id: data.brand_id,
      name_en: data.name_en,
      name_ar: data.name_ar,
      sub_name_en: data.sub_name_en || '',
      sub_name_ar: data.sub_name_ar || '',
      description_en: data.description_en || '',
      description_ar: data.description_ar || '',
      base_price: data.base_price || null,
      cost_price: data.cost_price || null,
      tax: data.tax || 0,
      is_displayed: data.is_displayed === 1,
      variants: data.variants.map(variant => ({
        id: variant.id,
        sku_en: variant.sku_en,
        sku_ar: variant.sku_ar,
        price: variant.price,
        cost_price: variant.cost_price || null,
        attribute_value_ids: variant.attribute_values.map(av => av.id),
        variant_image: null,
        variant_image_preview: variant.media && variant.media.length > 0 ? variant.media[0].url : null
      })) || []
    };

    hasVariants.value = data.has_variants;

    // Set main image previews if available
    if (data.media && data.media.length > 0) {
      mainImagePreviews.value = data.media.map(media => media.url);
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error.productLoad'), life: 3000 });
  }
};

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
  fetchProduct();
});

// Handle drag events for main images
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle main images upload
const handleImageUpload = (files) => {
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
      mainImages.value.push(file);
      mainImagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  isDragging.value = false;
};

const onImageUpload = (event) => {
  const files = event.target.files || event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleImageUpload(files);
  }
};

// Remove main image
const removeMainImage = (index) => {
  mainImages.value.splice(index, 1);
  mainImagePreviews.value.splice(index, 1);
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
    id: null,
    sku_ar: '',
    sku_en: '',
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
  const requiredFields = ['store_id', 'category_id', 'brand_id', 'name_en', 'name_ar'];

  // Validate required fields
  if (requiredFields.some(field => !productData.value[field])) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.requiredFields'), life: 3000 });
    return;
  }

  // Validate variants or base_price
  if (hasVariants.value) {
    if (productData.value.variants.some(v => !v.sku_en || !v.sku_ar || !v.price || v.attribute_value_ids.length === 0)) {
      toast.add({ severity: 'error', summary: t('error'), detail: t('validation.variantRequiredFields'), life: 3000 });
      return;
    }
  } else if (!productData.value.base_price) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.basePriceRequired'), life: 3000 });
    return;
  }

  loading.value = true;
  const formData = new FormData();

  // Append basic product data
  formData.append('store_id', productData.value.store_id);
  formData.append('category_id', productData.value.category_id);
  formData.append('brand_id', productData.value.brand_id);
  formData.append('name_en', productData.value.name_en);
  formData.append('name_ar', productData.value.name_ar);
  formData.append('sub_name_en', productData.value.sub_name_en || '');
  formData.append('sub_name_ar', productData.value.sub_name_ar || '');
  formData.append('description_en', productData.value.description_en || '');
  formData.append('description_ar', productData.value.description_ar || '');
  formData.append('tax', productData.value.tax);
  formData.append('is_displayed', productData.value.is_displayed ? 1 : 0);

  // Append main images
  mainImages.value.forEach((image, index) => {
    formData.append(`main_images[${index}]`, image);
  });

  if (hasVariants.value) {
    productData.value.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][id]`, variant.id || '');
      formData.append(`variants[${index}][sku_en]`, variant.sku_en);
      formData.append(`variants[${index}][sku_ar]`, variant.sku_ar);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][cost_price]`, variant.cost_price || 0);

      // Ensure attribute_value_ids is an array and properly formatted
      if (Array.isArray(variant.attribute_value_ids)) {
        variant.attribute_value_ids.forEach((attrId, attrIndex) => {
          formData.append(`variants[${index}][attribute_value_ids][${attrIndex}]`, attrId);
        });
      }

      if (variant.variant_image) {
        formData.append(`variants[${index}][variant_image]`, variant.variant_image);
      }
    });
  } else {
    formData.append('base_price', productData.value.base_price);
    formData.append('cost_price', productData.value.cost_price || 0);
  }

  try {
    await axios.post(`/api/product/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    router.push({ name: 'product' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('product.updateSuccess'), life: 3000 });
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
</script>

<template>
  <div v-can="'update product inventories'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg" :dir="isRTL ? 'rtl' : 'ltr'">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('product.updateTitle') }}</h1>

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

        <!-- Base Price and Cost Price (when no variants) -->
        <template v-if="!hasVariants">
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
        </template>

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

          <div v-for="(variant, index) in productData.variants" :key="index" class="p-4 border rounded-lg space-y-4 bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Attribute Values -->
              <div class="space-y-2 md:col-span-2">
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
                  :class="{ 'p-invalid': variant.attribute_value_ids.length === 0 }"
                  display="chip"
                  :filter="true"
                  :showToggleAll="false"
                />
              </div>

              <!-- SKU English -->
              <div class="space-y-2">
                <label :for="'sku_en_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.skuEn') }} <span class="text-red-500">*</span>
                </label>
                <InputText
                  :id="'sku_en_' + index"
                  v-model="variant.sku_en"
                  class="w-full"
                  :class="{ 'p-invalid': !variant.sku_en }"
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
                  class="w-full"
                  :class="{ 'p-invalid': !variant.sku_ar }"
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
                  :class="{ 'p-invalid': !variant.price }"
                />
              </div>

              <!-- Cost Price -->
              <div class="space-y-2">
                <label :for="'cost_price_' + index" class="block text-sm font-medium text-gray-700">
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
                <label :for="'variant_image_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.variantImage') }}
                </label>
                <label
                  :for="'variant_image_' + index"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="onVariantImageUpload($event, index)"
                  :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
                  class="cursor-pointer w-full rounded-lg border-2 border-dashed transition-colors duration-300 block"
                >
                  <input
                    type="file"
                    :id="'variant_image_' + index"
                    @change="onVariantImageUpload($event, index)"
                    accept="image/*"
                    class="hidden"
                  />
                  <div v-if="variant.variant_image_preview" class="p-4">
                    <div class="relative group">
                      <img
                        :src="variant.variant_image_preview"
                        alt="Variant Preview"
                        class="w-full h-32 object-contain rounded-lg shadow-md"
                      />
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                        <button
                          type="button"
                          @click.stop="removeVariantImage(index)"
                          class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                          :title="t('product.deleteImage')"
                        >
                          <i class="pi pi-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                    <p class="mt-2 text-center text-sm text-gray-500">{{ t('product.changeImage') }}</p>
                  </div>
                  <div v-else class="p-4 flex flex-col items-center justify-center">
                    <div class="bg-blue-100 p-2 rounded-full mb-2">
                      <i class="pi pi-image text-blue-500 text-xl"></i>
                    </div>
                    <p class="text-xs text-center text-gray-600">
                      <span class="text-blue-500 font-medium">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
                    </p>
                    <p class="text-xs text-gray-400">{{ t('product.imageFormat') }}</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <Button
                type="button"
                icon="pi pi-trash"
                class="p-button-danger p-button-sm"
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
            class="p-button-outlined p-button-secondary"
            @click="addVariant"
          />
        </div>

        <!-- Main Images Upload -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('product.images') }}</label>
          <label
            for="main_images_upload"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onImageUpload"
            :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
            class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300 p-6 block"
          >
            <input
              type="file"
              id="main_images_upload"
              @change="onImageUpload"
              accept="image/*"
              multiple
              class="hidden"
            />
            <div v-if="mainImagePreviews.length > 0" class="space-y-4">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="(preview, index) in mainImagePreviews" :key="index" class="relative group">
                  <img
                    :src="preview"
                    alt="Preview"
                    class="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeMainImage(index)"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      :title="t('product.deleteImage')"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="text-center text-sm text-gray-500">{{ t('product.addMoreImages') }}</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center space-y-3">
              <div class="bg-blue-100 p-3 rounded-full">
                <i class="pi pi-images text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-center text-gray-600">
                <span class="text-blue-500 font-medium">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
              </p>
              <p class="text-xs text-gray-400">{{ t('product.imageFormat') }}</p>
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
          class="p-button-outlined p-button-secondary"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('product.updateButton')"
          icon="pi pi-check"
          :loading="loading"
          class="p-button-success"
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

.duration-300 {
  transition-duration: 300ms;
}
</style>
