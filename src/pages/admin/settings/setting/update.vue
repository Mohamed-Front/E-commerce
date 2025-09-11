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
  import Editor from 'primevue/editor'
  import FileUpload from 'primevue/fileupload'

  // Main declarations
  const { t } = useI18n()
  const route = useRoute()
  const toast = useToast()
  const settings = ref([])
  const isLoading = ref(false)

  // Form data for updates
  const formData = ref({
    order_tax: '',
    address: '',
    phone: '',
    privacy_policy_ar: '',
    privacy_policy_en: '',
  })

  // Editor configuration
  const editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  }

  // Handle file upload
  const onFileSelect = (event, key) => {
    const file = event.files[0] // Get the first file
    if (file) {
      formData.value[`${key}_file`] = file
      toast.add({
        severity: 'info',
        summary: 'File Selected',
        detail: `${file.name} selected for ${t(`settings.${key}`)}`,
        life: 3000,
      })
    }
  }

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
      // Prepare form data for submission
      const formDataToSend = new FormData()
      const settingsToUpdate = Object.entries(formData.value)
        .filter(([key]) => !key.includes('_file')) // Exclude file fields
        .map(([key, value], index) => ({ key, value }))

      // Append text fields with key and value structure
      settingsToUpdate.forEach((item, index) => {
        formDataToSend.append(`data[${index}][key]`, item.key)
        formDataToSend.append(`data[${index}][value]`, item.value)
      })

      // Append files if they exist
      if (formData.value.privacy_policy_ar_file) {
        formDataToSend.append('privacy_policy_ar_file', formData.value.privacy_policy_ar_file)
      }
      if (formData.value.privacy_policy_en_file) {
        formDataToSend.append('privacy_policy_en_file', formData.value.privacy_policy_en_file)
      }

      const response = await axios.post('api/setting', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.is_success) {
        toast.add({
          severity: 'success',
          summary: 'Update Successful',
          detail: t('quickBooks.updateSuccess'),
          life: 3000,
        })
        // Clear file inputs after successful upload
        formData.value.privacy_policy_ar_file = null
        formData.value.privacy_policy_en_file = null
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
  <div class="mx-auto p-4">
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
              v-if="key !== 'privacy_policy_ar' && key !== 'privacy_policy_en' && !key.includes('_file')"
              :id="key"
              v-model="formData[key]"
              :placeholder="t(`settings.${key}Placeholder`)"
              class="w-full"
            />
            <Editor
              v-else-if="key === 'privacy_policy_ar' || key === 'privacy_policy_en'"
              :id="key"
              v-model="formData[key]"
              :placeholder="t(`settings.${key}Placeholder`)"
              editorStyle="min-height: 200px"
              class="w-full"
            >
              <template #toolbar>
                <span class="ql-formats">
                  <button class="ql-bold"></button>
                  <button class="ql-italic"></button>
                  <button class="ql-underline"></button>
                </span>
                <span class="ql-formats">
                  <button class="ql-list" value="ordered"></button>
                  <button class="ql-list" value="bullet"></button>
                </span>
                <span class="ql-formats">
                  <button class="ql-link"></button>
                </span>
                <span class="ql-formats">
                  <button class="ql-clean"></button>
                </span>
              </template>
            </Editor>
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
:deep(.p-editor-container .p-editor-content) {
  min-height: 200px;
}
:deep(.p-fileupload-choose) {
  width: 100%;
}
</style>
