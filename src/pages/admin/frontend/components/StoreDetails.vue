<template>
  <div class="mx-auto w-full full ">
    <Swiper
      v-if="sliderImages.length"
      :modules="[Autoplay, Navigation]"
      :centered-slides="true"
      :slides-per-view="1.3"
      :loop="true"
      :space-between="10"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :navigation="false"
      class="w-full"
    >
      <SwiperSlide v-for="(image, index) in sliderImages" :key="index">
        <div
          @click="handleMediaClick(image)"
          class="flex w-full  items-center justify-center  rounded-xl shadow-lg overflow-hidden cursor-pointer"
        >
          <img
            :src="image.url"
            :alt="`Slider Image ${index + 1}`"
            class="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <div class="gap-6  max-w-7xl mx-auto">
      <div class="rounded-xl my-4  overflow-hidden">
        <Swiper
          v-if="sliderImagesTwo.length"
          :modules="[Autoplay]"
           :breakpoints="{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 }
          }"
          :slides-per-view="1"
          :space-between="10"
          :autoplay="{ delay: 2500, disableOnInteraction: false }"
          class="w-full h-full"
        >
          <SwiperSlide v-for="(image, index) in sliderImagesTwo" :key="'two-' + index">
            <div
              @click="handleMediaClick(image)"
              class="flex w-full  items-center justify-center  rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                :src="image.url"
                :alt="`Slider Two Image ${index + 1}`"
                class="w-full  object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>


    </div>

    <div v-if="categories.length > 1" class="py-2 rounded-sm px-2 bg-[#1F3A932B] mx-auto max-w-7xl">
      <Swiper
        ref="categoriesSwiper"
        :modules="[Autoplay, Pagination]"
        :slides-per-view="8"
        :space-between="10"
        :navigation="false"
        :autoplay="{ delay: 600, disableOnInteraction: false }"

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
              loading="lazy"
            />
            <div class="p-3 w-full text-center rounded-xl">
              <span class="font-bold text-sm text-black">{{lang =='en' ? category?.name_en : category.name_ar.slice(0, 20)  }}</span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

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
        <div class="absolute inset-0 bg-gradient-to-b from-transparent flex items-center justify-center p-6"></div>
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
const storeId = ref(localStorage.getItem('defaultStoreId'));
const lang = ref(localStorage.getItem('appLang'));
const categoriesSwiper = ref(null);

// Helper function to extract media by name
const getMediaByName = (mediaArray, name) => {
  return mediaArray?.find(item => item.name === name) || null;
};

// Helper function to extract slider images
const getSliderImages = (mediaArray, name) => {
  return mediaArray?.filter(item => item.name === name) || [];
};

/**
 * Handle media click based on media link type for navigation.
 * Type 1: Navigate to category page
 * Type 2: Navigate to brand page
 * @param {Object} mediaItem - The media object with a `media_links` property.
 */
const handleMediaClick = (mediaItem) => {
  // Check if mediaItem or media_links is null/undefined
  if (!mediaItem || !mediaItem.media_links) {
    console.log('Media item or media links are missing. Cannot navigate.', mediaItem);
    return;
  }

  const { type, id } = mediaItem.media_links;

  if (type === 1) {
       router.push({ name: 'media-products', params: { id } });
    // Navigate to category page
  } else if (type === 2) {
    // Navigate to brand page
     router.push({ name: 'media-category', params: { id } });

  } else {
    console.log('Unsupported media link type:', type);
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

    // Get all media items
    const allMedia = store.media || [];

    // Use media as provided, assuming media_links is embedded in media items
    sliderImages.value = getSliderImages(allMedia, 'slider_images_one');
    sliderImagesTwo.value = getSliderImages(allMedia, 'slider_images_two');
    sliderImagesThree.value = getSliderImages(allMedia, 'slider_images_three');
    mainBannerImage.value = getMediaByName(allMedia, 'main_banner_image');
    subBannerImage.value = getMediaByName(allMedia, 'sub_banner_image');
    sponsorImage.value = getMediaByName(allMedia, 'store_image');
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
