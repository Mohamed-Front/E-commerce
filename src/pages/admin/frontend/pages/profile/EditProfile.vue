<template>
  <div class="min-h-screen p-8 font-tajawal" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
        <ul class="space-y-2">
          <li
            @click="router.push({ name: 'profile' })"
            :class="[
              'p-3 rounded-lg flex items-center gap-4',
              isProfileRoute ? 'bg-yellow-100 text-yellow-700 font-medium' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
            ]"
            role="button"
            :aria-label="t('profile.account')"
            :aria-current="isProfileRoute ? 'page' : undefined"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.55556 4.44444C5.55556 3.2657 6.02381 2.13524 6.8573 1.30175C7.6908 0.468252 8.82126 0 10 0C11.1787 0 12.3092 0.468252 13.1427 1.30175C13.9762 2.13524 14.4444 3.2657 14.4444 4.44444C14.4444 5.62318 13.9762 6.75365 13.1427 7.58714C12.3092 8.42064 11.1787 8.88889 10 8.88889C8.82126 8.88889 7.6908 8.42064 6.8573 7.58714C6.02381 6.75365 5.55556 5.62318 5.55556 4.44444ZM5.55556 11.1111C4.08213 11.1111 2.66905 11.6964 1.62718 12.7383C0.585316 13.7802 0 15.1932 0 16.6667C0 17.5507 0.35119 18.3986 0.976311 19.0237C1.60143 19.6488 2.44928 20 3.33333 20H16.6667C17.5507 20 18.3986 19.6488 19.0237 19.0237C19.6488 18.3986 20 17.5507 20 16.6667C20 15.1932 19.4147 13.7802 18.3728 12.7383C17.3309 11.6964 15.9179 11.1111 14.4444 11.1111H5.55556Z"
                :fill="isProfileRoute ? '#F9C006' : '#807575'"
              />
            </svg>
            <span>{{ t('profile.account') }}</span>
          </li>
          <li
            @click="router.push({ name: 'orders' })"
            class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer"
            role="button"
            :aria-label="t('profile.orders')"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.837143 0.689412C-8.51495e-08 1.37882 0 2.48706 0 4.70588V15.2941C0 17.5129 -8.51495e-08 18.6212 0.837143 19.3106C1.67429 20 3.02 20 5.71429 20H14.2857C16.98 20 18.3257 20 19.1629 19.3106C20 18.6212 20 17.5129 20 15.2941V4.70588C20 2.48706 20 1.37882 19.1629 0.689412C18.3257 -7.01231e-08 16.98 0 14.2857 0H5.71429C3.02 0 1.67429 -7.01231e-08 0.837143 0.689412ZM5.71429 4.70588C5.33541 4.70588 4.97204 4.82983 4.70413 5.05046C4.43622 5.27109 4.28571 5.57033 4.28571 5.88235C4.28571 6.19437 4.43622 6.49361 4.70413 6.71424C4.97204 6.93487 5.33541 7.05882 5.71429 7.05882H14.2857C14.6646 7.05882 15.028 6.93487 15.2959 6.71424C15.5638 6.49361 15.7143 6.19437 15.7143 5.88235C15.7143 5.57033 15.5638 5.27109 15.2959 5.05046C15.028 4.82983 14.6646 4.70588 14.2857 4.70588H5.71429ZM5.71429 9.41177C5.33541 9.41177 4.97204 9.53571 4.70413 9.75635C4.43622 9.97698 4.28571 10.2762 4.28571 10.5882C4.28571 10.9003 4.43622 11.1995 4.70413 11.4201C4.97204 11.6408 5.33541 11.7647 5.71429 11.7647H14.2857C14.6646 11.7647 15.028 11.6408 15.2959 11.4201C15.5638 11.1995 15.7143 10.9003 15.7143 10.5882C15.7143 10.2762 15.5638 9.97698 15.2959 9.75635C15.028 9.53571 14.6646 9.41177 14.2857 9.41177H5.71429ZM5.71429 14.1176C5.33541 14.1176 4.97204 14.2416 4.70413 14.4622C4.43622 14.6829 4.28571 14.9821 4.28571 15.2941C4.28571 15.6061 4.43622 15.9054 4.70413 16.126C4.97204 16.3466 5.33541 16.4706 5.71429 16.4706H11.4286C11.8075 16.4706 12.1708 16.3466 12.4387 16.126C12.7066 15.9054 12.8571 15.6061 12.8571 15.2941C12.8571 14.9821 12.7066 14.6829 12.4387 14.4622C12.1708 14.2416 11.8075 14.1176 11.4286 14.1176H5.71429Z"
                fill="#807575"
              />
            </svg>
            <span>{{ t('profile.orders') }}</span>
          </li>
          <li
            @click="router.push({ name: 'addresses' })"
            class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer"
            role="button"
            :aria-label="t('profile.addresses')"
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M9 0C6.61392 0.00245748 4.32637 0.831051 2.63915 2.30402C0.951939 3.77699 0.0028245 5.77405 9.57508e-06 7.85714C-0.00284824 9.55945 0.634084 11.2156 1.8131 12.5714C1.8131 12.5714 2.05855 12.8536 2.09864 12.8943L9 20L15.9046 12.8907C15.9406 12.8529 16.1869 12.5714 16.1869 12.5714L16.1877 12.5693C17.3661 11.214 18.0028 9.55866 18 7.85714C17.9972 5.77405 17.0481 3.77699 15.3608 2.30402C13.6736 0.831051 11.3861 0.00245748 9 0ZM9 10.7143C8.35272 10.7143 7.71997 10.5467 7.18177 10.2328C6.64358 9.91882 6.2241 9.4726 5.9764 8.95052C5.72869 8.42845 5.66388 7.85397 5.79016 7.29974C5.91644 6.74551 6.22814 6.23642 6.68583 5.83684C7.14353 5.43726 7.72668 5.16514 8.36152 5.0549C8.99637 4.94466 9.6544 5.00124 10.2524 5.21749C10.8504 5.43374 11.3616 5.79994 11.7212 6.2698C12.0808 6.73965 12.2727 7.29205 12.2727 7.85714C12.2716 8.61461 11.9265 9.34079 11.313 9.8764C10.6994 10.412 9.86765 10.7133 9 10.7143Z"
                fill="#807575"
              />
            </svg>
            <span>{{ t('profile.addresses') }}</span>
          </li>
          <li
            @click="logout"
            class="p-3 rounded-lg flex items-center gap-4 text-red-500 hover:bg-gray-50 cursor-pointer"
            role="button"
            :aria-label="t('profile.logout')"
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M0 20V0H9V2.22222H2V17.7778H9V20H0ZM13 15.5556L11.625 13.9444L14.175 11.1111H6V8.88889H14.175L11.625 6.05556L13 4.44444L18 10L13 15.5556Z"
                fill="#FF1212"
              />
            </svg>
            <span>{{ t('profile.logout') }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-white rounded-xl shadow-md p-8">
        <h1 class="text-2xl font-bold text-center mb-8 text-gray-700">{{ t('profile.title') }}</h1>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-4">
          <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" class="text-blue-600" />
          <p class="ml-2">{{ t('loading') }}</p>
        </div>

        <!-- Profile Section -->
        <div v-else class="flex flex-col items-center gap-4 mb-8">
          <div :class="{ 'flex-row-reverse': $i18n.locale === 'ar', 'flex-row': $i18n.locale !== 'ar' }" class="flex items-center gap-4">
            <img
              class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              :src="profileImage || 'https://placehold.co/80x80/606c38/FFF'"
              :alt="t('profile.profileImageAlt')"
            />
            <div class="text-center">
              <h3 class="font-bold text-lg text-gray-800">{{ username }}</h3>
              <label for="profileImage" class="text-blue-500 text-sm hover:underline cursor-pointer">{{ t('profile.changeImage') }}</label>
              <input
                type="file"
                id="profileImage"
                @change="handleImageChange"
                accept="image/*"
                class="hidden"
                :aria-label="t('profile.changeImage')"
              />
            </div>
          </div>
          <p v-if="errors.profileImage" class="text-red-500 text-sm mt-1">{{ errors.profileImage }}</p>
        </div>

        <!-- Form for updating user details -->
        <form v-if="!loading" @submit.prevent="saveChanges" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">{{ t('profile.username') }}</label>
            <div class="relative rounded-md shadow-sm">
              <div
                :class="{ 'left-0': $i18n.locale === 'ar', 'right-0': $i18n.locale !== 'ar' }"
                class="absolute inset-y-0 px-3 flex items-center pointer-events-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="username"
                v-model="username"
                class="w-full px-4 py-3"
                :class="{
                  'pl-10': $i18n.locale === 'ar',
                  'pr-10': $i18n.locale !== 'ar',
                  'border-red-500': errors.username,
                  'border-gray-300': !errors.username,
                  'rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200': true
                }"
                :aria-invalid="!!errors.username"
                :aria-describedby="errors.username ? 'username-error' : undefined"
              />
              <p v-if="errors.username" id="username-error" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
            </div>
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">{{ t('profile.email') }}</label>
            <div class="relative rounded-md shadow-sm">
              <div
                :class="{ 'left-0': $i18n.locale === 'ar', 'right-0': $i18n.locale !== 'ar' }"
                class="absolute inset-y-0 px-3 flex items-center pointer-events-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                v-model="email"
                class="w-full px-4 py-3"
                :class="{
                  'pl-10': $i18n.locale === 'ar',
                  'pr-10': $i18n.locale !== 'ar',
                  'border-red-500': errors.email,
                  'border-gray-300': !errors.email,
                  'rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200': true
                }"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'email-error' : undefined"
              />
              <p v-if="errors.email" id="email-error" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
          </div>

          <!-- Phone Number Input -->
          <div class="md:col-span-2">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">{{ t('profile.phone') }}</label>
            <div
              class="flex items-center rounded-md shadow-sm border rounded-xl focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors duration-200"
              :class="{ 'border-red-500': errors.phoneNumber, 'border-gray-300': !errors.phoneNumber }"
            >
              <input
                type="tel"
                id="phone"
                v-model="phoneNumber"
                class="flex-1 block w-full px-4 py-3 bg-white rounded-xl focus:outline-none"
                :class="{ 'direction-ltr': $i18n.locale === 'ar' }"
                :aria-invalid="!!errors.phoneNumber"
                :aria-describedby="errors.phoneNumber ? 'phone-error' : undefined"
              />
            </div>
            <p v-if="errors.phoneNumber" id="phone-error" class="text-red-500 text-sm mt-1">{{ errors.phoneNumber }}</p>
          </div>

          <!-- Buttons -->
          <div
            class="md:col-span-2 flex gap-4 mt-8"
            :class="{ 'justify-end': $i18n.locale === 'ar', 'justify-start': $i18n.locale !== 'ar' }"
          >
            <button
              type="button"
              @click="cancel"
              class="px-6 py-3 border border-blue-500 text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors duration-200"
              :disabled="loading"
              :aria-label="t('profile.cancel')"
            >
              {{ t('profile.cancel') }}
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
              :disabled="loading"
              :aria-label="t('profile.save')"
            >
              {{ t('profile.save') }}
            </button>
          </div>
        </form>

        <!-- Toast for notifications -->
        <Toast />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../../../stores/WebAuth';

// i18n, Router, Toast, and Auth
const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

// Reactive variables for form data
const username = ref('');
const email = ref('');
const phoneNumber = ref('');
const profileImage = ref(null);
const selectedImage = ref(null);
const loading = ref(true);
const errors = ref({ username: '', email: '', phoneNumber: '', profileImage: '' });

// Computed property to check if the current route is 'profile' or 'editprofile'
const isProfileRoute = computed(() => ['profile', 'editprofile'].includes(route.name));

// Handle image selection
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.value.profileImage = t('profile.imageInvalid');
      selectedImage.value = null;
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.profileImage = t('profile.imageTooLarge');
      selectedImage.value = null;
      return;
    }
    errors.value.profileImage = '';
    selectedImage.value = file;
    profileImage.value = URL.createObjectURL(file); // Preview the image
  }
};

// Fetch profile data from API
const fetchProfile = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/profile');
    username.value = response.data.data.name || '';
    email.value = response.data.data.email || '';
    phoneNumber.value = response.data.data.phone || '';
    profileImage.value = response.data.data.media?.[0]?.url || null;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('profile.loadError'),
      life: 3000,
    });
    console.error('Error fetching profile:', error);
  } finally {
    loading.value = false;
  }
};

// Validate form data
const validateForm = () => {
  errors.value = { username: '', email: '', phoneNumber: '', profileImage: '' };
  let isValid = true;

  if (!username.value.trim()) {
    errors.value.username = t('profile.usernameRequired');
    isValid = false;
  }
  if (!email.value.trim()) {
    errors.value.email = t('profile.emailRequired');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = t('profile.emailInvalid');
    isValid = false;
  }
  if (!phoneNumber.value.trim()) {
    errors.value.phoneNumber = t('profile.phoneRequired');
    isValid = false;
  } else if (!/^\+?\d{10,}$/.test(phoneNumber.value)) {
    errors.value.phoneNumber = t('profile.phoneInvalid');
    isValid = false;
  }
  return isValid;
};

// Save changes to profile
const saveChanges = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    const formData = new FormData();
    formData.append('name', username.value);
    formData.append('email', email.value);
    formData.append('phone', phoneNumber.value);
    if (selectedImage.value) {
      formData.append('image', selectedImage.value);
    }

    const response = await axios.post('/api/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update profile image URL if returned by API
    if (response.data.data.profileImage) {
      profileImage.value = response.data.data.profileImage;
    }

    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('profile.updateSuccess'),
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('profile.updateError'),
      life: 3000,
    });
    console.error('Error updating profile:', error);
  } finally {
    loading.value = false;
  }
};

// Cancel form changes
const cancel = () => {
  fetchProfile(); // Reload original data
  selectedImage.value = null; // Clear selected image
  profileImage.value = null; // Reset image preview
  toast.add({
    severity: 'info',
    summary: t('profile.cancel'),
    detail: t('profile.changesCancelled'),
    life: 3000,
  });
};

// Logout function
const logout = async () => {
  try {
    await axios.post('/api/logout');
    authStore.handleLogout();
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('profile.logoutSuccess'),
      life: 3000,
    });
    router.push({ name: 'login' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('profile.logoutError'),
      life: 3000,
    });
    console.error('Error logging out:', error);
  }
};

// Fetch profile data on mount
onMounted(fetchProfile);
</script>

<style scoped>
[dir="rtl"] .flex {
  direction: rtl;
}

[dir="rtl"] .text-right {
  text-align: right;
}

[dir="ltr"] .text-left {
  text-align: left;
}

[dir="rtl"] .p-progress-spinner {
  margin-left: 0.5rem;
}

[dir="rtl"] .direction-ltr {
  direction: ltr;
}
</style>
