<template>
  <div
    class="bg-gray-900 min-h-screen flex items-center justify-center p-4 overflow-hidden"
    dir="rtl"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm my-8 text-center">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ t('otpVerification.title') }}</h2>
        <p class="text-sm text-gray-500">
          {{ t('otpVerification.otpSent') }}
        </p>

        <div class="flex justify-center space-x-2 space-x-reverse">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            class="w-12 h-12 text-center text-xl font-bold rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            v-model="otpDigits[index]"
            @input="handleInput(index, $event)"
            @keydown.backspace="handleBackspace(index)"
            :ref="el => { if (el) otpInputs[index] = el; }"
            :aria-label="t('otpVerification.otpDigit', { number: index + 1 })"
          />
        </div>

        <div v-if="errors.length" class="text-red-500 text-sm w-full text-center">
          <p class="text-red-500 text-sm w-full text-center" v-for="error in errors" :key="error">{{ error }}</p>
        </div>

        <button
          @click="handleVerification"
          :disabled="authStore.loading"
          class="w-full mt-6 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
          :aria-label="t('otpVerification.verify')"
        >
          {{ authStore.loading ? t('otpVerification.verifying') : t('otpVerification.verify') }}
        </button>

        <div class="text-sm text-gray-500 mt-4">
          {{ t('otpVerification.noCode') }}
          <button
            @click="resendCode"
            :disabled="authStore.loading"
            class="text-blue-600 font-semibold hover:underline"
            :aria-label="t('otpVerification.resend')"
          >
            {{ authStore.loading ? t('otpVerification.resending') : t('otpVerification.resend') }}
          </button>
        </div>
        <div v-if="authStore.successMsg" class="text-green-500 text-sm mt-2">
          {{ authStore.successMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const errors = ref([]);

const props = defineProps({
  email: String,
  phone: String,
  otp_type: String,
});

onMounted(() => {
  if (!props.email && !props.phone) {
    errors.value = [t('otpVerification.invalidInfo')];
    router.push({ name: 'authlog' });
    return;
  }
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
  const value = event.target.value.replace(/[^0-9]/g, '');
  otpDigits.value[index] = value.slice(0, 1);
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
  errors.value = [];
  const otp = otpDigits.value.join('');
  console.log('Verifying OTP with Props:', {
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
    otp,
  });
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    errors.value = [t('otpVerification.invalidOtp')];
    return;
  }
  const result = await authStore.verifyEmail({
    email: props.email,
    phone: props.phone,
    otp,
  });
  if (!result.is_success) {
    errors.value = result.errors;
  }
};

const resendCode = async () => {
  errors.value = [];
  console.log('Resending Code with Props:', {
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
  });
  const result = await authStore.resendOtp({
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
  });
  if (!result.is_success) {
    errors.value = result.errors;
  }
};
</script>

<style scoped>
/* Ensure RTL text alignment for all text elements */
.text-right {
  text-align: right;
}
</style>
