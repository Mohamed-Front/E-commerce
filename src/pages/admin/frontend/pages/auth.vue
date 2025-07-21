<template>
  <!-- main container -->
    <Toast />
  <main class="flex flex-col bg-[#111] min-h-[110vh]">
    <nav><img src="../../../../assets/shiftlogo.png" alt="" width="80" class="m-[2rem]" /></nav>
    <div class="min-h-[80vh] flex justify-evenly items-center">
      <!-- Forms -->
      <div class="bg-[#2A2A2A] p-8 rounded-md text-white lg:min-w-[40%] min-w-[80%]">
        <!-- Login -->
        <div class="">
          <form class="flex flex-col gap-4 items-center" @submit.prevent="checkall()">
            <h1 class="font-bold">{{ $t('auth.loginnow') }}</h1>
            <p class="text-[#9F9F9F] mb-6">{{ t('auth.loginnote') }}</p>

            <div class="flex flex-col gap-1 w-full text-white" v-for="value in datalogin">
              <label v-if="value.page.includes(currentPage)" for="email" class="mb-2">{{
                t(`auth.${value.type}`)
              }}</label>
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
              <span v-if="error.type == value.type && error.message" name="email" class="text-red-500 text-xs mx-4">{{
                error.message
              }}</span>
            </div>
            <div v-if="currentPage == 'login'" class="flex justify-between w-full">
              <div>
                <input v-model="rememberme" type="checkbox" id="rememberme" class="mx-2" />
                <label for="rememberme">{{ t('auth.rememberme') }}</label>
              </div>
              <span class="text-blue-500">{{ t('auth.forgotpassword') }}</span>
            </div>
            <div v-if="currentPage == 'registration'">
              <input v-model="Terms" type="checkbox" id="Terms" class="mx-2 text-xs" />
              <label for="Terms">{{ t('auth.terms') }}</label>
            </div>

            <Button
              type="submit"
              :label="
                currentPage == 'registration' ? t('auth.registration') : currentPage == 'login' ? t('auth.login') : ''
              "
              class="outline-none w-full mt-6 focus:!shadow-none"
            />
            <Button
              @click="currentPage == 'registration' ? (currentPage = 'login') : (currentPage = 'registration')"
              :label="
                currentPage == 'login' ? t('auth.registration') : currentPage == 'registration' ? t('auth.login') : ''
              "
              severity="secondary"
              class="outline-none w-full focus:!shadow-none Custombutton"
            />
            <span class="text-xs text-[#9F9F9F]">{{ $t('auth.or') }}</span>
            <Button
              :label="t('auth.loginwithfacebock')"
              icon="pi pi-facebook"
              severity="secondary"
              class="text-[#9F9F9F] !text-sm outline-none w-full focus:!shadow-none Custombutton"
            />
            <Button
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
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AuthStore } from '../store/auth.store'
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();
  const authStore = AuthStore()
  const { t } = useI18n()
  const currentPage = ref('login') // 'login', 'register', 'missedPassword', 'OTP', 'newPassword'

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
      type: 'email',
      data: '',
      placeholder: 'test@example.com',
      inputtype: 'text',
      page: ['login', 'registration'],
    },
    {
      type: 'phone',
      data: '',
      placeholder: '07xxxxxxxx',
      inputtype: 'text',
      page: ['registration'],
    },
    {
      type: 'password',
      data: '',
      icon: 'pi-lock',
      showicon: 'pi-eye-slash',
      inputtype: 'password',
      page: ['login', 'registration'],
    },
    {
      type: 'checkpassword',
      data: '',
      icon: 'pi-lock',
      showicon: 'pi-eye-slash',
      inputtype: 'password',
      page: ['registration'],
    },
  ])

  const dataregister = ref([
    {
      type: 'email',
    },
  ])
  const error = ref({})
  const check = (type) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    switch (type) {
      case 'email':
        error.value.type = type
        const emailField = datalogin.value.find((item) => item.type === type)
        const emailValue = emailField?.data.trim()

        if (!emailValue) {
          error.value.message = t('auth.emailreq')
        } else if (!emailRegex.test(emailValue)) {
          error.value.message = t('auth.emailerr')
        } else {
          error.value.message = ''
        }
        break
      case 'password':
        error.value.type = type
        const passwordField = datalogin.value.find((item) => item.type === 'password')
        const passwordValue = passwordField?.data.trim()

        if (!passwordValue) {
          error.value.message = t('auth.passwordreq')
        } else if(passwordRegex.test(passwordValue)) {
          error.value.message = t('auth.passworderr')
        }
        else {
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
    if (!error.value.message && currentPage.value == 'login') {
      for (const inf of fields) {
        data.value.email = inf.type == 'email' ? inf.data : data.value.email
        data.value.password = inf.type == 'password' ? inf.data : data.value.password
      }
      await authStore.loginUser(data.value,rememberme.value)
      //  if(authStore.error) {
      //   console.log(authStore.error)
      //  }
    } else if (!error.value.message && currentPage.value == 'registration') {
      if(!Terms.value) {
        toast.add({ severity: 'info', summary: t('auth.Terms'), detail: t('auth.Termserror'), life: 3000 });
        return;
    }
      for (const inf of fields) {
        data.value.email = inf.type == 'email' ? inf.data : data.value.email
        data.value.password = inf.type == 'password' ? inf.data : data.value.password
        data.value.name = inf.type == 'username' ? inf.data : data.value.name
        data.value.phone = inf.type == 'phone' ? inf.data : data.value.phone
      }
      await authStore.registration(data.value)
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
</script>

<style>
  main {
    direction: rtl;
  }
</style>
