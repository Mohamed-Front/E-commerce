<template>
  <!-- path -->
  <h1 class="text-lg mb-20">
    <span class="text-[var(--main-text-color)] cursor-pointer" @click="router.push('/')"
      >{{ $t('navigation.home') }} /</span
    >
    {{ catagoryesName[activetap]?.name }}
  </h1>

  <!-- catagorys taps -->
  <div class="relative w-full border-b border-gray-300 overflow-x-auto whitespace-nowrap">
    <div class="flex justify-evenly">
      <div
        v-for="catagory in catagoryesName"
        :key="catagory.id"
        :ref="(el) => (tabs[catagory.id] = el)"
        class="px-4 py-2 sm:text-sm text-[.6rem] font-bold cursor-pointer flex-shrink-0 transition-all duration-300"
        :class="{
          'text-[var(--main-text-color)]': catagory.id === activetap,
          'text-gray-500': catagory.id !== activetap,
        }"
        @click="activecatagory(catagory.id)"
      >
        {{ catagory.name }}
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
        @click="router.push({ path: '/SubSubCategory', query: { activeproduct: pro.name, activetap: activetap } })"
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
  <Exclusiveoffers :Stor="Stor" />
  <!-- best_seller -->
  <bestSellers :Stor="Stor" />
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
  import Exclusiveoffers from '../../components/products/Exclusiveoffers.vue'
  import bestSellers from '../../components/products/bestSellers.vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const tabs = ref([])
  const underlineStyle = ref({})
  const activetap = ref(+route.query.activetap || 0)
  const catagoryesName = ref({})
  const Stor = ref({ id: route.query.stor || 1 })
  const loaddata = () => {
    axios.get(`api/home/get-categories/${Stor.value.id}`).then((response) => {
      response.data.data.data.forEach((category) => {
        catagoryesName.value[category.id] = {
          name: localStorage.getItem('appLang') == 'en' ? category.name_en : category.name_ar || category.name_en,
          id: category.id,
        }
      })
    })
  }

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
    router.push({ query: { ...route.query, activetap: index } })
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
    loaddata()
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
