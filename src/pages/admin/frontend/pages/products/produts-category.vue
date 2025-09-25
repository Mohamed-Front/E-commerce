<template>
  <div class="mx-auto mt-16 max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-16">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 rounded-xl animate-pulse">
      <img
        src="../../../../../assets/shiftlogo.png"
        alt="Loading Logo"
        class="w-32 h-32 object-contain animate-bounce"
        aria-label="Loading animation"
      />
    </div>

    <div v-else-if="error" class="text-center mb-10 py-16 text-red-600">
      <p class="text-lg font-semibold">{{ error }}</p>
      <button
        @click="fetchProducts"
        class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {{ t('products.retry') }}
      </button>
    </div>

    <div v-else class="lg:flex">
      <div class="lg:w-1/4 mb-8 lg:mb-0 mx-8">
        <div class="bg-white p-6 rounded-lg shadow-lg sticky top-24">
          <h3 class="font-bold text-lg mb-4">{{ t('products.filters') }}</h3>
          <div class="space-y-6">
            <!-- Category Filter with Search -->
            <div class="border-b pb-4">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="toggleFilter('category')"
              >
                <span class="font-semibold">{{ t('products.category') }}</span>
                <svg
                  :class="{ 'rotate-180': filtersExpanded.category }"
                  class="w-5 h-5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              <div v-show="filtersExpanded.category" class="mt-4 space-y-2">
                <input
                  v-model="categorySearchQuery"
                  type="text"
                  :placeholder="t('products.searchCategory')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label="Search categories"
                />
                <div v-for="category in filteredCategories" :key="category.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`cat-${category.id}`"
                    :value="category.id"
                    v-model="selectedFilters.category_ids"
                    class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label :for="`cat-${category.id}`" class="ml-2 text-sm text-gray-700">{{
                    category.name
                  }}</label>
                </div>
                <button
                  v-if="hasMoreCategories"
                  @click="fetchMoreCategories"
                  class="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  {{ t('products.loadMore') }}
                </button>
              </div>
            </div>

            <!-- Brand Filter with Search -->
            <div class="border-b pb-4">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="toggleFilter('brand')"
              >
                <span class="font-semibold">{{ t('products.brand') }}</span>
                <svg
                  :class="{ 'rotate-180': filtersExpanded.brand }"
                  class="w-5 h-5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              <div v-show="filtersExpanded.brand" class="mt-4 space-y-2">
                <input
                  v-model="brandSearchQuery"
                  type="text"
                  :placeholder="t('products.searchBrand')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label="Search brands"
                />
                <div v-for="brand in filteredBrands" :key="brand.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`brand-${brand.id}`"
                    :value="brand.id"
                    v-model="selectedFilters.brand_ids"
                    class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label :for="`brand-${brand.id}`" class="ml-2 text-sm text-gray-700">{{
                    brand.name
                  }}</label>
                </div>
                <button
                  v-if="hasMoreBrands"
                  @click="fetchMoreBrands"
                  class="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  {{ t('products.loadMore') }}
                </button>
              </div>
            </div>

            <!-- Rating Filter with Slider -->
            <div class="border-b pb-4">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="toggleFilter('rating')"
              >
                <span class="font-semibold">{{ t('products.rating') }}</span>
                <svg
                  :class="{ 'rotate-180': filtersExpanded.rating }"
                  class="w-5 h-5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              <div v-show="filtersExpanded.rating" class="mt-4 space-y-4">
                <input
                  id="rating-slider"
                  type="range"
                  v-model.number="selectedFilters.rate"
                  min="0"
                  max="5"
                  step="1"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Minimum rating slider"
                />
                <div class="flex justify-between text-sm text-gray-500">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="border-b pb-4">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="toggleFilter('price')"
              >
                <span class="font-semibold">{{ t('products.price') }}</span>
                <svg
                  :class="{ 'rotate-180': filtersExpanded.price }"
                  class="w-5 h-5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              <div v-show="filtersExpanded.price" class="mt-4 space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    v-model.number="selectedFilters.min_price"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Minimum price"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    v-model.number="selectedFilters.max_price"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:w-3/4">
        <div class="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mb-10">
          <div
            v-for="pro in paginatedProducts"
            :key="pro.id"
            class="group flex flex-col items-start cursor-pointer h-full bg-white transition-all pb-4 rounded-lg shadow-lg duration-300 hover:-translate-y-2 hover:shadow-xl"
            @click="router.push({ name: 'Product-details', params: { id: pro.id } })"
          >
            <div class="w-full max-h-[600px] overflow-hidden rounded-t-lg relative">
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
                <p class="font-sans   text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg w-full">
                  {{ truncateName(pro.name, 25) }}
                </p>

                <p v-if="pro.sub_name" class="font-sans  text-gray-600 text-sm w-full">
                  {{ pro.sub_name.slice(0, 37) }}
                </p>

              <div class="flex items-center w-full justify-between mt-1">
                <span class="font-sans text-[#A6853B] font-semibold text-lg">
                  {{ pro.price }} {{ $t('currencyLabel') }}
                </span>
                <button
                  v-if="authStore.authenticatedweb"
                  class="p-2 rounded-full bg-gray-100 text-[#A6853B] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A6853B] focus:ring-offset-2"
                  :class="{
                    'hover:bg-[#A6853B] hover:text-white': !pro.in_cart && !pro.isOutOfStock,
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
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Paginator from 'primevue/paginator';
import { useAuthStore } from '../../../../../stores/WebAuth';
import { debounce } from 'lodash';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import defaultProductImage from '../../imges/banner-addtion.png';

// Initialize Vue utilities
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();

// Set locale from localStorage
const storedLanguage = localStorage.getItem('appLang'); // Fallback to 'en' if not set
locale.value = storedLanguage; // Set the i18n locale

// Reactive state
const storeId = ref(localStorage.getItem('defaultStoreId'));
const products = ref({ title: '', products: [] });
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const limit = ref(12);
const totalProducts = ref(0);
const isLargeScreen = ref(window.innerWidth >= 1024);

// Filter-related state
const selectedFilters = ref({
  category_ids: [],
  brand_ids: [],
  rate: 0,
  min_price: null,
  max_price: null,
});
const filtersExpanded = ref({
  category: false,
  brand: false,
  rating: false,
  price: false,
});
const categories = ref([]);
const brands = ref([]);
const categorySearchQuery = ref('');
const brandSearchQuery = ref('');
const categoryPage = ref(1);
const brandPage = ref(1);
const hasMoreCategories = ref(true);
const hasMoreBrands = ref(true);

// Computed properties for filtered categories and brands
const filteredCategories = computed(() => {
  const allCategories = [];
  categories.value.forEach((cat) => {
    allCategories.push(cat);
    if (cat.has_subcategories && cat.subCategories.data.length > 0) {
      allCategories.push(...cat.subCategories.data);
    }
  });
  if (!categorySearchQuery.value) return allCategories;
  return allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.value.toLowerCase())
  );
});

const filteredBrands = computed(() => {
  if (!brandSearchQuery.value) return brands.value;
  return brands.value.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearchQuery.value.toLowerCase())
  );
});

// Fetch categories from API
const fetchCategories = async (page = 1, append = false) => {
  try {
    const response = await axios.get('/api/home/categories', {
      params: { page, search: categorySearchQuery.value || undefined },
    });
    const data = response.data.data;
    const newCategories = data.data.map((cat) => ({
      id: cat.id,
      name: locale.value === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar),
      has_subcategories: cat.has_subcategories,
      subCategories: {
        data: cat.subCategories.data.map((sub) => ({
          id: sub.id,
          name: locale.value === 'ar' ? (sub.name_ar || sub.name_en) : (sub.name_en || sub.name_ar),
          has_subcategories: sub.has_subcategories,
        })),
      },
    }));
    categories.value = append ? [...categories.value, ...newCategories] : newCategories;
    hasMoreCategories.value = data.next_page_url !== null;
    categoryPage.value = data.current_page;
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

// Fetch more categories
const fetchMoreCategories = () => {
  if (hasMoreCategories.value) {
    fetchCategories(categoryPage.value + 1, true);
  }
};

// Fetch brands from API
const fetchBrands = async (page = 1, append = false) => {
  try {
    const response = await axios.get('/api/home/brands', {
      params: { page, search: brandSearchQuery.value || undefined },
    });
    const data = response.data.data;
    const newBrands = data.data.map((brand) => ({
      id: brand.id,
      name: locale.value === 'ar' ? (brand.name_ar || brand.name_en) : (brand.name_en || brand.name_ar),
    }));
    brands.value = append ? [...brands.value, ...newBrands] : newBrands;
    hasMoreBrands.value = data.next_page_url !== null;
    brandPage.value = data.current_page;
  } catch (err) {
    console.error('Error fetching brands:', err);
  }
};

// Fetch more brands
const fetchMoreBrands = () => {
  if (hasMoreBrands.value) {
    fetchBrands(brandPage.value + 1, true);
  }
};

// Debounced search for categories and brands
const debouncedFetchCategories = debounce(fetchCategories, 300);
const debouncedFetchBrands = debounce(fetchBrands, 300);

// Watch for search query changes
watch(categorySearchQuery, () => {
  categoryPage.value = 1;
  debouncedFetchCategories();
});

watch(brandSearchQuery, () => {
  brandPage.value = 1;
  debouncedFetchBrands();
});

// Watch for filter changes and refetch products
watch(
  selectedFilters,
  () => {
    currentPage.value = 1;
    fetchProducts();
  },
  { deep: true }
);

// Watch for locale changes to refetch data
watch(locale, () => {
  fetchCategories();
  fetchBrands();
  fetchProducts();
});

// Update limit based on screen size
const updateLimit = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
  limit.value = isLargeScreen.value ? 12 : 6;
};

// Fetch products data with pagination and filters
const fetchProducts = async (page = currentPage.value) => {
  error.value = null;
  try {
    const params = {
      page: page,
      limit: limit.value,
      category_ids:
        selectedFilters.value.category_ids.length > 0
          ? selectedFilters.value.category_ids.join(',')
          : undefined,
      brand_ids:
        selectedFilters.value.brand_ids.length > 0
          ? selectedFilters.value.brand_ids.join(',')
          : undefined,
      rate: selectedFilters.value.rate > 0 ? selectedFilters.value.rate : undefined,
      min_price: selectedFilters.value.min_price,
      max_price: selectedFilters.value.max_price,
    };
    const response = await axios.get('/api/home/products', { params });
    const data = response.data.data;
    products.value = {
      products: (data.data || []).map((product) => ({
        id: product.id,
        name:
          locale.value === 'ar'
            ? product.name_ar || product.name_en
            : product.name_en || product.name_ar,
       sub_name:
          locale.value === 'ar'
            ? product.name_ar || product.sub_name_ar
            : product.name_en || product.sub_name_en,
        price:product.base_price ,
        img:
          product.media?.find((media) => media.name === 'product_main_image')?.url ||
          product.key_default_image ||
          defaultProductImage,
        is_wished: product.is_wished || false,
        in_cart: product.in_cart || false,
        is_stock: product.is_stock || 0,
        isOutOfStock: product.is_stock === 0,
        variant_id: product.has_variants ? product.variant_id : null,
      })),
    };
    currentPage.value = data.current_page;
    totalProducts.value = data.total;
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = t('products.errorLoading') || 'Failed to load products.';
  } finally {
    isLoading.value = false;
  }
};

// Toggle filter section expansion
const toggleFilter = (filterName) => {
  filtersExpanded.value[filterName] = !filtersExpanded.value[filterName];
};

// Paginated products
const paginatedProducts = computed(() => products.value.products);

// Handle page change
const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  fetchProducts(currentPage.value);
};

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
      response = await axios.delete(url, { data: payload });
    }
    if (response.status === 200 || response.status === 204) {
      product.is_wished = !isCurrentlyFavorited;
      alert(
        t(isCurrentlyFavorited ? 'wishlist.removed' : 'wishlist.added') ||
          `Product ${isCurrentlyFavorited ? 'removed from' : 'added to'} wishlist!`
      );
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    product.is_wished = isCurrentlyFavorited;
    alert(t('wishlist.error') || 'Failed to update wishlist.');
  }
};

// Method to truncate product name
const truncateName = (name, maxLength) => {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
};

// Handle window resize to update limit
const handleResize = () => {
  const newIsLargeScreen = window.innerWidth >= 1024;
  if (newIsLargeScreen !== isLargeScreen.value) {
    isLargeScreen.value = newIsLargeScreen;
    limit.value = isLargeScreen.value ? 12 : 6;
    currentPage.value = 1;
    fetchProducts(currentPage.value);
  }
};

// Fetch data before component mounts and set up resize listener
onBeforeMount(() => {
   selectedFilters.value.category_ids.push(route.params.id)
  if (storeId.value) {
    updateLimit();
    fetchProducts(currentPage.value);
    fetchCategories();
    fetchBrands();
  } else {
    error.value = t('products.missingParams') || 'Missing store ID.';
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
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
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
  padding-bottom: 0.5rem;
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
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom range slider styles */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #4f46e5;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4f46e5;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}

input[type="range"]:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
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
