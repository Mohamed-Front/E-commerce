```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" :dir="$t('dir')">
    <Toast position="top-right" />

    <!-- Tab Details -->
    <div v-if="tabDetails" class="card mb-6 transform hover:scale-[1.01] transition-transform duration-300">
      <h1 class="text-3xl font-bold mb-6 text-gray-800" :class="{ 'text-right': $t('dir') === 'rtl' }">
        {{ tabDetails[labelField] }}
      </h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p class="text-lg"><strong>{{ belongsToLabel }}:</strong> {{ belongsToName }}</p>
          <p class="text-lg"><strong>{{ $t('custom_tabs.name_en') }}:</strong> {{ tabDetails.name_en }}</p>
        </div>
        <div>
          <p class="text-lg"><strong>{{ $t('custom_tabs.name_ar') }}:</strong> {{ tabDetails.name_ar }}</p>
        </div>
      </div>
    </div>

    <!-- Add New Detail Form -->
    <div class="card mb-6 transform hover:scale-[1.01] transition-transform duration-300">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800" :class="{ 'text-right': $t('dir') === 'rtl' }">
        {{ $t('custom_tabs.add_new_detail') }}
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ $t('custom_tabs.name_en') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="newDetail.name_en"
            :placeholder="$t('custom_tabs.enter_name_en')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'border-red-500': showAddValidationErrors && !newDetail.name_en }"
            aria-describedby="name_en_error"
            required
          />
          <small v-if="showAddValidationErrors && !newDetail.name_en" id="name_en_error" class="text-red-500">
            {{ $t('custom_tabs.name_en_required') }}
          </small>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ $t('custom_tabs.name_ar') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="newDetail.name_ar"
            :placeholder="$t('custom_tabs.enter_name_ar')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'border-red-500': showAddValidationErrors && !newDetail.name_ar }"
            aria-describedby="name_ar_error"
            required
          />
          <small v-if="showAddValidationErrors && !newDetail.name_ar" id="name_ar_error" class="text-red-500">
            {{ $t('custom_tabs.name_ar_required') }}
          </small>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ selectLabel }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            v-model="newDetail.ids"
            :options="availableIds"
            :optionLabel="multiSelectLabel"
            optionValue="id"
            :placeholder="selectPlaceholder"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': showAddValidationErrors && !newDetail.ids.length }"
            aria-describedby="ids_error"
            filter
            :filterPlaceholder="searchPlaceholder"
            @filter="onIdFilter"
            required
          />
          <small v-if="showAddValidationErrors && !newDetail.ids.length" id="ids_error" class="text-red-500">
            {{ $t('custom_tabs.ids_required') }}
          </small>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ $t('custom_tabs.image') }} <span class="text-red-500">*</span>
          </label>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onImageSelect('new', $event)"
            :chooseLabel="$t('custom_tabs.select_image')"
            class="p-button-rounded"
          />
          <small v-if="showAddValidationErrors && !newDetail.image" class="text-red-500">
            {{ $t('custom_tabs.image_required') }}
          </small>
        </div>
      </div>
      <Button
        :label="$t('custom_tabs.add_detail')"
        icon="pi pi-plus"
        class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        @click="addDetail"
      />
    </div>

    <!-- Details List -->
    <div class="card mb-6">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800" :class="{ 'text-right': $t('dir') === 'rtl' }">
        {{ $t('custom_tabs.details') }}
      </h2>
      <div v-if="tabDetails?.details?.length" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div v-for="detail in tabDetails.details" :key="detail.id" class="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-lg"><strong>{{ $t('custom_tabs.name_en') }}:</strong> {{ detail.name_en }}</p>
              <p class="text-lg"><strong>{{ $t('custom_tabs.name_ar') }}:</strong> {{ detail.name_ar }}</p>
              <div v-if="detail.media.length">
                <strong>{{ $t('custom_tabs.media') }}:</strong>
                <img :src="detail.media[0].url" :alt="$t('custom_tabs.detail_image')" class="w-32 h-32 object-cover mt-2 rounded-lg" />
              </div>
            </div>
            <div class="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                class="p-detail p-button-rounded"
                @click="openEditDialog(detail)"
              />
              <Button
                severity="danger"
                icon="pi pi-trash"
                class="p-delete p-button-rounded"
                @click="deleteDetail(detail.id)"
              />
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 text-lg">{{ $t('custom_tabs.no_details') }}</p>
    </div>

    <!-- Edit Detail Dialog -->
    <Dialog
      v-model:visible="showEditDialog"
      :header="$t('custom_tabs.edit_detail')"
      :modal="true"
      class="w-full max-w-3xl bg-white rounded-xl shadow-2xl"
      :class="{ 'rtl': $t('dir') === 'rtl' }"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ $t('custom_tabs.name_en') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="editDetail.name_en"
            :placeholder="$t('custom_tabs.enter_name_en')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'border-red-500': !isEditFormValid && !editDetail.name_en }"
            aria-describedby="edit_name_en_error"
            required
          />
          <small v-if="!isEditFormValid && !editDetail.name_en" id="edit_name_en_error" class="text-red-500">
            {{ $t('custom_tabs.name_en_required') }}
          </small>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ $t('custom_tabs.name_ar') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="editDetail.name_ar"
            :placeholder="$t('custom_tabs.enter_name_ar')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'border-red-500': !isEditFormValid && !editDetail.name_ar }"
            aria-describedby="edit_name_ar_error"
            required
          />
          <small v-if="!isEditFormValid && !editDetail.name_ar" id="edit_name_ar_error" class="text-red-500">
            {{ $t('custom_tabs.name_ar_required') }}
          </small>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ selectLabel }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            v-model="editDetail.ids"
            :options="availableIds"
            :optionLabel="multiSelectLabel"
            optionValue="id"
            :placeholder="selectPlaceholder"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': !isEditFormValid && !editDetail.ids.length }"
            aria-describedby="edit_ids_error"
            filter
            :filterPlaceholder="searchPlaceholder"
            @filter="onIdFilter"
            required
          />
          <small v-if="!isEditFormValid && !editDetail.ids.length" id="edit_ids_error" class="text-red-500">
            {{ $t('custom_tabs.ids_required') }}
          </small>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" :class="{ 'text-right': $t('dir') === 'rtl' }">
            {{ $t('custom_tabs.image') }}
          </label>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onImageSelect('edit', $event)"
            :chooseLabel="$t('custom_tabs.select_image')"
            class="p-button-outlined p-button-rounded"
          />
          <img
            v-if="editDetail.media?.length"
            :src="editDetail.media[0].url"
            :alt="$t('custom_tabs.current_image')"
            class="w-32 h-32 object-cover mt-2 rounded-lg"
          />
        </div>
      </div>
      <template #footer>
        <Button
          :label="$t('custom_tabs.cancel')"
          severity="secondary"
          class="p-button-rounded"
          @click="showEditDialog = false"
        />
        <Button
          :label="$t('custom_tabs.save')"
          icon="pi pi-check"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          @click="updateDetail"
          :disabled="!isEditFormValid"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import MultiSelect from 'primevue/multiselect';
import Dialog from 'primevue/dialog';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();

const tabDetails = ref(null);
const showEditDialog = ref(false);
const showAddValidationErrors = ref(false);
const idSearchQuery = ref('');
const newDetail = ref({
  custom_tab_id: route.params.id,
  name_en: '',
  name_ar: '',
  ids: [],
  image: null,
});
const editDetail = ref({
  id: null,
  custom_tab_id: route.params.id,
  name_en: '',
  name_ar: '',
  ids: [],
  image: null,
  media: [],
});
const availableIds = ref([]);
const appLanguage = ref(localStorage.getItem('appLang') || 'en');

// Computed properties
const labelField = computed(() => appLanguage.value === 'en' ? 'name_en' : 'name_ar');

const multiSelectLabel = computed(() => labelField.value);

const belongsToLabel = computed(() => {
  switch (tabDetails.value?.belongs_to) {
    case 'store':
      return t('custom_tabs.store');
    case 'category':
      return t('custom_tabs.category');
    case 'market':
      return t('custom_tabs.market');
    default:
      return t('custom_tabs.unknown');
  }
});

const belongsToName = computed(() => {
  const entity = tabDetails.value?.[tabDetails.value.belongs_to];
  return entity ? entity[labelField.value] : '';
});

const selectLabel = computed(() => {
  const type = tabDetails.value?.type;
  if (type === 1) return t('custom_tabs.select_categories');
  if (type === 2) return t('custom_tabs.select_products');
  if (type === 3) return t('custom_tabs.select_brands');
  return t('custom_tabs.select_items');
});

const selectPlaceholder = computed(() => {
  const type = tabDetails.value?.type;
  if (type === 1) return t('custom_tabs.select_categories');
  if (type === 2) return t('custom_tabs.select_products');
  if (type === 3) return t('custom_tabs.select_brands');
  return t('custom_tabs.select_items');
});

const searchPlaceholder = computed(() => {
  const type = tabDetails.value?.type;
  if (type === 1) return t('custom_tabs.search_categories');
  if (type === 2) return t('custom_tabs.search_products');
  if (type === 3) return t('custom_tabs.search_brands');
  return t('custom_tabs.search_items');
});

// Form validation
const isAddFormValid = computed(() => {
  return newDetail.value.name_en &&
         newDetail.value.name_ar &&
         newDetail.value.ids.length > 0 &&
         newDetail.value.image;
});

const isEditFormValid = computed(() => {
  return editDetail.value.name_en &&
         editDetail.value.name_ar &&
         editDetail.value.ids.length > 0;
});

// Validate add form and show errors
const validateAddForm = () => {
  showAddValidationErrors.value = true;
  if (!isAddFormValid.value) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.validation_required'),
      life: 3000,
    });
    return false;
  }
  return true;
};

// Fetch tab details
const fetchDetails = async () => {
  try {
    const response = await axios.get(`/api/custom-tabs/${route.params.id}`);
    if (response.data.is_success) {
      tabDetails.value = response.data.data;
      await fetchIds(); // Fetch products, categories, or brands based on tab type
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('custom_tabs.fetch_failed'),
      life: 3000,
    });
  }
};

// Fetch products, categories, or brands with search support
const fetchIds = async () => {
  try {
    let endpoint;
    const type = tabDetails.value?.type;
    if (type === 1) endpoint = '/api/category';
    else if (type === 2) endpoint = '/api/product';
    else if (type === 3) endpoint = '/api/brand';
    else return; // Unknown type, skip

    const response = await axios.get(endpoint, {
      params: {
        search: idSearchQuery.value || undefined,
      },
    });
    availableIds.value = response.data.data.data;
  } catch (error) {
    let errorKey = 'items.loadError';
    const type = tabDetails.value?.type;
    if (type === 1) errorKey = 'category.loadError';
    else if (type === 2) errorKey = 'product.loadError';
    else if (type === 3) errorKey = 'brand.loadError';

    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t(errorKey),
      life: 3000,
    });
  }
};

// Debounced fetchIds for search
const debouncedFetchIds = debounce(fetchIds, 300);

// Handle ID filter input
const onIdFilter = (event) => {
  idSearchQuery.value = event.value;
  debouncedFetchIds();
};

// Watch for language changes to refetch IDs
watch(appLanguage, () => {
  fetchIds();
});

// Add new detail
const addDetail = async () => {
  if (!validateAddForm()) return;

  try {
    const formData = new FormData();
    formData.append('custom_tab_id', newDetail.value.custom_tab_id);
    formData.append('name_en', newDetail.value.name_en);
    formData.append('name_ar', newDetail.value.name_ar);
    formData.append('image', newDetail.value.image);
    newDetail.value.ids.forEach((id, index) => {
      formData.append(`ids[${index}]`, id);
    });

    const response = await axios.post('/api/custom-tab-details', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.is_success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('custom_tabs.detail_added'),
        life: 3000,
      });
      newDetail.value = {
        custom_tab_id: route.params.id,
        name_en: '',
        name_ar: '',
        ids: [],
        image: null,
      };
      showAddValidationErrors.value = false;
      await fetchDetails();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('custom_tabs.add_failed'),
      life: 3000,
    });
  }
};

// Delete detail
const deleteDetail = async (detailId) => {
  try {
    const response = await axios.delete(`/api/custom-tab-details/${detailId}`);
    if (response.data.is_success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('custom_tabs.detail_deleted'),
        life: 3000,
      });
      await fetchDetails();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('custom_tabs.delete_failed'),
      life: 3000,
    });
  }
};

// Open edit dialog
const openEditDialog = (detail) => {
  editDetail.value = {
    id: detail.id,
    custom_tab_id: route.params.id,
    name_en: detail.name_en,
    name_ar: detail.name_ar,
    ids: detail.ids,
    image: null,
    media: detail.media,
  };
  showEditDialog.value = true;
};

// Update detail
const updateDetail = async () => {
  try {
    const formData = new FormData();
    formData.append('custom_tab_id', editDetail.value.custom_tab_id);
    formData.append('name_en', editDetail.value.name_en);
    formData.append('name_ar', editDetail.value.name_ar);
    if (editDetail.value.image) {
      formData.append('image', editDetail.value.image);
    }
    editDetail.value.ids.forEach((id, index) => {
      formData.append(`ids[${index}]`, id);
    });
    formData.append('_method', 'PUT');

    const response = await axios.post(`/api/custom-tab-details/${editDetail.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.is_success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('custom_tabs.detail_updated'),
        life: 3000,
      });
      showEditDialog.value = false;
      await fetchDetails();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('custom_tabs.update_failed'),
      life: 3000,
    });
  }
};

// Handle image selection
const onImageSelect = (type, event) => {
  if (type === 'new') {
    newDetail.value.image = event.files[0];
  } else {
    editDetail.value.image = event.files[0];
  }
};

// Lifecycle hook
onMounted(() => {
  fetchDetails();
});
</script>

<style scoped>
.card {
  @apply bg-white p-6 rounded-xl shadow-lg;
}
:deep(.p-inputtext), :deep(.p-multiselect), :deep(.p-fileupload) {
  @apply w-full;
}
:deep(.p-dialog) {
  @apply rounded-xl shadow-2xl;
}
:deep(.p-button) {
  @apply transition-all duration-300;
}
.rtl {
  direction: rtl;
}
</style>
```
