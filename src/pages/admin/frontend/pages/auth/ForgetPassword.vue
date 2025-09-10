<template>
  <div
    class="bg-gray-900 min-h-screen flex items-start justify-center p-4 overflow-hidden"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-4 w-full max-w-sm sm:max-w-lg my-8">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <div class="bg-gray-100 rounded-xl p-1 mb-4 flex transition-all duration-300">
        <button
          @click="selectedTab = 'phone'"
          :class="[
            'flex-1 mx-2 py-3 px-4 rounded-xl font-bold transition-colors duration-300',
            selectedTab === 'phone' ? 'bg-yellow-400 text-gray-700' : 'bg-white text-gray-500'
          ]"
          :aria-label="t('resetInitiation.phoneTab')"
        >
          {{ t('resetInitiation.phoneTab') }}
        </button>
        <button
          @click="selectedTab = 'email'"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-bold transition-colors duration-300',
            selectedTab === 'email' ? 'bg-yellow-400 text-gray-700' : 'bg-white text-gray-500'
          ]"
          :aria-label="t('resetInitiation.emailTab')"
        >
          {{ t('resetInitiation.emailTab') }}
        </button>
      </div>

      <div class="space-y-4">
        <div v-if="selectedTab === 'phone'" class="flex">
          <select
            v-model="countryCode"
            class="w-1/3 px-4 py-3 rounded-tr-xl rounded-br-xl bg-gray-100 text-gray-700 focus:outline-none transition-shadow"
            :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
            required
          >
            <option value="" disabled>{{ t('resetInitiation.selectCountry') }}</option>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ $i18n.locale === 'ar' ? country.name_ar : country.name_en }} {{ country.code }}
            </option>
          </select>
          <input
            type="tel"
            v-model="phoneNumber"
            :placeholder="t('resetInitiation.phonePlaceholder')"
            class="w-2/3 px-4 py-3 rounded-tl-xl rounded-bl-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none transition-shadow"
            :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
            required
            pattern="[0-9]{9,12}"
          />
        </div>

        <input
          v-else
          type="email"
          v-model="email"
          :placeholder="t('resetInitiation.emailPlaceholder')"
          class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
          required
        />
      </div>

      <button
        @click="handleResetPassword"
        :disabled="authStore.loading"
        class="w-full mt-8 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
        :aria-label="t('resetInitiation.submit')"
      >
        {{ authStore.loading ? t('resetInitiation.loading') : t('resetInitiation.submit') }}
      </button>

       <div  class="text-red-600 text-sm text-center">
          <p v-for="error in errors" :key="error">{{ error.message }}</p>
        </div>

      <div class="mt-8 text-center text-sm text-gray-500">
        {{ t('resetInitiation.hasAccount') }}
        <a
          @click="router.push({ name: 'authlog' })"
          class="text-blue-600 cursor-pointer font-semibold hover:underline"
          :aria-label="t('resetInitiation.login')"
        >
          {{ t('resetInitiation.login') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const selectedTab = ref('phone');
const phoneNumber = ref('');
const countryCode = ref('+962');
const email = ref('');

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

// Clear fields and errors when switching tabs
watch(selectedTab, () => {
  email.value = '';
  phoneNumber.value = '';
  countryCode.value = '+962';
  authStore.errors = [];
});

const handleResetPassword = async () => {
  authStore.errors = [];
  const data = {
    email: selectedTab.value === 'email' ? email.value : undefined,
    phone: selectedTab.value === 'phone' ? phoneNumber.value : undefined,
    countryCode: selectedTab.value === 'phone' ? countryCode.value : undefined,
    otp_type: selectedTab.value === 'phone' ? 'whatsapp' : 'email',
  };
  await authStore.handleResetPassword(data);
};
</script>

