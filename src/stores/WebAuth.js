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
    verify: false,
    authErrors: ref({}), // Store errors as an object with keys for each action
    role: '',
    msg: '',
    loading: ref(false),
    router: useRouter(),
  }),
  getters: {
    user: (state) => state.webUser,
    token: (state) => state.webToken,
    errors: (state) => state.authErrors, // Returns the entire errors object
    getErrorsByAction: (state) => (action) => state.authErrors[action] || [], // Get errors for a specific action
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
        } catch (error) {
          this.authErrors['getUser'] = [error.response?.data?.message || 'Failed to fetch user data.'];
          this.clearAllData();
          this.router.push({ name: 'Login' });
        }
      }
    },
    async handleLogin(data) {
      console.log(data)
      this.authErrors['login'] = [];
      this.loading = true;
      this.resetAuthStore();

      try {
        const payload = data.type === 'phone'
          ? { phone: `${data.countryCode}${data.phoneNumber}`, password: data.password }
          : { email: data.email, password: data.password };

        const response = await axios.post('/api/login', payload);

        if (response.data.data?.access_token) {
          this.authenticatedweb = true;
          this.webToken = response.data.data.access_token;
          this.webUser = response.data.data.user;
          this.router.push({ name: 'home' });
        } else {
          this.authErrors['login'] = ['Invalid credentials. Please try again.'];
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.authErrors['login'] = error.response.data.errors
              ? Object.values(error.response.data.errors).flat()
              : ['Validation failed. Please check your inputs.'];
          } else if (error.response.status === 401) {
            this.authErrors['login'] = ['Invalid credentials.'];
          } else {
            this.authErrors['login'] = [error.response.data.message || 'An error occurred during login.'];
          }
        } else if (error.request) {
          this.authErrors['login'] = ['Network error. Please check your connection.'];
        } else {
          this.authErrors['login'] = ['An unexpected error occurred.'];
        }
      } finally {
        this.loading = false;
      }
    },
    async handleRegister(data) {
      if (this.loading) return;
      this.resetAuthStore();
      this.loading = true;
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
        } else {
          this.authErrors['register'] = ['Registration failed. Please try again.'];
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['register'] = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
        } else {
          this.authErrors['register'] = [error.response?.data?.message || 'Registration failed. Please try again.'];
        }
      } finally {
        this.loading = false;
      }
    },
    async handleLogout() {
      this.webUser = {};
      this.webToken = null;
      this.authenticatedweb = false;
      this.authErrors = {};
      this.msg = '';
      this.loading = false;
      this.role = '';
      this.verify = false;
      this.router.push({ name: 'authlog' });

    },
    async forgotPassword(data) {
      try {
        this.resetAuthStore();
        const response = await axios.post('/api/forgot-password', {
          email: data.email,
        });
        this.msg = response.data.status;
        this.router.push({ name: 'ResetPassword' });
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['forgotPassword'] = Object.values(error.response.data.errors).flat();
        } else {
          this.authErrors['forgotPassword'] = [error.response?.data?.message || 'Password reset request failed.'];
        }
      }
    },
    async resetPassword(data) {
      try {
        this.resetAuthStore();
        await axios.post('/api/reset-password', data);
        this.router.push({ name: 'Login' });
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['resetPassword'] = Object.values(error.response.data.errors).flat();
        } else {
          this.authErrors['resetPassword'] = [error.response?.data?.message || 'Password reset failed.'];
        }
      }
    },
    async handleGoogleLogin({ token }) {
      this.authErrors['googleLogin'] = [];
      this.loading = true;
      this.resetAuthStore();
      try {
        const response = await axios.post('/api/google-login', { token });
        if (response.data.data?.access_token) {

          this.webToken = response.data.data.access_token;
          this.webUser = response.data.data.user;
          this.role = response.data.data.user.role || '';
          this.router.push({ name: 'Home' });
        } else {
          this.authErrors['googleLogin'] = ['Google login failed. Please try again.'];
        }
      } catch (error) {
        this.authErrors['googleLogin'] = [error.response?.data?.message || 'Google login failed.'];
      } finally {
        this.loading = false;
      }
    },

       async verifyOtp({ email, phone, otp }) {
      this.authErrors['verifyOtp'] = [];
      this.loading = true;
      try {
        const payload = { email, phone, otp };
        const response = await axios.post('/api/verify-otp', payload);
        if (response.data.is_success) {

          this.verify = true;
          setTimeout(() => {
            if (this.verify) {
              this.verify = false;
              console.log('Verify state reset to false after 1 minute');
            }
          }, 1000);
        } else {
          this.authErrors['verifyOtp'] = ['Invalid OTP. Please try again.'];
          return false;
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['verifyOtp'] = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Invalid OTP. Please check your input.'];
        } else {
          this.authErrors['verifyOtp'] = [error.response?.data?.message || 'OTP verification failed.'];
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async verifyEmail({ email, phone, otp }) {

      this.authErrors['verifyOtp'] = [];
      this.loading = true;
      try {
        const payload = { email, phone, otp };
        const response = await axios.post('/api/verify-email', payload);
        if (response.data.is_success) {
         this.router.push({ name: 'authlog' });

          setTimeout(() => {
            if (this.verify) {
              this.verify = false;
              console.log('Verify state reset to false after 1 minute');
            }
          }, 1000);
        } else {
          this.authErrors['verifyOtp'] = ['Invalid OTP. Please try again.'];
          return false;
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['verifyOtp'] = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Invalid OTP. Please check your input.'];
        } else {
          this.authErrors['verifyOtp'] = [error.response?.data?.message || 'OTP verification failed.'];
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    async resendOtp({ email, phone, otp_type }) {
      this.authErrors['resendOtp'] = [];
      this.loading = true;
      try {
        const payload = { email, phone, otp_type };
        const response = await axios.post('/api/resend-otp', payload);
        this.msg = response.data.message || 'OTP resent successfully.';
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['resendOtp'] = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Failed to resend OTP. Please check your inputs.'];
        } else {
          this.authErrors['resendOtp'] = [error.response?.data?.message || 'Failed to resend OTP.'];
        }
      } finally {
        this.loading = false;
      }
    },
    async handleResetPassword(data) {
      this.authErrors['handleResetPassword'] = [];
      this.loading = true;
      this.resetAuthStore();
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
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['handleResetPassword'] = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
        } else {
          this.authErrors['handleResetPassword'] = [error.response?.data?.message || 'Password reset request failed.'];
        }
      } finally {
        this.loading = false;
      }
    },
    async completePasswordReset({ email, phone, otp, password }) {
      this.authErrors['completePasswordReset'] = [];
      this.loading = true;
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
        } else {
          this.authErrors['completePasswordReset'] = ['Password reset failed. Please try again.'];
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors['completePasswordReset'] = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
        } else {
          this.authErrors['completePasswordReset'] = [error.response?.data?.message || 'Password reset failed.'];
        }
      } finally {
        this.loading = false;
      }
    },
    resetAuthStore() {
      this.authErrors = {}; // Reset errors to an empty object
      this.msg = '';
      this.loading = false;
    },
    clearAllData() {
      this.webUser = {};
      this.webToken = null;
      this.authenticatedweb = false;
      this.authErrors = {};
      this.msg = '';
      this.loading = false;
      this.role = '';
      this.verify = false;
    },
    clearErrors(action = null) {
      if (action) {
        this.authErrors[action] = []; // Clear errors for a specific action
      } else {
        this.authErrors = {}; // Clear all errors
      }
    },
  },
});
