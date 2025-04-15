<template>
  <div class="profile-dropdown-wrapper">
    <va-dropdown v-model="isShown" class="profile-dropdown" stick-to-edges :offset="[13, 0]">
      <template #anchor>
        <span class="profile-dropdown__anchor">
          <slot />
          <va-icon class="px-2" :name="isShown ? 'angle_up' : 'angle_down'"  />
        </span>
      </template>
      <va-dropdown-content class="profile-dropdown__content mt-2">

        <va-listg-item class="p-2">
          <span class="profile-dropdown__item cursor-pointer" @click="logout " style="background-color: rgb(255, 255, 255)!important; color: black;">

            {{ t(`user.${options[1].name}`) }}
          </span>
        </va-listg-item>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { logIn } from 'ionicons/icons'
  import { useAuthStore } from '../../../../stores/Auth'

  const { t } = useI18n()
  const { colors } = useColors()
  const router = useRouter()

  const authStore = useAuthStore()

  withDefaults(
    defineProps<{
      options?: { name: string; redirectTo: string }[]
    }>(),
    {
      options: () => [
        {
          name: 'profile',
          redirectTo: '',
        },
        {
          name: 'logout',
          redirectTo: 'login',
        },
      ],
    },
  )

  const isShown = ref(false)
  const logout = () => {
    authStore.resetAuthStore()
        router.push({ name: 'login' })
    axios
      .post('/api/logout')
      .then((res) => {
        console.log(res.data)
        authStore.resetAuthStore()
        router.push({ name: 'login' })
      })
      .catch(() => {})
  }
</script>

<style lang="scss" scoped>
  .profile-dropdown {
    cursor: pointer;

    &__anchor {
      display: inline-block;
    }

    &__item {
      display: block;
      color:white;

      &:hover,
      &:active {
        color:white;
      }
    }
  }
</style>
