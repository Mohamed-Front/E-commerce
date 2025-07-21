<script setup>
import { ref, onMounted ,computed} from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from "vue-router";
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const brandLabelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);
const isDragging = ref(false);
const modelId = ref(route.params.id);
const brands = ref([]);

// Form Data
const modelData = ref({
  name_en: '',
  name_ar: '',
  brand_id: null,
  image: null
});

// Fetch model data
const fetchModel = async () => {
  try {
    loading.value = true;
    const [modelResponse, brandsResponse] = await Promise.all([
      axios.get(`/api/model/${modelId.value}`),
      axios.get('/api/brand')
    ]);

    modelData.value = modelResponse.data.data;

    brands.value = brandsResponse.data.data.data;


      imagePreview.value = modelResponse.data?.data?.media[0]?.url;

    loading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.add({
      severity: 'error',
      summary: t("error"),
      detail: error.response?.data?.message || 'Failed to fetch data',
      life: 3000
    });
    loading.value = false;

  }
};

onMounted(() => {
  fetchModel();
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
  modelData.value.image = null;
};

// Submit form
const submitForm = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('name_en', modelData.value.name_en);
  formData.append('name_ar', modelData.value.name_ar);
  formData.append('brand_id', modelData.value.brand_id);
  formData.append('_method', 'PUT');

  if (imageFile.value) {
    formData.append('image', imageFile.value);
  } else if (modelData.value.image === null) {
    formData.append('remove_image', 'true');
  }

  axios.post(`/api/model/${modelId.value}`, formData)
    .then(response => {
      router.push({name: 'model'});
      toast.add({
        severity: 'success',
        summary: t("success"),
        detail: 'Model updated successfully',
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
  <div v-can="'edit models'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Edit Model</h1>

    <Form ref="form" @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            English Name <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="modelData.name_en"
            placeholder="Enter model name in English"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.name_en">{{ form.errors.name_en[0] }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            Arabic Name <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="modelData.name_ar"
            placeholder="أدخل اسم الموديل بالعربية"
            dir="rtl"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.name_ar">{{ form.errors.name_ar[0] }}</small>
        </div>

        <!-- Brand Selection -->
        <div class="space-y-2">
          <label for="brand_id" class="block text-sm font-medium text-gray-700">
            Brand <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
          id="brand_id"
          v-model="modelData.brand_id"
          :options="brands"
          :optionLabel="brandLabelField"
          optionValue="id"
          placeholder="Select a brand"
          class="w-full"
        />
          <small class="text-red-500 text-xs" v-if="form?.errors?.brand_id">{{ form.errors.brand_id[0] }}</small>
        </div>

        <!-- Image Upload -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">Model Image</label>

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
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <div class="opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <label
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                        <input type="file" @change="onImageUpload" accept="image/*" class="hidden">
                      </label>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">Click or drag to change image</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          label="Cancel"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 mx-2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        />

        <Button
          type="submit"
          label="Update Model"
          icon="pi pi-check"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">Update Model</span>
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
