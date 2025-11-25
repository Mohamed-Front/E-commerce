<template>
  <div class="mx-auto mt-16 max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-16">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <img src="../../../../../assets/shiftlogo.png" alt="Loading" class="w-32 h-32 object-contain animate-bounce" />
      <p class="mt-4 text-gray-600">{{ t('common.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-lg font-semibold text-red-600 mb-4">{{ error }}</p>
      <button @click="fetchProducts" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
        {{ t('products.retry') }}
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="lg:flex gap-8">
      <!-- Filters Sidebar -->
      <aside class="lg:w-1/4 mb-8 lg:mb-0">
        <div class="bg-white p-6 rounded-xl shadow-lg sticky top-24">
          <h3 class="font-bold text-xl mb-6">{{ t('products.filters') }}</h3>
          <div class="space-y-6">

            <!-- Category Filter -->
            <div class="border-b pb-5">
              <div @click="toggleFilter('category')" class="flex justify-between items-center cursor-pointer">
                <span class="font-semibold">{{ t('products.category') }}</span>
                <svg :class="{ 'rotate-180': filtersExpanded.category }" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div v-show="filtersExpanded.category" class="mt-4 space-y-3">
                <input v-model="categorySearchQuery" type="text" :placeholder="t('products.searchCategory')"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                <div v-for="cat in filteredCategories" :key="cat.id" class="flex items-center">
                  <input type="checkbox" :id="`cat-${cat.id}`" :value="cat.id" v-model="selectedFilters.category_ids"
                    class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                  <label :for="`cat-${cat.id}`" class="mx-3 text-sm text-gray-700">{{ cat.name }}</label>
                </div>
                <button v-if="hasMoreCategories" @click="fetchMoreCategories"
                  class="text-indigo-600 text-sm hover:underline">{{ t('products.loadMore') }}</button>
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="border-b pb-5">
              <div @click="toggleFilter('rating')" class="flex justify-between items-center cursor-pointer">
                <span class="font-semibold">{{ t('products.rating') }}</span>
                <svg :class="{ 'rotate-180': filtersExpanded.rating }" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div v-show="filtersExpanded.rating" class="mt-4">
                <input type="range" v-model.number="selectedFilters.rate" min="0" max="5" step="1"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" />
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
                <p class="text-center text-sm font-medium mt-2">{{ selectedFilters.rate }}+ {{ t('products.stars') }}</p>
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <div @click="toggleFilter('price')" class="flex justify-between items-center cursor-pointer">
                <span class="font-semibold">{{ t('products.price') }}</span>
                <svg :class="{ 'rotate-180': filtersExpanded.price }" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div v-show="filtersExpanded.price" class="mt-4 flex gap-3">
                <input type="number" v-model.number="selectedFilters.min_price" :placeholder="t('min_price')"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <span class="self-center">-</span>
                <input type="number" v-model.number="selectedFilters.max_price" :placeholder="t('max_price')"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="lg:w-3/4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="pro in paginatedProducts"
            :key="pro.id"
            class="group cursor-pointer"
            @click="router.push({ name: 'Product-details', params: { id: pro.id } })"
          >
            <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
              <!-- Image Container -->
              <div class="relative aspect-square overflow-hidden bg-gray-50">
                <!-- Best Seller Badge -->
                <div v-if="pro.is_best_seller"
                  class="absolute top-3 left-3 z-10 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Best Seller
                </div>

                <!-- Product Image -->
                <img
                  :src="pro.img"
                  :alt="pro.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                <!-- Wishlist Button -->
                <button
                  v-if="authStore.authenticatedweb"
                  @click.stop="toggleFavorite(pro)"
                  class="absolute top-3 right-3 z-20 p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  :class="{ 'text-red-500': pro.is_wished }"
                  :aria-label="pro.is_wished ? 'Remove from wishlist' : 'Add to wishlist'"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              <!-- Card Content -->
              <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-semibold text-gray-900 text-lg line-clamp-2 leading-tight mb-2">
                  {{ truncateName(pro.name, 50) }}
                </h3>

                <p v-if="pro.sub_name" class="text-gray-600 text-sm line-clamp-2 mb-3 leading-snug">
                  {{ pro.sub_name }}
                </p>

                <!-- Rating -->
                <div class="flex items-center gap-1 mb-3">
                  <span class="text-yellow-500 font-bold text-sm">{{ pro.total_rating || '0.0' }}</span>
                  <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"/>
                  </svg>
                  <span class="text-gray-500 text-xs">({{ pro.total_reviews || 0 }})</span>
                </div>

                <!-- Price & Add to Cart -->
                <div class="mt-auto flex items-center justify-between">
                  <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-bold text-gray-900">
                      {{ $t('currencyLabel') }} {{ formatPrice(pro.final_price) }}
                    </span>
                    <span v-if="pro.total_discounts_value > 0"
                      class="text-base line-through text-blue-600 font-medium opacity-80">
                      {{ $t('currencyLabel') }} {{ formatPrice(pro.base_price) }}
                    </span>
                  </div>

                  <!-- Add to Cart Button -->
                  <button
                    @click.stop="addToCart(pro)"
                    :disabled="pro.is_stock === 0"
                    class="p-3 rounded-full transition-all duration-300 shadow-md"
                    :class="[
                      pro.in_cart
                        ? 'bg-[#0b3baa] text-white'
                        : pro.is_stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#A6853B] text-white hover:bg-[#8f702c]'
                    ]"
                  >
                    <svg v-if="pro.in_cart" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0 .984.984 0 0 0 0 1.4l4.2 4.2c.39.39 1.01.39 1.4 0l8.4-8.4a.984.984 0 0 0 0-1.4.984.984 0 0 0-1.4 0L9 16.2z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.708.707 1.708H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </button>
                </div>

                <!-- Free Shipping -->
                <div v-if="pro.is_free_shipping" class="flex items-center mt-3 text-[#0b3baa] text-xs font-medium">
                  <i class="pi pi-truck mr-1"></i>
                  {{ $t("products.Free_Delivery") }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex justify-center">
          <Paginator
            :rows="limit"
            :totalRecords="totalProducts"
            :first="(currentPage - 1) * limit"
            @page="onPageChange($event)"
            template="PrevPageLink PageLinks NextPageLink"
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
import defaultProductImage from '../../imges/banner-addtion.png';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();

// Set locale
const storedLanguage = localStorage.getItem('appLang') || 'en';
locale.value = storedLanguage;

// Reactive state
const isLoading = ref(true);
const error = ref(null);
const products = ref([]);
const currentPage = ref(1);
const limit = ref(12);
const totalProducts = ref(0);

// Filters
const selectedFilters = ref({
  category_ids: [],
  rate: 0,
  min_price: null,
  max_price: null,
});
const filtersExpanded = ref({
  category: true,
  rating: false,
  price: false,
});
const categories = ref([]);
const categorySearchQuery = ref('');
const hasMoreCategories = ref(true);
const categoryPage = ref(1);

// Computed
const filteredCategories = computed(() => {
  let cats = [];
  categories.value.forEach(cat => {
    cats.push({ id: cat.id, name: cat.name });
    if (cat.subCategories?.data) {
      cat.subCategories.data.forEach(sub => cats.push({ id: sub.id, name: sub.name }));
    }
  });
  if (!categorySearchQuery.value) return cats;
  return cats.filter(c => c.name.toLowerCase().includes(categorySearchQuery.value.toLowerCase()));
});

const paginatedProducts = computed(() => products.value);

// Format price
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

// Truncate name
const truncateName = (name, length) => {
  if (!name) return '';
  return name.length > length ? name.substring(0, length) + '...' : name;
};

// Fetch Categories
const fetchCategories = async (page = 1, append = false) => {
  try {
    const res = await axios.get(`/api/home/categories-by-brand/${route.params.id}`, {
      params: { page, search: categorySearchQuery.value || undefined }
    });
    const data = res.data.data;
    const mapped = data.data.map(cat => ({
      id: cat.id,
      name: locale.value === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar),
      subCategories: cat.subCategories
    }));
    categories.value = append ? [...categories.value, ...mapped] : mapped;
    hasMoreCategories.value = !!data.next_page_url;
  } catch (err) {
    console.error(err);
  }
};

const fetchMoreCategories = () => {
  if (hasMoreCategories.value) fetchCategories(categoryPage.value + 1, true);
};

watch(categorySearchQuery, debounce(() => {
  categoryPage.value = 1;
  fetchCategories();
}, 300));

// Watch filters
watch(selectedFilters, () => {
  currentPage.value = 1;
  fetchProducts();
}, { deep: true });

watch(locale, () => {
  fetchCategories();
  fetchProducts();
});

// Fetch Products
const fetchProducts = async (page = 1) => {
  error.value = null;
  try {
    const params = {
      page,
      limit: limit.value,
      brand_ids: route.params.id,
      category_ids: selectedFilters.value.category_ids.length ? selectedFilters.value.category_ids.join(',') : undefined,
      rate: selectedFilters.value.rate > 0 ? selectedFilters.value.rate : undefined,
      min_price: selectedFilters.value.min_price,
      max_price: selectedFilters.value.max_price,
    };

    const res = await axios.get('/api/home/products', { params });
    const data = res.data.data;

    products.value = data.data.map(p => ({
      id: p.id,
      name: locale.value === 'ar' ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar),
      sub_name: locale.value === 'ar' ? (p.sub_name_ar || p.sub_name_en) : (p.sub_name_en || p.sub_name_ar),
      base_price: parseFloat(p.base_price),
      final_price: p.total_discounts_value > 0
        ? parseFloat(p.base_price) - parseFloat(p.total_discounts_value)
        : parseFloat(p.base_price),
      total_discounts_value: parseFloat(p.total_discounts_value || 0),
      img: p.media?.find(m => m.name === 'product_main_image')?.url || p.key_default_image || defaultProductImage,
      total_rating: p.total_rating || 0,
      total_reviews: p.total_reviews || 0,
      is_wished: p.is_wished || false,
      in_cart: p.in_cart || false,
      is_stock: p.is_stock,
      is_free_shipping: p.is_free_shipping || false,
      is_best_seller: p.is_best_seller || false,
    }));

    currentPage.value = data.current_page;
    totalProducts.value = data.total;
  } catch (err) {
    error.value = t('products.errorLoading');
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Pagination
const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  fetchProducts(currentPage.value);
};

// Cart & Wishlist
const addToCart = async (product) => {
  if (!authStore.authenticatedweb) return router.push({ name: 'AuthLogin' });
  if (product.is_stock === 0) return;

  try {
    await axios.post('/api/cart/add', {
      product_id: product.id,
      quantity: 1
    });
    product.in_cart = true;
  } catch (err) {
    alert(t('cart.error'));
  }
};

const toggleFavorite = async (product) => {
  if (!authStore.authenticatedweb) return router.push({ name: 'AuthLogin' });

  const wasWished = product.is_wished;
  try {
    if (wasWished) {
      await axios.delete(`/api/wishlists/${product.id}`);
    } else {
      await axios.post('/api/wishlists', { product_id: product.id });
    }
    product.is_wished = !wasWished;
  } catch (err) {
    product.is_wished = wasWished;
  }
};

const toggleFilter = (key) => {
  filtersExpanded.value[key] = !filtersExpanded.value[key];
};

// Lifecycle
onBeforeMount(() => {
  fetchCategories();
  fetchProducts();
});

onMounted(() => {
  window.addEventListener('resize', () => {
    limit.value = window.innerWidth >= 1024 ? 12 : 8;
  });
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
