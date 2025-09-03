```vue
<template>
  <div class="min-h-screen p-8 bg-gray-100 font-inter" dir="rtl">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-center mb-8 text-gray-700">حسابي الشخصي</h1>

      <!-- Profile Section -->
      <div class="flex flex-col items-center gap-4 mb-8">
        <div class="flex items-center gap-4 flex-row-reverse">
          <img
            class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            :src="profilePicture"
            alt="صورة الملف الشخصي"
          />
          <div class="text-center">
            <h3 class="font-bold text-lg text-gray-800">{{ username }}</h3>
            <label
              for="profilePicture"
              class="text-blue-500 text-sm hover:underline cursor-pointer"
            >
              تغيير الصورة الشخصية
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              class="hidden"
              @change="uploadProfilePicture"
              aria-label="تحميل صورة الملف الشخصي"
            />
          </div>
        </div>
      </div>

      <!-- Form for updating user details -->
      <form @submit.prevent="saveChanges" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Username Input -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            اسم المستخدم
          </label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="username"
              v-model="username"
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              :class="{ 'border-red-500': !isUsernameValid }"
              aria-describedby="username-error"
            />
            <p v-if="!isUsernameValid" id="username-error" class="text-red-500 text-sm mt-1">
              اسم المستخدم مطلوب
            </p>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور
          </label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h2zm2-2a3 3 0 016 0v2H7V7zm6 3H7v5h6v-5z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              :class="{ 'border-red-500': !isPasswordValid }"
              aria-describedby="password-error"
            />
            <p v-if="!isPasswordValid" id="password-error" class="text-red-500 text-sm mt-1">
              كلمة المرور يجب أن تكون 8 أحرف على الأقل
            </p>
          </div>
        </div>

        <!-- Phone Number Input -->
        <div class="md:col-span-2">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <div
            class="flex items-center rounded-md shadow-sm border border-gray-300 rounded-xl focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors duration-200"
            :class="{ 'border-red-500': !isPhoneNumberValid }"
          >
            <select
              v-model="countryCode"
              class="px-4 py-3 bg-white border-l border-gray-300 rounded-r-xl focus:outline-none"
            >
               <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }} {{ country.code }}
            </option>
           </select>
            <input
              type="tel"
              id="phone"
              v-model="phoneNumber"
              class="flex-1 block w-full px-4 py-3 bg-white rounded-l-xl focus:outline-none"
              aria-describedby="phone-error"
            />
          </div>
          <p v-if="!isPhoneNumberValid" id="phone-error" class="text-red-500 text-sm mt-1">
            رقم الهاتف غير صالح
          </p>
        </div>

        <!-- Buttons -->
        <div class="md:col-span-2 flex justify-end gap-4 mt-8">
          <button
            type="button"
            @click="cancel"
            class="px-6 py-3 border border-blue-500 text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
          >
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/global-store';

// Reactive variables
const username = ref('محمد اشرف');
const password = ref('');
const phoneNumber = ref('');
const countryCode = ref('+20');
const profilePicture = ref('https://placehold.co/80x80/606c38/FFF');
const router = useRouter();
const GlobalStore = useGlobalStore();

// Form validation
const isUsernameValid = computed(() => username.value.trim() !== '');
const isPasswordValid = computed(() => password.value.length >= 8 || password.value === '');
const isPhoneNumberValid = computed(() => /^\+?\d{10,}$/.test(countryCode.value + phoneNumber.value) || phoneNumber.value === '');
const isFormValid = computed(() => isUsernameValid.value && isPasswordValid.value && isPhoneNumberValid.value);
const countries = [
  { name: 'السعودية', code: '+966' },
  { name: 'الإمارات', code: '+971' },
  { name: 'مصر', code: '+20' },
  { name: 'الكويت', code: '+965' },
  { name: 'قطر', code: '+974' },
  { name: 'الجزائر', code: '+213' },
  { name: 'البحرين', code: '+973' },
  { name: 'جزر القمر', code: '+269' },
  { name: 'جيبوتي', code: '+253' },
  { name: 'العراق', code: '+964' },
  { name: 'الأردن', code: '+962' },
  { name: 'لبنان', code: '+961' },
  { name: 'ليبيا', code: '+218' },
  { name: 'المغرب', code: '+212' },
  { name: 'موريتانيا', code: '+222' },
  { name: 'عمان', code: '+968' },
  { name: 'فلسطين', code: '+970' },
  { name: 'الصومال', code: '+252' },
  { name: 'السودان', code: '+249' },
  { name: 'سوريا', code: '+963' },
  { name: 'تونس', code: '+216' },
  { name: 'اليمن', code: '+967' },
];
// Handlers
const saveChanges = async () => {
  if (!isFormValid.value) return;
  try {
    await GlobalStore.updateUser({
      username: username.value,
      password: password.value,
      phoneNumber: countryCode.value + phoneNumber.value,
      profilePicture: profilePicture.value,
    });
    console.log('Changes saved successfully');
  } catch (error) {
    console.error('Failed to save changes:', error);
  }
};

const cancel = () => {
  const user = GlobalStore.user || {
    username: 'محمد اشرف',
    phoneNumber: '+201098454566',
    profilePicture: 'https://placehold.co/80x80/606c38/FFF',
  };
  username.value = user.username;
  password.value = '';
  phoneNumber.value = user.phoneNumber.replace(countryCode.value, '');
  profilePicture.value = user.profilePicture;
};

const uploadProfilePicture = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      // Simulate upload (replace with actual API call)
      const url = URL.createObjectURL(file);
      profilePicture.value = url;
      await GlobalStore.updateUser({ profilePicture: url });
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    }
  }
};
</script>

<style scoped>
/* Styles handled by Tailwind CSS */
</style>
```
