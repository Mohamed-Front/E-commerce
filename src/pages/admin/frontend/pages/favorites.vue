```vue
<template>
  <main class="bg-[#FAF7F0] min-h-[100vh] py-8">
    <section class="mx-auto w-full max-w-7xl px-4">
      <h1
        class="text-3xl font-bold text-center mb-8"
        :class="{
          'font-noto-kufi text-right': locale === 'ar',
          'font-plus-jakarta': locale === 'en'
        }"
      >
        {{ t('favorites.title') }}
      </h1>

      <div v-if="isLoading" class="text-center">
        <p class="text-lg font-sans">{{ t('favorites.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center text-red-500">
        <p class="text-lg font-sans">{{ error }}</p>
      </div>

      <div v-else-if="favorites.products.length === 0" class="text-center">
        <p class="text-lg font-sans">{{ t('favorites.empty') }}</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in favorites.products"
          :key="`${product.id}-${product.variant_id}`"
          class="group flex flex-col items-start bg-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          @click="router.push({ name: 'Product-details', params: { id: product.id } })"
        >
          <div class="w-full aspect-square overflow-hidden rounded-t-lg relative">
            <img
              :src="product.img"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <button
              v-if="authStore.authenticatedweb"
              class="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
              @click.stop="toggleWishlist(product)"
              :aria-label="product.is_wished ? t('favorites.removeFromWishlist') : t('favorites.addToWishlist')"
            >
              <svg
                class="w-5 h-5"
                :class="{ 'text-red-500': product.is_wished }"
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
          <div class="p-4 flex flex-col flex-grow w-full">
            <p
              class="font-sans text-gray-800 font-medium xs:text-sm sm:text-base md:text-lg truncate"
              :class="{ 'text-right': locale === 'ar' }"
            >
              {{ truncateName(product.name, 30) }}
            </p>
            <p
              v-if="product.sub_name"
              class="font-sans text-gray-600 text-sm truncate"
              :class="{ 'text-right': locale === 'ar' }"
            >
              {{ product.sub_name.slice(0, 37) }}
            </p>
            <div class="flex items-center justify-between mt-auto">
              <span class="font-sans text-[#A6853B] font-semibold xs:text-base sm:text-lg">
                {{ product.price }} {{ t('currencyLabel') }}
              </span>
              <button
                v-if="authStore.authenticatedweb"
                class="p-2 rounded-full bg-gray-100 text-[#A6853B] hover:bg-[#A6853B] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A6853B] focus:ring-offset-2"
                @click.stop="addToCart(product)"
                :aria-label="t('favorites.addToCart')"
              >
                <svg
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
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pagination.last_page > 1" class="mt-8 flex justify-center items-center gap-2">
        <button
          @click="fetchFavorites(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          aria-label="الصفحة السابقة"
        >
          {{ t('pagination.previous') || 'السابق' }}
        </button>
        <div class="flex gap-1">
          <button
            v-for="page in pagination.links"
            :key="page.label"
            @click="fetchFavorites(getPageNumber(page.url))"
            :class="{ 'bg-yellow-500 text-white': page.active, 'bg-gray-200 text-gray-700': !page.active }"
            class="px-4 py-2 rounded-lg"
            :disabled="!page.url"
            :aria-label="`الصفحة ${page.label}`"
          >
            {{ page.label }}
          </button>
        </div>
        <button
          @click="fetchFavorites(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          aria-label="الصفحة التالية"
        >
          {{ t('pagination.next') || 'التالي' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../../../../stores/WebAuth';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const localeRef = ref(localStorage.getItem('appLang') || 'ar');
const favorites = ref({ title: t('favorites.title') || 'Favorites', products: [] });
const isLoading = ref(false);
const error = ref(null);
const pagination = ref({
  current_page: parseInt(route.query.page) || 1,
  last_page: 1,
  links: [],
});

const fetchFavorites = async (page = 1) => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/wishlists', {
      params: {
        page,
        limit: 4, // Fixed limit to match orders page
      },
    });
    const data = response.data.data.data || [];
    const paginationData = response.data.data;

    favorites.value = {
      title: t('favorites.title') || 'Favorites',
      products: data.map((product) => ({
        id: product.id,
        variant_id: product.variant_id,
        data: product,
        is_wished: product.is_wished ?? true,
        sub_name: localeRef.value === 'ar' ? product.sub_name_ar || product.sub_name_en : product.sub_name_en || product.sub_name_ar,
        name: localeRef.value === 'ar' ? product.name_ar : product.name_en,
        price: parseFloat(product.base_price).toFixed(2),
        img: product.media?.find((media) => media.name === 'product_main_image')?.url || product.key_default_image,
      })),
    };

    pagination.value = {
      current_page: paginationData.current_page || 1,
      last_page: paginationData.last_page || 1,
      links: paginationData.links || [],
    };
  } catch (err) {
    console.error('Error fetching favorites:', err);
    error.value = t('favorites.errorLoading') || 'Failed to load favorites.';
  } finally {
    isLoading.value = false;
  }
};

const getPageNumber = (url) => {
  if (!url) return null;
  try {
    const pageParam = new URL(url).searchParams.get('page');
    return pageParam ? parseInt(pageParam) : null;
  } catch (e) {
    return null;
  }
};

const addToCart = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }
  try {
    await axios.post('/api/cart/add', {
      product_id: product.id,
      variant_id: product.variant_id,
      quantity: 1,
    });
    alert(t('favorites.addedToCart') || 'Added to cart successfully!');
  } catch (err) {
    console.error('Error adding to cart:', err);
    alert(t('favorites.errorCart') || 'Failed to add to cart.');
  }
};

const toggleWishlist = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }
  try {
    const endpoint = product.is_wished ? '/api/wishlists/remove' : '/api/wishlists/add';
    await axios.post(endpoint, {
      product_id: product.id,
      variant_id: product.variant_id,
    });
    product.is_wished = !product.is_wished;
    if (!product.is_wished) {
      favorites.value.products = favorites.value.products.filter(
        (p) => p.id !== product.id || p.variant_id !== product.variant_id
      );
    }
    alert(t(product.is_wished ? 'favorites.addedToWishlist' : 'favorites.removedFromWishlist') || 'Wishlist updated!');
  } catch (err) {
    console.error('Error toggling wishlist:', err);
    alert(t('favorites.errorWishlist') || 'Failed to update wishlist.');
  }
};

const truncateName = (name, maxLength) => {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
};

onMounted(() => {
  fetchFavorites(pagination.value.current_page);
});
</script>
```
