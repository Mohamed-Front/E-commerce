<template>

  <form @submit.prevent="" class="space-y-10">
    <div v-if="authStore.authErrors.length" class="alert alert-danger text-red-500 mb-5">
      {{ authStore.authErrors }}
    </div>
    <div class="card flex justify-content-center ">
        <span class="p-float-label w-full ">
            <InputText type="email" style="background-color: #FAF7F2;" id="username" class="w-full" v-model="form.email"/>
            <label style="font-size: 16px;" for="username">Email</label>
        </span>
    </div>

    <div class="card flex justify-content-center">

        <span class="p-float-label w-full">
            <InputText style="background-color: #FAF7F2;" type="password" id="username" class="w-full bg-[#FAF7F2]" v-model="form.password" />
            <label style="font-size: 16px;" for="username">password</label>
        </span>
    </div>
    <div class="flex justify-center mt-4">
      <button style="background-color: #D7A648 !important;border-radius: 10px;color:white" class="w-full lg:w-[50%] py-2 text-lg" @click="authStore.handleLogin(form)">{{ t('login') }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '../../../stores/Auth'
  import InputText from 'primevue/inputtext';

  const { t } = useI18n()

  // const email = ref('')
  // const password = ref('')

  const form = ref({
    email: '',
    password: '',
  })

  const authStore = useAuthStore()
  const keepLoggedIn = ref(false)
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const router = useRouter()

  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  function onsubmit() {
    if (!formReady.value) return

    emailErrors.value = form.value.email ? [] : ['Email is required']
    passwordErrors.value = form.value.password ? [] : ['Password is required']

    router.push({ name: 'dashboard' })
  }
</script>
<style>
label{
  color:#D7A648 !important;
}
</style>
