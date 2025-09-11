<template>
  <div class="flex items-center bg-gray-100 rounded-lg h-9 mx-3 md:h-10 md:mx-2">
    <i class="fa-solid fa-magnifying-glass text-gray-500 px-2.5 text-sm md:px-3 md:text-base"></i>
    <input
      v-model="searchQuery"
      class="flex-grow bg-transparent lg:w-[400px] text-sm placeholder-gray-400 focus:outline-none"
      type="text"
      placeholder="Search..."
      @input="handleSearch"
      @focus="showResults"
      @blur="hideResultsWithDelay"
    />
    <transition name="dropdown-fancy">
      <div
        v-if="showSearchResults && (searchResults.products.length || searchResults.categories.length || searchResults.brands.length)"
        class="absolute top-12 mt-2 lg:w-[500px] max-w-md bg-white rounded-xl shadow-2xl z-50 overflow-y-auto dropdown-fancy"
        style="max-height: 70vh;"
      >
        <!-- Products -->
        <div
          v-for="result in searchResults.products"
          :key="'product-' + result.id"
          @click="goToResult('product', result)"
          class="flex items-center px-4 py-3 transition-all duration-300 cursor-pointer dropdown-item hover:bg-amber-50"
        >
          <div v-if="result.key_default_image" class="w-8 h-8 flex items-center justify-center overflow-hidden rounded-sm bg-gray-100 mr-2">
            <img
              :src="result.key_default_image"
              :alt="displayName(result)"
              class="max-w-full max-h-full object-contain"
            />
          </div>
          <div v-else class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-sm mr-2">
            <i class="fa-solid fa-box text-gray-400"></i>
          </div>
          <span class="flex-grow text-sm text-gray-700 font-medium">{{ displayName(result) }}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Product</span>
        </div>
        <!-- Categories -->
        <div
          v-for="result in searchResults.categories"
          :key="'category-' + result.id"
          @click="goToResult('category', result)"
          class="flex items-center px-4 py-3 transition-all duration-300 cursor-pointer dropdown-item hover:bg-amber-50"
        >
          <div class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-sm mr-2">
            <i class="fa-solid fa-folder text-gray-400"></i>
          </div>
          <span class="flex-grow text-sm text-gray-700 font-medium">{{ displayName(result) }}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Category</span>
        </div>
        <!-- Brands -->
        <div
          v-for="result in searchResults.brands"
          :key="'brand-' + result.id"
          @click="goToResult('brand', result)"
          class="flex items-center px-4 py-3 transition-all duration-300 cursor-pointer dropdown-item hover:bg-amber-50"
        >
          <div class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-sm mr-2">
            <i class="fa-solid fa-tag text-gray-400"></i>
          </div>
          <span class="flex-grow text-sm text-gray-700 font-medium">{{ displayName(result) }}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Brand</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from 'vue';
import { useRouter } from "vue-router";

import axios from 'axios';

const searchQuery = ref('');
const searchResults = ref({
  products: [],
  categories: [],
  brands: []
});
const showSearchResults = ref(false);
const router = useRouter();
let searchTimeout = null;

// Computed property to determine which name to display based on appLang
const displayName = computed(() => {
  const lang = localStorage.getItem('appLang') || 'en';
  return (result) => (lang === 'ar' ? result.name_ar : result.name_en) || 'Unnamed';
});

const handleSearch = async () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim().length < 1) {
      searchResults.value = { products: [], categories: [], brands: [] };
      showSearchResults.value = false;
      return;
    }

    try {
      const response = await axios.get(`api/home/search?query=${encodeURIComponent(searchQuery.value)}`);
      searchResults.value = {
        products: response.data.data?.products || [],
        categories: response.data.data?.categories || [],
        brands: response.data.data?.brands || []
      };
      showSearchResults.value = searchResults.value.products.length || searchResults.value.categories.length || searchResults.value.brands.length;
    } catch (error) {
      console.error('Error fetching search results:', error);
      searchResults.value = { products: [], categories: [], brands: [] };
      showSearchResults.value = false;
    }
  }, 300);
};

const showResults = () => {
  if (searchResults.value.products.length || searchResults.value.categories.length || searchResults.value.brands.length) {
    showSearchResults.value = true;
  }
};

const hideResultsWithDelay = () => {
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

const goToResult = (type, result) => {
  console.log(result)
  showSearchResults.value = false;
  searchQuery.value = '';
  searchResults.value = { products: [], categories: [], brands: [] };

  if (type === 'product') {
     router.push({name:'Product-details',params:{id:result.id}})

  } else if (type === 'category') {
    if (result.has_subcategories) {
      router.push({ name: 'subcategory', params: { id: result.id } });
    } else {
      router.push({ name: 'produts_category', params: { id: result.id } });
    }
  } else if (type === 'brand') {
    router.push({ name: 'products-brand', params: { id: result.id } });
  }
};

onUnmounted(() => {
  clearTimeout(searchTimeout);
});
</script>

<style scoped>
.dropdown-fancy-enter-active,
.dropdown-fancy-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fancy-enter-from,
.dropdown-fancy-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-fancy-enter-to,
.dropdown-fancy-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-fancy {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.dropdown-item {
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
  transition: left 0.5s;
}

.dropdown-item:hover::before {
  left: 100%;
}

input:focus + i {
  @apply text-[#E6AC31];
}
</style>
