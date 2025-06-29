<template>
  <!-- main body -->
  <main class="bg-[#FAF7F0] min-h-[100vh]">
    <header>
      <Nav></Nav>
      <!-- products titels -->
      <div
        class="h-[58px] flex items-center place-content-evenly overflow-x-auto flex-nowrap text-white scrollbar-hide"
      >
        <div
          class="cursor-pointer titels font-sans bg-[var(--main-text-color)] h-[25px] min-w-[60px] sm:h-[28px] sm:min-w-[80px] md:h-[32px] md:min-w-[128px] text-[.5rem] sm:text-[.7rem] md:text-[1rem] text-center place-content-center font-bold rounded-md mr-1 md:mr-3"
          v-for="(title, index) in titels"
          @click="router.push({ path: '/SubCategory', query: { activetap: index } })"
        >
          {{ title }}
        </div>
        <div
          class="cursor-pointer titels font-sans bg-[var(--main-text-color)] h-[25px] min-w-[60px] sm:h-[28px] sm:min-w-[80px] md:h-[32px] md:min-w-[128px] text-[.5rem] sm:text-[.7rem] md:text-[1rem] text-center place-content-center font-bold rounded-md mr-1 md:mr-3"
          v-for="title in titels"
        >
          {{ title }}
        </div>
      </div>
      <!-- main banner -->
      <swiper
        :modules="[Autoplay]"
        :slides-per-view="1.5"
        :centered-slides="true"
        :space-between="20"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :speed="3000"
        grab-cursor
        class="my-swiper mt-6"
      >
        <swiper-slide v-for="(pro, index) in banners_slider" :key="index" class="flex justify-center">
          <img :src="pro" class="w-full h-auto max-w-[940px] max-h-[434px] object-contain mb-2" />
        </swiper-slide>
      </swiper>
    </header>
    <!-- main content -->
    <div class="contaner">
      <!-- section 1 -->
      <section class="mx-auto mt-16 w-[70%]">
        <!-- produts -->
        <div class="flex place-content-between pt-[35px]">
          <!-- img 1 -->
          <div class="produt-img w-[48%] bg-cover place-content-center items-center p-6 lg:p-12">
            <div class="text-white font-sans flex flex-col items-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
              <h2 class="font-bold font-sans text-[.6rem] sm:text-[1rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[3rem]">Home Slider</h2>
              <p class="text-center font-sans text-[8px] sm:text-[1rem] lg:text-[1.2rem]">Discover our exclusive deals</p>
              <button
                class="font-sans lg:px-[16px] lg:py-[8px] px-[8px] py-[4px] text-[8px] sm:text-[1rem] lg:text-[1.2rem] bg-[var(--main-text-color)] rounded-md"
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
        1280: { slidesPerView: 10 }
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
          <img src="../imges/banner2.png" alt="" class="w-[70%]" />
        </div>
        <!-- more products -->
        <!-- Exclusive_offers -->
        <productsSwiper :products="Exclusive_offers" />
        <!-- best_seller -->
        <productsSwiper :products="best_seller" />
        <!-- New_arrival -->
        <productsSwiper :products="New_arrival" />
      </section>
      <section class="max-w-full">
        <!-- Variety we chose for you -->
        <h1 class="lg:mt-24 xs:mt-12 mr-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">
          منوعات اخترناها لكم .
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
        <productsSwipertow :products="for_lady" />
        <!-- Variety we chose for you 2 -->
        <productsSwipertow :products="Variety" />
        <!-- For lady 2-->
        <productsSwipertow :products="for_lady" />
        <!-- Other products -->
      </section>
    </div>

    <!-- footer -->
    <Footer></Footer>
  </main>
</template>

<script setup>
  import { ref } from 'vue'
  import imge1 from '../imges/prand 1.png'
  import imge3 from '../imges/prand 3.png'
  import imge2 from '../imges/prand 2.png'
  import imge4 from '../imges/prand 4.png'
  import imge5 from '../imges/prand 5.png'
  import prand2_img from '../imges/prand 2_2.png'
  import banners_sliderimg from '../imges/banner slider.png'

  import productsSwiper from '../components/SwiperSlide/productsSwiper.vue'
  import productsSwipertow from '../components/SwiperSlide/porductsSwipertow.vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay } from 'swiper/modules'
  import { useRouter } from 'vue-router'

  import 'swiper/css'
  // components
  import Nav from '../components/nav.vue'
  import Footer from '../components/footer.vue'

  const router = useRouter()
  // constructor
  class Data {
    constructor(name = 'No name', img = '', price = '$$') {
      this.name = name
      this.img = img
      this.price = price
    }
  }
  const banners_slider = ref([banners_sliderimg, banners_sliderimg, banners_sliderimg, banners_sliderimg])
  const titels = ref([
    'ازياء',
    'القرطاسية',
    'جمال وعطور',
    'الصحة والتغذية',
    'الالكترونيات',
    'الجمال والعطور',
    'الصحة والتغذية',
  ])
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
  const Exclusive_offers = ref({
    title: 'عروض حصرية',
    products: [
      new Data('Product', imge2, '10.00 JD'),
      new Data('Product', imge2, '20.00 JD'),
      new Data('Product', imge2, '30.00 JD'),
      new Data('Product', imge2, '40.00 JD'),
      new Data('Product', imge2, '10.00 JD'),
      new Data('Product', imge2, '20.00 JD'),
      new Data('Product', imge2, '30.00 JD'),
      new Data('Product', imge2, '40.00 JD'),
    ],
  })
  const best_seller = ref({
    title: 'الأكثر مبيعاً',
    products: [
      new Data('Product', imge3, '15.00 JD'),
      new Data('Product', imge3, '25.00 JD'),
      new Data('Product', imge3, '35.00 JD'),
      new Data('Product', imge3, '45.00 JD'),
      new Data('Product', imge3, '15.00 JD'),
      new Data('Product', imge3, '25.00 JD'),
      new Data('Product', imge3, '35.00 JD'),
      new Data('Product', imge3, '45.00 JD'),
    ],
  })
  const New_arrival = ref({
    title: 'وصل حديثاً',
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
    title: 'منوعات اخترناها لكم',
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
  // const Variety2 = Variety.slice(0,4)
  const for_lady = ref({
    title: 'لكي سيدتي',
    products: [
      new Data('مستلزمات يومية', prand2_img),
      new Data('فوانيس رمضان', prand2_img),
      new Data('أجهزة المطبخ', prand2_img),
      new Data('العبايات والجلاليب', prand2_img),
      new Data('العناية بالبشرة', prand2_img),
      new Data('مستلزمات يومية', prand2_img),
      new Data('فوانيس رمضان', prand2_img),
      new Data('أجهزة المطبخ', prand2_img),
      new Data('العبايات والجلاليب', prand2_img),
      new Data('العناية بالبشرة', prand2_img),
    ],
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
</style>
