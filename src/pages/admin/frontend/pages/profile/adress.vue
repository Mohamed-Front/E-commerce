<template>
  <div class="min-h-screen p-8 font-tajawal" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      <aside class="w-full md:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
        <ul class="space-y-2">
          <li
            @click="router.push({ name: 'profile' })"
            class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer"
            role="button"
            :aria-label="t('profile.account')"
          >
            <span>{{ t('profile.account') }}</span>
          </li>
          <li
            @click="router.push({ name: 'orders' })"
            class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer"
            role="button"
            :aria-label="t('profile.orders')"
          >
            <span>{{ t('profile.orders') }}</span>
          </li>
          <li
            @click="router.push({ name: 'addres' })"
            class="p-3 rounded-lg flex items-center gap-4 bg-yellow-100 text-yellow-700 font-medium cursor-pointer"
            role="button"
            aria-current="page"
            :aria-label="t('profile.addresses')"
          >
            <span>{{ t('profile.addresses') }}</span>
          </li>
          <li
            @click="logout"
            class="p-3 rounded-lg flex items-center gap-4 text-red-500 hover:bg-gray-50 cursor-pointer"
            role="button"
            :aria-label="t('profile.logout')"
          >
            <span>{{ t('profile.logout') }}</span>
          </li>
        </ul>
      </aside>

      <main class="flex-1 bg-white rounded-xl shadow-md p-8">
        <h1 class="text-2xl font-bold text-center mb-8 text-gray-700">{{ t('addresses.title') }}</h1>

        <div v-if="loading" class="flex justify-center items-center py-4">
          <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" class="text-blue-600" />
          <p class="ml-2">{{ t('loading') }}</p>
        </div>

        <div v-if="error" class="text-center text-red-500">
          {{ error }}
          <button
            @click="fetchAddresses()"
            class="ml-4 text-blue-500 hover:underline"
            :aria-label="t('addresses.retry')"
          >
            {{ t('addresses.retry') }}
          </button>
        </div>

        <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="address in addresses"
            :key="address.id"
            :class="['bg-white border rounded-xl p-6 flex items-start gap-4', address.is_default ? 'border-2 border-blue-500' : 'border-gray-200']"
          >
            <div class="flex flex-col gap-2 flex-shrink-0 mt-1">
              <div
                @click="router.push({ name: 'add-addres', query: { id: address.id } })"
                role="button"
                :aria-label="t('addresses.edit', { name: address.address_line_1 })"
                class="cursor-pointer"
              >
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                </svg>
              </div>

              <div
                @click="confirmDelete(address.id, address.address_line_1)"
                role="button"
                :aria-label="t('addresses.delete', { name: address.address_line_1 })"
                class="cursor-pointer"
              >
                <svg class="w-5 h-5 text-red-500 hover:text-red-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 100-2V8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>

            <div class="flex-1" :class="{ 'text-right': $i18n.locale === 'ar', 'text-left': $i18n.locale !== 'ar' }">
              <h3 class="text-lg font-bold mb-1" :class="address.is_default ? 'text-yellow-600' : 'text-gray-700'">
                {{ address.is_default ? t('addresses.primary') : t('addresses.shipping') }}
              </h3>
              <p class="text-gray-600 mb-1">{{ address.address_line_1 }}</p>
              <p v-if="address.address_line_2" class="text-gray-600 mb-1">{{ address.address_line_2 }}</p>
              <p class="text-gray-600 mb-1">{{ address.city }}</p>
              <p class="text-gray-600 mb-1">{{ address.country }}</p>
              <p v-if="address.zip_code" class="text-gray-500 font-inter" :class="{ 'direction-ltr': $i18n.locale === 'ar' }">{{ address.zip_code }}</p>
            </div>
          </div>
          <div v-if="addresses.length === 0" class="col-span-1 md:col-span-2 text-center text-gray-500">
            {{ t('addresses.noAddresses') }}
          </div>
        </div>

        <div class="flex justify-center mt-8">
          <button
            @click="router.push({ name: 'add-addres' })"
            class="px-8 py-3 bg-transparent border-2 border-blue-500 text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors duration-200"
            :aria-label="t('addresses.add')"
          >
            {{ t('addresses.add') }}
          </button>
        </div>
      </main>
    </div>

    <Dialog
      v-model:visible="displayConfirmation"
      :header="t('addresses.deleteTitle')"
      :modal="true"
      :style="{ width: '30rem' }"
      class="p-4"
    >
      <div class="flex items-center gap-4">
        <svg class="w-8 h-8 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <span class="text-gray-700">
          {{ t('addresses.deleteConfirmation') }}
          <strong class="font-semibold">{{ addressToDelete.name }}</strong>?
        </span>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="displayConfirmation = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {{ t('addresses.cancel') }}
          </button>
          <button
            @click="performDelete()"
            :loading="isDeleting"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            {{ t('addresses.deleteConfirm') }}
          </button>
        </div>
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog'; // Import Dialog component
import { useAuthStore } from '../../../../../stores/WebAuth';

// Router, i18n, Toast, and Auth
const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

// Reactive variables for API data
const addresses = ref([]);
const loading = ref(true);
const error = ref(null);

// --- New Modal State Variables ---
const displayConfirmation = ref(false);
const addressToDelete = reactive({ id: null, name: '' });
const isDeleting = ref(false);
// ---------------------------------

/**
 * Prepares the modal for display by setting the address ID and name.
 * @param {number} id The ID of the address to be deleted.
 * @param {string} name The primary line of the address for display in the modal.
 */
const confirmDelete = (id, name) => {
  addressToDelete.id = id;
  addressToDelete.name = name;
  displayConfirmation.value = true;
};

/**
 * Executes the DELETE API call after confirmation.
 */
const performDelete = async () => {
  displayConfirmation.value = false;
  isDeleting.value = true;

  try {
    const id = addressToDelete.id;
    // Use the provided DELETE method on the correct endpoint
    const response = await axios.delete(`/api/address/${id}`);

    if (response.data.is_success) {
      // Remove the deleted address from the local array
      addresses.value = addresses.value.filter(address => address.id !== id);

      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('addresses.deleteSuccess'),
        life: 3000,
      });
    } else {
      throw new Error(response.data.message || t('addresses.deleteApiError'));
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || t('addresses.deleteError');
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: errorMessage,
      life: 3000,
    });
    console.error('Error deleting address:', err);
  } finally {
    isDeleting.value = false;
    addressToDelete.id = null;
    addressToDelete.name = '';
  }
};

// Fetch addresses from API (Omitted for brevity)
const fetchAddresses = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get('/api/home/address');
    if (response.data.is_success) {
      addresses.value = response.data.data;
    } else {
      throw new Error(t('addresses.apiError'));
    }
  } catch (err) {
    error.value = t('addresses.loadError');
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.value,
      life: 3000,
    });
    console.error('Error fetching addresses:', err);
  } finally {
    loading.value = false;
  }
};

// Logout function (Omitted for brevity)
const logout = async () => {
  try {
    await axios.post('/api/logout');
    authStore.handleLogout();
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('profile.logoutSuccess'),
      life: 3000,
    });
    router.push({ name: 'login' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('profile.logoutError'),
      life: 3000,
    });
    console.error('Error logging out:', error);
  }
};

onMounted(fetchAddresses);
</script>

<style scoped>
/* ... Existing styles ... */
</style>
