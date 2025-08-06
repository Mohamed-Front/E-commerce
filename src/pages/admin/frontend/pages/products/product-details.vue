```vue
<template>
  <div class="product-page max-w-7xl mx-auto p-4 lg:p-8">
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
            :class="{ 'border-blue-500': curantimg === img.url, 'border-transparent': curantimg !== img.url }"
            @click="changeimg(img.url)"
          />
        </div>
        <div class="w-full lg:w-3/4">
          <div class="w-full aspect-square shadow-lg rounded-md overflow-hidden">
            <img :src="curantimg" alt="Main product image" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 flex flex-col justify-between p-4 bg-white rounded-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ locale == 'en' ? pro.name_en : pro.name_ar }}</h1>
        <h2 v-if="pro.sub_name_en" class="text-xl text-gray-600 mb-4">{{ locale == 'en' ? pro.sub_name_en : pro.sub_name_ar }}</h2>

        <section class="mt-4 flex flex-wrap gap-2 text-center">
          <span v-if="pro.store_id" class="sub-titles">Store</span>
          <span v-if="pro.category && (pro.category.name_en || pro.category.name_ar)" class="sub-titles">{{ locale == 'en' ? pro.category.name_en : pro.category.name_ar }}</span>
          <span v-if="pro.brand_id" class="sub-titles">Brand</span>
        </section>

        <section class="mt-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
            <div v-if="variants_details && variants_details.attributes && variants_details.attributes.color" class="flex-1 flex flex-col">
              <span class="text-color font-bold mb-2">Color</span>
              <div class="flex gap-2">
                <button
                  v-for="color in variants_details.attributes.color"
                  :key="color.id"
                  class="h-8 w-8 rounded-full border-2 transition-all duration-200"
                  :style="{ backgroundColor: color.value_en.toLowerCase() }"
                  :class="{ 'border-blue-500': selectedColor === color.value_en, 'border-gray-300': selectedColor !== color.value_en }"
                  @click="selectedColor = color.value_en"
                ></button>
              </div>
            </div>

            <div v-if="variants_details && variants_details.attributes && variants_details.attributes.size" class="flex-1 flex flex-col">
              <span class="text-color font-bold mb-2">Size</span>
              <div class="flex gap-2">
                <button
                  v-for="size in variants_details.attributes.size"
                  :key="size.id"
                  class="px-4 py-2 rounded-md border-2 transition-all duration-200"
                  :class="{ 'border-blue-500 bg-gray-100': selectedSize === size.value_en, 'border-gray-300': selectedSize !== size.value_en }"
                  @click="selectedSize = size.value_en"
                >
                  {{ locale === 'en' ? size.value_en : size.value_ar }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="bg-[#A17D1C] my-6 h-[1px] border-0" />

        <section>
          <div class="flex items-center gap-6 mb-4">
            <span class="text-xl font-bold text-gray-800">Price:</span>
            <span v-if="currentPrice" class="text-2xl font-bold text-blue-600">{{ currentPrice }} $</span>
            <span v-else class="text-2xl font-bold text-blue-600">{{ productPrice }}$</span>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <label class="font-bold text-gray-700">Quantity:</label>
            <div class="flex items-center border border-gray-300 rounded-md">
              <button @click="quantity > 1 ? quantity-- : null" class="px-3 py-1 text-lg font-bold hover:bg-gray-100 rounded-l-md">-</button>
              <span class="px-4 py-1 border-x border-gray-300">{{ quantity }}</span>
              <button @click="quantity++" class="px-3 py-1 text-lg font-bold hover:bg-gray-100 rounded-r-md">+</button>
            </div>
          </div>

          <p class="text-gray-600 my-4">Delivery within : 3 H</p>

          <button
            class="w-full py-3 text-lg font-bold bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-lg"
          >
            {{ $t('product.addtocart') }}
          </button>
        </section>
      </div>
    </header>

    <section class="bg-[#E6AC312B] px-6 pt-2 pb-12 rounded-md text-left mt-8">
      <p class="leading-relaxed text-sm text-gray-700">
        {{ locale == 'en' ? pro.description_en : pro.description_ar || 'No description available.' }}
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

    <section class="mt-8 p-4 bg-white rounded-md shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Latest Reviews</h2>
      <div class="space-y-6">
        <div v-for="reviewItem in reviews" :key="reviewItem.id" class="p-4 flex flex-col md:flex-row gap-4 border-b border-gray-200 last:border-b-0">
          <img :src="reviewItem.img" alt="Profile" class="w-12 h-12 rounded-full object-cover border border-gray-300" />

          <div class="flex-1">
            <div class="flex flex-col justify-between items-start mb-1">
              <h3 class="text-lg font-semibold text-gray-800">{{ reviewItem.name }}</h3>
              <span class="text-xs text-[#A17D1C]">{{ reviewItem.date }}</span>
            </div>

            <Rating :modelValue="reviewItem.rating" readonly :cancel="false" class="mb-2" />

            <p class="text-gray-700 text-sm">{{ reviewItem.comment }}</p>

            <div class="flex items-center gap-4 mt-2">
              <button @click="toggleLike(reviewItem)">
                <i
                  class="pi text-[#A17D1C] text-lg"
                  :class="reviewItem.reaction === 'like' ? 'pi-thumbs-up-fill' : 'pi-thumbs-up'"
                ></i>
              </button>

              <button @click="toggleDislike(reviewItem)">
                <i
                  class="pi text-[#A17D1C] text-lg"
                  :class="reviewItem.reaction === 'dislike' ? 'pi-thumbs-down-fill' : 'pi-thumbs-down'"
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Related Products</h2>
      <Exclusiveoffers :Stor="pro" />
      <bestSellers :Stor="pro" />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import Exclusiveoffers from '../../components/products/Exclusiveoffers.vue'
import bestSellers from '../../components/products/bestSellers.vue'

const { locale } = useI18n()
const route = useRoute()

const pro = ref({})
const variants_details = ref(null)
const curantimg = ref()
const imgs = ref([])
const quantity = ref(1)
const review = ref(null)

const selectedColor = ref(null)
const selectedSize = ref(null)

const productPrice = computed(() => {
  if (pro.value.variants && pro.value.variants.length > 0) {
    return pro.value.variants[0].price
  }
  return '0.00'
})

const currentPrice = computed(() => {
  if (!variants_details.value || !variants_details.value.combinations) {
    return null
  }

  const combination = variants_details.value.combinations.find(
    (combo) => combo.color === selectedColor.value && combo.size === selectedSize.value
  )
  return combination ? combination.price : null
})

const changeimg = (imgUrl) => {
  curantimg.value = imgUrl
}

const allreviews = ref([
  { starsNumber: 1, rate: 10 },
  { starsNumber: 2, rate: 30 },
  { starsNumber: 3, rate: 40 },
  { starsNumber: 4, rate: 20 },
  { starsNumber: 5, rate: 70 },
])

const reviews = ref([
  {
    id: 1,
    name: 'John Doe',
    rating: 4,
    date: '2023-10-01',
    comment: 'Great product, highly recommend!',
    img: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
    reaction: null,
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 5,
    date: '2023-10-01',
    comment: 'Absolutely love it! Will buy again.',
    img: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
    reaction: null,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    rating: 3,
    date: '2023-10-01',
    comment: 'It was okay, not what I expected.',
    img: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
    reaction: null,
  },
])

const toggleLike = (review) => {
  review.reaction = review.reaction === 'like' ? null : 'like'
  if (review.reaction === 'like') review.reaction = 'like'
}

const toggleDislike = (review) => {
  review.reaction = review.reaction === 'dislike' ? null : 'dislike'
  if (review.reaction === 'dislike') review.reaction = 'dislike'
  if (review.reaction === 'dislike' && review.reaction === 'like') review.reaction = 'dislike'
}

onMounted(async () => {
  try {
    const response = await axios.get(`api/home/product-details/${route.params.id}`)
    pro.value = response.data.data.product
    variants_details.value = response.data.data.variants_details
    imgs.value = pro.value.media
    if (imgs.value.length > 0) {
      curantimg.value = imgs.value[0].url
    }

    if (variants_details.value && variants_details.value.attributes) {
      if (variants_details.value.attributes.color && variants_details.value.attributes.color.length > 0) {
        selectedColor.value = variants_details.value.attributes.color[0].value_en
      }
      if (variants_details.value.attributes.size && variants_details.value.attributes.size.length > 0) {
        selectedSize.value = variants_details.value.attributes.size[0].value_en
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  }
})
</script>

<style scoped>
.product-page {
  font-family: sans-serif;
  color: #333;
}

.sub-titles {
  @apply bg-[#E6AC312B] px-4 py-2 rounded-md font-semibold text-sm text-gray-700 flex-grow;
}

.text-color {
  @apply text-[#A17D1C];
}
</style>
```
