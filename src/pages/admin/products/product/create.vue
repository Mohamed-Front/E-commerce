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

// Handle drag events for main image
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle main image upload
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

// Remove main image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
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
    productData.value.variants.push({
      sku_ar: '',
      sku_en: '',
      price: '',
      cost_price: null,
      attribute_value_ids: [],
      variant_image: null,
      variant_image_preview: null
    });
  } else if (!hasVariants.value) {
    productData.value.variants = [];
  }
};

const addVariant = () => {
  productData.value.variants.push({
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
    if (productData.value.variants.some(v => !v.sku_en || !v.sku_ar || !v.price || !v.attribute_value_ids.length)) {
      toast.add({ severity: 'error', summary: t('error'), detail: t('validation.variantRequiredFields'), life: 3000 });
      return;
    }
  } else if (!productData.value.base_price) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation.basePriceRequired'), life: 3000 });
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
  formData.append('tax', productData.value.tax);
  formData.append('is_displayed', productData.value.is_displayed ? 1 : 0);

  if (hasVariants.value) {
    productData.value.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][sku_en]`, variant.sku_en);
      formData.append(`variants[${index}][sku_ar]`, variant.sku_ar);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][cost_price]`, variant.cost_price || 0);
      formData.append(`variants[${index}][attribute_value_ids]`, JSON.stringify(variant.attribute_value_ids));
      if (variant.variant_image) {
        formData.append(`variants[${index}][variant_image]`, variant.variant_image);
      }
    });
  } else {
    formData.append('base_price', productData.value.base_price);
    formData.append('cost_price', productData.value.cost_price || 0);
  }

  if (imageFile.value) {
    formData.append('main_image', imageFile.value);
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
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('error.createError'), life: 3000 });
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
        <div v-if="hasVariants" class="md:col-span-2 space-y-4">
          <label class="block text-sm font-medium text-gray-700">{{ t('product.variants') }}</label>
          <div v-for="(variant, index) in productData.variants" :key="index" class="p-4 border rounded-lg space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- SKU English -->

                <div class="space-y-2">
                <label :for="'attributes_' + index" class=" text-sm font-medium text-gray-700">
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
              <div class="space-y-2">
                <label :for="'sku_en_' + index" class="block text-sm font-medium text-gray-700">
                  {{ t('product.skuEn') }} <span class="text-red-500">*</span>
                </label>
                <InputText
                  :id="'sku_en_' + index"
                  v-model="variant.sku_en"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  @dragover.prevent="handleDragOver"
                  @dragleave="handleDragLeave"
                  @drop.prevent="onVariantImageUpload($event, index)"
                  :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
                  class="cursor-pointer w-full rounded-lg border-2 border-dashed transition-colors duration-300"
                >
                  <input
                    type="file"
                    :id="'variant_image_' + index"
                    @change="onVariantImageUpload($event, index)"
                    accept="image/*"
                    class="hidden"
                  >
                  <div v-if="variant.variant_image_preview" class="p-4">
                    <div class="relative group">
                      <img
                        :src="variant.variant_image_preview"
                        alt="Variant Preview"
                        class="w-full h-20 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                        <div class="opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <button
                            type="button"
                            @click.stop="removeVariantImage(index)"
                            class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                            :title="t('product.deleteImage')"
                          >
                            <i class="pi pi-trash text-sm"></i>
                          </button>
                          <button
                            type="button"
                            class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                            :title="t('product.editImage')"
                          >
                            <i class="pi pi-pencil text-sm"></i>
                          </button>
                        </div>
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

        <!-- Main Image Upload -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('product.image') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="onImageUpload"
              :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
              class="cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="onImageUpload" accept="image/*" class="hidden">
              <div v-if="imagePreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="w-full h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <div class="opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        :title="t('product.deleteImage')"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <button
                        type="button"
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                        :title="t('product.editImage')"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{ t('product.changeImage') }}</p>
              </div>
              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ t('product.uploadClick') }}</span> {{ t('product.uploadDrag') }}
                </p>
                <p class="text-xs text-gray-400">{{ t('product.imageFormat') }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('product.cancelButton')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 py-3 mx-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('product.createButton')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 mx-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
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
