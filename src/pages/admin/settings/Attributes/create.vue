<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);

// Language handling
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const isRTL = computed(() => currentLanguage.value === 'ar');

// Form Data
const attributeData = ref({
  name_en: '',
  name_ar: '',
  is_color: false,
  values: [
    {
      value_en: '',
      value_ar: ''
    }
  ]
});

// Add new value field
const addValueField = () => {
  attributeData.value.values.push({
    value_en: '',
    value_ar: ''
  });
};

// Remove value field
const removeValueField = (index) => {
  if (attributeData.value.values.length > 1) {
    attributeData.value.values.splice(index, 1);
  } else {
    toast.add({
      severity: 'warn',
      summary: t("warning"),
      detail: t('attribute.minOneValue'),
      life: 3000
    });
  }
};

// Submit form
const submitForm = async () => {
  // Validate main fields
  if (!attributeData.value.name_en || !attributeData.value.name_ar) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('validation.requiredFields'),
      life: 3000
    });
    return;
  }

  // Validate all values
  for (const value of attributeData.value.values) {
    if (!value.value_en || (!attributeData.value.is_color && !value.value_ar)) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('attribute.valueRequired'),
        life: 3000
      });
      return;
    }
  }

  loading.value = true;

  // Prepare data to send based on is_color
  const submitData = {
    name_en: attributeData.value.name_en,
    name_ar: attributeData.value.name_ar,
    is_color: attributeData.value.is_color,
    values: attributeData.value.is_color
      ? attributeData.value.values.map(value => ({ value_en: value.value_en ,value_ar:value.value_en }))
      : attributeData.value.values
  };

  axios.post("/api/attribute", submitData).then((res) => {
    router.push({ name: 'attributes' });
    toast.add({
      severity: 'success',
      summary: t("success"),
      detail: t('attribute.createSuccess'),
      life: 3000
    });
  }).catch((el) => {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: el.response.data.message,
      life: 3000
    });
    loading.value = false;
    console.log(el.response.data.message);
  });
};
</script>

<template>
  <div v-can="'create attributes'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg" :dir="isRTL ? 'rtl' : 'ltr'">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ t('attribute.createTitle') }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- English Name -->
        <div class="space-y-2">
          <label for="name_en" class="block text-sm font-medium text-gray-700">
            {{ t('attribute.nameEn') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_en"
            v-model="attributeData.name_en"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="name_ar" class="block text-sm font-medium text-gray-700">
            {{ t('attribute.nameAr') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name_ar"
            v-model="attributeData.name_ar"
            dir="rtl"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Is Color Checkbox -->
        <div class="space-y-2">
          <label for="is_color" class="block text-sm font-medium text-gray-700">
            {{ t('attribute.isColor') }}
          </label>
          <InputSwitch
            id="is_color"
            v-model="attributeData.is_color"
            class="mt-2"
          />
        </div>
      </div>

      <!-- Values Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">{{ t('attribute.values') }}</h3>

        <div v-for="(value, index) in attributeData.values" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <!-- English Value (Color or Text) -->
          <div class="space-y-2">
            <label :for="`value_en_${index}`" class="block text-sm font-medium text-gray-700">
              {{ t('attribute.valueEn') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <InputText
                v-if="!attributeData.is_color"
                :id="`value_en_${index}`"
                v-model="value.value_en"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                v-else
                type="color"
                :id="`value_en_${index}`"
                v-model="value.value_en"
                class="flex-1 h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <!-- Arabic Value (only when not color) -->
          <div v-if="!attributeData.is_color" class="space-y-2">
            <label :for="`value_ar_${index}`" class="block text-sm font-medium text-gray-700">
              {{ t('attribute.valueAr') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <InputText
                :id="`value_ar_${index}`"
                v-model="value.value_ar"
                dir="rtl"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <Button
                v-if="index > 0"
                type="button"
                icon="pi pi-trash"
                severity="danger"
                @click="removeValueField(index)"
                class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                :title="t('attribute.removeValue')"
              />
            </div>
          </div>

          <!-- Remove button for color values -->
          <div v-if="attributeData.is_color && index > 0" class="space-y-2">
            <Button
              type="button"
              icon="pi pi-trash"
              severity="danger"
              @click="removeValueField(index)"
              class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              :title="t('attribute.removeValue')"
            />
          </div>
        </div>

        <!-- Add Value Button -->
        <div class="pt-2">
          <Button
            type="button"
            :label="t('attribute.addValue')"
            icon="pi pi-plus"
            @click="addValueField"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          />
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('attribute.cancelButton')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 py-3 mx-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        />

        <Button
          type="submit"
          :label="t('attribute.createButton')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 mx-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('attribute.createButton') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
  </div>
  <Toast/>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

/* Button gradient animation */
button.bg-gradient-to-r:hover {
  background-size: 150% 100%;
}

/* RTL support */
[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]) {
  margin-right: 0.5rem;
  margin-left: 0;
}

/* Color picker styling */
input[type="color"] {
  padding: 0;
  cursor: pointer;
}
</style>
