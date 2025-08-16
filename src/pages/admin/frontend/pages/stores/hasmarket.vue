```vue
<template>
  <!-- Container -->
  <div class="mx-auto bg-gradient-to-b from-[#FAF7F0] to-white mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16 animate-pulse">
      <p class="text-gray-600 text-lg font-medium">{{ t('category.loading') }}</p>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16 text-red-600">
      <p class="text-lg font-semibold">{{ error }}</p>
    </div>
    <!-- Main Content -->
    <div v-else>
      <!-- Store Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight animate-fade-in">
          {{ storeName }}
        </h1>
        <p class="mt-2 text-gray-500 text-sm sm:text-base">
          {{ t('category.explore') }} {{ storeName }}
        </p>
      </div>

      <!-- Banner Slider -->
      <div class="relative mb-16">
        <swiper
          :modules="[Autoplay,]"
          :slides-per-view="1"
          :space-between="0"
          :loop="true"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :speed="1200"
          :navigation="false"
          :pagination="{ clickable: true }"
          class="rounded-2xl shadow-xl overflow-hidden"
           :breakpoints="{
            320: { slidesPerView: 1, spaceBetween: 8 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 }
          }"
        >
          <SwiperSlide v-for="(media, index) in sliderImages" :key="index">
            <div class="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <img
                :src="media.url"
                :alt="`Slider image ${index + 1}`"
                class="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
              />
              <div class="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 hover:bg-opacity-10"></div>
            </div>
          </SwiperSlide>
        </swiper>
      </div>

      <!-- Categories Section with Swiper -->
      <div class="mt-16">

        <swiper
          :modules="[Autoplay]"
          :slides-per-view="3"
          :space-between="20"
          :loop="categories.length > 3"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :speed="1000"
          :grab-cursor="true"
          :navigation="false"
          class="mt-6 pb-12"
          :breakpoints="{
            320: { slidesPerView: 1, spaceBetween: 8 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 7, spaceBetween: 20 }
          }"
        >
          <SwiperSlide
            v-for="category in categories"
            :key="category.id"
            class="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2"
            @click="router.push(`/categories/${category.id}`)"
          >
            <div class="w-full h-48 overflow-hidden rounded-xl shadow-md relative">
              <img
                :src="category.media?.[0]?.url || defaultCategoryImage"
                :alt="`${categoryName(category)} image`"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
              ></div>
            </div>
            <h3 class="font-sans mt-4 mb-1 text-gray-800 font-semibold text-sm sm:text-base md:text-lg">
              {{ categoryName(category) }}
            </h3>
          </SwiperSlide>
        </swiper>
      </div>

      <!-- Markets Section with Swiper -->
      <div v-if="markets.length" class="mt-16">
        <h2 class="font-bold font-sans text-gray-800 text-2xl sm:text-3xl lg:text-4xl mb-8 animate-slide-up">
          {{ t('category.markets') }}
        </h2>
        <swiper
          :modules="[Autoplay]"
          :slides-per-view="3"
          :space-between="20"
          :loop="markets.length > 3"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :speed="1000"
          :grab-cursor="true"
          :navigation="false"
          class="mt-6 pb-12"
          :breakpoints="{
            320: { slidesPerView: 1, spaceBetween: 8 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 }
          }"
        >
          <SwiperSlide
            v-for="market in markets"
            :key="market.id"
            class="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2"
            @click="router.push(`/markets/${market.id}`)"
          >
            <div class="w-full h-48 overflow-hidden rounded-xl shadow-md relative">
              <swiper
                :modules="[Autoplay]"
                :slides-per-view="1"
                :space-between="0"
                :loop="market.media.length > 1"
                :autoplay="{ delay: 2000, disableOnInteraction: false }"
                :speed="800"
                class="w-full h-full"
              >
                <SwiperSlide
                  v-for="(media, index) in market.media"
                  :key="index"
                  class="w-full h-full"
                >
                  <img
                    :src="media.url"
                    :alt="`${market.title} image ${index + 1}`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </SwiperSlide>
              </swiper>
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
              ></div>
            </div>
            <h3 class="font-sans mt-4 mb-1 text-gray-800 font-semibold text-sm sm:text-base md:text-lg">
              {{ market.title }}
            </h3>
          </SwiperSlide>
        </swiper>
      </div>

      <!-- Products Sections -->
      <section class="mt-16 space-y-16">
        <!-- Exclusive Offers -->
        <productsSwiper
          v-if="exclusiveOffers.products.length"
          :products="exclusiveOffers"
          class="animate-slide-up"
        />
        <!-- Best Sellers -->
        <productsSwiper
          v-if="bestSellers.products.length"
          :products="bestSellers"
          class="animate-slide-up"
        />
        <!-- New Arrivals -->
        <productsSwiper
          v-if="newArrivals.products.length"
          :products="newArrivals"
          class="animate-slide-up"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import productsSwiper from '../../components/SwiperSlide/productsSwiper.vue';
import defaultMarketImage from '../../../../../assets/loginFormImg.png';
import defaultProductImage from '../../../../../assets/loginFormImg.png';
import defaultCategoryImage from '../../../../../assets/loginFormImg.png';

// Initialize Vue utilities
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// Reactive state for store data
const storeData = ref({});
const storeName = ref('');
const sliderImages = ref([]);
const categories = ref([]);
const markets = ref([]);
const exclusiveOffers = ref({ title: 'Exclusive Offers', products: [] });
const bestSellers = ref({ title: 'Best Sellers', products: [] });
const newArrivals = ref({ title: 'New Arrivals', products: [] });
const isLoading = ref(false);
const error = ref(null);

// Helper function to get category name based on locale
const categoryName = (category) => {
  return locale.value === 'ar' ? category.name_ar || category.name_en : category.name_en || category.name_ar;
};

// Fetch store details
const fetchStoreDetails = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/home/store-details/${route.params.id}`);
    storeData.value = response.data.data.store || {};
  } catch (err) {
    console.error('Error fetching store details:', err);
    error.value = t('category.errorLoading') || 'Failed to load store details.';
  } finally {
    isLoading.value = false;
  }
};

// Initialize store data
const initStoreData = () => {
  if (!storeData.value) return;
  storeName.value = locale.value === 'ar' ? storeData.value.name_ar || storeData.value.name_en : storeData.value.name_en || storeData.value.name_ar;
  sliderImages.value = (storeData.value.media || []).filter(media =>
    ['main_banner_image', 'sub_banner_image', 'slider_images_one', 'slider_images_two', 'slider_images_three'].includes(media.name)
  );
  categories.value = (storeData.value.categories || []).map(category => ({
    id: category.id,
    name_ar: category.name_ar || category.name_en,
    name_en: category.name_en || category.name_ar,
    media: category.media || [{ url: defaultCategoryImage, name: 'default' }]
  }));
  markets.value = (storeData.value.markets || []).map(market => ({
    id: market.id,
    title: locale.value === 'ar' ? market.name_ar || market.name_en : market.name_en || market.name_ar,
    media: (market.media || []).map(media => ({
      url: media.url || defaultMarketImage,
      name: media.name || 'default'
    }))
  }));
};

// Fetch best sellers
const fetchBestSellers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/home/best-sellers/${route.params.id}`);
    const data = response.data.data.data || [];
    bestSellers.value = {
      title: t('category.bestSellers') || 'Best Sellers',
      products: data.map(product => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar,
        price: parseFloat(product.base_price || 0).toFixed(2),
        img: product.media?.find(media => media.name === 'product_main_image')?.url || defaultProductImage
      }))
    };
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    error.value = t('category.errorLoading') || 'Failed to load best sellers.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch new arrivals
const fetchNewArrivals = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/home/new-arrivals/${route.params.id}`);
    const data = response.data.data.data || [];
    newArrivals.value = {
      title: t('category.newArrivals') || 'New Arrivals',
      products: data.map(product => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar,
        price: parseFloat(product.base_price || 0).toFixed(2),
        img: product.media?.find(media => media.name === 'product_main_image')?.url || defaultProductImage
      }))
    };
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    error.value = t('category.errorLoading') || 'Failed to load new arrivals.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch exclusive offers (placeholder, replace with actual API call if available)
const fetchExclusiveOffers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/home/exclusive-offers/${route.params.id}`);
    const data = response.data.data.data || [];
    exclusiveOffers.value = {
      title: t('category.exclusiveOffers') || 'Exclusive Offers',
      products: data.map(product => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar,
        price: parseFloat(product.base_price || 0).toFixed(2),
        img: product.media?.find(media => media.name === 'product_main_image')?.url || defaultProductImage
      }))
    };
  } catch (err) {
    console.error('Error fetching exclusive offers:', err);
    error.value = t('category.errorLoading') || 'Failed to load exclusive offers.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch all data
const fetchAllData = async () => {
  isLoading.value = true;
  await fetchStoreDetails();
  if (!error.value) {
    initStoreData();
    await Promise.all([fetchBestSellers(), fetchNewArrivals(), fetchExclusiveOffers()]);
  }
  isLoading.value = false;
};

// Initialize on mount
onMounted(() => {
  if (route.params.id) {
    fetchAllData();
  }
});
</script>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

/* Swiper custom styles */
.swiper {
  @apply w-full pb-12;
}

.swiper-slide {
  @apply flex flex-col items-center;
}

/* Navigation buttons */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  @apply bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors hover:bg-indigo-700;
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  @apply text-sm;
}

/* Pagination bullets */
:deep(.swiper-pagination-bullet) {
  @apply bg-gray-300 w-2 h-2;
}

:deep(.swiper-pagination-bullet-active) {
  @apply bg-indigo-600 w-3 h-3;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  @apply h-1.5;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-indigo-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-indigo-500;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-4xl {
    @apply text-2xl;
  }
  .text-3xl {
    @apply text-xl;
  }
}
</style>
```
