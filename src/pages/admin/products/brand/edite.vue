<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);
const isDragging = ref(false);
const brandId = ref(route.params.id);

// Form Data
const brandData = ref({
  name_en: '',
  name_ar: '',
  image: null
});

// Fetch brand data
const fetchBrand = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/brand/${brandId.value}`);
    brandData.value = response.data.data;

    if (response.data.data.media[0].url) {
      imagePreview.value = response.data.data.media[0].url; // Assuming your API returns image_url
    }

    loading.value = false;
  } catch (error) {
    console.error("Error fetching brand:", error);
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: error.response?.data?.message || 'Failed to fetch brand',
      life: 3000
    });
    loading.value = false;
    router.push({ name: 'brand' });
  }
};

onMounted(() => {
  fetchBrand();
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
  if (file && file.type.match('image.*')) {
    handleImageUpload(file);
  }
};

// Remove image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
  brandData.value.image = null; // This will tell the backend to remove the image
};

// Submit form
const submitForm = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('name_en', brandData.value.name_en);
  formData.append('name_ar', brandData.value.name_ar);
  formData.append('_method', 'post'); // For Laravel to handle as PUT request

  if (imageFile.value) {
    formData.append('image', imageFile.value);
  } else if (brandData.value.image === null) {
    formData.append('remove_image', 'true');
  }

  axios.post(`/api/brand/${brandId.value}`, formData)
    .then(response => {
      router.push({name: 'brand'});
      toast.add({
        severity: 'success',
        summary: t("success"),
        detail: 'Brand updated successfully',
        life: 3000
      });
      loading.value = false;
    })
    .catch(error => {
      console.error("Error:", error);
      toast.add({
        severity: 'error',
        summary: t("error"),
        detail: error.response?.data?.message || 'An error occurred',
        life: 3000
      });
      loading.value = false;
    });
};
</script>

<template>
  <div  v-can="'edit brands'" class="max-w-5xl p-6 mx-auto bg-white shadow-lg rounded-xl">
    <h1 class="mb-8 text-3xl font-bold text-center text-gray-800">Edit Brand</h1>

    <Form ref="form" @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            English Name <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="brandData.name_en"
            placeholder="Enter brand name in English"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <small class="text-xs text-red-500" v-if="form?.errors?.name_en">{{ form.errors.name_en[0] }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            Arabic Name <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="brandData.name_ar"
            placeholder="أدخل اسم العلامة التجارية بالعربية"
            dir="rtl"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <small class="text-xs text-red-500" v-if="form?.errors?.name_ar">{{ form.errors.name_ar[0] }}</small>
        </div>

        <!-- Image Upload -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Brand Logo</label>

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
                  >
                  <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                    <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage"
                        class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                      >
                        <i class="text-sm pi pi-trash"></i>
                      </button>
                      <label
                        class="p-2 text-gray-700 transition bg-white rounded-full cursor-pointer hover:bg-gray-100"
                      >
                        <i class="text-sm pi pi-pencil"></i>
                        <input type="file" @change="onImageUpload" accept="image/*" class="hidden">
                      </label>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-sm text-center text-gray-500">Click or drag to change logo</p>
              </div>

              <div v-else class="flex flex-col items-center justify-center p-8">
                <div class="p-4 mb-4 bg-blue-100 rounded-full">
                  <i class="text-2xl text-blue-500 pi pi-image"></i>
                </div>
                <p class="mb-1 text-sm text-center text-gray-600">
                  <span class="font-medium text-blue-500">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-4 space-x-4">
        <Button
          type="button"
          label="Cancel"
          icon="pi pi-times"

          @click="router.go(-1)"
          class="flex items-center justify-center px-6 py-3 mx-2 space-x-2 text-gray-700 transition-all duration-300 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg"
          :disabled="loading"
        />

        <Button
          type="submit"
          label="Update Brand"
          icon="pi pi-check"
          :loading="loading"
          class="flex items-center justify-center px-8 py-3 space-x-2 text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
          :disabled="loading"
        >
          <span v-if="!loading">Update Brand</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </Form>
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
</style>
