<template>
  <div class="product-page max-w-7xl mx-auto p-4 lg:p-8">
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <!-- Product Header Section -->
    <header class="flex flex-col lg:flex-row items-start gap-8">
      <div class="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row items-center gap-4">
        <div
          class="flex lg:flex-col flex-row items-center justify-center lg:justify-start gap-2 w-full lg:w-1/4"
        >
          <img
            v-for="img in imgs"
            :key="img.url"
            :src="img.url"
            alt="Thumbnail"
            class="h-20 w-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200"
            :class="{ 'border-blue-500': currentImg === img.url, 'border-transparent': currentImg !== img.url }"
            @click="changeImg(img.url)"
          />
        </div>
        <div class="w-full lg:w-3/4">
          <div class="w-full aspect-square shadow-lg rounded-md overflow-hidden">
            <img :src="currentImg || pro.key_default_image" alt="Main product image" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 flex flex-col justify-between p-4 bg-white rounded-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ locale === 'en' ? pro.name_en : pro.name_ar }}</h1>
        <h2 v-if="pro.sub_name_en || pro.sub_name_ar" class="text-xl text-gray-600 mb-4">
          {{ locale === 'en' ? pro.sub_name_en : pro.sub_name_ar }}
        </h2>

        <section class="mt-4 flex flex-wrap gap-2 text-center">
          <span @click="selectStore(pro.store)" v-if="pro.store_id" class="sub-tiles">
            {{ locale === 'en' ? pro.store?.name_en : pro.store?.name_ar || 'Store' }}
          </span>
          <span @click="goCatgory(pro.category)" v-if="pro.category && (pro.category.name_en || pro.category.name_ar)" class="sub-tiles cu">
            {{ locale === 'en' ? pro.category.name_en : pro.category.name_ar }}
          </span>
          <span v-if="pro.brand_id" class="sub-tiles">{{ locale === 'en' ? pro.brand?.name_en : pro.brand?.name_ar || 'Brand' }}</span>
        </section>

        <hr class="bg-[#A17D1C] my-6 h-[1px] border-0" />

        <section>
          <div class="flex items-center gap-6 mb-4">
            <span class="text-xl font-bold text-gray-800">Price:</span>
            <span class="text-2xl font-bold text-blue-600">{{ pro.base_price_after_discount }} JOD</span>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <label class="font-bold text-gray-700">Quantity:</label>
            <div class="flex items-center border border-gray-300 rounded-md">
              <button @click="quantity > 1 ? quantity-- : null" class="px-3 py-1 text-lg font-bold hover:bg-gray-100 rounded-l-md">-</button>
              <span class="px-4 py-1 border-x border-gray-300">{{ quantity }}</span>
              <button @click="quantity++" class="px-3 py-1 text-lg font-bold hover:bg-gray-100 rounded-r-md">+</button>
            </div>
          </div>

          <p class="text-gray-600 my-4">Delivery within: 3 H</p>

          <button
            :disabled="isAddingToCart"
            @click="addToCart(pro)"
            class="w-full py-3 text-lg font-bold bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-lg"
            :class="{ 'opacity-50 cursor-not-allowed': isAddingToCart }"
          >
            {{ isAddingToCart ? 'Adding...' : $t('product.addtocart') }}
          </button>
        </section>
      </div>
    </header>

    <!-- Product Description Section -->
    <section class="bg-[#E6AC312B] px-6 pt-2 pb-12 rounded-md mt-8">
      <p class="leading-relaxed text-sm text-gray-700">
        {{ locale === 'en' ? pro.description_en : pro.description_ar || 'No description available.' }}
      </p>
      <h3 class="text-[#E39F30] text-sm font-semibold mt-2 cursor-pointer">READ MORE</h3>
    </section>

    <!-- Reviews Section -->
    <section class="mt-8 p-4 bg-white rounded-md shadow-md">
      <div class="flex justify-center items-center flex-col">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Leave A Review</h2>
      </div>
      <div class="flex flex-col md:flex-row justify-center items-center gap-8 mt-4">
        <div class="text-center">
          <h2 class="text-5xl font-bold text-gray-800">{{ averageRating.toFixed(1) }}</h2>
          <div class="card flex justify-center my-2">
            <Rating v-model="newReview.rating" :cancel="false" />
          </div>
          <p class="text-gray-500">{{ reviews.length }} {{ reviews.length === 1 ? 'review' : 'reviews' }}</p>
        </div>
        <div class="w-full md:w-1/3">
          <div v-for="reviewBar in allreviews" :key="reviewBar.starsNumber" class="flex items-center gap-2 mb-3">
            <span class="text-sm font-bold w-4">{{ reviewBar.starsNumber }}</span>
            <div class="w-full relative h-2 bg-gray-200 rounded overflow-hidden">
              <div
                class="absolute top-0 left-0 h-full bg-[#F0E3C2] transition-all duration-300"
                :style="{ width: reviewBar.percentage + '%' }"
              ></div>
            </div>
            <span class="text-[#A17D1C] text-sm w-8">{{ reviewBar.count }}</span>
          </div>
        </div>
      </div>

      <!-- Review Form -->
      <div v-if="authStore.authenticatedweb" class="flex flex-col justify-center items-center mt-6">
        <textarea
          v-model="newReview.comment"
          class="w-full md:w-1/2 h-32 bg-gray-50 border border-gray-300 rounded-md p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F0E3C2]"
          placeholder="Write your review here..."
        ></textarea>
        <button
          @click="submitReview"
          :disabled="isSubmittingReview || newReview.rating === 0 || !newReview.comment.trim()"
          class="w-full md:w-1/2 mt-4 py-2 px-4 text-lg font-bold bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmittingReview ? 'Submitting...' : 'Submit' }}
        </button>
        <p v-if="reviewError" class="text-red-500 text-sm mt-2">{{ reviewError }}</p>
      </div>
      <div v-else class="text-center mt-6">
        <p class="text-gray-600 mb-4">Please log in to leave a review</p>
        <button
          @click="router.push({ name: 'AuthLogin' })"
          class="py-2 px-6 bg-[var(--main-text-color)] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Login
        </button>
      </div>

      <!-- Reviews List -->
      <div v-if="reviews.length > 0" class="mt-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h3>
        <div v-for="review in displayedReviews" :key="review.id" class="border-b border-gray-200 py-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-800">{{ review.user?.name || 'Anonymous' }}</span>

              <Rating :modelValue="review.rate" :readonly="true" :cancel="false" class="text-sm" />
            </div>
            <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
          </div>
          <p class="text-gray-700">{{ review.message }}</p>
        </div>
      </div>
      <div v-else class="text-center mt-8 py-6">
        <p class="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    </section>

    <!-- Product Offers Section -->
    <section class="mt-8">
      <ProductOffers></ProductOffers>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import Rating from 'primevue/rating';
import ProductOffers from '../../components/ProductOffers.vue';
import { useAuthStore } from '../../../../../stores/WebAuth';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const pro = ref({});
const imgs = ref([]);
const quantity = ref(1);
const currentImg = ref('');
const isLoading = ref(false);
const error = ref(null);
const isAddingToCart = ref(false);
const reviews = ref([]);
const isSubmittingReview = ref(false);
const reviewError = ref(null);

const newReview = ref({
  rating: 0,
  comment: ''
});

// Compute displayed reviews (limited to 3)
const displayedReviews = computed(() => {
  return reviews.value.slice(0, 3);
});

// Calculate average rating
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((total, review) => total + review.rate, 0);
  return sum / reviews.value.length;
});

// Calculate review distribution
const allreviews = computed(() => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.value.forEach(review => {
    if (review.rate >= 1 && review.rate <= 5) {
      distribution[review.rate]++;
    }
  });

  return [5, 4, 3, 2, 1].map(stars => ({
    starsNumber: stars,
    count: distribution[stars],
    percentage: reviews.value.length > 0
      ? Math.round((distribution[stars] / reviews.value.length) * 100)
      : 0
  }));
});

const goCatgory = (data) => {
  if (!data) return;
  if (data.has_subcategories) {
    router.push({ name: 'subcategory', params: { id: data.id } });
  } else {
    router.push({ name: 'produts_category', params: { id: data.id } });
  }
};

const selectStore = (store) => {
  if (!store) return;
  if (store.has_market) {
    router.push({ name: 'stores-hasmarket' });
  } else {
    router.push({ name: 'home' });
  }
};

const addToCart = async (product) => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }
  if (isAddingToCart.value) return;
  isAddingToCart.value = true;
  try {
    const payload = {
      product_id: product.id,
      variant_id: product.variant_id || null,
      quantity: quantity.value,
    };
    const response = await axios.post('/api/cart/add', payload);
    console.log('Added to cart successfully:', response.data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    error.value = 'Failed to add product to cart. Please try again.';
  } finally {
    isAddingToCart.value = false;
  }
};

const changeImg = (imgUrl) => {
  currentImg.value = imgUrl;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const submitReview = async () => {
  if (!authStore.authenticatedweb) {
    router.push({ name: 'AuthLogin' });
    return;
  }

  if (newReview.value.rating === 0) {
    reviewError.value = 'Please select a rating';
    return;
  }

  if (!newReview.value.comment.trim()) {
    reviewError.value = 'Please write a review comment';
    return;
  }

  isSubmittingReview.value = true;
  try {
    const payload = {
      model_id: route.params.id,
      rate: newReview.value.rating,
      type: 'product',
      message: newReview.value.comment.trim()
    };

    const response = await axios.post('/api/review', payload);

    if (response.data.success) {
      reviews.value.unshift({
        id: response.data.data.id,
        rate: newReview.value.rating,
        message: newReview.value.comment.trim(),
        user: { name: authStore.user?.name || 'Anonymous' },
        created_at: new Date().toISOString()
      });

      newReview.value = { rating: 0, comment: '' };
      reviewError.value = null;
    } else {
      throw new Error(response.data.message || 'Failed to submit review');
    }
  } catch (err) {
    console.error('Error submitting review:', err);
    reviewError.value = err.response?.data?.message || 'Failed to submit review. Please try again.';
  } finally {
    isSubmittingReview.value = false;
  }
};

onMounted(async () => {
  window.scrollTo(0, 0);
  isLoading.value = true;
  try {
    const response = await axios.get(`/api/home/product-details/${route.params.id}`);
    pro.value = response.data.data?.product || {};
    imgs.value = pro.value.media || [];
    currentImg.value = imgs.value.length > 0 ? imgs.value[0].url : pro.value.key_default_image;
    reviews.value = pro.value.reviews || [];
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = t('category.errorLoading') || 'Failed to load data.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.product-page {
  font-family: sans-serif;
  color: #333;
}

.sub-tiles {
  @apply bg-[#E6AC312B] px-4 py-2 rounded-md font-semibold text-sm text-gray-700 flex-grow;
}

.text-color {
  @apply text-[#A17D1C];
}

:deep(.p-rating .p-rating-icon) {
  color: #F0E3C2;
}

:deep(.p-rating .p-rating-icon.p-rating-icon-active) {
  color: #E39F30;
}
</style>
