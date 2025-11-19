<template>
  <!-- Container -->
  <div class="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
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
    <div v-else-if="error" class="text-center py-16 text-red-600">
      <p class="text-lg font-semibold">{{ error }}</p>
    </div>
    <!-- Main Content -->
    <div v-else>
      <!-- Store Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-800 tracking-tight animate-fade-in">
          {{ storeName }}
        </h1>
      </div>

      <!-- Markets Section -->
      <div v-if="markets.length" class="my-10">
        <swiper
          :modules="[Autoplay]"
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
            @click="goCatgory(market)"
          >
            <div class="w-full h-58 overflow-hidden  rounded-lg shadow-md relative">
              <img
                :src="market.media.find(m => m.name === 'category_image')?.url || defaultMarketImage"
                :alt="`${market.title} category image`"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                :aria-label="`${market.title} category image`"
              />
            </div>
            <h3 class="font-sans mt-4 mb-1 text-black font-bold text-sm sm:text-base md:text-lg">
              {{ market.title }}
            </h3>
          </SwiperSlide>
        </swiper>
      </div>
      <!-- Main Slider -->
      <Swiper
        v-if="sliderImages.length"
        :modules="[Autoplay, Navigation]"
        :breakpoints="{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 }
        }"
        :space-between="10"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :navigation="false"
        class="w-full rounded-2xl shadow-xl overflow-hidden mb-10"
      >
        <SwiperSlide v-for="(image, index) in sliderImages" :key="index">
          <div class="flex w-full max-h-[50vh] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-300 rounded-xl shadow-lg overflow-hidden">
            <img
              :src="image.url"
              :alt="`Slider Image ${index + 1}`"
              class="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
              loading="lazy"
              :aria-label="`Promotional banner ${index + 1}`"
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <!-- Dual Sliders Section -->
      <div v-if="sliderImagesTwo.length || sliderImagesThree.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <!-- Slider for sliderImagesTwo -->
        <div class="rounded-xl shadow-lg overflow-hidden">
          <Swiper
            v-if="sliderImagesTwo.length"
            :modules="[Autoplay]"
            :slides-per-view="1"
            :space-between="10"
            :autoplay="{ delay: 2500, disableOnInteraction: false }"
            class="w-full h-full"
          >
            <SwiperSlide v-for="(image, index) in sliderImagesTwo" :key="'two-' + index">
              <div class="flex w-full max-h-64 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden">
                <img
                  :src="image.url"
                  :alt="`Slider Two Image ${index + 1}`"
                  class="w-full h-64 object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  :aria-label="`Secondary banner ${index + 1}`"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <!-- Slider for sliderImagesThree -->
        <div class="rounded-xl shadow-lg overflow-hidden">
          <Swiper
            v-if="sliderImagesThree.length"
            :modules="[Autoplay]"
            :slides-per-view="1"
            :space-between="10"
            :autoplay="{ delay: 2500, disableOnInteraction: false }"
            class="w-full h-full"
          >
            <SwiperSlide v-for="(image, index) in sliderImagesThree" :key="'three-' + index">
              <div class="flex w-full h-64 items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl overflow-hidden">
                <img
                  :src="image.url"
                  :alt="`Slider Three Image ${index + 1}`"
                  class="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  :aria-label="`Tertiary banner ${index + 1}`"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <!-- Categories Slider -->
      <div v-if="categories.length" class="mt-8 hidden py-2 rounded-sm px-2 bg-[#1F3A932B] mx-auto max-w-7xl">
        <Swiper
          :modules="[Navigation, Autoplay]"
          :slides-per-view="8"
          :space-between="10"
          :navigation="false"
          :autoplay="{ delay: 2000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          class="w-full"
          :breakpoints="{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 }
          }"
        >
          <SwiperSlide v-for="category in categories" :key="category.id">
            <div
              @click="router.push(`/categories/${category.id}`)"
              class="flex flex-col items-center justify-center rounded-xl h-full w-full cursor-pointer"
            >
              <img
                :src="category.media?.[0]?.url || defaultCategoryImage"
                :alt="`${categoryName(category)} image`"
                class="w-full h-full max-h-36 object-cover rounded-xl"
                loading="lazy"
                :aria-label="`${categoryName(category)} category image`"
              />
              <div class="p-3 w-full text-center rounded-xl">
                <span class="font-bold text-sm text-black">{{ categoryName(category).slice(0, 20) }}</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <!-- Products Sections -->
      <section class="mt-16 space-y-16">
        <ProductOffers></ProductOffers>
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
import ProductOffers from '../../components/ProductOffers.vue';

// Initialize Vue utilities
const router = useRouter();
const { t, locale } = useI18n();

// Reactive state for store data
const storeData = ref({});
const storeName = ref('');
const sliderImages = ref([]);
const sliderImagesTwo = ref([]);
const sliderImagesThree = ref([]);
const categories = ref([]);
const markets = ref([]);
const exclusiveOffers = ref({ title: 'Exclusive Offers', products: [] });
const bestSellers = ref({ title: 'Best Sellers', products: [] });
const newArrivals = ref({ title: 'New Arrivals', products: [] });
const isLoading = ref(false);
const error = ref(null);

// Get store ID from localStorage
const storeId = ref(localStorage.getItem('defaultStoreId') );

// Helper function to get category name based on locale
const categoryName = (category) => {
  return locale.value === 'ar' ? category.name_ar || category.name_en : category.name_en || category.name_ar;
};

// Helper function to extract slider images
const getSliderImages = (mediaArray, name) => {
  return mediaArray?.filter(item => item.name === name) || [];
};

// Fetch store details
const fetchStoreDetails = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/home/store-details/${storeId.value}`);
    storeData.value = response.data.data.store || {};
  } catch (err) {
    console.error('Error fetching store details:', err);
    error.value = t('category.errorLoading') || 'Failed to load store details.';
  } finally {
    isLoading.value = false;
  }
};
const goCatgory = (data) => {
  console.log(data)
  if(data.has_subcategories  ){
   router.push({ name: 'subcategory', params: { id: data.id } });
  }
  else
  router.push({ name: 'produts_category', params: { id: data.id } });
};
// Initialize store data
const initStoreData = () => {
  if (!storeData.value) return;
  storeName.value = locale.value === 'ar' ? storeData.value.name_ar || storeData.value.name_en : storeData.value.name_en || storeData.value.name_ar;
  sliderImages.value = getSliderImages(storeData.value.media, 'slider_images_one');
  sliderImagesTwo.value = getSliderImages(storeData.value.media, 'slider_images_two');
  sliderImagesThree.value = getSliderImages(storeData.value.media, 'slider_images_three');
  categories.value = (storeData.value.categories || []).map(category => ({
    id: category.id,
    name_ar: category.name_ar || category.name_en,
    name_en: category.name_en || category.name_ar,
    media: category.media || [{ url: defaultCategoryImage, name: 'default' }]
  }));
  markets.value = (storeData.value.markets || []).map(market => ({
    id: market.id,
      has_subcategories: market.has_subcategories,
    title: locale.value === 'ar' ? market.name_ar || market.name_en : market.name_en || market.name_ar,
    media: (market.media || []).map(media => ({
      url: media.url || defaultMarketImage,
      name: media.name || 'default'
    }))
  }));
};

// Fetch all data
const fetchAllData = async () => {
  isLoading.value = true;
  await fetchStoreDetails();
  if (!error.value) {
    initStoreData();
  }
  isLoading.value = false;
};

// Initialize on mount
onMounted(() => {
  if (storeId.value) {
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

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-bounce {
  animation: bounce 1.5s ease-in-out infinite;
}

/* Swiper custom styles */
.swiper {
  @apply w-full;
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

/* Additional styles for sliders and categories */
img {
  @apply transition-all duration-500 ease-in-out;
}

img:hover {
  @apply opacity-95 shadow-2xl;
}
</style>
