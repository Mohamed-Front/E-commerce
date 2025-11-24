<template>
  <!-- main body -->
  <main class="min-h-[100vh]">
    <header>
      <!-- products titles slider -->
      <swiper
        :modules="[Autoplay, Navigation]"
        :slides-per-view="5"
        :space-between="25"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :speed="3000"
        :navigation="false"
        grab-cursor
        class="h-[58px] mt-2"
        :breakpoints="{
          0: { slidesPerView: 4, spaceBetween: 5 },
          480: { slidesPerView: 3, spaceBetween: 5 },
          768: { slidesPerView: 4, spaceBetween: 5 },
          1024: { slidesPerView: 8, spaceBetween: 5 },
        }"
      >
        <swiper-slide v-for="title in computedTitles" :key="title.id" class="flex items-center justify-center">
          <router-link
            :to="linkTo(title)"
            class="titels font-sans bg-[#1F3A93] h-[40px] min-w-[80px] sm:h-[44px] sm:min-w-[100px] md:h-[48px] md:min-w-[140px] text-[.5rem] sm:text-[.8rem] md:text-[.8rem] text-center place-content-center font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer text-white inline-flex items-center justify-center"
          >
            {{ title.name }}
          </router-link>
        </swiper-slide>
      </swiper>
      <!-- main banner -->
      <swiper
        :modules="[Autoplay]"
        :slides-per-view="1.3"
        :centered-slides="true"
        :space-between="10"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :speed="3000"
        grab-cursor
        class="my-swiper mt-2"
      >
        <swiper-slide v-for="(pro, index) in banners_slider" :key="index" class="flex justify-center">
          <img :src="pro.url" class="w-full h-auto max-w-[1200px]  object-contain mb-2 rounded-lg" />
        </swiper-slide>
      </swiper>
    </header>
    <StoreDetails></StoreDetails>

    <!-- main content -->
    <div class="contaner">
      <!-- section 1 -->
      <section class="mx-auto mt-16 w-[100%] max-w-7xl">
        <ProductOffers></ProductOffers>
      </section>
      <section class="mx-auto mt-16 w-[100%] max-w-7xl">
        <CustomTaps></CustomTaps>
      </section>
    </div>
  </main>
</template>

<script setup>
  import { onBeforeMount, ref, computed } from 'vue'
  import ProductOffers from '../components/ProductOffers.vue'
  import axios from 'axios'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Navigation } from 'swiper/modules'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import 'swiper/css'
  import 'swiper/css/navigation'

  // components
  import productsSwiper from '../components/SwiperSlide/productsSwiper.vue'
  import CustomTaps from '../components/CustomTaps.vue'
  import StoreDetails from '../components/StoreDetails.vue'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const exclusive_offers = ref({ title: '', products: [] })
  // constructor
  class Data {
    constructor(name = 'No name', img = '', price = '$$', id) {
      this.name = name
      this.img = img
      this.price = price
      this.id = id
    }
  }
  const Best_seller = ref({ title: '', products: [] })
  // api data
  const Stor = ref({})
  const banners_slider = ref([])
  const titels = ref({})
  const storimg = ref({})
  const New_arrival = ref({ title: '', products: [] })
  const isLoading = ref(false)
  const error = ref(null)
  const locale = ref(localStorage.getItem('appLang') || 'ar')

  const stor_id = ref(localStorage.getItem('defaultStoreId'))

  // Computed property for titles
  const computedTitles = computed(() => {
    return Object.values(titels.value)
  })

  const linkTo = (d) =>
    d.has_subcategories
      ? { name: 'subcategory', params: { id: d.id } }
      : { name: 'produts_category', params: { id: d.id } }


  const loaddata = async () => {
    try {
      // Fetch categories
      const categoryResponse = await axios.get(`api/home/get-categories/${stor_id.value}`)
      categoryResponse.data.data.forEach((category) => {
        titels.value[category.id] = {
          name: localStorage.getItem('appLang') == 'en' ? category.name_en : category.name_ar || category.name_en,
          id: category.id,
          has_subcategories: category.has_subcategories,
        }
      })

      // Fetch banner slider images
      const bannerResponse = await axios.get('api/home/get-media-link')
      banners_slider.value = bannerResponse.data.data.map((item) => ({
        url: item.url,
        id: item.id,
      }))

      // Fetch store images
      if (Stor.value.media?.length > 0) {
        storimg.value = {
          store_image: Stor.value.media.find((img) => img.name == 'store_image')?.url,
          sub_banner_image: Stor.value.media.find((img) => img.name == 'sub_banner_image')?.url,
          slider_images_one: Stor.value.media.find((img) => img.name == 'slider_images_one')?.url,
          slider_images_two: Stor.value.media.find((img) => img.name == 'slider_images_two')?.url,
          slider_images_three: Stor.value.media.find((img) => img.name == 'slider_images_three')?.url,
          main_banner_image: Stor.value.media.find((img) => img.name == 'main_banner_image')?.url,
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  onBeforeMount(() => {
    loaddata()
  })
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

  .produt-img {
    background-image: url(../imges/img1.png);
  }

  .pro:first-child {
    margin-left: 1rem;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .Variety:hover div {
    filter: blur(3px);
  }

  .Variety div:hover {
    filter: blur(0px);
  }

  /* Fancy titles slider styles */
  .titles-swiper {
    padding: 0 10px;
  }

  .titles-swiper :deep(.swiper-button-next),
  .titles-swiper :deep(.swiper-button-prev) {
    color: var(--main-text-color);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .titles-swiper :deep(.swiper-button-next:hover),
  .titles-swiper :deep(.swiper-button-prev:hover) {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  .titles-swiper :deep(.swiper-button-next:after),
  .titles-swiper :deep(.swiper-button-prev:after) {
    font-size: 14px;
    font-weight: bold;
  }

  .titels {
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .titels:hover {
    background: linear-gradient(45deg, #6b7280, var(--main-text-color));
  }
</style>
