<template>
  <!-- contaner -->
  <div class="mx-auto mt-16 w-[70%]">
    <div class="flex justify-between items-center text-center gap-2">
      <div v-for="market in markets">
        <img :src="market.img" alt="" class="rounded-lg" />
        <h1 class="text-[clamp(.6rem,2vw,1.3rem)]">{{ market.title }}</h1>
        <p class="text-[var(--main-text-color)] text-[clamp(.4rem,1vw,.8rem)]">All Categories</p>
      </div>
    </div>
    <section>
      <!-- banner -->
      <img src="../imges/banner-addtion.png" alt="" class="mt-28" />
      <!-- products -->
      <div class="flex place-content-between pt-[35px]">
        <!-- img 1 -->
        <div class="produt-img w-[48%] bg-cover place-content-center items-center p-6 lg:p-12">
          <div class="text-white font-sans flex flex-col items-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
            <h2 class="font-bold font-sans text-[.4rem] sm:text-[.7rem] md:text-[1rem] lg:text-[1.3rem] xl:text-[1.8rem]">
              Home Slider
            </h2>
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
      <!-- Exclusive_offers -->
      <productsSwiper :products="Exclusive_offers" />
      <!-- best_seller -->
      <productsSwiper :products="best_seller" />
      <!-- New_arrival -->
      <productsSwiper :products="New_arrival" />
    </section>
  </div>
</template>

<script setup>
  // components
  import productsSwiper from '../components/SwiperSlide/productsSwiper.vue'

  import imge1 from '../imges/prand 1.png'
  import imge2 from '../imges/prand 2.png'
  import imge3 from '../imges/prand 3.png'
  import imge5 from '../imges/prand 5.png'

  import { ref } from 'vue'

  class Data {
    constructor(name = 'No name', img = '', price = '$$') {
      this.name = name
      this.img = img
      this.price = price
    }
  }

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
  const markets = ref([
    {
      title: 'Shift market',
      img: imge5,
    },
    {
      title: 'Centro market',
      img: imge5,
    },
    {
      title: 'Yasser Mall',
      img: imge5,
    },
  ])
</script>

<style scoped>
  .produt-img {
    background-image: url(../imges/img1.png);
  }
</style>
