<template>
  <div class="bg-gray-900 min-h-screen flex items-center justify-center p-4 overflow-hidden" dir="rtl">
    <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm my-8 text-center">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">ادخل الرمز المرسل</h2>
        <p class="text-sm text-gray-500">
          تم إرسال رمز التحقق المكون من 4 أرقام
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
          />
        </div>

        <div v-if="authStore.errors.length" class="text-red-500 text-sm text-right">
          <p v-for="error in authStore.errors" :key="error">{{ error }}</p>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';

const authStore = useAuthStore();
const otpDigits = ref(['', '', '', '','','']);
const otpInputs = ref([]);

const props = defineProps({
  email: String,
  phone: String,
  otp_type: String,
});

onMounted(() => {
  // Log props to console when component is mounted
  console.log('OTP Page Props:', {
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
  // Log props to console during verification
  console.log('Verifying OTP with Props:', {
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
    otp,
  });

  if (otp) {
    try {
      await authStore.verifyOtp({
        email: props.email,
        phone: props.phone,

        otp,
      });
      // Navigation is handled in the store
    } catch (error) {
      console.error('OTP Verification failed:', error);
    }
  } else {
    authStore.authErrors = ['الرجاء إدخال رمز تحقق مكون من 6 أرقام.'];
  }
};

const resendCode = async () => {
  // Log props to console during resend
  console.log('Resending Code with Props:', {
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
  });

  try {
    await authStore.resendOtp({
      email: props.email,
      phone: props.phone,
      otp_type: props.otp_type,
    });
  } catch (error) {
    console.error('Resend OTP failed:', error);
  }
};
</script>

<style scoped>
/* Tailwind CSS is already included in the template classes */
</style>
