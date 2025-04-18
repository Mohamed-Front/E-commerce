<template>
  <!-- main body -->
  <main class="bg-[#FAF7F0] min-h-[100vh]">
    <header>
      <Nav></Nav>
      <!-- products titels -->
      <div class="h-[58px] flex items-center place-content-evenly overflow-x-auto flex-nowrap scrollbar-hide">
        <div
          class="titels font-sans bg-[#E6AC31] h-[25px] min-w-[60px] sm:h-[28px] sm:min-w-[80px] md:h-[32px] md:min-w-[128px] text-[.5rem] sm:text-[.7rem] md:text-[1rem] text-center place-content-center font-bold rounded-md mr-1 md:mr-3"
          v-for="title in titels">{{ title }}</div>
        <div
          class="titels font-sans bg-[#E6AC31] h-[25px] min-w-[60px] sm:h-[28px] sm:min-w-[80px] md:h-[32px] md:min-w-[128px] text-[.5rem] sm:text-[.7rem] md:text-[1rem] text-center place-content-center font-bold rounded-md mr-1 md:mr-3"
          v-for="title in titels">{{ title }}</div>
      </div>
      <!-- main banner -->
      <img src="../imges/banner.png" alt="main banner" class="w-full">
    </header>
    <!-- main content -->
    <div class="contaner">
      <!-- section 1 -->
      <section class="mx-auto mt-16 w-[70%]">
        <!-- produts -->
        <div class="flex place-content-between pt-[35px]">
          <!-- img 1 -->
          <div class="produt-img w-[48%] h-[257px] bg-cover place-content-center items-center">
            <div class="text-center text-white font-sans">
              <h2 class="font-bold font-sans sm:text-[2rem] lg:text-[3rem]">Home Slider</h2>
              <p class="my-6 font-sans text-[12px] sm:text-[1rem] lg:text-[1.2rem]">Discover our exclusive deals</p>
              <button
                class="font-sans px-[16px] py-[8px] text-[10px] sm:text-[1rem] lg:text-[1.2rem] bg-[#E5AD30] rounded-md">Shop
                Now</button>
            </div>
          </div>
          <!-- img 2 -->
          <div class="produt-img w-[48%] h-[257px] bg-cover"></div>
        </div>
        <!-- products -->
        <div class="bg-[#E6AC312B] w-full overflow-x-auto py-4 scrollbar-hide">
          <div class="flex space-x-4 px-4 w-max ">
            <div v-for="(pro, index) in product_titels" :key="index"
              class="pro flex-shrink-0 w-24 xs:w-[70px] text-center flex flex-col items-center">
              <img src="../imges/image.png" :alt="pro" class="w-20 h-20 xs:h-16 xs:w-16 object-contain mb-2">
              <p class="font-sans text-xs font-bold truncate w-full">{{ pro }}</p>
            </div>
            <div v-for="(pro, index) in product_titels" :key="index"
              class="pro flex-shrink-0 w-24 xs:w-[70px] text-center flex flex-col items-center">
              <img src="../imges/image.png" :alt="pro" class="w-20 h-20 xs:h-16 xs:w-16 object-contain mb-2">
              <p class="font-sans text-xs font-bold truncate w-full">{{ pro }}</p>
            </div>
          </div>
        </div>
        <!-- banner -->
        <div class="h-[143px] flex place-content-center items-center">
          <img src="../imges/banner2.png" alt="" class="w-[70%]">
        </div>
        <!-- more products -->
        <!-- Exclusive_offers -->
        <h2 class="font-bold font-sans lg:mt-8 xs:mt-2 xs:text-[.7rem] sm:text-[.9rem] md:text-[1.1rem]">عروض حصرية</h2>
        <div class="mt-6 grid grid-cols-4 gap-4">
          <div class="text-end" v-for="(pro, i) in Exclusive_offers" :key="i">
            <img src="../imges/prod2.png" alt="">
            <p class="font-sans mt-2 mb-1 xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.name + " " +
              Number(i + 1) }}</p>
            <span class="font-sans text-[#A6853B] xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.price }}</span>
          </div>
        </div>
        <!-- best_seller -->
        <h2 class="font-bold font-sans lg:mt-20 xs:mt-10 xs:text-[.7rem] sm:text-[.9rem] md:text-[1.1rem]">الاكثر مبيعاً
        </h2>
        <div class="mt-6 grid grid-cols-4 gap-4">
          <div class="text-end" v-for="(pro, i) in best_seller" :key="i">
            <img src="../imges/prod3.png" alt="">
            <p class="font-sans mt-2 mb-1 xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.name + " " +
              Number(i + 5) }}</p>
            <span class="font-sans text-[#A6853B] xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.price }}</span>
          </div>
        </div>
        <!-- New_arrival -->
        <h2 class="font-bold font-sans lg:mt-20 xs:mt-10 xs:text-[.7rem] sm:text-[.9rem] md:text-[1.1rem]">وصل حديثاً
        </h2>
        <div class="mt-6 grid grid-cols-4 gap-4">
          <div class="text-end" v-for="(pro, i) in New_arrival" :key="i">
            <img src="../imges/prod4.png" alt="">
            <p class="font-sans mt-2 mb-1 xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.name + " " +
              Number(i + 9) }}</p>
            <span class="font-sans text-[#A6853B] xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem]">{{ pro.price }}</span>
          </div>
        </div>
      </section>
      <section class="max-w-full">
        <!-- Variety we chose for you -->
        <h1 class="lg:mt-24 xs:mt-12 mr-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">منوعات
          اخترناها لكم .</h1>
        <div class="max-h-[873px] bg-[#E6AC31] mt-3 grid grid-flow-row-2 grid-cols-5 gap-2   p-4">
          <div class="bg-white text-center rounded-md pb-3" v-for="pro in Variety">
            <img :src="pro.img" alt="" class="h-[87%] rounded-md">
            <p
              class="text-[#E29A30] font-bold m-[calc((12%)/2)] xs:text-[.3rem] sm:text-[.5rem] md:text-[.7rem] lg:text-[1rem]  p-2">
              {{ pro.name }}</p>
          </div>
        </div>
        <!-- For lady -->
        <h1 class="lg:mt-24 xs:mt-12 mr-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">لكي
          سيدتي</h1>
        <div class="max-h-[405px] mt-3 grid grid-flow-row-1 grid-cols-5 gap-2 p-4">
          <div class="bg-white text-center rounded-md" v-for="pro in for_lady">
            <img :src="pro.img" alt="" class="h-[87%] rounded-md">
            <p
              class="text-[#E29A30] font-bold m-[calc((13%)/2)] xs:text-[.3rem] sm:text-[.5rem] md:text-[.7rem] lg:text-[1rem]">
              {{ pro.name }}</p>
          </div>
        </div>
        <!-- Variety we chose for you 2 -->
        <h1 class="lg:mt-24 xs:mt-12 mr-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">منوعات
          اخترناها لكم</h1>
        <div class="max-h-[405px] mt-3 grid grid-flow-row-1 grid-cols-5 gap-2 p-4">
          <div class="bg-white text-center rounded-md pb-3" v-for="pro in Variety.slice(0, 5)">
            <img :src="pro.img" alt="" class="h-[87%] rounded-md">
            <p
              class="text-[#E29A30] font-bold m-[calc((13%)/2)] xs:text-[.3rem] sm:text-[.5rem] md:text-[.7rem] lg:text-[1rem] p-2">
              {{ pro.name }}</p>
          </div>
        </div>
        <!-- For lady 2-->
        <h1 class="lg:mt-24 xs:mt-12 mr-4 font-bold font-sans xs:text-[.9rem] sm:text-[1.3rem] md:text-[1.8rem]">لكي
          سيدتي</h1>
        <div class="max-h-[405px] mt-3 grid grid-flow-row-1 grid-cols-5 gap-2 p-4">
          <div class="bg-white text-center rounded-md" v-for="pro in for_lady">
            <img :src="pro.img" alt="" class="h-[87%] rounded-md">
            <p
              class="text-[#E29A30] font-bold m-[calc((13%)/2)] xs:text-[.3rem] sm:text-[.5rem] md:text-[.7rem] lg:text-[1rem]">
              {{ pro.name }}</p>
          </div>
        </div>
        <!-- Other products -->
      </section>
    </div>
    <footer
      class="max-h-[211px] flex flex-col justify-center items-center gap-4 fixed bottom-0 w-full p-6 bg-[#FAF7F0] text-[#A17D1C] font-semibold 24 xs:text-[.5rem] sm:text-[.7rem] md:text-[1rem] lg:text-[1rem]">
      <div class="flex justify-evenly items-center gap-4 w-3/4">
        <p><a href="#">Shift7 Mall</a></p>
        <p><a href="#">Shift7 Market</a></p>
        <p><a href="#">Centro</a></p>
        <p><a href="#">Yasser Mall</a></p>
      </div>
      <!-- <div><i class="fa-brands fa-instagram" style="color: #A17D1C;"></i> <i class="fa-brands fa-twitter"
          style="color: #A17D1C;"></i> <i class="fa-brands fa-facebook" style="color: #A17D1C;"></i></div> -->
      <p>© 2025 Shift7</p>
    </footer>

  </main>
</template>


<script setup>
import { ref } from 'vue';
import imge1 from '../imges/prand 1.png'
import imge2 from '../imges/prand 2.png'
import imge3 from '../imges/prand 3.png'
import imge4 from '../imges/prand 4.png'
import imge5 from '../imges/prand 5.png'
import prand2_img from '../imges/prand 2_2.png'

import Nav from '../components/nav.vue';
const titels = ref(["ازياء", "القرطاسية", "جمال وعطور", "الصحة والتغذية", "الالكترونيات", "الجمال والعطور", "الصحة والتغذية"])
const product_titels = ref(["العناية الشخصية", "ازياء النساء", "ازياء الرجال", "العناية بالبشرة", "العناية بالشعر", "شنط واكسسوارات", "العناية الشخصية", "ازياء النساء"])
const Exclusive_offers = ref([
  { name: "Product", img: "../imges/prod.png", price: "10.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "20.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "30.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "40.00 JD" }
]);
const best_seller = ref([
  { name: "Product", img: "../imges/prod.png", price: "15.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "25.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "35.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "45.00 JD" }
]);
const New_arrival = ref([
  { name: "Product", img: "../imges/prod.png", price: "12.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "22.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "32.00 JD" },
  { name: "Product", img: "../imges/prod.png", price: "42.00 JD" }
]);
const Variety = ref([
  { name: "مستلزمات يومية", img: imge1 },
  { name: "فوانيس رمضان", img: imge2 },
  { name: "أجهزة المطبخ", img: imge3 },
  { name: "العبايات والجلاليب", img: imge4 },
  { name: "العناية بالبشرة", img: imge5 },
  { name: "مستلزمات يومية", img: imge1 },
  { name: "فوانيس رمضان", img: imge2 },
  { name: "أجهزة المطبخ", img: imge3 },
  { name: "العبايات والجلاليب", img: imge4 },
  { name: "العناية بالبشرة", img: imge5 },
]);
// const Variety2 = Variety.slice(0,4)
const for_lady = ref([
  { name: "مستلزمات يومية", img: prand2_img },
  { name: "فوانيس رمضان", img: prand2_img },
  { name: "أجهزة المطبخ", img: prand2_img },
  { name: "العبايات والجلاليب", img: prand2_img },
  { name: "العناية بالبشرة", img: prand2_img },
])
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
</style>