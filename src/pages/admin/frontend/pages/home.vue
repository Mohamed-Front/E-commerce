<template>
  <!-- main body -->
  <main class="bg-[#FAF7F0] min-h-[100vh]">
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
        class="titles-swiper h-[58px] mt-2"
        :breakpoints="{
          0: { slidesPerView: 4 },
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 10 }
        }"
      >
        <swiper-slide v-for="title in computedTitles" :key="title.id" class="flex items-center justify-center">
          <div
            class="titels font-sans bg-[#1F3A93] h-[40px] min-w-[80px] sm:h-[44px] sm:min-w-[100px] md:h-[48px] md:min-w-[140px] text-[.5rem] sm:text-[.8rem] md:text-[.8rem] text-center place-content-center font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer text-white"
            @click="router.push({ path: '/SubCategory', query: { activetap: title.id, stor: Stor.id } })"
          >
            {{ title.name }}
          </div>
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
          <img :src="pro.url" class="w-full h-auto max-w-[1200px] max-h-[600px] object-contain mb-2 rounded-lg" />
        </swiper-slide>
      </swiper>
    </header>
    <!-- main content -->
    <div class="contaner">
      <!-- section 1 -->
      <section class="mx-auto mt-16 w-[100%] max-w-7xl">
        <!-- produts -->
        <div class="flex place-content-between pt-[35px]">
          <!-- img 1 -->
          <div class="produt-img w-[48%] bg-cover place-content-center items-center p-6 lg:p-12">
            <div class="text-white font-sans flex flex-col items-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
              <h2
                class="font-bold font-sans text-[.6rem] sm:text-[1rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[3rem]"
              >
                Home Slider
              </h2>
              <p class="text-center font-sans text-[8px] sm:text-[1rem] lg:text-[1.2rem]">
                Discover our exclusive deals
              </p>
              <button
                class="font-sans lg:px-[16px] lg:py-[8px] px-[8px] py-[4px] text-[8px] sm:text-[1rem] lg:text-[1.2rem] bg-[var(--main-text-color)] rounded-md hover:bg-opacity-80 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
          <!-- img 2 -->
          <div class="produt-img w-[48%] bg-cover"></div>
        </div>
        <!-- products -->
        <div class="bg-[var(--main-text-color)/15] w-full overflow-x-auto py-4 scrollbar-hide">
          <swiper
            :modules="[Autoplay]"
            :loop="true"
            :autoplay="{ delay: 0, disableOnInteraction: false }"
            :speed="3000"
            grab-cursor
            :space-between="10"
            :breakpoints="{
              0: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 8 },
              1280: { slidesPerView: 10 },
            }"
            class="px-4"
          >
            <swiper-slide
              v-for="(pro, index) in product_titels"
              :key="index"
              class="flex-shrink-0 text-center flex flex-col items-center"
            >
              <div class="w-20 h-20 xs:w-16 xs:h-16 flex items-center justify-center">
                <img src="../imges/image.png" :alt="pro.name" class="w-full h-full object-contain" />
              </div>
              <p class="font-sans text-xs font-bold truncate w-full mt-1">
                {{ pro.name }}
              </p>
            </swiper-slide>
          </swiper>
        </div>
        <!-- banner -->
        <div class="h-[143px] flex place-content-center items-center">
          <img :src="storimg.main_banner_image" alt="" class="w-[70%] rounded-lg" />
        </div>
        <!-- more products -->
        <!-- Exclusive_offers -->
        <Exclusiveoffers :Stor="Stor" />
        <!-- best_seller -->
        <bestSellers :Stor="Stor" />
        <!-- New_arrival -->
        <productsSwiper :products="New_arrival" />
      </section>
      <section class="max-w-full">
        <!-- Variety we chose for you -->
        <h1 class="lg:mt-24 xs:mt-12 mx-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">
          {{ $t('Miscellaneous') }}
        </h1>
        <div
          class="max-h-[873px] bg-[var(--main-text-color)] mt-3 grid grid-flow-row-2 grid-cols-5 gap-2 cursor-pointer p-4 Variety transition"
        >
          <div class="bg-white text-center rounded-md pb-3 transition" v-for="pro in Variety.products">
            <img :src="pro.img" alt="" class="h-[87%] rounded-md" />
            <p
              class="text-[var(--main-text-color)] font-bold m-[calc((12%)/2)] xs:text-[.3rem] sm:text-[.5rem] md:text-[.7rem] lg:text-[1rem] p-2"
            >
              {{ pro.name }}
            </p>
          </div>
        </div>
        <!-- For lady -->
        <for_lady :Stor="Stor"/>
        <!-- Variety we chose for you 2 -->
        <productsSwipertow :products="Variety" />
        <!-- For lady 2-->
        <for_lady :Stor="Stor"/>
        <!-- Other products -->
      </section>
    </div>

    <!-- footer -->
  </main>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import imge1 from '../imges/prand 1.png'
  import imge3 from '../imges/prand 3.png'
  import imge2 from '../imges/prand 2.png'
  import imge4 from '../imges/prand 4.png'
  import imge5 from '../imges/prand 5.png'

  import axios from 'axios'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Navigation } from 'swiper/modules'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import 'swiper/css'
  import 'swiper/css/navigation'

  // components
  import productsSwiper from '../components/SwiperSlide/productsSwiper.vue'
  import productsSwipertow from '../components/SwiperSlide/porductsSwipertow.vue'
  import for_lady from '../components/categories/for_lady.vue'
  import Exclusiveoffers from '../components/products/Exclusiveoffers.vue'
  import bestSellers from '../components/products/bestSellers.vue'
  import Nav from '../components/nav.vue'
  import Footer from '../components/footer.vue'

  const { t } = useI18n()
  const router = useRouter()

  // constructor
  class Data {
    constructor(name = 'No name', img = '', price = '$$', id) {
      this.name = name
      this.img = img
      this.price = price
      this.id = id
    }
  }

  // api data
  const Stor = ref({})
  const banners_slider = ref([])
  const titels = ref({})
  const storimg = ref({})

  const product_titels = ref([
    new Data('العناية الشخصية', 'imges/personal-care.png'),
    new Data('أزياء النساء', 'imges/women-fashion.png'),
    new Data('أزياء الرجال', 'imges/men-fashion.png'),
    new Data('العناية بالبشرة', 'imges/skin-care.png'),
    new Data('العناية بالشعر', 'imges/hair-care.png'),
    new Data('شنط واكسسوارات', 'imges/bags-accessories.png'),
    new Data('الإلكترونيات', 'imges/electronics.png'),
    new Data('المنزل والمطبخ', 'imges/home-kitchen.png'),
    new Data('ألعاب الأطفال', 'imges/kids-toys.png'),
    new Data('العروض اليومية', 'imges/daily-deals.png'),
    new Data('العناية الشخصية', 'imges/personal-care.png'),
    new Data('أزياء النساء', 'imges/women-fashion.png'),
    new Data('أزياء الرجال', 'imges/men-fashion.png'),
    new Data('العناية بالبشرة', 'imges/skin-care.png'),
    new Data('العناية بالشعر', 'imges/hair-care.png'),
    new Data('شنط واكسسوارات', 'imges/bags-accessories.png'),
    new Data('الإلكترونيات', 'imges/electronics.png'),
    new Data('المنزل والمطبخ', 'imges/home-kitchen.png'),
    new Data('ألعاب الأطفال', 'imges/kids-toys.png'),
    new Data('العروض اليومية', 'imges/daily-deals.png'),
  ])

  const New_arrival = ref({
    title: t('category.newlyarrived'),
    products: [
      new Data('Product', imge1, '12.00 JD'),
      new Data('Product', imge1, '22.00 JD'),
      new Data('Product', imge1, '32.00 JD'),
      new Data('Product', imge1, '42.00 JD'),
      new Data('Product', imge1, '12.00 JD'),
      new Data('Product', imge1, '22.00 JD'),
      new Data('Product', imge1, '32.00 JD'),
      new Data('Product', imge1, '42.00 JD'),
    ],
  })

  const Variety = ref({
    title: t('Miscellaneous'),
    products: [
      new Data('مستلزمات يومية', imge1),
      new Data('فوانيس رمضان', imge2),
      new Data('أجهزة المطبخ', imge3),
      new Data('العبايات والجلاليب', imge4),
      new Data('العناية بالبشرة', imge5),
      new Data('مستلزمات يومية', imge1),
      new Data('فوانيس رمضان', imge2),
      new Data('أجهزة المطبخ', imge3),
      new Data('العبايات والجلاليب', imge4),
      new Data('العناية بالبشرة', imge5),
    ],
  })

  // Computed property for titles
  const computedTitles = computed(() => {
    return Object.values(titels.value)
  })

  const loaddata = async () => {
    try {
      // Fetch store data
      const storeResponse = await axios.get('api/home/get-stores')
      const data = storeResponse.data.data.data
      data.forEach((stor) => {
        if (stor.is_default) {
          Stor.value = stor
        }
      })

      // Fetch categories
      const categoryResponse = await axios.get(`api/home/get-categories/${Stor.value.id}`)
      categoryResponse.data.data.data.forEach((category) => {
        titels.value[category.id] = {
          name: localStorage.getItem('appLang') == 'en' ? category.name_en : category.name_ar || category.name_en,
          id: category.id,
        }
      })

      // Fetch banner slider images
      const bannerResponse = await axios.get('api/home/get-media-link')
      banners_slider.value = bannerResponse.data.data.map(item => ({
        url: item.url,
        id: item.id
      }))

      // Fetch store images
      if (Stor.value.media.length > 0) {
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

  onMounted(loaddata)
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
    background: linear-gradient(45deg, #6B7280, var(--main-text-color));
  }
</style>
