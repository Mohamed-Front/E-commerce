<template>
  <div class="mx-auto bg-gradient-to mt-16 max-w-7xl   ">
    <!-- Loading State -->
   <!-- Fancy Loading State -->
   <div v-if="isLoading" class="flex flex-col items-center justify-center py-16  rounded-xl animate-pulse">
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
      <button @click="fetchAllData" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">{{ t('category.retry') }}</button>
    </div>
    <!-- Main Content -->
    <div v-else>
      <!-- Category Header -->
      <div class="text-center mb-2">
        <h1 class="text-4xl sm:text-4xl font-extrabold text-gray-800 tracking-tight animate-fade-in">
          {{ categoryName(category) }}
        </h1>
      </div>
      <!-- Sub-Categories Section with Swiper -->
      <div v-if="subCategories.length >= 1">
        <h2 class="font-bold font-sans text-gray-800 text-2xl sm:text-3xl lg:text-4xl mb-4 animate-slide-up">
        </h2>
        <swiper
          :modules="[Autoplay, Navigation]"
          :slides-per-view="3"
          :space-between="20"
          :loop="subCategories.length > 3"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :speed="1000"
          :grab-cursor="true"
          :navigation="false"
          class="mt-6 "
          :breakpoints="{
            320: { slidesPerView: 2, spaceBetween: 4 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 5.5, spaceBetween: 10 }
          }"
        >
          <SwiperSlide
            v-for="subCategory in subCategories"
            :key="subCategory.id"
            class="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2"

          >
            <router-link  :to="linkTo(subCategory)" class="w-full h-48 overflow-hidden rounded-xl shadow-md relative">
              <img
                :src="subCategory.media[0]?.url"
                :alt="`${categoryName(subCategory)} image`"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
              ></div>
            </router-link>
            <h3 class="font-sans mt-4 mb-1 text-gray-800 font-semibold text-sm sm:text-base md:text-lg">
              {{ categoryName(subCategory) }}
            </h3>
          </SwiperSlide>
        </swiper>
      </div>

      <!-- First Banner Section -->
      <div v-if="category.media?.find(media => media.name === 'banner_one_image')" class="mb-3 md:my-8">
        <div class="relative overflow-hidden rounded-2xl shadow-lg animate-banner-slide">
          <img
            :src="category.media.find(media => media.name === 'banner_one_image').url"
            :alt="`${categoryName(category)} banner one`"
            class="w-full  sm:h-70 md:h-76 object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-6">
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <section>
        <!-- Category Products Row -->
        <productsSwiper
          v-if="categoryProducts.products.length"
          :products="categoryProducts"
          :title="productcategoryName(category)"
        />


        <ProductOffers></ProductOffers>
      </section>

      <!-- Second Banner Section -->
      <div v-if="category.media?.find(media => media.name === 'banner_two_image')" class="my-8">
        <div class="relative overflow-hidden rounded-2xl shadow-lg animate-banner-slide">
          <img
            :src="category.media.find(media => media.name === 'banner_two_image').url"
            :alt="`${categoryName(category)} banner two`"
            class="w-full  sm:h-70 md:h-76 object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-center justify-center p-6">
          </div>
        </div>
      </div>
    </div>

  </div>
    <CustomTaps></CustomTaps>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import productsSwiper from '../../components/SwiperSlide/productsSwiper.vue';
import defaultCategoryImage from '../../imges/banner-addtion.png';
import defaultProductImage from '../../imges/banner-addtion.png';
import axios from 'axios';
import CustomTaps from '../../components/CustomTaps.vue';
import ProductOffers from '../../components/ProductOffers.vue';

// Initialize Vue utilities
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// Reactive state
const storeId = ref(localStorage.getItem('defaultStoreId'));
const category = ref({});
const subCategories = ref([]);
const categoryProducts = ref({ title: '', products: [] });
const subCategoryProducts = ref([]);

const exclusiveOffers = ref({ title: '', products: [] });
const isLoading = ref(false);
const error = ref(null);

// Helper function to get category/sub-category name based on locale
const categoryName = (item) => {
  return locale.value === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar;
};

const productcategoryName = (item) => {
  return locale.value === 'ar' ? 'منتجات ' + (item.name_ar || item.name_en) : 'Products ' + (item.name_en || item.name_ar);
};

  const linkTo = (d) =>
    d.has_subcategories
      ? { name: 'subcategory', params: { id: d.id } }
      : { name: 'produts_category', params: { id: d.id } }

// Fetch category and products data
const fetchCategoryData = async () => {
  try {
    const response = await axios.get(`/api/home/products-by-category/${route.params.id}/${storeId.value}`);
    const data = response.data.data;
    category.value = {
      id: data.category.id,
      name_ar: data.category.name_ar,
      name_en: data.category.name_en,
      media: data.category.media || [{ url: defaultCategoryImage, name: 'default' }],
    };
    subCategories.value = data.sub_categories.map(sub => ({
      id: sub.id,
      has_subcategories: sub.has_subcategories,

      name_ar: sub.name_ar || sub.name_en,
      name_en: sub.name_en || sub.name_ar,
      media: sub.media.length ? sub.media : [{ url: defaultCategoryImage, name: 'default' }],
    }));
    categoryProducts.value = {
      title: productcategoryName(category.value),
      products: (data.products.data || []).map(product => ({
        id: product.id,
          sub_name: locale.value === 'ar'
    ? (product.sub_name_ar || product.sub_name_en || '')
    : (product.sub_name_en || product.sub_name_ar || ''),
        name: locale.value === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar,
        tax: product.tax || 0,
          total_discounts_value:product.total_discounts_value,
          is_free_shipping: product.is_free_shipping,
          total_rating: product.total_rating,
        price: parseFloat(product.base_price || 0).toFixed(2),
        img: product.media?.find(media => media.name === 'product_main_image')?.url || product.key_default_image || defaultProductImage,
      })),
    };
  } catch (err) {
    console.error('Error fetching category data:', err);
    error.value = t('category.errorLoading') || 'Failed to load category data.';
  }
};

// Fetch products for each subcategory
const fetchSubCategoryProducts = async () => {
  try {
    const promises = subCategories.value.map(async (subCategory) => {
      const response = await axios.get(`/api/home/products-by-category/${subCategory.id}/${storeId.value}`);
      const products = response.data.data.products.data || [];
      return products.map(product => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar,
        tax: product.tax || 0,
        price: parseFloat(product.base_price || 0).toFixed(2),
        img: product.media?.find(media => media.name === 'product_main_image')?.url || product.key_default_image || defaultProductImage,
      }));
    });
    const results = await Promise.allSettled(promises);
    subCategoryProducts.value = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);
  } catch (err) {
    console.error('Error fetching subcategory products:', err);
    error.value = t('category.errorLoading') || 'Failed to load subcategory products.';
  }
};





// Fetch all data
const fetchAllData =  () => {
  isLoading.value = true;
  error.value = null;
  fetchCategoryData()

  if (subCategories.value.length) {
     fetchSubCategoryProducts();
  }
  isLoading.value = false;
};

// Initialize on mount
onBeforeMount(() => {
  console.log(storeId.value)
  if (route.params.id && storeId.value) {
    fetchAllData();
  } else {
    error.value = t('category.missingParams') || 'Missing category or store ID.';
  }
});

// Watch for changes in route.params.id
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId && newId && storeId.value) {
    fetchAllData();
  } else if (!newId || !storeId.value) {
    error.value = t('category.missingParams') || 'Missing category or store ID.';
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

@keyframes banner-slide {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-banner-slide {
  animation: banner-slide 1s ease-out forwards;
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
