<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);

// Form Data
const storeData = ref({
  name_en: '',
  name_ar: '',
  is_default: false,
  has_market: false,
  store_image: null,
  main_banner_image: null,
  sub_banner_image: null,
  slider_images_one: [],
  slider_images_two: [],
  slider_images_three: []
});

// Image previews
const storeImagePreview = ref(null);
const mainBannerPreview = ref(null);
const subBannerPreview = ref(null);
const sliderOnePreviews = ref([]);
const sliderTwoPreviews = ref([]);
const sliderThreePreviews = ref([]);

// Drag states
const isDraggingStoreImage = ref(false);
const isDraggingMainBanner = ref(false);
const isDraggingSubBanner = ref(false);
const isDraggingSliderOne = ref(false);
const isDraggingSliderTwo = ref(false);
const isDraggingSliderThree = ref(false);

// Handle image uploads
const handleImageUpload = (file, type) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    switch (type) {
      case 'store':
        storeData.value.store_image = file;
        storeImagePreview.value = e.target.result;
        isDraggingStoreImage.value = false;
        break;
      case 'main_banner':
        storeData.value.main_banner_image = file;
        mainBannerPreview.value = e.target.result;
        isDraggingMainBanner.value = false;
        break;
      case 'sub_banner':
        storeData.value.sub_banner_image = file;
        subBannerPreview.value = e.target.result;
        isDraggingSubBanner.value = false;
        break;
    }
  };
  reader.readAsDataURL(file);
};

const handleSliderUpload = (files, type) => {
  const newPreviews = [];
  const newFiles = [];

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPreviews.push(e.target.result);
      newFiles.push(file);

      if (newPreviews.length === files.length) {
        if (type === 'slider_one') {
          storeData.value.slider_images_one = [...storeData.value.slider_images_one, ...newFiles];
          sliderOnePreviews.value = [...sliderOnePreviews.value, ...newPreviews];
          isDraggingSliderOne.value = false;
        } else if (type === 'slider_two') {
          storeData.value.slider_images_two = [...storeData.value.slider_images_two, ...newFiles];
          sliderTwoPreviews.value = [...sliderTwoPreviews.value, ...newPreviews];
          isDraggingSliderTwo.value = false;
        } else if (type === 'slider_three') {
          storeData.value.slider_images_three = [...storeData.value.slider_images_three, ...newFiles];
          sliderThreePreviews.value = [...sliderThreePreviews.value, ...newPreviews];
          isDraggingSliderThree.value = false;
        }
      }
    };
    reader.readAsDataURL(file);
  });
};

const onImageUpload = (event, type) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file && file.type.match('image.*')) {
    handleImageUpload(file, type);
  }
};

const onSliderUpload = (event, type) => {
  const files = event.target.files || event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleSliderUpload(files, type);
  }
};

// Remove images
const removeImage = (type) => {
  switch (type) {
    case 'store':
      storeData.value.store_image = null;
      storeImagePreview.value = null;
      break;
    case 'main_banner':
      storeData.value.main_banner_image = null;
      mainBannerPreview.value = null;
      break;
    case 'sub_banner':
      storeData.value.sub_banner_image = null;
      subBannerPreview.value = null;
      break;
  }
};

const removeSliderImage = (index, type) => {
  if (type === 'slider_one') {
    storeData.value.slider_images_one.splice(index, 1);
    sliderOnePreviews.value.splice(index, 1);
  } else if (type === 'slider_two') {
    storeData.value.slider_images_two.splice(index, 1);
    sliderTwoPreviews.value.splice(index, 1);
  } else if (type === 'slider_three') {
    storeData.value.slider_images_three.splice(index, 1);
    sliderThreePreviews.value.splice(index, 1);
  }
};

// Submit form
const submitForm = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('name_en', storeData.value.name_en);
  formData.append('name_ar', storeData.value.name_ar);
  formData.append('is_default', storeData.value.is_default ? '1' : '0');
  formData.append('has_market', storeData.value.has_market ? '1' : '0');

  if (storeData.value.store_image) {
    formData.append('store_image', storeData.value.store_image);
  }
  if (storeData.value.main_banner_image) {
    formData.append('main_banner_image', storeData.value.main_banner_image);
  }
  if (storeData.value.sub_banner_image) {
    formData.append('sub_banner_image', storeData.value.sub_banner_image);
  }

  storeData.value.slider_images_one.forEach((file, index) => {
    formData.append(`slider_images_one[${index}]`, file);
  });

  storeData.value.slider_images_two.forEach((file, index) => {
    formData.append(`slider_images_two[${index}]`, file);
  });

  storeData.value.slider_images_three.forEach((file, index) => {
    formData.append(`slider_images_three[${index}]`, file);
  });

  try {
    await axios.post("/api/store", formData);

    router.push({name: 'stores'});
    toast.add({
      severity: 'success',
      summary: t("success"),
      detail: t("store.createdSuccess"),
      life: 3000
    });
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: error.response?.data?.message || t("store.createError"),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-can="'create stores'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('store.createTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ t('store.nameEn') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="storeData.name_en"
            :placeholder="t('store.enterNameEn')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('store.nameAr') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="storeData.name_ar"
            :placeholder="t('store.enterNameAr')"
            dir="rtl"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Toggle Buttons -->
        <div class="space-y-4 md:col-span-2">
          <div class="flex items-center space-x-4">
            <label class="block text-sm font-medium text-gray-700 mx-2">{{ t('store.isDefault') }}</label>
            <InputSwitch v-model="storeData.is_default" />
          </div>

          <div class="flex items-center space-x-4">
            <label class="block text-sm font-medium text-gray-700 mx-2">{{ t('store.hasMarket') }}</label>
            <InputSwitch v-model="storeData.has_market" />
          </div>
        </div>

        <!-- Store Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('store.storeLogo') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingStoreImage = true"
              @dragleave="isDraggingStoreImage = false"
              @drop.prevent="onImageUpload($event, 'store')"
              :class="{'border-blue-500 bg-blue-50': isDraggingStoreImage, 'border-gray-300': !isDraggingStoreImage}"
              class="cursor-pointer w-full h-48 rounded-xl border-2 border-dashed transition-colors duration-300 flex items-center justify-center"
            >
              <input type="file" @change="onImageUpload($event, 'store')" accept="image/*" class="hidden">

              <div v-if="storeImagePreview" class="p-4 w-full h-full">
                <div class="relative group w-full h-full">
                  <img
                    :src="storeImagePreview"
                    :alt="t('store.storeLogo')"
                    class="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeImage('store')"
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
                  <span class="text-blue-500 font-medium">{{ t('store.clickToUpload') }}</span> {{ t('store.orDragDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Main Banner Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('store.mainBanner') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingMainBanner = true"
              @dragleave="isDraggingMainBanner = false"
              @drop.prevent="onImageUpload($event, 'main_banner')"
              :class="{'border-blue-500 bg-blue-50': isDraggingMainBanner, 'border-gray-300': !isDraggingMainBanner}"
              class="cursor-pointer w-full h-48 rounded-xl border-2 border-dashed transition-colors duration-300 flex items-center justify-center"
            >
              <input type="file" @change="onImageUpload($event, 'main_banner')" accept="image/*" class="hidden">

              <div v-if="mainBannerPreview" class="p-4 w-full h-full">
                <div class="relative group w-full h-full">
                  <img
                    :src="mainBannerPreview"
                    :alt="t('store.mainBanner')"
                    class="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeImage('main_banner')"
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
                  <span class="text-blue-500 font-medium">{{ t('store.clickToUpload') }}</span> {{ t('store.orDragDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Sub Banner Image -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('store.subBanner') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingSubBanner = true"
              @dragleave="isDraggingSubBanner = false"
              @drop.prevent="onImageUpload($event, 'sub_banner')"
              :class="{'border-blue-500 bg-blue-50': isDraggingSubBanner, 'border-gray-300': !isDraggingSubBanner}"
              class="cursor-pointer w-full max-w-2xl h-48 rounded-xl border-2 border-dashed transition-colors duration-300 flex items-center justify-center"
            >
              <input type="file" @change="onImageUpload($event, 'sub_banner')" accept="image/*" class="hidden">

              <div v-if="subBannerPreview" class="p-4 w-full h-full">
                <div class="relative group w-full h-full">
                  <img
                    :src="subBannerPreview"
                    :alt="t('store.subBanner')"
                    class="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeImage('sub_banner')"
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
                  <span class="text-blue-500 font-medium">{{ t('store.clickToUpload') }}</span> {{ t('store.orDragDrop') }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Slider Images One -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('store.sliderOne') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingSliderOne = true"
              @dragleave="isDraggingSliderOne = false"
              @drop.prevent="onSliderUpload($event, 'slider_one')"
              :class="{'border-blue-500 bg-blue-50': isDraggingSliderOne, 'border-gray-300': !isDraggingSliderOne}"
              class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="onSliderUpload($event, 'slider_one')" accept="image/*" multiple class="hidden">

              <div v-if="sliderOnePreviews.length > 0" class="p-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div v-for="(preview, index) in sliderOnePreviews" :key="index" class="relative group">
                    <img
                      :src="preview"
                      :alt="`${t('store.sliderOne')} ${index + 1}`"
                      class="w-full h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    >
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                      <button
                        type="button"
                        @click.stop="removeSliderImage(index, 'slider_one')"
                        class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{ t('store.clickOrDragMore') }}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-images text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ t('store.clickToUpload') }}</span> {{ t('store.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ t('store.multipleImages') }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Slider Images Two -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('store.sliderTwo') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingSliderTwo = true"
              @dragleave="isDraggingSliderTwo = false"
              @drop.prevent="onSliderUpload($event, 'slider_two')"
              :class="{'border-blue-500 bg-blue-50': isDraggingSliderTwo, 'border-gray-300': !isDraggingSliderTwo}"
              class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="onSliderUpload($event, 'slider_two')" accept="image/*" multiple class="hidden">

              <div v-if="sliderTwoPreviews.length > 0" class="p-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div v-for="(preview, index) in sliderTwoPreviews" :key="index" class="relative group">
                    <img
                      :src="preview"
                      :alt="`${t('store.sliderTwo')} ${index + 1}`"
                      class="w-full h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    >
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                      <button
                        type="button"
                        @click.stop="removeSliderImage(index, 'slider_two')"
                        class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{ t('store.clickOrDragMore') }}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-images text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ t('store.clickToUpload') }}</span> {{ t('store.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ t('store.multipleImages') }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Slider Images Three -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ t('store.sliderThree') }}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="isDraggingSliderThree = true"
              @dragleave="isDraggingSliderThree = false"
              @drop.prevent="onSliderUpload($event, 'slider_three')"
              :class="{'border-blue-500 bg-blue-50': isDraggingSliderThree, 'border-gray-300': !isDraggingSliderThree}"
              class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="onSliderUpload($event, 'slider_three')" accept="image/*" multiple class="hidden">

              <div v-if="sliderThreePreviews.length > 0" class="p-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div v-for="(preview, index) in sliderThreePreviews" :key="index" class="relative group">
                    <img
                      :src="preview"
                      :alt="`${t('store.sliderThree')} ${index + 1}`"
                      class="w-full h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    >
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                      <button
                        type="button"
                        @click.stop="removeSliderImage(index, 'slider_three')"
                        class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{ t('store.clickOrDragMore') }}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-images text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ t('store.clickToUpload') }}</span> {{ t('store.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ t('store.multipleImages') }}</p>
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
          class="px-6 py-3 bg-gray-200 mx-2 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          :disabled="loading"
        />

        <Button
          type="submit"
          :label="t('store.createStore')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r mx-2 from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('store.createStore') }}</span>
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
</style>
