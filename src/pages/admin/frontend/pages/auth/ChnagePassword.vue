<template>
  <div
    class="bg-gray-900 min-h-screen flex items-start justify-center p-4 overflow-hidden"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm sm:max-w-lg my-8 text-center">
      <div class="flex flex-col items-center mb-8">
        <img src="../../../../../assets/shiftlogo.png" alt="SHIFT7 Logo" class="h-16 w-16 object-contain" />
      </div>

      <div class="space-y-6">
        <!-- OTP Verification Form -->
        <div v-if="!isOtpVerified">
          <h2 class="text-2xl font-bold text-gray-800">{{ t('passwordReset.title') }}</h2>
          <p class="text-sm text-gray-500 my-3">
            {{ t('passwordReset.otpSent') }}
          </p>

          <div class="flex justify-center space-x-2" :class="{ 'space-x-reverse': $i18n.locale === 'ar' }">
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
              :aria-label="t('passwordReset.otpDigit', { number: index + 1 })"
            />
          </div>

          <div v-if="otpErrors.length" class="text-red-500 text-sm" :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }">
            <p v-for="error in otpErrors" :key="error">{{ error }}</p>
          </div>

          <button
            @click="handleVerification"
            :disabled="authStore.loading"
            class="w-full mt-6 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
            :aria-label="t('passwordReset.verify')"
          >
            {{ authStore.loading ? t('passwordReset.verifying') : t('passwordReset.verify') }}
          </button>

          <div class="text-center text-sm text-gray-500 mt-4">
            {{ t('passwordReset.noCode') }}
            <button
              @click="resendCode"
              :disabled="authStore.loading"
              class="text-blue-600 font-semibold hover:underline"
              :aria-label="t('passwordReset.resend')"
            >
              {{ authStore.loading ? t('passwordReset.resending') : t('passwordReset.resend') }}
            </button>
          </div>
          <div v-if="authStore.successMsg" class="text-green-500 text-sm text-center mt-2">
            {{ authStore.successMsg }}
          </div>
        </div>

        <!-- Password Reset Form -->
        <div v-else>
          <h2 class="text-2xl font-bold text-gray-800">{{ t('passwordReset.resetTitle') }}</h2>
          <p class="text-sm text-gray-500">
            {{ t('passwordReset.resetDescription') }}
          </p>

          <div class="space-y-4">
            <input
              type="password"
              v-model="password"
              :placeholder="t('passwordReset.newPasswordPlaceholder')"
              :aria-label="t('passwordReset.newPassword')"
              aria-describedby="password-error"
              class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
            />
            <input
              type="password"
              v-model="confirmPassword"
              :placeholder="t('passwordReset.confirmPasswordPlaceholder')"
              :aria-label="t('passwordReset.confirmPassword')"
              aria-describedby="password-error"
              class="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
            />

            <div
              v-if="passwordErrors.length"
              id="password-error"
              class="text-red-500 text-sm"
              :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }"
            >
              <p v-for="error in passwordErrors" :key="error">{{ error }}</p>
            </div>
          </div>

          <button
            @click="handlePasswordReset"
            :disabled="authStore.loading"
            class="w-full mt-6 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400"
            :aria-label="t('passwordReset.submit')"
          >
            {{ authStore.loading ? t('passwordReset.resetting') : t('passwordReset.submit') }}
          </button>
        </div>

        <div class="text-center text-sm text-gray-500 mt-4">
          {{ t('passwordReset.hasAccount') }}
          <a
            @click="navigateToLogin"
            class="text-blue-600 cursor-pointer font-semibold hover:underline"
            :aria-label="t('passwordReset.login')"
          >
            {{ t('passwordReset.login') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const isOtpVerified = ref(false);
const password = ref('');
const confirmPassword = ref('');
const otpErrors = ref([]);
const passwordErrors = ref([]);

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
    otpErrors.value = [];
    otpDigits.value = ['', '', '', '', '', '']; // Clear OTP digits
  }
});

onMounted(() => {
  if (!props.email && !props.phone) {
    passwordErrors.value = [t('passwordReset.invalidInfo')];
    router.push({ name: 'authlog' });
    return;
  }
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
  otpErrors.value = [];
  const otp = otpDigits.value.join('');
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    otpErrors.value = [t('passwordReset.invalidOtp')];
    return;
  }
  const result = await authStore.verifyOtp({
    email: props.email,
    phone: props.phone,
    otp,
  });
  if (result.is_success) {
    isOtpVerified.value = true;
  } else {
    otpErrors.value = result.errors;
  }
};

const resendCode = async () => {
  otpErrors.value = [];
  const result = await authStore.resendOtp({
    email: props.email,
    phone: props.phone,
    otp_type: props.otp_type,
  });
  if (!result.is_success) {
    otpErrors.value = result.errors;
  }
};

const handlePasswordReset = async () => {
  passwordErrors.value = [];
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password.value || !passwordRegex.test(password.value)) {
    passwordErrors.value = [t('passwordReset.passwordRequirements')];
    return;
  }
  if (password.value !== confirmPassword.value) {
    passwordErrors.value = [t('passwordReset.passwordMismatch')];
    return;
  }
  const result = await authStore.completePasswordReset({
    email: props.email,
    phone: props.phone,
    otp: otpDigits.value.join(''),
    password: password.value,
  });
  if (!result.is_success) {
    passwordErrors.value = result.errors;
  }
};

const navigateToLogin = () => {
  router.push({ name: 'authlog' });
};
</script>

