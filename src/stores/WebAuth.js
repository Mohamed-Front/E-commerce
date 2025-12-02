// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('Auth', {
  state: () => ({
    webUser: useStorage('webUser', {}),
    webToken: useStorage('webToken', null),
    authenticatedweb: useStorage('authenticatedweb', false),
    defaultStoreId: useStorage('defaultStoreId', 4),
    appLang: useStorage('appLang', 'ar'),
    verify: false,
    role: '',
    router: useRouter(),
    msg: '',
    loading: ref(false),
    errors: ref([]), // Added errors state
  }),
  getters: {
    user: (state) => state.webUser,
    token: (state) => state.webToken,
    successMsg: (state) => state.msg,
  },
  actions: {
    async getUser() {

      if (this.authenticatedweb && this.webToken) {
        try {
          const response = await axios.get('/api/get-user', {
            headers: { Authorization: `Bearer ${this.webToken}` },
          });
          this.webUser = response.data.user;
          this.role = response.data.user.role || '';
          return { is_success: true, errors: null };
        } catch (error) {
          this.clearAllData();
          this.router.push({ name: 'Login' });
          return {
            is_success: false,
            errors: [error.response?.data?.message || 'Failed to fetch user data.'],
          };
        }
      }
      return { is_success: false, errors: ['Not authenticated or no token.'] };
    },
    async handleLogin(data) {
     ;
      this.loading = true;
      this.errors = [];
      try {
        const payload = data.type === 'phone'
          ? { phone: `${data.countryCode}${data.phoneNumber}`, password: data.password }
          : { email: data.email, password: data.password };
        const response = await axios.post('/api/login', payload);
        if (response.data.is_success) {
          this.authenticatedweb = true;
          this.webToken = response.data.data.access_token;
          this.webUser = response.data.data.user;
          this.router.push({ name: 'home' });
          return { is_success: true, errors: null };
        }
        this.errors = ['Invalid credentials. Please try again.'];
        return { is_success: false, errors: this.errors };
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors
              ? Object.values(error.response.data.errors).flat()
              : ['Validation failed. Please check your inputs.'];
            return { is_success: false, errors: this.errors };
          } else if (error.response.status === 401) {
            this.errors = ['Invalid credentials.'];
            return { is_success: false, errors: this.errors };
          }
          this.errors = [error.response.data.message || 'An error occurred during login.'];
          return { is_success: false, errors: this.errors };
        } else if (error.request) {
          this.errors = ['Network error. Please check your connection.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = ['An unexpected error occurred.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async handleRegister(data) {
      if (this.loading) return { is_success: false, errors: ['Operation in progress.'] };
      this.loading = true;
      this.errors = [];
      try {
        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          phone: data.phone ? `${data.countryCode}${data.phone}` : undefined,
          otp_type: data.otp_type,
        };
        const response = await axios.post('/api/register', payload);
        if (response.data.is_success) {
          this.router.push({
            name: 'otp',
            params: { type: 'register' },
            query: {
              email: data.email,
              phone: data.phone ? `${data.countryCode}${data.phone}` : undefined,
              otp_type: data.otp_type,
            },
          });
          return { is_success: true, errors: null };
        }
        this.errors = ['Registration failed. Please try again.'];
        return { is_success: false, errors: this.errors };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'Registration failed. Please try again.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async handleLogout() {
      this.webUser = {};
      this.webToken = null;
      this.authenticatedweb = false;
      this.msg = '';
      this.loading = false;
      this.role = '';
      this.verify = false;
      this.errors = [];
      this.router.push({ name: 'authlog' });
      return { is_success: true, errors: null };
    },
    async forgotPassword(data) {
      this.errors = [];
      try {
        const response = await axios.post('/api/forgot-password', {
          email: data.email,
        });
        this.msg = response.data.status;
        this.router.push({ name: 'ResetPassword' });
        return { is_success: true, errors: null };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = Object.values(error.response.data.errors).flat();
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'Password reset request failed.'];
        return { is_success: false, errors: this.errors };
      }
    },
    async resetPassword(data) {

      this.errors = [];
      try {
        await axios.post('/api/reset-password', data);
        this.router.push({ name: 'Login' });
        return { is_success: true, errors: null };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = Object.values(error.response.data.errors).flat();
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'Password reset failed.'];
        return { is_success: false, errors: this.errors };
      }
    },
    async handleResetPassword(data) {
      this.loading = true;
      this.errors = [];
      try {
        const payload = {
          email: data.email,
          phone: data.phone ? `${data.countryCode}${data.phone}` : undefined,
          otp_type: data.otp_type,
        };
        const response = await axios.post('/api/send-otp', payload);
        this.msg = response.data.message || 'Password reset request sent successfully.';
        this.router.push({
          name: 'changepassword',
          params: { type: 'reset-password' },
          query: {
            email: data.email,
            phone: data.phone ? `${data.countryCode}${data.phone}` : undefined,
            otp_type: data.otp_type,
          },
        });
        return { is_success: true, errors: null };
      } catch (error) {
        console.log('Error response:', error.response); // Debugging
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'Password reset request failed.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async completePasswordReset({ email, phone, otp, password }) {
      this.loading = true;
      this.errors = [];
      try {
        const payload = {
          email,
          phone,
          otp,
          password,
          password_confirmation: password,
        };
        const response = await axios.post('/api/change-password', payload);
        if (response.data.is_success) {
          this.msg = response.data.message || 'Password reset successfully.';
          this.router.push({ name: 'authlog' });
          return { is_success: true, errors: null };
        }
        this.errors = ['Password reset failed. Please try again.'];
        return { is_success: false, errors: this.errors };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'Password reset failed.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async handleGoogleLogin({ token }) {
      this.loading = true;
      this.errors = [];
      try {
        const response = await axios.post('/api/google-login', { token });
        if (response.data.data?.access_token) {
          this.webToken = response.data.data.access_token;
          this.webUser = response.data.data.user;
          this.role = response.data.data.user.role || '';
          this.router.push({ name: 'Home' });
          return { is_success: true, errors: null };
        }
        this.errors = ['Google login failed. Please try again.'];
        return { is_success: false, errors: this.errors };
      } catch (error) {
        this.errors = [error.response?.data?.message || 'Google login failed.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async verifyOtp({ email, phone, otp }) {
      this.loading = true;
      this.errors = [];
      try {
        const payload = { email, phone, otp };
        const response = await axios.post('/api/verify-otp', payload);
        if (response.data.is_success) {
          this.verify = true;
          setTimeout(() => {
            if (this.verify) {
              this.verify = false;
              console.log('Verify state reset to false after 5 minutes');
            }
          }, 5 * 60 * 1000); // 5 minutes
          return { is_success: true, errors: null };
        }
        this.errors = ['Invalid OTP. Please try again.'];
        return { is_success: false, errors: this.errors };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Invalid OTP. Please check your input.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'OTP verification failed.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async verifyEmail({ email, phone, otp }) {
      this.loading = true;
      this.errors = [];
      try {
        const payload = { email, phone, otp };
        const response = await axios.post('/api/verify-email', payload);
        if (response.data.is_success) {
          this.router.push({ name: 'authlog' });
          return { is_success: true, errors: null };
        }
        this.errors = ['Invalid OTP. Please try again.'];
        return { is_success: false, errors: this.errors };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Invalid OTP. Please check your input.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'OTP verification failed.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    async resendOtp({ email, phone, otp_type }) {
      this.loading = true;
      this.errors = [];
      try {
        const payload = { email, phone, otp_type };
        const response = await axios.post('/api/resend-otp', payload);
        this.msg = response.data.message || 'OTP resent successfully.';
        return { is_success: true, errors: null };
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Failed to resend OTP. Please check your inputs.'];
          return { is_success: false, errors: this.errors };
        }
        this.errors = [error.response?.data?.message || 'Failed to resend OTP.'];
        return { is_success: false, errors: this.errors };
      } finally {
        this.loading = false;
      }
    },
    clearAllData() {
      this.webUser = {};
      this.webToken = null;
      this.authenticatedweb = false;
      this.msg = '';
      this.loading = false;
      this.role = '';
      this.verify = false;
      this.errors = [];
    },
  },
});
