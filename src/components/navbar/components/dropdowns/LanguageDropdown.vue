<template>

</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { reactive, computed } from 'vue'
  const { t, locale } = useI18n()
  import axios from 'axios'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()

  withDefaults(
    defineProps<{
      options?: { code: string; name: string }[]
    }>(),
    {
      options: () => [
        {
          code: 'gb',
          name: 'english',
        },
        {
          code: 'sa',
          name: 'arabic',
        },

      ],
    },
  )

  function getFlagIcon(code: string, size: string) {
    return `flag-icon-${code} ${size}`
  }

  import i18n from '../../../../i18n/index'

  const changeLocale = () => {
    i18n.global.locale.value != 'sa' ? executeArCode() : executeEnCode()
  }

  const executeArCode = () => {
    localStorage.setItem('dir', 'ltr')
    document.body.dir = 'ltr'
  }

  const executeEnCode = () => {
    localStorage.setItem('dir', 'rtl')

    document.body.dir = 'rtl'
  }

  const setLocale = (code: string) => {
    axios
      .get(`/api/language/${locale}`)
      .then((res) => {
        locale.value = code
        localStorage.setItem('appLang', code)
        changeLocale()
        router.push({
          params: { locale: code },
        })
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
</script>

<style lang="scss" scoped>
  @import 'flag-icons/css/flag-icons.css';

  .language-dropdown {
    cursor: pointer;

    &__content {
      .fi-size-small {
        min-width: 1.5rem;
        min-height: 1.5rem;
        margin-right: 0.5rem;
      }
    }

    &__item {
      cursor: pointer;
      flex-wrap: nowrap;

      &:last-of-type {
        padding-bottom: 0 !important;
      }

      &:hover {
        color: var(--va-primary);
      }
    }

    .fi::before {
      content: '';
    }

    .fi-size-large {
      display: block;
      width: 32px;
      height: 24px;
    }

    .va-dropdown__anchor {
      display: inline-block;
    }
  }
</style>
