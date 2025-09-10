<template>
  <div
    class="bg-gray-900 min-h-screen flex items-start justify-center p-4 overflow-hidden"

  >
    <div class="bg-white rounded-3xl shadow-2xl p-4 w-full max-w-sm sm:max-w-lg my-8">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <!-- Tabs -->
      <div class="bg-gray-100 rounded-xl p-1 mb-4 flex transition-all duration-300">
        <button
          @click="selectTab('phone')"
          :class="[
            'flex-1 mx-2 py-3 px-4 rounded-xl font-bold transition-colors duration-300',
            selectedTab === 'phone' ? 'bg-yellow-400 text-gray-700' : 'bg-white text-gray-500'
          ]"
          :aria-label="t('signup.phoneTab')"
        >
          {{ t('signup.phoneTab') }}
        </button>
        <button
          @click="selectTab('email')"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-bold transition-colors duration-300',
            selectedTab === 'email' ? 'bg-yellow-400 text-gray-700' : 'bg-white text-gray-500'
          ]"
          :aria-label="t('signup.emailTab')"
        >
          {{ t('signup.emailTab') }}
        </button>
      </div>

      <div class="space-y-4">
        <!-- Name Input -->
        <div class="relative">
          <input
            type="text"
            v-model="name"
            :placeholder="t('signup.namePlaceholder')"
            class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div v-if="validationErrors.name" class="text-red-500 text-sm" :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }">
            {{ validationErrors.name }}
          </div>
        </div>

        <!-- Phone Input -->
        <div v-if="selectedTab === 'phone'" class="flex">
          <select
            v-model="countryCode"
            class="w-1/3 px-4 py-3 rounded-tr-xl rounded-br-xl bg-gray-100 text-gray-700 focus:outline-none transition-shadow"
            :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
          >
            <option value="" disabled>{{ t('signup.selectCountry') }}</option>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ $i18n.locale === 'ar' ? country.name_ar : country.name_en }} ({{ country.code }})
            </option>
          </select>
          <input
            type="tel"
            v-model="phoneNumber"
            :placeholder="t('signup.phonePlaceholder')"
            class="w-2/3 px-4 py-3 rounded-tl-xl rounded-bl-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none transition-shadow"
            :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
          />
        </div>

        <!-- Email Input -->
        <input
          v-else
          type="email"
          v-model="email"
          :placeholder="t('signup.emailPlaceholder')"
          class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
        />
        <div v-if="validationErrors.email" class="text-red-500 text-sm" :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }">
          {{ validationErrors.email }}
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            :placeholder="t('signup.passwordPlaceholder')"
            class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
          />
          <button
            type="button"
            @click="isPasswordVisible = !isPasswordVisible"
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
            :aria-label="t(isPasswordVisible ? 'signup.hidePassword' : 'signup.showPassword')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isPasswordVisible"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.015 10.015 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.965 9.965 0 011.313-2.617M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                v-else
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
          <div v-if="validationErrors.password" class="text-red-500 text-sm" :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }">
            {{ validationErrors.password }}
          </div>
        </div>

        <!-- Errors -->
        <div v-if="errors.length" class="text-red-500 text-center text-sm">
          <p v-for="error in errors" :key="error">{{ error }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        @click="handleSignUp"
        :disabled="authStore.loading || !isFormValid"
        class="w-full mt-8 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
      >
        {{ authStore.loading ? t('signup.loading') : t('signup.submit') }}
      </button>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="mx-4 text-gray-400 text-xs font-semibold">{{ t('signup.or') }}</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>

      <!-- Google Sign-Up -->
      <button
        @click="handleGoogleSignUp"
        :disabled="authStore.loading"
        class="w-full py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
        :aria-label="t('signup.googleSignUp')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google" role="img" viewBox="0 0 512 512" class="w-6 h-6">
          <rect width="512" height="512" rx="15%" fill="#ffffff"></rect>
          <path d="M488 261.2c0-14.7-1.4-29.1-4.1-43.1H256v82.2h135.5c-5.7 29.8-22.3 55.4-46.1 73.1v53.4h68.8c40.3-37.1 63.5-91.8 63.5-165.6z" fill="#4285f4"></path>
          <path d="M256 496c69.8 0 128.4-22.9 171.2-62.5l-68.8-53.4c-19.1 13.5-44.5 21.6-76.4 21.6-58.6 0-108.4-39.6-126.3-92.4H68.8v53.4C106.8 447.2 176.6 496 256 496z" fill="#34a853"></path>
          <path d="M129.7 302.5c-3.1-9.2-4.9-19-4.9-29.2s1.8-19.9 4.9-29.2V190H68.8c-10.2 20.3-15.8 43.8-15.8 68.8s5.6 48.5 15.8 68.8L129.7 302.5z" fill="#fbbc04"></path>
          <path d="M256 106.8c34.8 0 65.9 12 90.3 35.5l61.2-61.2c-38.3-36.4-88.6-58.1-151.5-58.1-79.4 0-149.2 48.8-187.2 122.8l61.2 47.5c17.9-52.8 67.7-92.4 126.3-92.4z" fill="#ea4335"></path>
        </svg>
        <span class="text-gray-700 font-semibold">{{ t('signup.googleSignUp') }}</span>
      </button>

      <!-- Login Link -->
      <div class="mt-8 text-center text-sm text-gray-500">
        {{ t('signup.haveAccount') }}
        <a @click="router.push({ name: 'authlog' })" class="text-blue-600 cursor-pointer font-semibold hover:underline">
          {{ t('signup.login') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const selectedTab = ref('phone');
const name = ref('');
const phoneNumber = ref('');
const countryCode = ref('+962');
const email = ref('');
const password = ref('');
const isPasswordVisible = ref(false);
const errors = ref([]);

// Countries array with Arabic and English names
const countries = [
  { name_ar: 'السعودية', name_en: 'Saudi Arabia', code: '+966' },
  { name_ar: 'الإمارات', name_en: 'United Arab Emirates', code: '+971' },
  { name_ar: 'مصر', name_en: 'Egypt', code: '+20' },
  { name_ar: 'الكويت', name_en: 'Kuwait', code: '+965' },
  { name_ar: 'قطر', name_en: 'Qatar', code: '+974' },
  { name_ar: 'الجزائر', name_en: 'Algeria', code: '+213' },
  { name_ar: 'البحرين', name_en: 'Bahrain', code: '+973' },
  { name_ar: 'جزر القمر', name_en: 'Comoros', code: '+269' },
  { name_ar: 'جيبوتي', name_en: 'Djibouti', code: '+253' },
  { name_ar: 'العراق', name_en: 'Iraq', code: '+964' },
  { name_ar: 'الأردن', name_en: 'Jordan', code: '+962' },
  { name_ar: 'لبنان', name_en: 'Lebanon', code: '+961' },
  { name_ar: 'ليبيا', name_en: 'Libya', code: '+218' },
  { name_ar: 'المغرب', name_en: 'Morocco', code: '+212' },
  { name_ar: 'موريتانيا', name_en: 'Mauritania', code: '+222' },
  { name_ar: 'عمان', name_en: 'Oman', code: '+968' },
  { name_ar: 'فلسطين', name_en: 'Palestine', code: '+970' },
  { name_ar: 'الصومال', name_en: 'Somalia', code: '+252' },
  { name_ar: 'السودان', name_en: 'Sudan', code: '+249' },
  { name_ar: 'سوريا', name_en: 'Syria', code: '+963' },
  { name_ar: 'تونس', name_en: 'Tunisia', code: '+216' },
  { name_ar: 'اليمن', name_en: 'Yemen', code: '+967' },
];

// Client-side validation with translated messages
const validationErrors = computed(() => {
  const errs = {};
  if (name.value && name.value.length < 2) {
    errs.name = t('signup.errors.nameTooShort');
  }
  if (selectedTab.value === 'email' && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errs.email = t('signup.errors.invalidEmail');
  }
  if (password.value && password.value.length < 6) {
    errs.password = t('signup.errors.passwordTooShort');
  }
  return errs;
});

const isFormValid = computed(() => {
  return (
    name.value &&
    name.value.length >= 2 &&
    password.value &&
    password.value.length >= 6 &&
    (selectedTab.value === 'phone'
      ? phoneNumber.value && /^\d{7,15}$/.test(phoneNumber.value)
      : email.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
  );
});

const selectTab = (tab) => {
  selectedTab.value = tab;
  errors.value = []; // Clear errors when switching tabs
};

const handleSignUp = async () => {
  errors.value = [];
  const validationErrs = Object.values(validationErrors.value);
  if (validationErrs.length > 0) {
    errors.value = validationErrs;
    return;
  }
  if (!isFormValid.value) {
    errors.value = [t('signup.errors.fillAllFields')];
    return;
  }
  const data = {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password.value,
    phone: selectedTab.value === 'phone' ? phoneNumber.value : undefined,
    countryCode: selectedTab.value === 'phone' ? countryCode.value : undefined,
    otp_type: selectedTab.value === 'phone' ? 'whatsapp' : 'email',
  };
  const result = await authStore.handleRegister(data);
  if (!result.is_success) {
    errors.value = result.errors;
  }
};

const handleGoogleSignUp = async () => {
  errors.value = [];
  const result = await authStore.handleGoogleLogin({});
  if (!result.is_success) {
    errors.value = result.errors;
  }
};
</script>

<style scoped>
/* Ensure RTL/LTR text alignment */
[dir="rtl"] .text-right {
  text-align: right;
}
[dir="ltr"] .text-left {
  text-align: left;
}
</style>
