<template>
  <div class="mx-auto max-w-[1500px] px-4">
    <!-- Main Slider -->
    <Swiper
      v-if="sliderImages.length"
      :modules="[Autoplay, Navigation]"
      :slides-per-view="2"
      :breakpoints="{
        320: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 2 }
      }"
      :space-between="10"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :navigation="false"
      class="w-full"
    >
      <SwiperSlide v-for="(image, index) in sliderImages" :key="index">
        <div class="flex w-full max-h-[50vh] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl shadow-lg overflow-hidden">
          <img
            :src="image.url"
            :alt="`Slider Image ${index + 1}`"
            class="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Main Banner and Sponsor Image -->
    <div class="grid grid-cols-1 md:grid-cols-3 mx-auto gap-6 mt-8 max-w-7xl">
      <div class="md:col-span-2">
        <img
          v-if="mainBannerImage"
          :src="mainBannerImage.url"
          alt="Main Banner"
          class="w-full h-full object-cover rounded-xl shadow-xl transform hover:scale-[1.02] transition-all duration-500"
        />
      </div>
      <div class="md:col-span-1">
        <img
          v-if="sponsorImage"
          :src="sponsorImage.url"
          alt="Sponsor Image"
          class="w-full h-auto object-cover rounded-xl shadow-xl transform hover:scale-[1.02] transition-all duration-500"
        />
      </div>
    </div>

    <!-- Categories Slider -->
    <div class="mt-8 mx-auto max-w-7xl">
      <Swiper
        :modules="[Navigation]"
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
          1024: { slidesPerView: 8 }
        }"
      >
        <SwiperSlide v-for="(category, index) in categories" :key="index">
          <div class="flex bg-gradient-to-b from-white to-gray-50 flex-col items-center justify-center rounded-xl shadow-lg h-full w-full cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            <img
              :src="category?.media[0]?.url"
              :alt="category.name_en"
              class="w-full h-full max-h-36 object-cover rounded-t-xl"
            />
            <div class="p-3 w-full text-center rounded-b-xl bg-gradient-to-t from-gray-100 to-transparent">
              <span class="text-sm font-semibold text-gray-800">{{ category.name_ar.slice(0, 20) }}</span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <!-- Sub Banner -->
    <div class="mt-8 mx-auto max-w-7xl">
      <img
        v-if="subBannerImage"
        :src="subBannerImage.url"
        alt="Sub Banner"
        class="w-full h-full object-cover rounded-xl shadow-xl transform hover:scale-[1.02] transition-all duration-500"
      />
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const sliderImages = ref([]);
const mainBannerImage = ref(null);
const subBannerImage = ref(null);
const sponsorImage = ref(null);
const categories = ref([]);
const storeId = ref(localStorage.getItem('defaultStoreId') || '4');

// Helper function to extract media by name
const getMediaByName = (mediaArray, name) => {
  return mediaArray?.find(item => item.name === name) || null;
};

// Helper function to extract slider images
const getSliderImages = (mediaArray) => {
  return mediaArray?.filter(item => item.name === 'slider_images_one') || [];
};

// Fetch store details and extract images and categories
const fetchStoreDetails = async () => {
  try {
    const response = await axios.get(`/api/home/store-details/${storeId.value}`);
    const { store } = response.data.data;
    sliderImages.value = getSliderImages(store.media);
    mainBannerImage.value = getMediaByName(store.media, 'main_banner_image');
    subBannerImage.value = getMediaByName(store.media, 'sub_banner_image');
    sponsorImage.value = getMediaByName(store.media, 'store_image'); // Assuming store_image as sponsor image
    categories.value = store.categories || [];
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
  @apply w-full pb-10 relative overflow-hidden;
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
</style>
