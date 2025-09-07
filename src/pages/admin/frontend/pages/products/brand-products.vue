<template>
  <div class="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 rounded-xl animate-pulse">
      <img
        src="../../../../../assets/shiftlogo.png"
        alt="Loading Logo"
        class="w-32 h-32 object-contain animate-bounce"
        aria-label="Loading animation"
      />
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="text-center mb-10 py-16 text-red-600">
      <p class="text-lg font-semibold">{{ error }}</p>
      <button @click="fetchProducts" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        {{ t('products.retry') }}
      </button>
    </div>
    <!-- Main Content -->
    <div v-else>
      <h2 class="font-bold font-sans text-gray-800 lg:mt-4 xs:mt-2 xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-center animate-fade-in">
        {{ products.title }}
      </h2>
      <!-- Product Grid -->
      <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 mb-10">
        <div v-for="(pro, i) in paginatedProducts" :key="pro.id"
             class="group flex flex-col items-start cursor-pointer h-full bg-white transition-all pb-4 rounded-lg shadow-lg duration-300 hover:-translate-y-2 hover:shadow-xl"
             @click="router.push({ name: 'Product-details', params: { id: pro.id } })">
          <div class="w-full h-50 overflow-hidden rounded-t-lg relative">
            <img :src="pro.img" :alt="pro.name"
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 loading="lazy" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <button
              v-if="authStore.authenticatedweb"
              class="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
              @click.stop="toggleFavorite(pro)"
              aria-label="Add to wishlist"
            >
              <svg
                class="w-5 h-5"
                :class="{ 'text-red-500': pro.is_wished }"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>
          <div class="p-4 w-full">
            <p class="font-sans text-gray-800 font-medium text-base line-clamp-2">
              {{ truncateName(pro.name, 30) }}
            </p>
            <p v-if="pro.sub_name" class="font-sans text-gray-600 text-sm line-clamp-1 mt-1">
              {{ pro.sub_name.slice(0, 37) }}
            </p>
            <div class="flex items-center w-full justify-between mt-1">
              <span class="font-sans text-[#A6853B] font-semibold text-lg">
                ${{ pro.price }} {{ $t('currencyLabel') }}
              </span>
              <button
                v-if="authStore.authenticatedweb"
                class="p-2 rounded-full bg-gray-100 text-[#A6853B] hover:bg-[#A6853B] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A6853B] focus:ring-offset-2"
                @click.stop="addToCart(pro)"
                aria-label="Add to cart"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.708.707 1.708H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- PrimeVue Paginator -->
      <div class="mt-8 bg-white flex justify-center">
        <Paginator
          :rows="limit"
          :totalRecords="totalProducts"
          :pageLinkSize="3"
          :first="(currentPage - 1) * limit"
          @page="onPageChange($event)"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="custom-paginator"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Paginator from 'primevue/paginator';
import { useAuthStore } from '../../../../../stores/WebAuth';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import defaultProductImage from '../../imges/banner-addtion.png';

// Initialize Vue utilities
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();

// Reactive state
const storeId = ref(localStorage.getItem('defaultStoreId'));
const products = ref({ title: '', products: [] });
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const limit = ref(12); // Default to 12
const totalProducts = ref(0);
const isLargeScreen = ref(window.innerWidth >= 1024);

// Update limit based on screen size
const updateLimit = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
  limit.value = isLargeScreen.value ? 12 : 6;
};

// Fetch products data with pagination
const fetchProducts = async (page = 1) => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/home/products-by-brand/${route.params.id}`, {
      params: {
        page: page,
        limit: limit.value,
      },
    });
    const data = response.data.data;
    products.value = {
      title: locale.value === 'ar' ? `منتجات ${data.brand.name_ar || data.brand.name_en}` : `Products ${data.brand.name_en || data.brand.name_ar}`,
      products: (data.products.data || []).map(product => ({
        id: product.id,
        name: locale.value === 'ar' ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar),
        sub_name: locale.value === 'ar' ? (product.sub_name_ar || product.sub_name_en) : (product.sub_name_en || product.sub_name_ar),
        price: parseFloat(product.base_price || 0).toFixed(2),
        img: product.media?.find(media => media.name === 'product_main_image')?.url || product.key_default_image || defaultProductImage,
        is_wished: product.is_wished || false,
        variant_id: product.has_variants ? product.variant_id : null,
      })),
    };
    currentPage.value = data.products.current_page;
    totalProducts.value = data.products.total;
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = t('products.errorLoading') || 'Failed to load products.';
  } finally {
    isLoading.value = false;
  }
};

// Paginated products
const paginatedProducts = computed(() => {
  return products.value.products;
});

// Handle page change
const onPageChange = (event) => {
  currentPage.value = event.page + 1; // PrimeVue is 0-based, API expects 1-based
  fetchProducts(currentPage.value);
};

// Method to handle adding a product to the cart via API
const addToCart = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }

  try {
    const payload = {
      product_id: product.id,
      variant_id: product.variant_id,
      quantity: 1,
    };
    const response = await axios.post('/api/cart/add', payload);
    console.log('Added to cart successfully:', response.data);
    alert('Product added to cart!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add product to cart.');
  }
};

// Method to handle adding/removing a product from the wishlist
const toggleFavorite = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }

  const isCurrentlyFavorited = product.is_wished;
  const method = isCurrentlyFavorited ? 'delete' : 'post';
  const url = isCurrentlyFavorited ? `/api/wishlists/${product.id}` : '/api/wishlists';
  const payload = { product_id: product.id };

  try {
    let response;
    if (method === 'post') {
      response = await axios.post(url, payload);
    } else {
      response = await axios.delete(url, { data: payload });
    }

    // Update the is_wished property
    product.is_wished = !isCurrentlyFavorited;
    console.log(`Product ${isCurrentlyFavorited ? 'removed from' : 'added to'} wishlist successfully:`, response.data);
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    // Revert the state if the API call fails
    product.is_wished = isCurrentlyFavorited;
    alert('Failed to update wishlist.');
  }
};

// Method to truncate product name to a specific length
const truncateName = (name, maxLength) => {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
};

// Handle window resize to update limit
const handleResize = () => {
  const newIsLargeScreen = window.innerWidth >= 1024;
  if (newIsLargeScreen !== isLargeScreen.value) {
    isLargeScreen.value = newIsLargeScreen;
    limit.value = isLargeScreen.value ? 12 : 6;
    currentPage.value = 1; // Reset to first page on limit change
    fetchProducts(currentPage.value); // Refetch with new limit
  }
};

// Fetch data before component mounts and set up resize listener
onBeforeMount(() => {
  if (route.params.id && storeId.value) {
    updateLimit();
    fetchProducts(currentPage.value);
  } else {
    error.value = t('products.missingParams') || 'Missing brand or store ID.';
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-progress {
  animation: progress 2s ease-in-out infinite;
}

/* PrimeVue Paginator custom styles */
.custom-paginator {
  margin-top: 2rem;
  padding-bottom: .5rem;
}

.custom-paginator :deep(.p-paginator) {
  @apply flex items-center justify-center gap-1 bg-transparent;
}

.custom-paginator :deep(.p-paginator-page),
.custom-paginator :deep(.p-paginator-next),
.custom-paginator :deep(.p-paginator-prev),
.custom-paginator :deep(.p-paginator-first),
.custom-paginator :deep(.p-paginator-last) {
  @apply min-w-[2.5rem] h-10 rounded-md border border-gray-300 bg-white text-gray-400 transition-colors hover:bg-gray-100;
}

.custom-paginator :deep(.p-paginator-page.p-highlight) {
  @apply bg-indigo-600 text-white border-indigo-600;
}

.custom-paginator :deep(.p-paginator-prev),
.custom-paginator :deep(.p-paginator-next),
.custom-paginator :deep(.p-paginator-first),
.custom-paginator :deep(.p-paginator-last) {
  @apply flex items-center justify-center;
}

/* Product card hover effect */
.group:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Image container */
.h-60 {
  height: 15rem;
}

/* Line clamp for product names */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .xs\:text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .h-60 {
    height: 10rem;
  }
}

@media (max-width: 768px) {
  .sm\:text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}

@media (max-width: 1024px) {
  .md\:text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .lg\:text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}
</style>
