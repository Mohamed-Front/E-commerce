<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);

const marketLabelField = computed(() => {
  return localStorage.getItem('appLang') == 'ar' ? 'name_ar' : 'name_en';
});

// Form Data
const marketData = ref({
  name_en: '',
  name_ar: '',
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
const stores = ref([]);

// Drag states
const isDraggingImage = ref(false);
const isDraggingBannerOne = ref(false);
const isDraggingBannerTwo = ref(false);

// Fetch stores
const fetchStores = async () => {
  try {
    const response = await axios.get('/api/store');
    stores.value = response.data.data.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};

// Handle image uploads
const handleImageUpload = (file, type) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    switch (type) {
      case 'image':
        marketData.value.image = file;
        imagePreview.value = e.target.result;
        isDraggingImage.value = false;
        break;
      case 'banner_one':
        marketData.value.banner_one_image = file;
        bannerOnePreview.value = e.target.result;
        isDraggingBannerOne.value = false;
        break;
      case 'banner_two':
        marketData.value.banner_two_image = file;
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
      marketData.value.image = null;
      imagePreview.value = null;
      break;
    case 'banner_one':
      marketData.value.banner_one_image = null;
      bannerOnePreview.value = null;
      break;
    case 'banner_two':
      marketData.value.banner_two_image = null;
      bannerTwoPreview.value = null;
      break;
  }
};

// Submit form
const submitForm = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('name_en', marketData.value.name_en);
  formData.append('name_ar', marketData.value.name_ar);
  formData.append('store_id', marketData.value.store_id || '');

  if (marketData.value.image) {
    formData.append('image', marketData.value.image);
  }
  if (marketData.value.banner_one_image) {
    formData.append('banner_one_image', marketData.value.banner_one_image);
  }
  if (marketData.value.banner_two_image) {
    formData.append('banner_two_image', marketData.value.banner_two_image);
  }

  try {
    const response = await axios.post("/api/market", formData);

    router.push({name: 'markets'});
    toast.add({
      severity: 'success',
      summary: t("success"),
      detail: t('market.createSuccess'),
      life: 3000
    });
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: error.response?.data?.message || t('market.createError'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Initialize form
onMounted(() => {
  fetchStores();
});
</script>

<template>
  <div v-can="'create markets'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('market.createTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ t('market.nameEn') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="marketData.name_en"
            :placeholder="t('market.nameEnPlaceholder')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('market.nameAr') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="marketData.name_ar"
            :placeholder="t('market.nameArPlaceholder')"
            dir="rtl"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Store -->
        <div class="space-y-2 lg:col-span-2">
          <label for="store_id" class="block text-sm font-medium text-gray-700">
            {{ t('market.store') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            v-model="marketData.store_id"
            :options="stores"
            :optionLabel="marketLabelField"
            optionValue="id"
            :placeholder="t('market.selectStore')"
            class="w-full"
            required
          />
        </div>

        <!-- Market Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('market.image') }}</label>
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
                    :alt="t('market.imagePreview')"
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
                  <span class="text-blue-500 font-medium">{{ t('market.clickToUpload') }}</span> {{ t('market.orDragAndDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Banner One Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('market.bannerOne') }}</label>
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
                    :alt="t('market.bannerOnePreview')"
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
                  <span class="text-blue-500 font-medium">{{ t('market.clickToUpload') }}</span> {{ t('market.orDragAndDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Banner Two Image -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('market.bannerTwo') }}</label>
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
                    :alt="t('market.bannerTwoPreview')"
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
                  <span class="text-blue-500 font-medium">{{ t('market.clickToUpload') }}</span> {{ t('market.orDragAndDrop') }}
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
          :label="t('market.createButton')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 mx-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('market.createButton') }}</span>
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
