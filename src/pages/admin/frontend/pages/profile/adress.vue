<template>
  <!-- Main container with a light gray background and right-to-left direction for Arabic text -->
  <div class="min-h-screen p-8 font-inter">
    <!-- Main content area, centered and split into a sidebar and a main section -->
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

      <!-- Sidebar section with navigation links -->
      <aside class="w-full md:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
        <ul class="space-y-2">
          <!-- Account Link -->
          <li @click="router.push({ name: 'profile' })" class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.55556 4.44444C5.55556 3.2657 6.02381 2.13524 6.8573 1.30175C7.6908 0.468252 8.82126 0 10 0C11.1787 0 12.3092 0.468252 13.1427 1.30175C13.9762 2.13524 14.4444 3.2657 14.4444 4.44444C14.4444 5.62318 13.9762 6.75365 13.1427 7.58714C12.3092 8.42064 11.1787 8.88889 10 8.88889C8.82126 8.88889 7.6908 8.42064 6.8573 7.58714C6.02381 6.75365 5.55556 5.62318 5.55556 4.44444ZM5.55556 11.1111C4.08213 11.1111 2.66905 11.6964 1.62718 12.7383C0.585316 13.7802 0 15.1932 0 16.6667C0 17.5507 0.35119 18.3986 0.976311 19.0237C1.60143 19.6488 2.44928 20 3.33333 20H16.6667C17.5507 20 18.3986 19.6488 19.0237 19.0237C19.6488 18.3986 20 17.5507 20 16.6667C20 15.1932 19.4147 13.7802 18.3728 12.7383C17.3309 11.6964 15.9179 11.1111 14.4444 11.1111H5.55556Z" fill="#807575"/>
            </svg>
            <span>حسابي</span>
          </li>
          <!-- Orders Link -->
          <li @click="router.push({ name: 'orders' })" class="p-3 rounded-lg flex items-center gap-4 text-gray-500 hover:bg-gray-50 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.837143 0.689412C-8.51495e-08 1.37882 0 2.48706 0 4.70588V15.2941C0 17.5129 -8.51495e-08 18.6212 0.837143 19.3106C1.67429 20 3.02 20 5.71429 20H14.2857C16.98 20 18.3257 20 19.1629 19.3106C20 18.6212 20 17.5129 20 15.2941V4.70588C20 2.48706 20 1.37882 19.1629 0.689412C18.3257 -7.01231e-08 16.98 0 14.2857 0H5.71429C3.02 0 1.67429 -7.01231e-08 0.837143 0.689412ZM5.71429 4.70588C5.33541 4.70588 4.97204 4.82983 4.70413 5.05046C4.43622 5.27109 4.28571 5.57033 4.28571 5.88235C4.28571 6.19437 4.43622 6.49361 4.70413 6.71424C4.97204 6.93487 5.33541 7.05882 5.71429 7.05882H14.2857C14.6646 7.05882 15.028 6.93487 15.2959 6.71424C15.5638 6.49361 15.7143 5.88235C15.7143 5.57033 15.5638 5.27109 15.2959 5.05046C15.028 4.82983 14.6646 4.70588 14.2857 4.70588H5.71429ZM5.71429 9.41177C5.33541 9.41177 4.97204 9.53571 4.70413 9.75635C4.43622 9.97698 4.28571 10.2762 4.28571 10.5882C4.28571 10.9003 4.43622 11.1995 4.70413 11.4201C4.97204 11.6408 5.33541 11.7647 5.71429 11.7647H14.2857C14.6646 11.7647 15.028 11.6408 15.2959 11.4201C15.5638 11.1995 15.7143 10.9003 15.7143 10.5882C15.7143 10.2762 15.5638 9.97698 15.2959 9.75635C15.028 9.53571 14.6646 9.41177 14.2857 9.41177H5.71429ZM5.71429 14.1176C5.33541 14.1176 4.97204 14.2416 4.70413 14.4622C4.43622 14.6829 4.28571 14.9821 4.28571 15.2941C4.28571 15.6061 4.43622 15.9054 4.70413 16.126C4.97204 16.3466 5.33541 16.4706 5.71429 16.4706H11.4286C11.8075 16.4706 12.1708 16.3466 12.4387 16.126C12.7066 15.9054 12.8571 15.6061 12.8571 15.2941C12.8571 14.9821 12.7066 14.6829 12.4387 14.4622C12.1708 14.2416 11.8075 14.1176 11.4286 14.1176H5.71429Z" fill="#807575"/>
            </svg>
            <span>طلباتي</span>
          </li>
          <!-- Addresses Link (Highlighted) -->
          <li @click="router.push({ name: 'addres' })" class="p-3 rounded-lg flex items-center gap-4 bg-yellow-100 text-yellow-700 font-medium cursor-pointer">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0C6.61392 0.00245748 4.32637 0.831051 2.63915 2.30402C0.951939 3.77699 0.0028245 5.77405 9.57508e-06 7.85714C-0.00284824 9.55945 0.634084 11.2156 1.8131 12.5714C1.8131 12.5714 2.05855 12.8536 2.09864 12.8943L9 20L15.9046 12.8907C15.9406 12.8529 16.1869 12.5714 16.1869 12.5714L16.1877 12.5693C17.3661 11.214 18.0028 9.55866 18 7.85714C17.9972 5.77405 17.0481 3.77699 15.3608 2.30402C13.6736 0.831051 11.3861 0.00245748 9 0ZM9 10.7143C8.35272 10.7143 7.71997 10.5467 7.18177 10.2328C6.64358 9.91882 6.2241 9.4726 5.9764 8.95052C5.72869 8.42845 5.66388 7.85397 5.79016 7.29974C5.91644 6.74551 6.22814 6.23642 6.68583 5.83684C7.14353 5.43726 7.72668 5.16514 8.36152 5.0549C8.99637 4.94466 9.6544 5.00124 10.2524 5.21749C10.8504 5.43374 11.3616 5.79994 11.7212 6.2698C12.0808 6.73965 12.2727 7.29205 12.2727 7.85714C12.2716 8.61461 11.9265 9.34079 11.313 9.8764C10.6994 10.412 9.86765 10.7133 9 10.7143Z" fill="#F9C006"/>
            </svg>
            <span>دليل العناوين</span>
          </li>
          <!-- Logout Link -->
          <li @click="authStore.handleLogout()" class="p-3 rounded-lg flex items-center gap-4 text-red-500 hover:bg-gray-50 cursor-pointer">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20V0H9V2.22222H2V17.7778H9V20H0ZM13 15.5556L11.625 13.9444L14.175 11.1111H6V8.88889H14.175L11.625 6.05556L13 4.44444L18 10L13 15.5556Z" fill="#FF1212"/>
            </svg>
            <span>تسجيل الخروج</span>
          </li>
        </ul>
      </aside>

      <!-- Main Content section with address details -->
      <main class="flex-1 bg-white rounded-xl shadow-md p-8">
        <h1 class="text-2xl font-bold text-center mb-8 text-gray-700">دليل العناوين</h1>

        <!-- Loading state -->
        <div v-if="loading" class="text-center text-gray-500">
          جاري تحميل العناوين...
        </div>

        <!-- Error state -->
        <div v-if="error" class="text-center text-red-500">
          {{ error }}
        </div>

        <!-- Address list -->
        <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="address in addresses" :key="address.id"
               :class="['bg-white border rounded-xl p-6 flex items-start gap-4', address.is_default ? 'border-2 border-blue-500' : 'border-gray-200']">
            <div class="flex-shrink-0 mt-1">
              <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <h3 class="text-lg font-bold mb-1" :class="address.is_default ? 'text-yellow-600' : 'text-gray-700'">
                {{ address.is_default ? 'العنوان الرئيسي' : 'عنوان الشحن' }}
              </h3>
              <p class="text-gray-600 mb-1">{{ address.address_line_1 }}</p>
              <p v-if="address.address_line_2" class="text-gray-600 mb-1">{{ address.address_line_2 }}</p>
              <p class="text-gray-600 mb-1">{{ address.city }}</p>
              <p class="text-gray-600 mb-1">{{ address.country }}</p>
              <p v-if="address.zip_code" class="text-gray-500 font-inter ltr:direction-ltr">{{ address.zip_code }}</p>
            </div>
          </div>
        </div>

        <!-- Add New Address Button -->
        <div class="flex justify-center mt-8">
          <button class="px-8 py-3 bg-transparent border-2 border-blue-500 text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors duration-200">
            إضافة عنوان جديد
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../../../../stores/WebAuth';
const authStore = useAuthStore();
// Reactive variables for API data
const addresses = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

// Fetch addresses from API
const fetchAddresses = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/address');
    if (response.data.is_success) {
      addresses.value = response.data.data.data; // Access nested data array
    } else {
      throw new Error('API response indicates failure');
    }
  } catch (err) {
    error.value = 'فشل في تحميل العناوين، يرجى المحاولة لاحقًا';
    console.error('Error fetching addresses:', err);
  } finally {
    loading.value = false;
  }
};
const logout = () => {

};

// Fetch addresses when component mounts
onMounted(fetchAddresses);
</script>

<style scoped>
/* Scoped styles are not necessary here as all styling is handled by Tailwind CSS */
</style>
