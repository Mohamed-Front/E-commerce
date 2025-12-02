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
import Message from 'primevue/message'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const isLoading = ref(false)

// البيانات الأساسية + الشروط والأحكام الجديدة
const formData = ref({
  order_tax: '',
  address: '',
  phone: '',
  privacy_policy_ar: '',
  privacy_policy_en: '',
  terms_conditions_ar: '',
  terms_conditions_en: '',

  // لحفظ الملفات المرفوعة مؤقتًا
  privacy_policy_ar_file: null,
  privacy_policy_en_file: null,
  terms_conditions_ar_file: null,
  terms_conditions_en_file: null,
})

// إعدادات المحرر مع دعم المحاذاة (text alignment)
const editorOptions = {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }], // زر المحاذاة: يمين - وسط - يسار - مبرر
      ['link'],
      ['clean'],
    ],
  },
}

// معالجة اختيار الملف
const onFileSelect = (event, key) => {
  const file = event.files[0]
  if (file) {
    // التحقق من نوع الملف (PDF أو Word)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.add({
        severity: 'warn',
        summary: t('settings.invalidFile'),
        detail: t('settings.onlyPdfWord'),
        life: 5000,
      })
      return
    }

    formData.value[`${key}_file`] = file
    toast.add({
      severity: 'info',
      summary: t('settings.fileSelected'),
      detail: `${file.name} → ${t(`settings.${key}`)}`,
      life: 3000,
    })
  }
}

// جلب الإعدادات عند تحميل الصفحة
onMounted(() => {
  fetchSettings()
})

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
      const data = response.data.data

      // تعيين القيم في formData إذا وجدت
      const mapping = {
        order_tax: 'order_tax',
        address: 'address',
        phone: 'phone',
        privacy_policy_ar: 'privacy_policy_ar',
        privacy_policy_en: 'privacy_policy_en',
        terms_conditions_ar: 'terms_conditions_ar',
        terms_conditions_en: 'terms_conditions_en',
      }

      data.forEach(item => {
        if (mapping[item.key] && formData.value.hasOwnProperty(mapping[item.key])) {
          formData.value[item.key] = item.value || ''
        }
      })

      toast.add({
        severity: 'success',
        summary: t('quickBooks.success'),
        detail: t('quickBooks.successContent'),
        life: 3000,
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('quickBooks.error'),
      detail: t('quickBooks.erorrContent'),
      life: 5000,
    })
  } finally {
    isLoading.value = false
  }
}

// تحديث الإعدادات
const updateSettings = async () => {
  isLoading.value = true
  try {
    const formDataToSend = new FormData()

    // تحضير الحقول النصية
    const fields = [
      'order_tax',
      'address',
      'phone',
      'privacy_policy_ar',
      'privacy_policy_en',
      'terms_conditions_ar',
      'terms_conditions_en',
    ]

    fields.forEach((key, index) => {
      formDataToSend.append(`data[${index}][key]`, key)
      formDataToSend.append(`data[${index}][value]`, formData.value[key] || '')
    })

    // إرفاق الملفات إذا وُجدت
    const fileKeys = [
      'privacy_policy_ar_file',
      'privacy_policy_en_file',
      'terms_conditions_ar_file',
      'terms_conditions_en_file',
    ]

    fileKeys.forEach(key => {
      if (formData.value[key]) {
        formDataToSend.append(key, formData.value[key])
      }
    })

    const response = await axios.post('api/setting', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.is_success) {
      toast.add({
        severity: 'success',
        summary: t('settings.updateSuccess'),
        detail: t('quickBooks.updateSuccess'),
        life: 4000,
      })

      // إعادة تحميل البيانات + مسح الملفات المؤقتة
      formData.value.privacy_policy_ar_file = null
      formData.value.privacy_policy_en_file = null
      formData.value.terms_conditions_ar_file = null
      formData.value.terms_conditions_en_file = null

      await fetchSettings()
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('settings.updateFailed'),
      detail: error.response?.data?.message || t('quickBooks.updateError'),
      life: 6000,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto p-4 max-w-6xl">
    <Card>
      <template #title>
        <h2 class="text-2xl font-bold">{{ t('settings.title') }}</h2>
      </template>

      <template #content>
        <!-- تحميل -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <ProgressSpinner style="width: 60px; height: 60px" />
        </div>

        <!-- النموذج -->
        <div v-else class="space-y-8">

          <!-- الحقول النصية العادية -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="field">
              <label class="block mb-2 font-medium">{{ t('settings.order_tax') }}</label>
              <InputText
                v-model="formData.order_tax"
                :placeholder="t('settings.order_taxPlaceholder')"
                class="w-full"
              />
            </div>

            <div class="field">
              <label class="block mb-2 font-medium">{{ t('settings.phone') }}</label>
              <InputText
                v-model="formData.phone"
                :placeholder="t('settings.phonePlaceholder')"
                class="w-full"
              />
            </div>

            <div class="field md:col-span-2">
              <label class="block mb-2 font-medium">{{ t('settings.address') }}</label>
              <InputText
                v-model="formData.address"
                :placeholder="t('settings.addressPlaceholder')"
                class="w-full"
              />
            </div>
          </div>

          <div class="border-t pt-8">

            <!-- سياسة الخصوصية عربي -->
            <div class="mb-8">
              <label class="block mb-3 font-medium text-lg">{{ t('settings.privacy_policy_ar') }}</label>
              <Editor
                v-model="formData.privacy_policy_ar"
                :placeholder="t('settings.privacy_policy_arPlaceholder')"
                editorStyle="min-height: 320px"
                :formats="['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'align']"
                :modules="editorOptions.modules"
              />

            </div>

            <!-- سياسة الخصوصية إنجليزي -->
            <div class="mb-8">
              <label class="block mb-3 font-medium text-lg">{{ t('settings.privacy_policy_en') }}</label>
              <Editor
                v-model="formData.privacy_policy_en"
                :placeholder="t('settings.privacy_policy_enPlaceholder')"
                editorStyle="min-height: 320px"
                :formats="['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'align']"
                :modules="editorOptions.modules"
              />

            </div>
          </div>

          <!-- الشروط والأحكام -->
          <div class="border-t pt-8">

            <!-- الشروط والأحكام عربي -->
            <div class="mb-8 ">
              <label class="block mb-3 font-medium text-lg">{{ t('settings.terms_conditions_ar') }}</label>
              <Editor
                v-model="formData.terms_conditions_ar"
                :placeholder="t('settings.terms_conditions_arPlaceholder')"

                :formats="['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'align']"
                :modules="editorOptions.modules"
              />

            </div>

            <!-- الشروط والأحكام إنجليزي -->
            <div class="mb-8">
              <label class="block mb-3 font-medium text-lg">{{ t('settings.terms_conditions_en') }}</label>
              <Editor
                v-model="formData.terms_conditions_en"
                :placeholder="t('settings.terms_conditions_enPlaceholder')"
                editorStyle="min-height: 320px"
                :formats="['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'align']"
                :modules="editorOptions.modules"
              />

            </div>
          </div>

          <!-- زر الحفظ -->
          <div class="flex justify-end mt-10">
            <Button
              :label="t('settings.updateButton')"
              icon="pi pi-check"
              :loading="isLoading"
              class="px-8 py-3 text-lg"
              @click="updateSettings"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

:deep(.p-editor-container .p-editor-content) {
  min-height: 320px;
  font-size: 1rem;
  line-height: 1.6;
}

:deep(.p-fileupload) {
  width: 100%;
}

:deep(.p-button) {
  background: #6366f1;
  border: none;
}

:deep(.p-button:hover) {
  background: #4f46e5 !important;
}
</style>
