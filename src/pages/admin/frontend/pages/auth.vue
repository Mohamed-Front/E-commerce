<template>
  <!-- main container -->
  <Toast />
  <main class="flex flex-col bg-[#111] min-h-[110vh]">
    <nav><img src="../../../../assets/shiftlogo.png" alt="" width="80" class="m-[2rem]" /></nav>
    <div class="min-h-[80vh] flex justify-evenly items-center">
      <!-- Forms -->
      <div class="bg-[#2A2A2A] p-8 rounded-md text-white lg:w-[40%] w-[80%]">
        <!-- Login -->
        <div class="">
          <form class="flex flex-col gap-4 items-center" @submit.prevent="checkall()">
            <!-- Header -->
            <h1 class="font-bold">
              {{
                currentPage == 'login'
                  ? $t('auth.loginnow')
                  : currentPage == 'registration'
                  ? $t('auth.registrationnow')
                  : currentPage == 'missedPassword'
                  ? $t('auth.forgotpassword')
                  : currentPage == 'OTP'
                  ? $t('auth.Activationcode')
                  : $t('auth.newpassH')
              }}
            </h1>
            <p class="text-[#9F9F9F] mb-6 text-center text-sm">
              {{
                currentPage == 'login' || currentPage == 'registration'
                  ? t('auth.loginnote')
                  : currentPage == 'missedPassword'
                  ? t('auth.forgotpasswordP')
                  : currentPage == 'OTP'
                  ? t('auth.donesend') + ` ${otpdata.phone}`
                  : t('auth.newpassP')
              }}
            </p>
            <span class="text-center text-red-500" v-if="authStore.error">{{ authStore.error }}</span>

            <!-- Inputs form -->
            <div class="flex flex-col gap-1 w-full text-white" v-for="value in datalogin" v-if="currentPage != 'OTP'">
              <label v-if="value.page.includes(currentPage)" class="mb-2">{{ t(`auth.${value.type}`) }}</label>
              <div
                v-if="value.page.includes(currentPage)"
                class="bg-[#9F9F9F26] py-2 rounded-md px-4 flex items-center gap-2"
                :class="error.type == value.type && error.message ? 'border-2 border-red-500' : ''"
              >
                <i class="pi" :class="value.icon ? value.icon : ''"></i>
                <input
                  v-model="value.data"
                  :type="value.inputtype"
                  :placeholder="value.placeholder"
                  class="bg-transparent outline-none flex-1"
                  @blur="check(value.type)"
                  :id="value.type"
                />
                <i class="pi" :class="value.showicon ? value.showicon : ''" @click="showpass(value.type)"></i>
              </div>
              <!-- error message -->
              <span v-if="error.type == value.type && error.message" class="text-red-500 text-xs mx-4">{{
                error.message
              }}</span>
            </div>
            <!-- OTP Fome -->
            <label v-if="currentPage == 'OTP'" class="mb-2">{{ t(`auth.code`) }}</label>
            <div v-if="currentPage == 'OTP'" class="py-2 rounded-md px-4 flex items-center gap-2 justify-between">
              <template v-for="(digit, index) in otpDigits" :key="index">
                <input
                  v-model="otp[index]"
                  ref="otpInput"
                  maxlength="1"
                  type="text"
                  inputmode="numeric"
                  class="w-[50px] h-[50px] text-center rounded border bg-transparent border-gray-300 focus:outline-none focus:border-blue-500"
                  @input="handleInput(index, $event)"
                  @keydown.backspace="handleBackspace(index, $event)"
                />
              </template>
            </div>
            <label v-if="currentPage == 'OTP'">{{ t(`auth.expen`) + ` ${timer}s` }}</label>
            <label v-if="currentPage == 'OTP'" class="font-bold cursor-pointer">{{ t(`auth.resend`) }}</label>
            <div v-if="currentPage == 'login'" class="flex justify-between w-full">
              <!--Rememberme  -->
              <div>
                <input v-model="rememberme" type="checkbox" id="rememberme" class="mx-2" />
                <label for="rememberme">{{ t('auth.rememberme') }}</label>
              </div>
              <!-- Forgot password -->
              <span
                class="text-blue-500 cursor-pointer hover:translate-y-[-3px] transition-all"
                @click="currentPage = 'missedPassword'"
                >{{ t('auth.forgotpassword') }}</span
              >
            </div>

            <!--Terms  -->
            <div v-if="currentPage == 'registration'">
              <input v-model="Terms" type="checkbox" id="Terms" class="mx-2 text-xs" />
              <label for="Terms">{{ t('auth.terms') }}</label>
            </div>

            <Button
              type="submit"
              :loading="loading"
              :label="
                currentPage == 'registration'
                  ? t('auth.registration')
                  : currentPage == 'login'
                  ? t('auth.login')
                  : currentPage == 'missedPassword'
                  ? $t('auth.ok')
                  : $t('auth.ok')
              "
              class="outline-none w-full mt-6 focus:!shadow-none"
            />
            <Button
              @click="currentPage == 'registration' ? (currentPage = 'login') : (currentPage = 'registration')"
              :label="
                currentPage == 'login' || currentPage == 'missedPassword'
                  ? t('auth.registration')
                  : currentPage == 'registration'
                  ? t('auth.login')
                  : t('auth.registration')
              "
              severity="secondary"
              class="outline-none w-full focus:!shadow-none Custombutton"
            />
            <span v-if="currentPage != 'OTP' && currentPage != 'newPassword'" class="text-xs text-[#9F9F9F]">{{
              $t('auth.or')
            }}</span>
            <Button
              v-if="currentPage != 'OTP' && currentPage != 'newPassword'"
              :label="t('auth.loginwithfacebock')"
              icon="pi pi-facebook"
              severity="secondary"
              class="text-[#9F9F9F] !text-sm outline-none w-full focus:!shadow-none Custombutton"
            />
            <Button
              v-if="currentPage != 'OTP' && currentPage != 'newPassword'"
              :label="t('auth.loginwithgoogle')"
              icon="pi pi-google"
              severity="secondary"
              class="text-[#9F9F9F] !text-sm outline-none w-full focus:!shadow-none Custombutton"
            />
          </form>
        </div>
      </div>

      <!-- Img -->
      <div>
        <img
          src="../../../../assets/loginFormImg.png"
          alt=""
          class="lg:block hidden w-[450px] rounded-tl-[30%] rounded-br-[30%]"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
  import { ref, reactive, watch, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AuthStore } from '../store/auth.store'
  import { useToast } from 'primevue/usetoast'
  import axios from 'axios'

  const toast = useToast()
  const authStore = AuthStore()
  const { t } = useI18n()
  const currentPage = ref('login') // 'login', 'register', 'missedPassword', 'OTP', 'newPassword'
  const loading = ref(false)

  const rememberme = ref(true)
  const Terms = ref(false)
  const datalogin = ref([
    {
      type: 'username',
      data: '',
      inputtype: 'text',
      icon: 'pi-user',
      placeholder: 'Your Name',
      page: ['registration'],
    },
    {
      type: 'phone',
      data: '',
      placeholder: '07xxxxxxxx',
      inputtype: 'text',
      page: ['login', 'registration', 'missedPassword'],
    },
    {
      type: 'password',
      data: '',
      icon: 'pi-lock',
      showicon: 'pi-eye-slash',
      inputtype: 'password',
      page: ['login', 'registration', 'newPassword'],
    },
    {
      type: 'checkpassword',
      data: '',
      icon: 'pi-lock',
      showicon: 'pi-eye-slash',
      inputtype: 'password',
      page: ['registration', 'newPassword'],
    },
  ])

  // otp script
  const timer = ref(60)
  const otp = reactive(['', '', '', '', '', ''])
  const otpdata = ref({
    phone: '',
    newpass: '',
    renewpass: '',
  })
  const otpDigits = ref(6)

  const handleInput = (index, event) => {
    const value = event.target.value
    if (!/^[0-9]$/.test(value)) {
      otp[index] = ''
      return
    }
    otp[index] = value
    if (index < otp.length - 1) {
      nextTick(() => {
        const nextInput = document.querySelectorAll('input')[index + 1]
        nextInput?.focus()
      })
    }
  }

  const handleBackspace = (index, event) => {
    if (otp[index] === '') {
      if (index > 0) {
        nextTick(() => {
          const prevInput = document.querySelectorAll('input')[index - 1]
          prevInput?.focus()
        })
      }
    }
  }

  ////////
  const error = ref({})
  const check = (type) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    switch (type) {
      case 'password':
        error.value.type = type
        const passwordField = datalogin.value.find((item) => item.type === 'password')
        const passwordValue = passwordField?.data.trim()

        if (!passwordValue) {
          error.value.message = t('auth.passwordreq')
        } else if (!passwordRegex.test(passwordValue)) {
          error.value.message = t('auth.passworderr')
        } else {
          error.value.message = ''
        }
        break
      case 'username':
        error.value.type = type
        const usernameField = datalogin.value.find((item) => item.type === type)
        const usernameValue = usernameField?.data.trim()

        if (!usernameValue) {
          error.value.message = t('auth.usernamereq')
        } else {
          error.value.message = ''
        }
        break
      case 'checkpassword':
        error.value.type = type
        const repassF = datalogin.value.find((item) => item.type === 'password')
        const passV = repassF?.data.trim()
        const repasswordField = datalogin.value.find((item) => item.type === type)
        const repasswordValue = repasswordField?.data.trim()

        if (!repasswordValue) {
          error.value.message = t('auth.repasswordreq')
        } else if (repasswordValue !== passV) {
          error.value.message = t('auth.repassworderr')
        } else {
          error.value.message = ''
        }
        break
      case 'phone':
        error.value.type = type
        const phoneField = datalogin.value.find((item) => item.type === type)
        const phoneValue = phoneField?.data.trim()

        if (!phoneValue) {
          error.value.message = t('auth.phonereq')
        } else if (!/^\d+$/.test(phoneValue)) {
          error.value.message = t('auth.justnum')
        } else {
          error.value.message = ''
        }
        break
    }
  }

  // check all form

  const checkall = async () => {
    const fields = datalogin.value.filter((object) => object.page.includes(currentPage.value))

    for (const input of fields) {
      check(input.type)
      if (error.value.message) break
    }
    const data = ref({})
    // login
    if (!error.value.message && currentPage.value == 'login') {
      loading.value = true
      for (const inf of fields) {
        data.value.phone = inf.type == 'phone' ? inf.data : data.value.phone
        data.value.password = inf.type == 'password' ? inf.data : data.value.password
      }
      await authStore.loginUser(data.value, rememberme.value).finally(() => {
        loading.value = false
      })
      // registration
    } else if (!error.value.message && currentPage.value == 'registration') {
      if (!Terms.value) {
        throw toast.add({ severity: 'info', summary: t('auth.Terms'), detail: t('auth.Termserror'), life: 3000 })
      }
      loading.value = true
      for (const inf of fields) {
        data.value.password = inf.type == 'password' ? inf.data : data.value.password
        data.value.name = inf.type == 'username' ? inf.data : data.value.name
        data.value.phone = inf.type == 'phone' ? inf.data : data.value.phone
      }
      await authStore.registration(data.value).finally(() => {
        loading.value = false
      })
      // missedPassword
    } else if (!error.value.message && currentPage.value == 'missedPassword') {
      loading.value = true
      try {
        const response = await axios.post('api/send-otp', {
          phone: datalogin.value.find((obj) => obj.type === 'phone')?.data,
        })

        if (!error.value.message && currentPage.value == 'missedPassword') {
          currentPage.value = 'OTP'
          otpdata.value.phone = datalogin.value.find((obj) => obj.type === 'phone')?.data
          timer.value = 60
          setInterval(() => {
            if (timer.value > 0) {
              timer.value--
            } else return
          }, 1000)
          toast.add({
            severity: 'success',
            summary: 'Send OTP',
            detail: response.data.message,
            life: 3000,
          })
        }
      } catch (error) {
        const message = error?.response?.data?.message
        toast.add({
          severity: 'error',
          summary: 'Send OTP',
          detail: message,
          life: 3000,
        })
      } finally {
        loading.value = false
      }
      // OTP
    } else if (!error.value.message && currentPage.value == 'OTP') {
      loading.value = true
      try {
        const response = await axios.post('api/verify-email', {
          phone: otpdata.value.phone,
          otp: otp.join(''),
        })
        currentPage.value = 'newPassword'
        toast.add({
          severity: 'success',
          summary: 'Verify Email',
          detail: response.data.message,
          life: 3000,
        })
      } catch (error) {
        const message = error?.response?.data?.message
        toast.add({
          severity: 'error',
          summary: 'Verify Email',
          detail: message,
          life: 3000,
        })
      } finally {
        loading.value = false
      }
    } else if (!error.value.message && currentPage.value == 'newPassword') {
      loading.value = true
        for (const inf of fields) {
        data.value.password = inf.type == 'password' ? inf.data : data.value.password
        data.value.repassword = inf.type == 'checkpassword' ? inf.data : data.value.repassword
      }
      try {
        const response = await axios.post('api/change-password', {
          phone: otpdata.value.phone,
          otp: otp.join(''),
          password : data.value.password,
          password_confirmation: data.value.repassword
        })
        currentPage.value = 'login'
        toast.add({
          severity: 'success',
          summary: 'Change Password',
          detail: response.data.message,
          life: 3000,
        })
      } catch (error) {
        const message = error?.response?.data?.message
        toast.add({
          severity: 'error',
          summary: 'Change Password',
          detail: message,
          life: 3000,
        })
      } finally {
        loading.value = false
      }
    }
  }

  const showpass = (type) => {
    const el = document.getElementById(type)
    const repasswordField = datalogin.value.find((item) => item.type === type)
    if (el.type == 'text') {
      el.type = 'password'
      repasswordField.showicon = 'pi-eye-slash'
    } else if (el.type == 'password') {
      el.type = 'text'
      repasswordField.showicon = 'pi-eye'
    }
  }

  watch(currentPage, (newVal, oldVal) => {
    authStore.clear()
  })
</script>

<style>
  main {
    direction: rtl;
  }
</style>
