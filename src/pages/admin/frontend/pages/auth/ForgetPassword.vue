<template>
  <div class="bg-gray-900 min-h-screen flex items-start justify-center p-4 overflow-hidden" dir="rtl">
    <div class="bg-white rounded-3xl shadow-2xl p-4 w-full max-w-sm sm:max-w-lg my-8">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <div class="bg-gray-100 rounded-xl p-1 mb-4 flex transition-all duration-300">
        <button
          @click="selectedTab = 'phone'"
          :class="[
            'flex-1 mx-2 py-3 px-4 rounded-xl font-bold transition-colors duration-300',
            selectedTab === 'phone'
              ? 'bg-yellow-400 text-gray-700'
              : 'bg-white text-gray-500'
          ]"
        >
          إعادة تعيين باستخدام الهاتف
        </button>
        <button
          @click="selectedTab = 'email'"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-bold transition-colors duration-300',
            selectedTab === 'email'
              ? 'bg-yellow-400 text-gray-700'
              : 'bg-white text-gray-500'
          ]"
        >
          إعادة تعيين باستخدام البريد الإلكتروني
        </button>
      </div>

      <div class="space-y-4">
        <div v-if="selectedTab === 'phone'" class="flex">
          <select
            v-model="countryCode"
            class="w-1/3 px-4 py-3 rounded-tr-xl rounded-br-xl bg-gray-100 text-gray-700 focus:outline-none transition-shadow text-right"
          >
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }} {{ country.code }}
            </option>
          </select>
          <input
            type="tel"
            v-model="phoneNumber"
            placeholder="ادخل رقم الهاتف"
            class="w-2/3 px-4 py-3 rounded-tl-xl rounded-bl-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none transition-shadow text-right"
          />
        </div>

        <input
          v-else
          type="email"
          v-model="email"
          placeholder="ادخل بريدك الإلكتروني"
          class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
        />

        <div v-if="authStore.getErrorsByAction('handleResetPassword').length" class="text-red-500 text-sm text-right">
          <p v-for="error in authStore.getErrorsByAction('handleResetPassword')" :key="error">{{ error }}</p>
        </div>
      </div>

      <button
        @click="handleResetPassword"
        :disabled="authStore.loading"
        class="w-full mt-8 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
      >
        {{ authStore.loading ? 'جاري إرسال الطلب...' : 'إرسال رابط إعادة التعيين' }}
      </button>

      <div class="mt-8 text-center text-sm text-gray-500">
        لديك حساب بالفعل؟
        <a @click="router.push({name:'authlog'})" class="text-blue-600 cursor-pointer font-semibold hover:underline">تسجيل الدخول</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore();
const selectedTab = ref('phone');
const phoneNumber = ref('');
const countryCode = ref('+962');
const email = ref('');

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
const handleResetPassword = async () => {
  const data = {
    email: selectedTab.value === 'email' ? email.value : undefined,
    phone: selectedTab.value === 'phone' ? phoneNumber.value : undefined,
    countryCode: selectedTab.value === 'phone' ? countryCode.value : undefined,
    otp_type: selectedTab.value === 'phone' ? 'whatsapp' : 'email',
  };
  await authStore.handleResetPassword(data);
};
</script>

<style scoped>
/* Tailwind CSS is already included in the template classes */
</style>
