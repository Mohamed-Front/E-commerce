```vue
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const mediaData = ref([]);
const loading = ref(false);
const mediaSelections = ref({});
const appLanguage = ref(localStorage.getItem('appLang') || 'en');

const fetchMedia = async () => {
  loading.value = true;
  const type = route.params.type === '1' ? 'store' : route.params.type === '2' ? 'category' : null;
  const id = route.params.id;

  if (!type || !id) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invalidParams'),
      life: 3000
    });
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`/api/product/get/product/category?type=${type}&id=${id}`);
    if (response.data.is_success && response.data.data.success) {
      mediaData.value = response.data.data.data || [];
      if (mediaData.value.length === 0) {
        toast.add({
          severity: 'warn',
          summary: t('warning'),
          detail: t('noMediaFound'),
          life: 3000
        });
      } else {
        mediaData.value.forEach(media => {
          mediaSelections.value[media.id] = {
            selectedType: media.media_links?.type?.toString() || route.params.type || '1',
            selectedIds: media.media_links?.ids || [],
            availableIds: [],
            searchQuery: ''
          };
        });
      }
    } else {
      throw new Error(response.data.message || t('mediaFetchError'));
    }
  } catch (error) {
    console.error('Error fetching media:', error);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || error.message || t('mediaFetchError'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const fetchAvailableIds = async (mediaId, typeValue) => {
  try {
    const endpoint = typeValue === '1' ? 'product' : 'category';
    // Fetch initial list of available items
    const response = await axios.get(`/api/${endpoint}`, {
      params: {
        search: mediaSelections.value[mediaId].searchQuery || undefined
      }
    });

    let items = [];
    if (response.data.is_success) {
      items = response.data.data.data || [];
      mediaSelections.value[mediaId].availableIds = items.map(item => ({
        label: appLanguage.value === 'ar'
          ? (item.name_ar || item.name || `ID ${item.id}`)
          : (item.name_en || item.name || `ID ${item.id}`),
        value: item.id
      }));
    } else {
      throw new Error(response.data.message || t('idFetchError'));
    }

    // Fetch details for pre-selected IDs not in the initial list
    const selectedIds = mediaSelections.value[mediaId].selectedIds;
    const missingIds = selectedIds.filter(id => !mediaSelections.value[mediaId].availableIds.some(item => item.value === id));

    if (missingIds.length > 0) {
      const additionalItems = [];
      // Make individual API calls for each missing ID
      for (const id of missingIds) {
        try {
          const idResponse = await axios.get(`/api/${endpoint}`, {
            params: { search: id }
          });
          if (idResponse.data.is_success && idResponse.data.data.data.length > 0) {
            const item = idResponse.data.data.data[0];
            additionalItems.push({
              label: appLanguage.value === 'ar'
                ? (item.name_ar || item.name || `ID ${item.id}`)
                : (item.name_en || item.name || `ID ${item.id}`),
              value: item.id
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch details for ID ${id}:`, error);
        }
      }
      // Add unique items to availableIds, avoiding duplicates
      additionalItems.forEach(item => {
        if (!mediaSelections.value[mediaId].availableIds.some(existing => existing.value === item.value)) {
          mediaSelections.value[mediaId].availableIds.push(item);
        }
      });
    }
  } catch (error) {
    console.error('Error fetching IDs:', error);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || error.message || t('idFetchError'),
      life: 3000
    });
  }
};

const onIdFilter = (event, mediaId) => {
  mediaSelections.value[mediaId].searchQuery = event.value;
  fetchAvailableIds(mediaId, mediaSelections.value[mediaId].selectedType);
};

const submitMediaLink = async (mediaId) => {
  const selection = mediaSelections.value[mediaId];
  if (!selection.selectedIds.length || !selection.selectedType) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('selectIdsAndType'),
      life: 3000
    });
    return;
  }

  try {
    const payload = {
      media_id: mediaId,
      type: parseInt(selection.selectedType),
      ids: selection.selectedIds
    };
    const response = await axios.post('/api/medialink', payload);
    if (response.data.is_success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('mediaLinkCreated'),
        life: 3000
      });
      mediaSelections.value[mediaId].selectedIds = [];
      mediaSelections.value[mediaId].searchQuery = '';
      await fetchAvailableIds(mediaId, selection.selectedType);
    } else {
      throw new Error(response.data.message || t('mediaLinkError'));
    }
  } catch (error) {
    console.error('Error creating media link:', error);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || error.message || t('mediaLinkError'),
      life: 3000
    });
  }
};

const handleTypeChange = async (mediaId) => {
  mediaSelections.value[mediaId].selectedIds = [];
  mediaSelections.value[mediaId].availableIds = [];
  mediaSelections.value[mediaId].searchQuery = '';
  await fetchAvailableIds(mediaId, mediaSelections.value[mediaId].selectedType);
};

onMounted(async () => {
  await fetchMedia();
  for (const media of mediaData.value) {
    await fetchAvailableIds(media.id, mediaSelections.value[media.id]?.selectedType || '1');
  }
});

const typeOptions = [
  { label: t('product.mediaTitle'), value: '1' },
  { label: t('category.mediaTitle'), value: '2' }
];
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ route.params.type === '1' ? t('store.mediaTitle') : t('category.mediaTitle') }}
    </h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>

    <div v-else-if="mediaData.length === 0" class="text-center text-gray-600">
      {{ t('noMediaFound') }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="media in mediaData" :key="media.id" class="shadow-md hover:shadow-lg transition-shadow duration-300">
        <template #content>
          <div class="relative group">
            <img
              :src="media.url"
              :alt="media.name || `${route.params.type === '1' ? t('store.media') : t('category.media')} ${media.id}`"
              class="w-full h-[50px] object-cover rounded-lg"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
              <a
                :href="media.url"
                target="_blank"
                class="opacity-0 group-hover:opacity-100 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                :aria-label="t('viewMedia', { name: media.name || 'Media ' + media.id })"
              >
                <i class="pi pi-link text-sm"></i>
              </a>
            </div>
          </div>
          <p class="mt-2 text-center text-sm text-gray-600">{{ media.name || t('mediaItem') }}</p>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('selectType') }}</label>
            <Dropdown
              v-model="mediaSelections[media.id].selectedType"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              @change="handleTypeChange(media.id)"
            />
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ mediaSelections[media.id].selectedType === '1' ? t('selectProducts') : t('selectCategories') }}
            </label>
            <MultiSelect
              v-model="mediaSelections[media.id].selectedIds"
              :options="mediaSelections[media.id].availableIds || []"
              optionLabel="label"
              optionValue="value"
              :placeholder="mediaSelections[media.id].selectedType === '1' ? t('selectProducts') : t('selectCategories')"
              class="w-full"
              :maxSelectedLabels="3"
              filter
              :filterPlaceholder="mediaSelections[media.id].selectedType === '1' ? t('searchProducts') : t('searchCategories')"
              @filter="onIdFilter($event, media.id)"
            />
          </div>

          <Button
            :label="t('linkMedia')"
            class="mt-4 w-full"
            severity="success"
            @click="submitMediaLink(media.id)"
            :disabled="!mediaSelections[media.id].selectedIds.length"
          />
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>

<style scoped>
.transition-all {
  transition-property: all;
}
.transition-shadow {
  transition-property: box-shadow;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

.group:hover .group-hover\:bg-opacity-30 {
  background-color: rgba(0, 0, 0, 0.3);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
```
