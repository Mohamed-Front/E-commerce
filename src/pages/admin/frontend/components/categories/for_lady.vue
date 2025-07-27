<template>
  <productsSwipertow :products="for_lady" />
</template>

<script setup>
  import { ref, watch } from 'vue'
  import productsSwipertow from '../SwiperSlide/porductsSwipertow.vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'

  const { t } = useI18n()

  const for_lady = ref({
    title: t('lady'),
    products: [],
  })

  const props = defineProps({
    Stor: {
      type: Object,
      required: true,
    },
  })

  const forLady = async () => {
    try {
      const id = props.Stor?.id
      if (!id) return

      const response = await axios.get(`api/home/get-custom-tab/${id}`)

      const lang = localStorage.getItem('appLang') || 'en'

      response.data.data.data.map((product) => {
          for_lady.value.products.push({
            name: lang === 'en' ? product.name_en : product.name_ar || product.name_en,
            img: product.details[0]?.media[0]?.url || '',
            id: product.id,
            type: product.type,
            ids: product.details[0]?.ids
          })
        console.log(for_lady.value)
      })
    } catch (error) {
      console.error('Failed to fetch best sellers:', error)
    }
  }

  watch(
    () => props.Stor?.id,
    (id) => {
      if (id) forLady()
    },
    { immediate: true },
  )
</script>
