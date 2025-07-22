import { defineStore } from 'pinia'
import type { User, LoginPayload, registrationPayload } from '../types/auth'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
export const AuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || ('' as string),
    loading: false,
    error: '' as string,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async loginUser(payload: LoginPayload, remmberme : boolean = false) {
      this.loading = true
      this.error = ''

      try {
        const response = await axios.post('api/login', payload)
        this.user = {
          id: response.data.data.user.id,
          name: response.data.data.user.name,
          phone: response.data.data.user.phone,
          email_verified_at: response.data.data.user.email_verified_at,
          permissions: response.data.data.user.permissions || [],
        }

        this.token = response.data.data.access_token
        if(remmberme) {
          localStorage.setItem('userPermissions', JSON.stringify(this.user.permissions))
          localStorage.setItem('usertoken', this.token)
        }
        const router = useRouter()
        await router.push({ name: 'home' })
      } catch (error: any) {
        this.handleLoginError(error)
      } finally {
        this.loading = false
      }
    },

    handleLoginError(error: any) {
      if (error.response?.status === 401) {
        this.error = t('auth.notcorrect')
      } else if (error.response?.data?.message) {
        this.error = error.response.data.message
      } else {
        this.error = t('auth.noneerorr')
      }
      throw error
    },

    logout() {
      const router = useRouter()

      this.user = null
      this.token = ''
      this.error = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userPermissions')
      router.push({ name: 'login' })
    },
    async registration(data: registrationPayload) {
      this.loading = true
      this.error = ''

      try {
        const response = await axios.post('api/register', data)
        if (response) {
          this.loginUser({
            phone: data.phone,
            password: data.password,
          })
        }
      } catch (error: any) {
        this.handleLoginError(error)

      } finally {
        this.loading = false
      }
    },
    clear() {
      this.error = ''
    }
  },
})
