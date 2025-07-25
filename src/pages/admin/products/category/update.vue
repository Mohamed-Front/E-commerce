<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);

// Computed property for language-specific label field
const categoryLabelField = computed(() => {
  return localStorage.getItem('appLang') == 'ar' ? 'name_ar' : 'name_en';
});

// Form Data
const categoryData = ref({
  name_en: '',
  name_ar: '',
  is_market: false,
  parent_id: null,
  store_id: null,
  image: null,
  banner_one_image: null,
  banner_two_image: null
});

// Image previews
const imagePreview = ref(null);
const bannerOnePreview = ref(null);
const bannerTwoPreview = ref(null);

// Options
const parentCategories = ref([]);
const stores = ref([]);

// Drag states
const isDraggingImage = ref(false);
const isDraggingBannerOne = ref(false);
const isDraggingBannerTwo = ref(false);

// Fetch parent categories and stores
const fetchParentCategories = async () => {
  try {
    const response = await axios.get('/api/category');
    parentCategories.value = response.data.data.data;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
  }
};

const fetchStores = async () => {
  try {
    const response = await axios.get('/api/store');
    stores.value = response.data.data.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};

// Fetch category data by ID
const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`/api/category/${id}`);
    const category = response.data.data;

    // Populate form fields
    categoryData.value = {
      name_en: category.name_en || '',
      name_ar: category.name_ar || '',
      is_market: !!category.is_market,
      parent_id: category.parent_id || null,
      store_id: category.store_id || null,
      image: null, // File inputs cannot be pre-filled
      banner_one_image: null,
      banner_two_image: null
    };

    // Set image previews if images exist
    category.media.forEach(media => {
      if (media.name === 'category_image') {
        imagePreview.value = media.url;
      } else if (media.name === 'banner_one_image') {
        bannerOnePreview.value = media.url;
      } else if (media.name === 'banner_two_image') {
        bannerTwoPreview.value = media.url;
      }
    });
  } catch (error) {
    console.error("Error fetching category data:", error);
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: t('category.fetchError'),
      life: 3000
    });
  }
};

// Handle image uploads
const handleImageUpload = (file, type) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    switch (type) {
      case 'image':
        categoryData.value.image = file;
        imagePreview.value = e.target.result;
        isDraggingImage.value = false;
        break;
      case 'banner_one':
        categoryData.value.banner_one_image = file;
        bannerOnePreview.value = e.target.result;
        isDraggingBannerOne.value = false;
        break;
      case 'banner_two':
        categoryData.value.banner_two_image = file;
        bannerTwoPreview.value = e.target.result;
        isDraggingBannerTwo.value = false;
        break;
    }
  };
  reader.readAsDataURL(file);
};

const onImageUpload = (event, type) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file && file.type.match('image.*')) {
    handleImageUpload(file, type);
  }
};

// Remove images
const removeImage = (type) => {
  switch (type) {
    case 'image':
      categoryData.value.image = null;
      imagePreview.value = null;
      break;
    case 'banner_one':
      categoryData.value.banner_one_image = null;
      bannerOnePreview.value = null;
      break;
    case 'banner_two':
      categoryData.value.banner_two_image = null;
      bannerTwoPreview.value = null;
      break;
  }
};

// Submit form (handles both create and update)
const submitForm = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('name_en', categoryData.value.name_en);
  formData.append('name_ar', categoryData.value.name_ar);
  formData.append('is_market', categoryData.value.is_market ? '1' : '0');
  formData.append('parent_id', categoryData.value.parent_id || '');
  formData.append('store_id', categoryData.value.store_id || '');

  if (categoryData.value.image) {
    formData.append('image', categoryData.value.image);
  }
  if (categoryData.value.banner_one_image) {
    formData.append('banner_one_image', categoryData.value.banner_one_image);
  }
  if (categoryData.value.banner_two_image) {
    formData.append('banner_two_image', categoryData.value.banner_two_image);
  }

  try {
    const categoryId = route.params.id; // Get ID from route params
    const method = categoryId ? 'post' : 'post'; // Use PUT for update, POST for create
    const url = categoryId ? `/api/category/${categoryId}` : '/api/category';

    const response = await axios[method](url, formData);

    router.push({ name: 'category' });
    toast.add({
      severity: 'success',
      summary: t("success"),
      detail: categoryId ? t('category.updateSuccess') : t('category.createSuccess'),
      life: 3000
    });
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: error.response?.data?.message || (route.params.id ? t('category.updateError') : t('category.createError')),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Initialize form
onMounted(async () => {
  await fetchParentCategories();
  await fetchStores();

  // Check if an ID exists in the route params
  const categoryId = route.params.id;
  if (categoryId) {
    await fetchCategoryById(categoryId); // Fetch data for update
  }
});
</script>

<template>
  <div v-can="'create categories'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ route.params.id ? t('category.updateTitle') : t('category.createTitle') }}
    </h1>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Fields remain unchanged -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ t('category.nameEn') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="categoryData.name_en"
            :placeholder="t('category.nameEnPlaceholder')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('category.nameAr') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="categoryData.name_ar"
            :placeholder="t('category.nameArPlaceholder')"
            dir="rtl"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <!-- Parent Category -->
        <div class="space-y-2">
          <label for="parent_id" class="block text-sm font-medium text-gray-700">
            {{ t('category.parent') }}
          </label>
          <Dropdown
          filter
            v-model="categoryData.parent_id"
            :options="parentCategories"
            :optionLabel="categoryLabelField"
            optionValue="id"
            :placeholder="t('category.selectParent')"
            class="w-full"
            :showClear="true"
          />
        </div>
        <!-- Store -->
        <div class="space-y-2">
          <label for="store_id" class="block text-sm font-medium text-gray-700">
            {{ t('category.store') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
            v-model="categoryData.store_id"
            :options="stores"
            :optionLabel="categoryLabelField"
            optionValue="id"
            :placeholder="t('category.selectStore')"
            class="w-full"
            required
          />
        </div>
        <!-- Market Type -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('category.marketType') }}</label>
          <div class="flex items-center space-x-4">
            <InputSwitch v-model="categoryData.is_market" />
            <span class="text-sm text-gray-600">
              {{ categoryData.is_market ? t('category.market') : t('category.nonMarket') }}
            </span>
          </div>
        </div>
        <!-- Category Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('category.image') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingImage = true"
              @dragleave="isDraggingImage = false"
              @drop.prevent="onImageUpload($event, 'image')"
              :class="{'border-blue-500 bg-blue-50': isDraggingImage, 'border-gray-300': !isDraggingImage}"
              class="cursor-pointer w-full h-48 rounded-xl border-2 border-dashed transition-colors duration-300 flex items-center justify-center"
            >
              <input type="file" @change="onImageUpload($event, 'image')" accept="image/*" class="hidden">
              <div v-if="imagePreview" class="p-4 w-full h-full">
                <div class="relative group w-full h-full">
                  <img
                    :src="imagePreview"
                    :alt="t('category.imagePreview')"
                    class="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeImage('image')"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-3 rounded-full mb-2">
                  <i class="pi pi-image text-blue-500 text-xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600">
                  <span class="text-blue-500 font-medium">{{ t('category.clickToUpload') }}</span> {{ t('category.orDragAndDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>
        <!-- Banner One Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('category.bannerOne') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingBannerOne = true"
              @dragleave="isDraggingBannerOne = false"
              @drop.prevent="onImageUpload($event, 'banner_one')"
              :class="{'border-blue-500 bg-blue-50': isDraggingBannerOne, 'border-gray-300': !isDraggingBannerOne}"
              class="cursor-pointer w-full h-48 rounded-xl border-2 border-dashed transition-colors duration-300 flex items-center justify-center"
            >
              <input type="file" @change="onImageUpload($event, 'banner_one')" accept="image/*" class="hidden">
              <div v-if="bannerOnePreview" class="p-4 w-full h-full">
                <div class="relative group w-full h-full">
                  <img
                    :src="bannerOnePreview"
                    :alt="t('category.bannerOnePreview')"
                    class="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeImage('banner_one')"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-3 rounded-full mb-2">
                  <i class="pi pi-image text-blue-500 text-xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600">
                  <span class="text-blue-500 font-medium">{{ t('category.clickToUpload') }}</span> {{ t('category.orDragAndDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>
        <!-- Banner Two Image -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('category.bannerTwo') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingBannerTwo = true"
              @dragleave="isDraggingBannerTwo = false"
              @drop.prevent="onImageUpload($event, 'banner_two')"
              :class="{'border-blue-500 bg-blue-50': isDraggingBannerTwo, 'border-gray-300': !isDraggingBannerTwo}"
              class="cursor-pointer w-full max-w-2xl h-48 rounded-xl border-2 border-dashed transition-colors duration-300 flex items-center justify-center"
            >
              <input type="file" @change="onImageUpload($event, 'banner_two')" accept="image/*" class="hidden">
              <div v-if="bannerTwoPreview" class="p-4 w-full h-full">
                <div class="relative group w-full h-full">
                  <img
                    :src="bannerTwoPreview"
                    :alt="t('category.bannerTwoPreview')"
                    class="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeImage('banner_two')"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-3 rounded-full mb-2">
                  <i class="pi pi-image text-blue-500 text-xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600">
                  <span class="text-blue-500 font-medium">{{ t('category.clickToUpload') }}</span> {{ t('category.orDragAndDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
      <!-- Submit Button -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('cancel')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 py-3 mx-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="route.params.id ? t('category.updateButton') : t('category.createButton')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 mx-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ route.params.id ? t('category.updateButton') : t('category.createButton') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
  </div>
  <Toast/>
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
/* Button gradient animation */
button.bg-gradient-to-r:hover {
  background-size: 150% 100%;
}
</style>
