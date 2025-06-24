<template>
  <!-- path -->
  <h1 class="text-lg mb-20">
    <span class="text-[var(--main-text-color)] cursor-pointer" @click="router.push('/')"
      >{{ $t('navigation.home') }} /</span
    >
    <span class="cursor-pointer" @click="router.push({ path: '/SubCategory', query: { activetap: activetap } })">{{
      catagoryesName[activetap]
    }}</span>
    / {{ route.query.activeproduct }}
  </h1>

  <!-- catagorys taps -->
  <div class="relative w-full border-b border-gray-300 overflow-x-auto whitespace-nowrap">
    <div class="flex justify-evenly">
      <div
        v-for="(catagory, index) in catagoryesName"
        :key="index"
        :ref="(el) => (tabs[index] = el)"
        class="px-4 py-2 sm:text-sm text-[.6rem] font-bold cursor-pointer flex-shrink-0 transition-all duration-300"
        :class="{
          'text-[var(--main-text-color)]': index === activetap,
          'text-gray-500': index !== activetap,
        }"
        @click="activecatagory(index)"
      >
        {{ catagory }}
      </div>
    </div>

    <!-- underline -->
    <div
      class="absolute bottom-0 h-[2px] bg-[var(--main-text-color)] transition-all duration-300"
      :style="underlineStyle"
    ></div>
  </div>

  <swiper
    :modules="[Autoplay]"
    :slides-per-view="4.5"
    :space-between="8"
    :loop="true"
    :autoplay="{ delay: 0, disableOnInteraction: false }"
    :speed="25000"
    grab-cursor
    class="max-h-[405px] mt-3 p-4 w-[95%]"
  >
    <SwiperSlide v-for="(pro, index) in mainProducts">
      <div
        :style="{ backgroundImage: `url(\'${pro.img}\')` }"
        class="relative bg-cover bg-center h-[148px] w-full rounded-md cursor-pointer"
        @click="router.push({ path: '/SubSubCategory', query: { activeproduct: pro.name } })"
      >
        <h1
          class="absolute top-[50%] text-center w-full text-white font-bold lg:text-xl md:text-lg sm:text-md text-xs translate-y-[-50%]"
        >
          {{ pro.name }}
        </h1>
      </div>
    </SwiperSlide>
  </swiper>
  <img :src="banner" class="mt-[36px]" />

  <!-- Exclusive_offers -->
  <productsSwiper :products="Exclusive_offers" />
  <!-- best_seller -->
  <productsSwiper :products="best_seller" />
  <!-- New_arrival -->
  <productsSwiper :products="New_arrival" />

  <img :src="banner" class="mt-[36px]" />

  <!-- Variety we chose for you -->
  <productsSwipertow :products="Variety" />
  <productsSwipertow :products="Variety" />
</template>

<script setup>
  import { ref, onMounted, nextTick, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay } from 'swiper/modules'

  // images
  import imge1 from '../../imges/prand 1.png'
  import imge2 from '../../imges/prand 2.png'
  import imge3 from '../../imges/prand 3.png'
  import banner from '../../imges/banner.png'

  // components
  import productsSwiper from '../../components/SwiperSlide/productsSwiper.vue'
  import productsSwipertow from '../../components/SwiperSlide/porductsSwipertow.vue'

  const route = useRoute()
  const router = useRouter()

  const tabs = ref([])
  const underlineStyle = ref({})
  const activetap = ref(+route.query.activetap || 0)
  const catagoryesName = ref([
    'ازياء',
    'القرطاسية',
    'جمال وعطور',
    'الصحة والتغذية',
    'الالكترونيات',
    'الجمال والعطور',
    'الصحة والتغذية',
  ])
  const mainProducts = ref([
    {
      name: 'العناية بالبشرة',
      img: imge1,
    },
    {
      name: 'العناية بالبشرة',
      img: imge3,
    },
    {
      name: 'العناية بالبشرة',
      img: imge2,
    },
    {
      name: 'العناية بالبشرة',
      img: imge1,
    },
    {
      name: 'العناية بالبشرة',
      img: imge2,
    },
    {
      name: 'العناية بالبشرة',
      img: imge3,
    },
    {
      name: 'العناية بالبشرة',
      img: imge1,
    },
    {
      name: 'العناية بالبشرة',
      img: imge2,
    },
  ])

  class Data {
    constructor(name = 'No name', img = '', price = '$$') {
      this.name = name
      this.img = img
      this.price = price
    }
  }
  // Data for products
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
      new Data('العبايات والجلاليب', imge3),
      new Data('العناية بالبشرة', imge3),
      new Data('مستلزمات يومية', imge1),
      new Data('فوانيس رمضان', imge2),
      new Data('أجهزة المطبخ', imge3),
      new Data('العبايات والجلاليب', imge3),
      new Data('العناية بالبشرة', imge3),
    ],
  })
  // active catagory
  const activecatagory = (index) => {
    activetap.value = index
    router.push({ path: '/SubCategory', query: { activetap: activetap.value } })
  }

  const updateUnderline = () => {
    const el = tabs.value[activetap.value]
    const lang = localStorage.getItem('appLang') || 'en'

    if (el) {
      const parent = el.offsetParent
      if (lang === 'ar') {
        const rightOffset = parent.offsetWidth - (el.offsetLeft + el.offsetWidth)
        underlineStyle.value = {
          width: `${el.offsetWidth}px`,
          transform: `translateX(-${rightOffset}px)`,
        }
      } else {
        underlineStyle.value = {
          width: `${el.offsetWidth}px`,
          transform: `translateX(${el.offsetLeft}px)`,
        }
      }
    }
  }

  onMounted(() => {
    nextTick(updateUnderline)
  })

  watch(activetap, () => {
    nextTick(updateUnderline)
  })
</script>

<style scoped>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
