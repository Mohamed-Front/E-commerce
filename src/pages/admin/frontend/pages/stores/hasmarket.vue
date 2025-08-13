<template>
  <!-- container -->
  <div class="mx-auto bg-[#FAF7F0] mt-16 max-w-7xl px-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-600">{{ t('category.loading') }}</p>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-red-600">
      <p>{{ error }}</p>
    </div>
    <!-- Main Content -->
    <div v-else>
      <!-- Markets Section with Swiper -->
      <div class="mt-16">
        <h2
          class="font-bold font-sans text-gray-800 lg:mt-20 xs:mt-10 xs:text-lg sm:text-xl md:text-2xl lg:text-3xl"
        >
          {{ t('category.markets') }}
        </h2>
        <swiper
          :modules="[Autoplay]"
          :slides-per-view="3"
          :space-between="16"
          :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :speed="1000"
          :grab-cursor="true"
          class="mt-6 pb-8"
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
            <h1
              class="font-sans mt-4 mb-1 text-gray-800 font-semibold xs:text-sm sm:text-base md:text-lg"
            >
              {{ market.title }}
            </h1>
            <p class="text-gray-600 text-sm">{{ t('category.allCategories') }}</p>
          </SwiperSlide>
        </swiper>
      </div>

      <!-- Rest of your content -->
      <section>
        <!-- banner -->
        <img
          :src="bannerImage"
          :alt="t('category.storeBanner')"
          class="mt-10 w-full rounded-lg"
        />

        <!-- Exclusive_offers -->
        <productsSwiper
          v-if="exclusiveOffers.products.length"
          :products="exclusiveOffers"
        />
        <!-- best_seller -->
        <productsSwiper
          v-if="bestSellers.products.length"
          :products="bestSellers"
        />
        <!-- New_arrival -->
        <productsSwiper
          v-if="newArrivals.products.length"
          :products="newArrivals"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import productsSwiper from '../../components/SwiperSlide/productsSwiper.vue';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// Reactive state for API data
const exclusiveOffers = ref({ title: '', products: [] });
const bestSellers = ref({ title: 'Best Sellers', products: [] });
const newArrivals = ref({ title: 'New Arrivals', products: [] });
const markets = ref([]);
const bannerImage = ref('');
const sliderImageOne = ref('');
const sliderImageTwo = ref('');
const isLoading = ref(false);
const error = ref(null);

// Function to fetch store details from API
const fetchStoreDetails = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`api/home/store-details/${route.params.id}`);
    const data = response.data.data;

    // Set banner and slider images
    const storeMedia = data.store.media || [];
    bannerImage.value =
      storeMedia.find((media) => media.name === 'main_banner_image')?.url ||
      '/default-banner.png';
    sliderImageOne.value =
      storeMedia.find((media) => media.name === 'slider_images_one')?.url ||
      '/default-slider.png';
    sliderImageTwo.value =
      storeMedia.find((media) => media.name === 'slider_images_two')?.url ||
      '/default-slider.png';

    // Map markets with localized names and all media images
    if (data.store.markets) {
      markets.value = data.store.markets.map((item) => ({
        id: item.id,
        title: locale.value === 'ar' ? item.name_ar : item.name_en,
        media: item.media
          ? item.media.map((media) => ({
              url: media.url || '/default-market-image.png',
              name: media.name,
            }))
          : [{ url: '/default-market-image.png', name: 'default' }],
      }));
    } else {
      markets.value = [];
    }
  } catch (err) {
    console.error('Error fetching store details:', err);
    error.value = t('category.errorLoading') || 'Failed to load store details.';
  } finally {
    isLoading.value = false;
  }
};

// Function to fetch best sellers
const fetchBestSellers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`api/home/best-sellers/${route.params.id}`);
    const data = response.data.data.data || [];
    bestSellers.value = {
      title: t('category.bestSellers') || 'Best Sellers',
      products: data.map((product) => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar : product.name_en,
        price: parseFloat(product.base_price).toFixed(2),
        img:
          product.media.find((media) => media.name === 'product_main_image')
            ?.url || '/default-product.png',
      })),
    };
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    error.value = t('category.errorLoading') || 'Failed to load best sellers.';
  } finally {
    isLoading.value = false;
  }
};

// Function to fetch new arrivals
const fetchNewArrivals = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`api/home/new-arrivals/${route.params.id}`);
    const data = response.data.data.data || [];
    newArrivals.value = {
      title: t('category.newArrivals') || 'New Arrivals',
      products: data.map((product) => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar : product.name_en,
        price: parseFloat(product.base_price).toFixed(2),
        img:
          product.media.find((media) => media.name === 'product_main_image')
            ?.url || '/default-product.png',
      })),
    };
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    error.value = t('category.errorLoading') || 'Failed to load new arrivals.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch all data
const fetchAllData = async () => {
  await Promise.all([fetchStoreDetails(), fetchBestSellers(), fetchNewArrivals()]);
};

// Watch for route param changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchAllData();
    }
  },
  { immediate: true } // Run immediately on mount
);

// Fetch data when component is mounted (optional, since watcher with immediate handles it)
onMounted(fetchAllData);
</script>

<style scoped>
.produt-img {
  background-size: cover;
  background-position: center;
  height: 300px; /* Adjust as needed */
}

/* Swiper styling */
.swiper {
  @apply w-full pb-8;
}

.swiper-slide {
  @apply flex flex-col items-center;
}

/* Nested Swiper for market images */
.nested-swiper {
  @apply w-full h-full;
}

/* Custom scrollbar for swiper */
::-webkit-scrollbar {
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
