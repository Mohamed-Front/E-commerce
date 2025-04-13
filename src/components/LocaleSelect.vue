<script setup>
import { ref, computed } from "vue";
import i18n from "../plugins/i18n";
import { useAppLangStore } from "../stores/AppLangStore";
import Dropdown from 'primevue/dropdown';

const appLang = useAppLangStore();

const languages = ref([
  { name: 'English', code: 'en', dir: 'ltr' },
  { name: 'العربية', code: 'ar', dir: 'rtl' }
]);

const selectedLanguage = computed({
  get() {
    return languages.value.find(lang => lang.code === appLang.appLang) || languages.value[0];
  },
  set(newLang) {
    changeLocale(newLang);
  }
});

const changeLocale = (newLang) => {
  document.body.dir = newLang.dir;
  i18n.global.locale.value = newLang.code;
  appLang.setAppLang(newLang.code);
  appLang.setAppRtl(newLang.dir === 'rtl');
};
</script>

<template>
  <Dropdown
    v-model="selectedLanguage"
    :options="languages"
    optionLabel="name"
    class="language-dropdown mx-4"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="language-option">
        <span class="language-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
          </svg>
        </span>
        <span>{{ slotProps.value.code.toUpperCase() }}</span>
      </div>
    </template>
    <template #option="slotProps">
      <div class="language-option">
        <span>{{ slotProps.option.name }}</span>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped>
.language-dropdown {
  min-width: 70px;
  background:none;
  border: 1px solid #7C7B7B;
  border-radius: .5rem;
}

.language-dropdown :deep(.p-dropdown) {

  border: none;
  color: white;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.language-dropdown :deep(.p-dropdown:hover) {
  transform: translateY(-2px);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.25);
}

.language-dropdown :deep(.p-dropdown:not(.p-disabled).p-focus) {
  box-shadow: 0 0 0 0.2rem rgba(118, 75, 162, 0.5);
}

.language-dropdown :deep(.p-dropdown-panel) {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.language-dropdown :deep(.p-dropdown-items .p-dropdown-item) {
  padding: 0.75rem 1.25rem;
}

.language-dropdown :deep(.p-dropdown-items .p-dropdown-item.p-highlight) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.language-icon {
  display: flex;
  align-items: center;
}

.language-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* RTL specific styles */
[dir="rtl"] .language-dropdown :deep(.p-dropdown) {
  font-family: 'Tahoma', 'Arial', sans-serif;
}
</style>
