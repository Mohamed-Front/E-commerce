<template>
  <div class="product-page max-w-7xl mx-auto p-4 lg:p-8">
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
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
            <img :src="currentImg" alt="Main product image" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 flex flex-col justify-between p-4 bg-white rounded-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ locale === 'en' ? pro.name_en : pro.name_ar }}</h1>
        <h2 v-if="pro.sub_name_en" class="text-xl text-gray-600 mb-4">{{ locale === 'en' ? pro.sub_name_en : pro.sub_name_ar }}</h2>

        <section class="mt-4 flex flex-wrap gap-2 text-center">
          <span @click="selectStore(pro.store)" v-if="pro.store_id" class="sub-tiles">{{ pro.store?.name_en || 'Store' }}</span>
          <span @click="goCatgory(pro.category)" v-if="pro.category && (pro.category.name_en || pro.category.name_ar)" class="sub-tiles cu">{{ locale === 'en' ? pro.category.name_en : pro.category.name_ar }}</span>
          <span v-if="pro.brand_id" class="sub-tiles">{{ pro.brand?.name_en || 'Brand' }}</span>
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
            class="w-full py-3 text-lg font-bold bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-lg"
          >
            {{ $t('product.addtocart') }}
          </button>
        </section>
      </div>
    </header>

    <section class="bg-[#E6AC312B] px-6 pt-2 pb-12 rounded-md mt-8">
      <p class="leading-relaxed text-sm text-gray-700">
        {{ locale === 'en' ? pro.description_en : pro.description_ar || 'No description available.' }}
      </p>
      <h3 class="text-[#E39F30] text-sm font-semibold mt-2 cursor-pointer">READ MORE</h3>
    </section>

    <section class="mt-8 p-4 bg-white rounded-md shadow-md">
      <div class="flex justify-center items-center flex-col">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Leave A Review</h2>
      </div>
      <div class="flex flex-col md:flex-row justify-center items-center gap-8 mt-4">
        <div class="text-center">
          <h2 class="text-5xl font-bold text-gray-800">0</h2>
          <div class="card flex justify-center my-2">
            <Rating v-model="review" :cancel="false" />
          </div>
          <p class="text-gray-500">0 reviews</p>
        </div>
        <div class="w-full md:w-1/3">
          <div v-for="reviewBar in allreviews" :key="reviewBar.starsNumber" class="flex items-center gap-2 mb-3">
            <span class="text-sm font-bold w-4">{{ reviewBar.starsNumber }}</span>
            <div class="w-full relative h-2 bg-gray-200 rounded overflow-hidden">
              <div
                class="absolute top-0 left-0 h-full bg-[#F0E3C2] transition-all duration-300"
                :style="{ width: reviewBar.rate + '%' }"
              ></div>
            </div>
            <span class="text-[#A17D1C] text-sm w-8">{{ reviewBar.rate }}%</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center mt-6">
        <textarea
          class="w-full md:w-1/2 h-32 bg-gray-50 border border-gray-300 rounded-md p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F0E3C2]"
          placeholder="Write your review here..."
        ></textarea>
        <button
          class="w-full md:w-1/2 mt-4 py-2 px-4 text-lg font-bold bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-lg"
        >
          Submit
        </button>
      </div>
    </section>

    <section class="mt-8">
      <ProductOffers></ProductOffers>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import Rating from 'primevue/rating'
import ProductOffers from '../../components/ProductOffers.vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter();

const pro = ref({})
const imgs = ref([])
const quantity = ref(1)
const review = ref(null)
const currentImg = ref('')
const isLoading = ref(false)
const error = ref(null)
const goCatgory = (data) => {
  console.log(data)
  if(data.has_subcategories  ){
   router.push({ name: 'subcategory', params: { id: data.id } });
  }
  else
  router.push({ name: 'produts_category', params: { id: data.id } });
};
const selectStore = (store) => {

  if (store.has_market) {
    router.push({ name: 'stores-hasmarket' });
  } else {
    router.push({ name: 'home' });
  }
};
onMounted(async () => {
  window.scrollTo(0, 0)
  isLoading.value = true
  try {
    const response = await axios.get(`api/home/product-details/${route.params.id}`)
    pro.value = response.data.data.product
    imgs.value = pro.value.media || []
    if (imgs.value.length > 0) {
      currentImg.value = imgs.value[0].url
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = t('category.errorLoading') || 'Failed to load data.'
  } finally {
    isLoading.value = false
  }
})

const changeImg = (imgUrl) => {
  currentImg.value = imgUrl
}

const allreviews = ref([
  { starsNumber: 5, rate: 0 },
  { starsNumber: 4, rate: 0 },
  { starsNumber: 3, rate: 0 },
  { starsNumber: 2, rate: 0 },
  { starsNumber: 1, rate: 0 },
])
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
</style>
