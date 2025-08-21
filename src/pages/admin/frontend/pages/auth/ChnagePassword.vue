<template>
  <div class="bg-gray-900 min-h-screen flex items-start justify-center p-4 overflow-hidden" dir="rtl">
    <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm sm:max-w-lg my-8 text-center">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <div class="space-y-6">
        <!-- OTP Verification Form -->
        <div v-if="!isOtpVerified">
          <h2 class="text-2xl font-bold text-gray-800">ادخل الرمز المرسل</h2>
          <p class="text-sm text-gray-500 my-3">
            تم إرسال رمز التحقق المكون من 6 أرقام
          </p>

          <div class="flex justify-center space-x-2 space-x-reverse">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              type="tel"
              maxlength="1"
              class="w-12 h-12 text-center text-xl font-bold rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              v-model="otpDigits[index]"
              @input="handleInput(index, $event)"
              @keydown.backspace="handleBackspace(index)"
              :ref="el => { if (el) otpInputs[index] = el; }"
              :aria-label="`رقم التحقق ${index + 1}`"
            />
          </div>

          <div v-if="authStore.getErrorsByAction('verifyOtp').length" class="text-red-500 text-sm text-right">
            <p v-for="error in authStore.getErrorsByAction('verifyOtp')" :key="error">{{ error }}</p>
          </div>

          <button
            @click="handleVerification"
            :disabled="authStore.loading"
            class="w-full mt-6 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
          >
            {{ authStore.loading ? 'جاري التحقق...' : 'تحقق' }}
          </button>

          <div class="text-center text-sm text-gray-500 mt-4">
            لم تتلق الرمز؟
            <a href="#" @click.prevent="resendCode" class="text-blue-600 font-semibold hover:underline">إعادة إرسال الرمز</a>
          </div>
        </div>

        <!-- Password Reset Form -->
        <div v-else>
          <h2 class="text-2xl font-bold text-gray-800">إعادة تعيين كلمة المرور</h2>
          <p class="text-sm text-gray-500">
            أدخل كلمة المرور الجديدة وتأكيدها
          </p>

          <div class="space-y-4">
            <input
              type="password"
              v-model="password"
              placeholder="أدخل كلمة المرور الجديدة"
              aria-label="كلمة المرور الجديدة"
              class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
            />
            <input
              type="password"
              v-model="confirmPassword"
              placeholder="تأكيد كلمة المرور"
              aria-label="تأكيد كلمة المرور"
              class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
            />

            <div v-if="authStore.getErrorsByAction('completePasswordReset').length" class="text-red-500 text-sm text-right">
              <p v-for="error in authStore.getErrorsByAction('completePasswordReset')" :key="error">{{ error }}</p>
            </div>
          </div>

          <button
            @click="handlePasswordReset"
            :disabled="authStore.loading"
            class="w-full mt-6 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
          >
            {{ authStore.loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور' }}
          </button>
        </div>

        <div class="text-center text-sm text-gray-500 mt-4">
          لديك حساب بالفعل؟
          <a @click="navigateToLogin" class="text-blue-600 cursor-pointer font-semibold hover:underline">تسجيل الدخول</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const isOtpVerified = ref(false);
const password = ref('');
const confirmPassword = ref('');

// Props received from password reset initiation
const props = defineProps({
  email: String,
  phone: String,
  otp_type: String,
});

// Watch for changes in isOtpVerified
watch(isOtpVerified, (newValue) => {
  if (newValue) {
    console.log('OTP verification successful, isOtpVerified is now true');
    authStore.clearErrors('verifyOtp'); // Clear OTP errors after successful verification
  }
});

onMounted(() => {
  console.log('Change Password Page Props:', {
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
  });

  if (otpInputs.value.length > 0) {
    otpInputs.value[0].focus();
  }
});

const handleInput = (index, event) => {
  const value = event.target.value;
  if (value.length > 1) {
    otpDigits.value[index] = value.slice(0, 1);
  } else {
    otpDigits.value[index] = value;
  }

  if (value && index < otpDigits.value.length - 1) {
    otpInputs.value[index + 1].focus();
  }
};

const handleBackspace = (index) => {
  if (index > 0 && otpDigits.value[index] === '') {
    otpInputs.value[index - 1].focus();
  }
};

const handleVerification = async () => {
  const otp = otpDigits.value.join('');

  if (otp.length !== 6) {
    authStore.authErrors['verifyOtp'] = ['الرجاء إدخال رمز تحقق مكون من 6 أرقام'];
    return;
  }

  await authStore.verifyOtp({
    email: props.email,
    phone: props.phone,
    otp,
  });
  isOtpVerified.value = authStore.verify; // Update isOtpVerified based on store
};

const resendCode = async () => {
  authStore.clearErrors('resendOtp'); // Clear previous resend OTP errors
  await authStore.resendOtp({
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
  });
};

const handlePasswordReset = async () => {
  if (!password.value || password.value.length < 8) {
    authStore.authErrors['completePasswordReset'] = ['كلمة المرور يجب أن تكون 8 أحرف على الأقل'];
    return;
  }
  if (password.value !== confirmPassword.value) {
    authStore.authErrors['completePasswordReset'] = ['كلمة المرور وتأكيدها غير متطابقتين'];
    return;
  }

  await authStore.completePasswordReset({
    email: props.email,
    phone: props.phone,
    otp: otpDigits.value.join(''),
    password: password.value,
  });
};

const navigateToLogin = () => {
  router.push({ name: 'authlog' });
};
</script>

<style scoped>
/* Tailwind CSS is already included in the template classes */
</style>
