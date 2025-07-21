<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {useToast} from 'primevue/usetoast'
// Form Refs
const toast = useToast()
import { useI18n } from 'vue-i18n'
import {useRouter} from "vue-router";
const router = useRouter()
const { t } = useI18n()
const form = ref();
const loading = ref(false);
const roles = ref([]);
const imageFile = ref(null);
const imagePreview = ref(null);
const isDragging = ref(false);

// Form Data
const userData = ref({
  name: '',
  phone: '',
  type: null,
  role_id: null,
  email: '',
  password: '',
});


const fetchRoles = async () => {
  try {
    const response = await axios.get('api/role');
    roles.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

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
};

// Submit form
const submitForm = async () => {

  loading.value = true;

  const formData = new FormData();
  formData.append('name', userData.value.name);
  formData.append('phone', userData.value.phone);
  formData.append('type', userData.value.type);
  formData.append('role_id', userData.value.role_id);
  formData.append('email', userData.value.email);
  formData.append('password', userData.value.password);

  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  axios.post("/api/user", formData)
    .then(response => {
      router.push({name:'users'})
      loading.value = false;
    })
    .catch(error => {
      console.error("Error:", error);
      toast.add({ severity: 'error', summary: t("error"), detail: error.response.data.message, life: 3000 });
      loading.value = false;
    });
};

onMounted(() => {
  fetchRoles();
});
</script>

<template>
  <div v-can="'create users'"  class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{$t("user.create_New_User")}}</h1>

    <Form ref="form" :model="userData" :rules="rules" @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name -->
        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium text-gray-700">
            {{$t("user.name")}} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name"
            v-model="userData.name"
            :placeholder='$t("user.enter_full_name")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.name">{{ form.errors.name[0].message }}</small>
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <label for="phone" class="block text-sm font-medium text-gray-700">
            {{$t("user.phone")}}  <span class="text-red-500">*</span>
          </label>
          <InputText
            id="phone"
            v-model="userData.phone"
            placeholder="+1 (___) ___-____"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.phone">{{ form.errors.phone[0].message }}</small>
        </div>

        <!-- Type -->
        <div class="space-y-2">
          <label for="type" class="block text-sm font-medium text-gray-700">
            {{$t("user.type")}}  <span class="text-red-500">*</span>
          </label>
          <Dropdown
           filter
            id="type"
            v-model="userData.type"
            :options="[
              { label: 'Admin', value: 1 },
              { label: 'customer', value: 2},
              { label: 'User', value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder='$t("user.select_user_type")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.type">{{ form.errors.type[0].message }}</small>
        </div>

        <!-- Role -->
        <div class="space-y-2">
          <label for="role" class="block text-sm font-medium text-gray-700">
            {{$t("user.role")}}  <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
            id="role"
            v-model="userData.role_id"
            :options="roles"
            optionLabel="name"
            optionValue="id"
            :placeholder='$t("user.select_role")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.role_id">{{ form.errors.role_id[0].message }}</small>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">
            {{$t("user.email")}}  <span class="text-red-500">*</span>
          </label>
          <InputText
            id="email"
            v-model="userData.email"
            type="email"
            placeholder="user@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.email">{{ form.errors.email[0].message }}</small>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">
            {{$t("user.password")}}  <span class="text-red-500">*</span>
          </label>
          <Password
            id="password"
            v-model="userData.password"
            placeholder="••••••••"
            toggleMask
            :feedback="false"
            inputClass="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            class="w-full"
          />
          <small class="text-red-500 text-xs" v-if="form?.errors?.password">{{ form.errors.password[0].message }}</small>
        </div>

        <!-- Image Upload -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{$t("user.profile_Image")}}</label>

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
                    class="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
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
                      <button
                        type="button"
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{$t("user.click_or_drag_to_change_photo")}}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{$t("user.click_to_upload")}}</span> {{$t("user.or_drag_and_drop")}}
                </p>
                <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center">
        <Button
          type="submit"
          label="Create User"
          icon="pi pi-user-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{$t("user.create_User")}}</span>
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

/* Password input eye icon */
:deep(.p-password-input) {
  padding-right: 2.5rem;
}
:deep(.p-password-toggle) {
  right: 0.75rem;
}
</style>
