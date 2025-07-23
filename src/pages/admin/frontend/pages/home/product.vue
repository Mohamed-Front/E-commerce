<template>
  <header class="flex lg:flex-row flex-col items-center gap-4">
    <div class="text-end w-3/4 lg:w-1/2">
      <h1 class="text-[clamp(1rem,3vw,3rem)] font-bold text-start">{{ locale == 'en' ? pro.name_en : pro.name_ar }}</h1>
      <section class="mt-8">
        <div class="flex justify-evenly flex-wrap w-full gap-2 text-center">
          <span class="sub-titles">Store</span><span class="sub-titles">Category</span>
          <span class="sub-titles">Sub-Category</span><span class="sub-titles flex-1">Brand</span>
        </div>
        <div class="flex justify-evenly text-color my-4 gap-6 flex-wrap">
          <div class="flex flex-1 justify-evenly border-[1px] border-[#A17D1C] rounded-md py-4 px-4">
            <span>Quantity</span><span>-</span>3<span>+</span>
          </div>
          <div class="flex flex-1 justify-evenly border-[1px] border-[#A17D1C] rounded-md py-4 px-4">
            <span>Color</span><span>RED</span>
          </div>
        </div>
      </section>
      <hr class="bg-[#A17D1C] my-6" />
      <section>
        <div class="flex justify-around text-center">
          <div class="flex flex-col">
            <span class="text-color font-bold">Before</span><span class="line-through">{{ +pro.base_price + +pro.cost_price + +pro.tax }}$</span>
          </div>
          <div class="flex flex-col">
            <span class="text-color font-bold">After</span><span>{{ +pro.base_price + +pro.cost_price + +pro.tax }}$</span>
          </div>
        </div>
        <p class="my-6 text-start">Delivery within : 3 H</p>
        <button
          class="lg:py-[10px] py-[6px] text-[8px] sm:text-[1rem] lg:text-[1.2rem] bg-[var(--main-text-color)] rounded-md w-full text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-md"
        >
          {{ $t('product.addtocart') }}
        </button>
      </section>
    </div>
    <div class="w-3/4 lg:w-1/2 flex lg:flex-row flex-col items-center gap-4">
      <!-- الصورة الكبيرة -->
      <div class="max-w-[60%] ml-4">
        <div class="w-full aspect-square shadow bg-full">
          <img :src="curantimg" alt="Main product image" class="w-full h-full object-cover rounded-md" />
        </div>
      </div>

      <!-- الصور الصغيرة -->
      <div class="lg:w-1/4 flex lg:flex-col flex-row items-center w-full justify-evenly gap-2">
        <img
          v-for="img in imgs.values"
          :key="img"
          :src="img"
          alt="Thumbnail"
          class="max-h-20 w-[20%] lg:w-auto object-cover rounded-lg cursor-pointer border hover:border-blue-500"
          @click="changeimg(img)"
        />
      </div>
    </div>
  </header>
  <section class="bg-[#E6AC312B] px-6 pt-2 pb-12 rounded-md text-left mt-8">
    <p class="leading-relaxed text-[clamp(.7rem,1vw,1rem)]">{{ locale == 'en' ? pro.description_en : pro.description_ar }}</p>
    <h3 class="text-[#E39F30] text-[clamp(.9rem,1.5vw,1.5rem)]">READ MORE</h3>
  </section>

  <section class="mt-8">
    <div class="flex justify-center items-center flex-col">
      <h2 class="text-[clamp(1rem,2vw,2rem)] font-bold">Leave A Review</h2>
    </div>
    <div class="flex justify-center items-center gap-10 mt-8">
      <div>
        <h2 class="text-[clamp(1.5rem,3vw,3rem)]">0</h2>
        <div class="card flex justify-center my-2">
          <Rating v-model="review" :cancel="false" />
        </div>
        <p>0 reviews</p>
      </div>
      <div class="w-[25%]">
        <div v-for="review in allreviews" class="flex gap-2 mb-3">
          <span>{{ review.starsNumber }}</span>
          <div class="min-w-full relative h-2 bg-gray-200 rounded overflow-hidden">
            <!-- الشريط المتلوّن حسب النسبة -->
            <div
              class="absolute top-0 left-0 h-full bg-[#F0E3C2] transition-all duration-300"
              :style="{ width: review.rate + '%' }"
            ></div>
          </div>
          <span class="text-[#A17D1C]">{{ review.rate }}%</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center mt-4">
      <textarea
        class="w-[40%] h-32 bg-transparent border border-[#F0E3C2] rounded-md p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F0E3C2]"
        placeholder="اكتب هنا..."
      ></textarea>
      <button
        class="w-[45%] mt-4 lg:py-[6px] py-[6px] text-[8px] sm:text-[1rem] lg:text-[1.2rem] bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-md"
      >
        Submit
      </button>
    </div>
    <div class="flex justify-center items-start flex-col mt-4">
      <h2 class="text-[clamp(1rem,2vw,2rem)] font-bold">Latest Reviews</h2>
    </div>
    <div class="space-y-6">
      <div v-for="review in reviews" :key="review.id" class="p-4 flex flex-col gap-4" style="margin-top: 0">
        <!-- user img -->
        <img :src="review.img" alt="Profile" class="w-9 h-9 rounded-full object-cover border border-gray-300" />

        <!-- date and name-->
        <div class="flex-1">
          <div class="flex flex-col justify-between items-start mb-1">
            <h3 class="text-gray-800 text-md">{{ review.name }}</h3>
            <span class="text-[.7rem] my-1 text-[#A17D1C]">{{ review.date }}</span>
          </div>

          <!-- rating starts -->
          <Rating :modelValue="review.rating" readonly :cancel="false" class="mb-2" />

          <!-- comment-->
          <p class="text-gray-700 text-xs">{{ review.comment }}</p>

          <!-- action -->
          <div class="flex items-center gap-4 mt-2">
            <button @click="toggleLike(review)">
              <i
                class="pi text-[#A17D1C]"
                :class="review.reaction == 'like' ? 'pi-thumbs-up-fill' : 'pi-thumbs-up'"
              ></i>
            </button>

            <button @click="toggleDislike(review)">
              <i
                class="pi text-[#A17D1C]"
                :class="review.reaction == 'dislike' ? 'pi-thumbs-down-fill' : 'pi-thumbs-down'"
              ></i>
            </button>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </section>
  <section>
    <div class="flex justify-center items-start flex-col mt-4">
      <h2 class="text-[clamp(1rem,2vw,2rem)] font-bold">Related Products</h2>
    </div>
    <Exclusiveoffers :Stor="pro" />
    <bestSellers :Stor="pro" />
  </section>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'

  import imge1 from '../../imges/prand 1.png'
  import imge3 from '../../imges/prand 3.png'
  import imge2 from '../../imges/prand 2.png'
  import imge4 from '../../imges/prand 4.png'
  import { useI18n } from 'vue-i18n'

  import Exclusiveoffers from '../../components/products/Exclusiveoffers.vue'
  import bestSellers from '../../components/products/bestSellers.vue'
  const { t,locale } = useI18n()
  const route = useRoute()

  const pro = ref({})
  const curantimg = ref()
  const imgs = []
  const changeimg = (img) => {
    curantimg.value = img
  }
  const review = ref(null)
  const allreviews = ref([
    {
      starsNumber: 1,
      rate: 10,
    },
    {
      starsNumber: 2,
      rate: 30,
    },
    {
      starsNumber: 3,
      rate: 40,
    },
    {
      starsNumber: 4,
      rate: 20,
    },
    {
      starsNumber: 5,
      rate: 70,
    },
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
   await axios
      .get(`api/home/product-details/${route.query.product}`)
      .then((response) => {
        pro.value = response.data.data
        curantimg.value = pro.value.media[0].url
        imgs.values = pro.value.media.map((img) => img.url)
      })
      .catch((error) => {
        console.error('Error fetching product:', error)
      })
      console.log(pro.value)
  })
</script>

<style scoped>
  .sub-titles {
    @apply bg-[var(--second-color)] px-2 py-2 rounded-md flex-grow;
  }
  .text-color {
    @apply text-[#A17D1C];
  }
</style>
