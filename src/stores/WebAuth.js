import { defineStore } from 'pinia'
import axios from 'axios'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as PusherPushNotifications from '@pusher/push-notifications-web'

export const useAuthStore = defineStore('Auth', {
  state: () => ({
    webUser: useStorage('webUser', {}), // Renamed from authUser to webUser
    userToken: useStorage('userToken', null), // Renamed from token to userToken
    authenticatedweb: useStorage('authenticatedweb', false),

    authErrors: [],
    role: '',
    msg: '',
    loading: ref(false),
    router: useRouter(),
  }),
  getters: {
    user: (state) => state.webUser,
    token: (state) => state.userToken,
    errors: (state) => state.authErrors,
    successMsg: (state) => state.msg,
  },
  actions: {
    async getUser() {
      if (this.authenticatedweb == true && this.webUser) {
        const response = await axios.get('api/get-user')
      }
    },
    async handleLogin(data) {
      this.authErrors = ["Invalid credentials. Please try again."]
      this.loading = true
      this.resetAuthStore()

      try {
        const response = await axios.post('/api/login', {
          email: data.email,
          phone: data.phone,
          password: data.password,
        })

        if (response.data.data?.access_token) {
          this.authenticatedweb = true
          this.userToken = response.data.data.access_token
          this.webUser = response.data.data.user




          this.router.push({ name: '/' })
        } else {
          this.authErrors = ["Invalid credentials. Please try again."]
        }
      } catch (error) {
        if (error.response) {
          // Handle server validation errors
          if (error.response.status === 422) {
            this.authErrors = error.response.data.errors
              ? Object.values(error.response.data.errors).flat()
              : ["Validation failed. Please check your inputs."]
          } else if (error.response.status === 401) {
            this.authErrors = "Invalid email or password."
          } else {
            this.authErrors = [error.response.data.message || "An error occurred during login."]
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.authErrors = ["Network error. Please check your connection."]
        } else {
          // Something happened in setting up the request
          this.router.push({ name: '/' })
        }
      } finally {
        this.loading = false
      }
    },
    async handleRegister(data) {
      if (this.loading) return
      this.resetAuthStore()
      this.loading = true
      try {
        const response = await axios.post('/api/register', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          password_confirmation: data.password_confirmation,
        })
        this.authenticatedweb = true
        this.userToken = response.data.token
        this.webUser = response.data.user
        this.router.push({ name: 'Home' })
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ["Validation failed. Please check your inputs."]
        } else {
          this.authErrors = [error.response?.data?.message || "Registration failed. Please try again."]
        }
      } finally {
        this.loading = false
      }
    },
    async handleLogout() {
      try {
        await axios.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Only clear non-essential data, keeping userToken and webUser
        this.authenticatedweb = false
        this.userPermissions = []
        this.authErrors = []
        this.msg = ''
        this.loading = false
        this.router.push({ name: 'Login' })
      }
    },
    async forgotPassword(data) {
      try {
        this.resetAuthStore()
        const response = await axios.post('/api/forgot-password', {
          email: data.email,
        })
        this.msg = response.data.status
        this.router.push({ name: 'ResetPassword' })
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = Object.values(error.response.data.errors).flat()
        } else {
          this.authErrors = [error.response?.data?.message || "Password reset request failed."]
        }
      }
    },
    async resetPassword(data) {
      try {
        await axios.post('/api/reset-password', data)
        this.router.push({ name: 'Login' })
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = Object.values(error.response.data.errors).flat()
        } else {
          this.authErrors = [error.response?.data?.message || "Password reset failed."]
        }
      }
    },
    resetAuthStore() {
      // Only reset non-persistent data, keeping userToken and webUser
      this.authenticatedweb = false
      this.userPermissions = []
      this.authErrors = []
      this.msg = ''
      this.loading = false
    },
    // Add a new method to completely clear all data including userToken and webUser
    clearAllData() {
      this.webUser = {}
      this.userToken = null
      this.authenticatedweb = false
      this.userPermissions = []
      this.authErrors = []
      this.msg = ''
      this.loading = false
    }
  },
})
