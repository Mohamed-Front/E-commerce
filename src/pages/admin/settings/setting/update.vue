<script setup>
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useToast } from 'primevue/usetoast'
  import InputText from 'primevue/inputtext'
  import Button from 'primevue/button'
  import Card from 'primevue/card'
  import ProgressSpinner from 'primevue/progressspinner'

  // Main declarations
  const { t } = useI18n()
  const route = useRoute()
  const toast = useToast()
  const settings = ref([])
  const isLoading = ref(false)

  // Form data for updates
  const formData = ref({
    order_tax: '',
    facebook: '',
    snapchat: '',
    instagram: '',
    whatsapp: '',
    address: '',
    phone: ''
  })

  // Fetch settings on mount
  onMounted(() => {
    fetchSettings()
  })

  // Fetch settings from API
  const fetchSettings = async () => {
    isLoading.value = true
    try {
      const response = await axios.get('api/setting', {
        params: {
          code: route.query.code,
          realmId: route.query.realmId,
        },
      })
      
      if (response.data.is_success) {
        settings.value = response.data.data
        // Map settings to form data
        response.data.data.forEach(item => {
          if (formData.value.hasOwnProperty(item.key)) {
            formData.value[item.key] = item.value
          }
        })
        
        toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: t('quickBooks.successContent'),
          life: 3000,
        })
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: t('quickBooks.erorrContent'),
        life: 3000,
      })
    } finally {
      isLoading.value = false
    }
  }

  // Update settings
  const updateSettings = async () => {
    isLoading.value = true
    try {
      const settingsToUpdate = Object.entries(formData.value).map(([key, value]) => ({
        key,
        value
      }))

      const response = await axios.post('api/setting', {
        data: settingsToUpdate
      })

      if (response.data.is_success) {
        toast.add({
          severity: 'success',
          summary: 'Update Successful',
          detail: t('quickBooks.updateSuccess'),
          life: 3000,
        })
        await fetchSettings() // Refresh settings after update
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: t('quickBooks.updateError'),
        life: 3000,
      })
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <div class=" mx-auto p-4">
    <Card class="max-w-5xl mx-auto">
      <template #title>
        {{ t('settings.title') }}
      </template>
      <template #content>
        <div v-if="!isLoading" class="flex flex-col gap-4">
          <div v-for="(value, key) in formData" :key="key" class="field">
            <label :for="key" class="block mb-2 font-medium">
              {{ t(`settings.${key}`) }}
            </label>
            <InputText
              :id="key"
              v-model="formData[key]"
              :placeholder="t(`settings.${key}Placeholder`)"
              class="w-full"
            />
          </div>
          <Button
            :label="t('settings.updateButton')"
            :disabled="isLoading"
            class="mt-4"
            @click="updateSettings"
          />
        </div>
        <div v-else class="text-center">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
.field {
  margin-bottom: 1rem;
}
</style>