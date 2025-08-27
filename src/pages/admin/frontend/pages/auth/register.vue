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
          تسجيل الدخول بالهاتف
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
          تسجيل الدخول بالبريد الإلكتروني
        </button>
      </div>

      <div class="space-y-4">
        <div class="relative">
          <input
            type="text"
            v-model="name"
            placeholder="ادخل اسمك"
            class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>

        <div v-if="selectedTab === 'phone'" class="flex">
          <select
            v-model="countryCode"
            class="w-1/3 px-4 py-3 rounded-tr-xl rounded-br-xl bg-gray-100 text-gray-700 focus:outline-none transition-shadow text-right"
          >
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.flag }} {{ country.code }}
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

        <div class="relative">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            placeholder="ادخل كلمة المرور"
            class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a4 4 0 110-8 4 4 0 010 8z"></path>
              <path v-if="!isPasswordVisible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <button
            type="button"
            @click="isPasswordVisible = !isPasswordVisible"
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isPasswordVisible"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.015 10.015 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.965 9.965 0 011.313-2.617M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="authStore.errors.length" class="text-red-500 text-sm text-right">
          <p v-for="error in authStore.errors" :key="error">{{ error }}</p>
        </div>
      </div>

      <button
        @click="handleSignUp"
        :disabled="authStore.loading"
        class="w-full mt-8 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
      >
        {{ authStore.loading ? 'جاري التسجيل...' : 'تسجيل' }}
      </button>

      <div class="flex items-center my-6">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="mx-4 text-gray-400 text-xs font-semibold">أو</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        @click="handleGoogleSignUp"
        :disabled="authStore.loading"
        class="w-full py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google" role="img" viewBox="0 0 512 512" width="34px" height="34px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#ffffff"></rect><path d="M488 261.2c0-14.7-1.4-29.1-4.1-43.1H256v82.2h135.5c-5.7 29.8-22.3 55.4-46.1 73.1v53.4h68.8c40.3-37.1 63.5-91.8 63.5-165.6z" fill="#4285f4"></path><path d="M256 496c69.8 0 128.4-22.9 171.2-62.5l-68.8-53.4c-19.1 13.5-44.5 21.6-76.4 21.6-58.6 0-108.4-39.6-126.3-92.4H68.8v53.4C106.8 447.2 176.6 496 256 496z" fill="#34a853"></path><path d="M129.7 302.5c-3.1-9.2-4.9-19-4.9-29.2s1.8-19.9 4.9-29.2V190H68.8c-10.2 20.3-15.8 43.8-15.8 68.8s5.6 48.5 15.8 68.8L129.7 302.5z" fill="#fbbc04"></path><path d="M256 106.8c34.8 0 65.9 12 90.3 35.5l61.2-61.2c-38.3-36.4-88.6-58.1-151.5-58.1-79.4 0-149.2 48.8-187.2 122.8l61.2 47.5c17.9-52.8 67.7-92.4 126.3-92.4z" fill="#ea4335"></path></g></svg>
        <span class="text-gray-700 font-semibold">المتابعة باستخدام جوجل</span>
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
const name = ref('');
const phoneNumber = ref('');
const countryCode = ref('+20');
const email = ref('');
const password = ref('');
const isPasswordVisible = ref(false);

const countries = [
  { name: 'الأردن', flag: '🇯🇴', code: '+962' },
  { name: 'المملكة العربية السعودية', flag: '🇸🇦', code: '+966' },
  { name: 'الإمارات العربية المتحدة', flag: '🇦🇪', code: '+971' },
  { name: 'مصر', flag: '🇪🇬', code: '+20' },
  { name: 'الكويت', flag: '🇰🇼', code: '+965' },
  { name: 'قطر', flag: '🇶🇦', code: '+974' },
];

const handleSignUp = async () => {
  const data = {
    name: name.value,
    email: email.value,
    password: password.value,
    phone: selectedTab.value === 'phone' ? phoneNumber.value : undefined,
    countryCode: selectedTab.value === 'phone' ? countryCode.value : undefined,
    otp_type: selectedTab.value === 'phone' ? 'whatsapp' : 'email',
  };
  await authStore.handleRegister(data);
};

const handleGoogleSignUp = async () => {
  await authStore.handleGoogleLogin({});
};
</script>

<style scoped>
/* Tailwind CSS is already included in the template classes */
</style>
