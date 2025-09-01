<template>
  <div class="mx-auto max-w-[1400px] px-4">
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
      class="w-full"
    >
      <SwiperSlide v-for="(image, index) in sliderImages" :key="index">
        <div
          @click="handleMediaClick(image)"
          class="flex w-full max-h-[50vh] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-300 rounded-xl shadow-lg overflow-hidden cursor-pointer"
        >
          <img
            :src="image.url"
            :alt="`Slider Image ${index + 1}`"
            class="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Dual Sliders Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-7xl mx-auto">
      <!-- Slider for slider_images_two -->
      <div class="rounded-xl shadow-lg overflow-hidden">
        <Swiper
          v-if="sliderImagesTwo.length"
          :modules="[Autoplay]"
          :slides-per-view="1"
          :space-between="10"
          :autoplay="{ delay: 2500, disableOnInteraction: false }"
          class="w-full h-full"
        >
          <SwiperSlide v-for="(image, index) in sliderImagesTwo" :key="'two-'+index">
            <div
              @click="handleMediaClick(image)"
              class="flex w-full max-h-64 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                :src="image.url"
                :alt="`Slider Two Image ${index + 1}`"
                class="w-full h-64 object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Slider for slider_images_three -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <Swiper
          v-if="sliderImagesThree.length"
          :modules="[Autoplay]"
          :slides-per-view="1"
          :space-between="10"
          :autoplay="{ delay: 2500, disableOnInteraction: false }"
          class="w-full h-full"
        >
          <SwiperSlide v-for="(image, index) in sliderImagesThree" :key="'three-'+index">
            <div
              @click="handleMediaClick(image)"
              class="flex w-full h-64 items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                :src="image.url"
                :alt="`Slider Three Image ${index + 1}`"
                class="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <!-- Categories Slider -->
    <div class="mt-8 py-2 rounded-sm px-2 bg-[#1F3A932B] mx-auto max-w-7xl">
      <Swiper
        ref="categoriesSwiper"
        :modules="[Autoplay]"
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
        <SwiperSlide v-for="(category, index) in categories" :key="index">
          <div @click="goCategory(category)" class="flex flex-col items-center justify-center rounded-xl h-full w-full cursor-pointer">
            <img
              v-if="category?.media"
              :src="category?.media[0]?.url"
              :alt="category.name_en || 'Category Image'"
              class="w-full h-full object-cover rounded-xl"
            />
            <div class="p-3 w-full text-center rounded-xl">
              <span class="font-bold text-sm text-black">{{ category?.name_ar ? category.name_ar.slice(0, 20) : 'Category' }}</span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Sub Banner -->
    <div v-if="subBannerImage" class="my-8 max-w-5xl mx-auto">
      <div
        @click="handleMediaClick(subBannerImage)"
        class="relative overflow-hidden rounded-2xl shadow-lg animate-banner-slide cursor-pointer"
      >
        <img
          :src="subBannerImage.url"
          class="w-full h-64 sm:h-40 md:h-46 object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent flex items-center justify-center p-6">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const router = useRouter();

const sliderImages = ref([]);
const sliderImagesTwo = ref([]);
const sliderImagesThree = ref([]);
const mainBannerImage = ref(null);
const subBannerImage = ref(null);
const sponsorImage = ref(null);
const categories = ref([]);
const storeId = ref(localStorage.getItem('defaultStoreId') || '4');
const categoriesSwiper = ref(null);

// Helper function to extract media by name
const getMediaByName = (mediaArray, name) => {
  return mediaArray?.find(item => item.name === name) || null;
};

// Helper function to extract slider images
const getSliderImages = (mediaArray, name) => {
  return mediaArray?.filter(item => item.name === name) || [];
};

// Handle media click based on media link type
const handleMediaClick = (mediaItem) => {
  if (!mediaItem || !mediaItem.media_links) {
    console.log(mediaItem);
    return;
  }

  const { type, id } = mediaItem.media_links;

  if (type === 1) {
    // Navigate to category page
    router.push({ name: 'subcategory', params: { id } });
  } else if (type === 2) {
    // Navigate to product details page
    router.push({ name: 'product-details', params: { id } });
  } else {
    console.log('Unknown media link type:', type);
  }
};

// Navigate to category page
const goCategory = (category) => {
  router.push({ name: 'subcategory', params: { id: category.id } });
};

// Fetch store details and extract images and categories
const fetchStoreDetails = async () => {
  try {
    const response = await axios.get(`/api/home/store-details/${storeId.value}`);
    const { store } = response.data.data;

    // Get all media items with their media_links
    const allMedia = store.media || [];
    const mediaLinks = store.media_links || [];

    // Enhance media items with their media_links
    const enhancedMedia = allMedia.map(mediaItem => {
      // Find the corresponding media_link for this media item
      const mediaLink = mediaLinks.find(link => link.media_id === mediaItem.id);
      return {
        ...mediaItem,
        media_links: mediaLink || null
      };
    });

    sliderImages.value = getSliderImages(enhancedMedia, 'slider_images_one');
    sliderImagesTwo.value = getSliderImages(enhancedMedia, 'slider_images_two');
    sliderImagesThree.value = getSliderImages(enhancedMedia, 'slider_images_three');
    mainBannerImage.value = getMediaByName(enhancedMedia, 'main_banner_image');
    subBannerImage.value = getMediaByName(enhancedMedia, 'sub_banner_image');
    sponsorImage.value = getMediaByName(enhancedMedia, 'store_image');
    categories.value = store.categories || [];

    // Update Swiper after data is fetched
    if (categoriesSwiper.value && categoriesSwiper.value.swiper) {
      categoriesSwiper.value.swiper.update();
      categoriesSwiper.value.swiper.autoplay.start();
    }
  } catch (error) {
    console.error('Error fetching store details:', error);
  }
};

// Initialize data on mount
onMounted(() => {
  if (storeId.value) {
    fetchStoreDetails();
  }
});
</script>

<style scoped>
/* Fancy Swiper styles */
.swiper {
  @apply w-full relative overflow-hidden;
}

/* Enhanced Swiper slides */
.swiper-slide {
  @apply flex items-center justify-center h-auto transition-all duration-700 ease-in-out;
}

/* Image styles with subtle glow */
img {
  @apply transition-all duration-500 ease-in-out;
}

img:hover {
  @apply opacity-95 shadow-2xl;
}

.swiper {
  width: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Navigation buttons with elegant design */
.swiper-button-next,
.swiper-button-prev {
  @apply text-white bg-gradient-to-r from-gray-700 to-gray-900 rounded-full shadow-lg w-12 h-12 flex items-center justify-center opacity-75 transition-all duration-300;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  @apply opacity-100 scale-110 bg-gradient-to-r from-gray-600 to-gray-800;
}

/* Pagination bullets with modern look */
.swiper-pagination-bullet {
  @apply bg-gray-300 w-3 h-3 rounded-full transition-all duration-300;
}

.swiper-pagination-bullet-active {
  @apply bg-gradient-to-r from-gray-700 to-gray-900 w-4 h-4;
}

/* Custom scrollbar with sleek design */
::-webkit-scrollbar {
  @apply h-1.5 w-1.5;
}

::-webkit-scrollbar-track {
  @apply bg-gray-50 rounded-full shadow-inner;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-r from-gray-600 to-gray-800 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gradient-to-r from-gray-700 to-gray-900;
}

/* Add subtle container glow and padding */
div {
  @apply transition-all duration-500;
}

/* Dual sliders animation */
.animate-banner-slide {
  animation: slideIn 0.8s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cursor pointer for clickable elements */
.cursor-pointer {
  cursor: pointer;
}
</style>
