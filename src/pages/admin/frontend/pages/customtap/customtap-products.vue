<template>
  <div class="mx-auto px-4 max-w-[1500px]">
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <svg
        class="animate-spin h-8 w-8 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div v-else-if="error" class="text-center py-16 text-red-600">
      <p class="text-lg font-semibold">{{ error }}</p>
      <button
        @click="fetchProducts(route.params.id, currentPage)"
        class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {{ t('products.retry') || 'Retry' }}
      </button>
    </div>

    <div v-else class="m-auto max-w-7xl">
      <h2
        class="font-bold font-sans text-gray-600 lg:mt-4 xs:mt-2 xs:text-lg text-center sm:text-xl md:text-2xl lg:text-3xl"
      >
        {{ title || t('products.allProducts') || 'Products' }}
      </h2>

      <div
        class="mt-6 grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5"
      >
        <div
          v-for="pro in products"
          :key="pro.id"
          class="group flex flex-col items-start cursor-pointer transition-all pb-[1%] rounded-lg shadow-lg duration-300 hover:-translate-y-2 h-auto"
          @click="navigateToDetail(pro.id)"
          :aria-label="`View product ${pro.name}`"
        >
          <div
            class="w-full overflow-hidden rounded-xl shadow-sm relative bg-gray-100 aspect-square"
          >
            <img
              :src="pro.img"
              :alt="pro.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
            ></div>

            <button
              v-if="authStore.authenticatedweb"
              class="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
              @click.stop="toggleFavorite(pro)"
              :aria-label="pro.is_wished ? 'Remove from wishlist' : 'Add to wishlist'"
              :title="pro.is_wished ? 'Remove from wishlist' : 'Add to wishlist'"
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
            <p
              class="font-sans text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg w-full truncate"
            >
              {{ pro.name }}
            </p>

            <p v-if="pro.sub_name" class="font-sans text-gray-600 text-sm w-full truncate">
              {{ pro.sub_name }}
            </p>

            <div class="flex items-center w-full justify-between mt-1">
              <span class="font-sans text-[#E39F30] font-semibold text-lg">
                {{ pro.price }} {{ t('currencyLabel') }}
              </span>

              <button
                v-if="authStore.authenticatedweb"
                class="p-2 rounded-full bg-gray-100 text-[#E39F30] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                :class="{
                  'hover:bg-indigo-600 hover:text-white': !pro.in_cart && !pro.isOutOfStock,
                  'bg-gray-300 text-gray-500 cursor-not-allowed': pro.isOutOfStock,
                }"
                :disabled="pro.isOutOfStock"
                @click.stop="addToCart(pro)"
                :aria-label="
                  pro.in_cart ? 'In cart' : pro.isOutOfStock ? 'Out of stock' : 'Add to cart'
                "
                :title="
                  pro.in_cart ? 'In cart' : pro.isOutOfStock ? 'Out of stock' : 'Add to cart'
                "
              >
                <svg
                  v-if="pro.in_cart"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0 .984.984 0 0 0 0 1.4l4.2 4.2c.39.39 1.01.39 1.4 0l8.4-8.4a.984.984 0 0 0 0-1.4.984.984 0 0 0-1.4 0L9 16.2z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.708.707 1.708H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pagination.last_page > 1" class="flex justify-center items-center pt-8">
        <nav class="inline-flex gap-2" aria-label="Pagination">
          <template v-for="(link, index) in pagination.links" :key="index">
            <button
              v-if="link.url && !['&laquo; Previous', 'Next &raquo;'].includes(link.label)"
              @click="goToPage(parseInt(link.label))"
              :aria-current="link.active ? 'page' : undefined"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                link.active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700',
              ]"
            >
              {{ link.label }}
            </button>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../../../stores/WebAuth'; // Assuming this path is correct

// --- Helper Data / Defaults ---
const defaultProductImage = '/placeholder.jpg'; // Placeholder or fallback image path

// --- Props ---
defineProps({
  title: {
    type: String,
    default: '',
  },
});

// --- Setup ---
const { t } = useI18n();
const locale = ref(localStorage.getItem('appLang') || 'ar');
const authStore = useAuthStore();
const products = ref([]); // Changed from customTabs to products
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();
const route = useRoute();
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  links: [],
});
const currentPage = ref(parseInt(route.query.page) || 1);
const isMobile = ref(false);

// --- Responsiveness and Page Limit Logic ---
const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768;
  }
};

const perPageLimit = computed(() => {
  // Use a different limit for products than for categories/brands
  return isMobile.value ? 10 : 20;
});

onMounted(() => {
  checkScreenSize();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkScreenSize);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkScreenSize);
  }
});

// --- Data Fetching (Renamed for clarity) ---
const fetchProducts = async (id, page = 1) => {
  isLoading.value = true;
  error.value = null;

  // IMPORTANT: Replaced custom tab API with a generic products API
  // You might need to adjust the API path and parameters based on how your backend expects filtering.
  // For this example, I'm assuming /api/home/products returns a paginated list of products.
  const url = `/api/home/products?limit=${perPageLimit.value}&page=${page}`;

  try {
    const response = await axios.get(url);
    const apiData = response.data.data;
    const paginatedData = apiData.data ? apiData : apiData.details || apiData; // Adjust based on your API response structure

    pagination.value = {
      current_page: paginatedData.current_page,
      last_page: paginatedData.last_page,
      next_page_url: paginatedData.next_page_url,
      prev_page_url: paginatedData.prev_page_url,
      links: paginatedData.links,
    };
    currentPage.value = paginatedData.current_page;

    products.value = (paginatedData.data || []).map((product) => ({
      id: product.id,
      name:
        locale.value === 'ar'
          ? product.name_ar || product.name_en
          : product.name_en || product.name_ar,
      sub_name:
        locale.value === 'ar'
          ? product.sub_name_ar || product.sub_name_en
          : product.sub_name_en || product.sub_name_ar,
      price: product.base_price, // Assuming 'base_price' holds the price
      img:
        product.media?.find((media) => media.name === 'product_main_image')?.url ||
        product.key_default_image ||
        defaultProductImage,
      is_wished: product.is_wished || false,
      in_cart: product.in_cart || false,
      isOutOfStock: product.is_stock === 0,
      variant_id: product.has_variants ? product.variant_id : null,
    }));
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = t('error.fetchFailed') || 'Failed to load products.';
  } finally {
    isLoading.value = false;
    // Update the URL query without refreshing the page
    router.push({ query: { ...route.query, page: currentPage.value } }).catch(() => {});
  }
};

// --- Navigation ---
const navigateToDetail = (productId) => {
  router.push({ name: 'Product-details', params: { id: productId } }); // Navigate to a single product page
};

// --- Pagination ---
const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= pagination.value.last_page) {
    fetchProducts(route.params.id, pageNumber);
  }
};

// --- Cart and Wishlist Actions ---

// Method to handle adding a product to the cart via API
const addToCart = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }
  if (product.isOutOfStock) return;
  try {
    const payload = {
      product_id: product.id,
      variant_id: product.variant_id,
      quantity: 1,
    };
    const response = await axios.post('/api/cart/add', payload);
    if (response.status === 200) {
      product.in_cart = true;
      alert(t('cart.added') || 'Product added to cart!');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert(t('cart.error') || 'Failed to add product to cart.');
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
      // Axios DELETE with data in body
      response = await axios.delete(url, { data: payload });
    }
    if (response.status === 200 || response.status === 204) {
      product.is_wished = !isCurrentlyFavorited;
      alert(
        t(isCurrentlyFavorited ? 'wishlist.removed' : 'wishlist.added') ||
          `Product ${isCurrentlyFavorited ? 'removed from' : 'added to'} wishlist!`,
      );
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    // Revert state on failure
    product.is_wished = isCurrentlyFavorited;
    alert(t('wishlist.error') || 'Failed to update wishlist.');
  }
};

// --- Lifecycle & Watchers ---
onMounted(() => {
  // The 'id' in route.params is now treated as an optional parameter for context,
  // but the component primarily displays products.
  fetchProducts(route.params.id, currentPage.value);
});

// Watch for changes in route ID (if this component is reused for different product listings, e.g., by category ID)
watch(
  () => route.params.id,
  (newId) => {
    currentPage.value = 1;
    fetchProducts(newId, 1);
  },
);

// Watch for screen size changes to update limit
watch(perPageLimit, (newLimit, oldLimit) => {
  if (newLimit !== oldLimit) {
    currentPage.value = 1;
    fetchProducts(route.params.id, 1);
  }
});
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
