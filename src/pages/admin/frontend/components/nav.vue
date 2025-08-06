<template>
  <div>
    <!-- Mobile Top Navigation -->
    <nav class="h-[65px] bg-[#fff] flex py-[12.5px] px-[20px] md:hidden">
      <div class="w-full flex justify-between items-center">
        <!-- Logo -->
        <div class="main-logo cursor-pointer">
          <a class="flex place-content-center items-center">
            <img src="../../../../assets/shiftlogo.png" width="40" alt="shift7 logo" @click="router.push('/')" />
          </a>
        </div>

        <!-- Search Bar -->
        <div class="flex-grow flex items-center bg-gray-100 rounded-lg h-10 mx-2">
          <i class="fa-solid fa-magnifying-glass text-gray-500 px-3"></i>
          <input
            class="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            type="text"
            :placeholder="$t('search')"
          />
        </div>

        <!-- Icons (Cart and Language) -->
        <div class="flex items-center gap-2">
          <span @click="router.push({ name: 'Cart' })" class="icon-container bg-[#E6AC31] cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3547 4.09922C17.2359 3.95709 17.0602 3.87497 16.875 3.875H4.27187L3.88984 1.77656C3.78186 1.18219 3.26426 0.750087 2.66016 0.75H1.25C0.904822 0.75 0.625 1.02982 0.625 1.375C0.625 1.72018 0.904822 2 1.25 2H2.65625L4.65312 12.9602C4.71195 13.2852 4.8556 13.5889 5.06953 13.8406C4.24996 14.6061 4.14205 15.8674 4.81967 16.761C5.49729 17.6546 6.74093 17.891 7.69916 17.3084C8.6574 16.7257 9.01981 15.5128 8.53828 14.5H12.0867C11.9469 14.7927 11.8745 15.1131 11.875 15.4375C11.875 16.6456 12.8544 17.625 14.0625 17.625C15.2706 17.625 16.25 16.6456 16.25 15.4375C16.25 14.2294 15.2706 13.25 14.0625 13.25H6.49766C6.1956 13.25 5.9368 13.0339 5.88281 12.7367L5.63516 11.375H14.6977C15.6038 11.3749 16.3802 10.7267 16.5422 9.83516L17.4922 4.61172C17.5247 4.42894 17.4744 4.24115 17.3547 4.09922ZM7.5 15.4375C7.5 15.9553 7.08027 16.375 6.5625 16.375C6.04473 16.375 5.625 15.9553 5.625 15.4375C5.625 14.9197 6.04473 14.5 6.5625 14.5C7.08027 14.5 7.5 14.9197 7.5 15.4375ZM15 15.4375C15 15.9553 14.5803 16.375 14.0625 16.375C13.5447 16.375 13.125 15.9553 13.125 15.4375C13.125 14.9197 13.5447 14.5 14.0625 14.5C14.5803 14.5 15 14.9197 15 15.4375ZM15.3125 9.61172C15.2584 9.90978 14.9982 10.1261 14.6953 10.125H5.40781L4.49922 5.125H16.1258L15.3125 9.61172Z" fill="white"/>
            </svg>
          </span>
          <span class="icon-container bg-[#F2EDDE] cursor-pointer" @click="roggellLang">
            <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.509563 12.5V0.579999H8.18956V1.78H1.78956V5.924H7.86956V7.124H1.78956V11.3H8.18956V12.5H0.509563Z" fill="black"/>
            </svg>
          </span>
        </div>
      </div>
    </nav>

    <!-- Desktop Navigation -->
    <nav class="h-[65px] bg-[#fff] flex py-[12.5px] px-[20px] hidden md:flex">
      <div class="flex-[0_0_30%] h-[40px] gap-2 flex place-content-center items-center mx-4">
        <div class="main-logo w-[30%] cursor-pointer">
          <a class="flex place-content-center items-center">
            <img src="../../../../assets/shiftlogo.png" width="70" alt="shift7 logo" @click="router.push('/')" />
          </a>
        </div>
        <div
          @click="router.push('/stores')"
          class="rounded-md cursor-pointer h-[30px] w-[30%] md:h-[40px] bg-[var(--main-text-color)] text-white flex place-content-evenly items-center"
        >
          <div>
            <div class="font-[Arvo] text-[.3rem] mb-[2px] sm:text-[.3rem] lg:text-[.7rem]">
              SUPER
              <i class="fa-solid fa-signal text-[.3rem] lg:text-[.6rem]" style="color: white; transform: rotate(-90deg)"></i>
            </div>
            <div class="font-[Arvo] text-[.3rem] sm:text-[.5rem] lg:text-[.7rem]">MARKET</div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 20 20"
            fill="none"
            class="text-[.5rem] sm:text-[.9rem] lg:text-[1rem] hidden sm:block"
          >
            <path
              d="M15.835 5.83203H4.16829C3.94728 5.83203 3.73532 5.91983 3.57904 6.07611C3.42276 6.23239 3.33496 6.44435 3.33496 6.66536V17.4987C3.33496 17.7197 3.42276 17.9317 3.57904 18.088C3.73532 18.2442 3.94728 18.332 4.16829 18.332H15.835C16.056 18.332 16.2679 18.2442 16.4242 18.088C16.5805 17.9317 16.6683 17.7197 16.6683 17.4987V6.66536C16.6683 6.44435 16.5805 6.23239 16.4242 6.07611C16.2679 5.91983 16.056 5.83203 15.835 5.83203Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.08496 7.49935V4.58268C7.08496 4.19966 7.1604 3.82039 7.30698 3.46652C7.45355 3.11266 7.6684 2.79113 7.93923 2.52029C8.21007 2.24945 8.5316 2.03461 8.88547 1.88803C9.23933 1.74146 9.61861 1.66602 10.0016 1.66602C10.3846 1.66602 10.7639 1.74146 11.1178 1.88803C11.4717 2.03461 11.7932 2.24945 12.064 2.52029C12.3349 2.79113 12.5497 3.11266 12.6963 3.46652C12.8429 3.82039 12.9183 4.19966 12.9183 4.58268V7.49935"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div
          class="rounded-md cursor-pointer bg-[#E6AC31] h-[30px] w-[30%] md:h-[40px] text-white flex place-content-evenly items-center"
        >
          <div>
            <div class="font-[Arvo] text-[.3rem] mb-[2px] tracking-wider font-black sm:text-[.3rem] lg:text-[.7rem]">
              MALL
              <i class="fa-solid fa-signal text-[.3rem] lg:text-[.6rem]" style="color: white; transform: rotate(-90deg)"></i>
            </div>
            <div class="font-[Arvo] tracking-widest font-black text-[.3] text-[.3rem] sm:text-[.5rem] lg:text-[.7rem]">SHIFT7</div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 20 20"
            fill="none"
            class="text-[.5rem] sm:text-[.9rem] lg:text-[1rem] hidden sm:block"
          >
            <path
              d="M15.835 5.83203H4.16829C3.94728 5.83203 3.73532 5.91983 3.57904 6.07611C3.42276 6.23239 3.33496 6.44435 3.33496 6.66536V17.4987C3.33496 17.7197 3.42276 17.9317 3.57904 18.088C3.73532 18.2442 3.94728 18.332 4.16829 18.332H15.835C16.056 18.332 16.2679 18.2442 16.4242 18.088C16.5805 17.9317 16.6683 17.7197 16.6683 17.4987V6.66536C16.6683 6.44435 16.5805 6.23239 16.4242 6.07611C16.2679 5.91983 16.056 5.83203 15.835 5.83203Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.08496 7.49935V4.58268C7.08496 4.19966 7.1604 3.82039 7.30698 3.46652C7.45355 3.11266 7.6684 2.79113 7.93923 2.52029C8.21007 2.24945 8.5316 2.03461 8.88547 1.88803C9.23933 1.74146 9.61861 1.66602 10.0016 1.66602C10.3846 1.66602 10.7639 1.74146 11.1178 1.88803C11.4717 2.03461 11.7932 2.24945 12.064 2.52029C12.3349 2.79113 12.5497 3.11266 12.6963 3.46652C12.8429 3.82039 12.9183 4.19966 12.9183 4.58268V7.49935"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="w-[70%] flex place-content-between items-center">
        <div class="flex-grow flex items-center bg-gray-100 rounded-lg h-10">
          <i
            class="fa-solid fa-magnifying-glass text-gray-500 px-3"
          ></i>
          <input
            class="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            type="text"
            :placeholder="$t('search')"
          />
        </div>
        <div class="flex items-center ml-4 gap-4">
          <span
            class="icon-container bg-[var(--main-text-color)] cursor-pointer mr-2 "
            @click="authlogin ? router.push({ name: 'profile' }) : router.push({ name: 'authlog' })"
          >
          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0406 15.0625C15.8508 13.0055 14.0172 11.5305 11.8773 10.8313C14.053 9.53609 15.0951 6.94698 14.4235 4.50575C13.7518 2.06451 11.5319 0.372875 9 0.372875C6.46806 0.372875 4.24816 2.06451 3.57652 4.50575C2.90487 6.94698 3.94704 9.53609 6.12266 10.8313C3.98281 11.5297 2.14922 13.0047 0.959375 15.0625C0.840586 15.2562 0.836273 15.4991 0.948109 15.6969C1.05995 15.8947 1.27031 16.0162 1.49752 16.0142C1.72473 16.0123 1.93298 15.8872 2.04141 15.6875C3.51328 13.1438 6.11484 11.625 9 11.625C11.8852 11.625 14.4867 13.1438 15.9586 15.6875C16.067 15.8872 16.2753 16.0123 16.5025 16.0142C16.7297 16.0162 16.9401 15.8947 17.0519 15.6969C17.1637 15.4991 17.1594 15.2562 17.0406 15.0625ZM4.625 6C4.625 3.58375 6.58375 1.625 9 1.625C11.4162 1.625 13.375 3.58375 13.375 6C13.375 8.41625 11.4162 10.375 9 10.375C6.58483 10.3724 4.62758 8.41517 4.625 6Z" fill="white"/>
          </svg>

            <i class="pi pi-user text-white"></i>
          </span>
          <span @click="router.push({ name: 'Cart' })" class="icon-container bg-[#E6AC31] cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3547 4.09922C17.2359 3.95709 17.0602 3.87497 16.875 3.875H4.27187L3.88984 1.77656C3.78186 1.18219 3.26426 0.750087 2.66016 0.75H1.25C0.904822 0.75 0.625 1.02982 0.625 1.375C0.625 1.72018 0.904822 2 1.25 2H2.65625L4.65312 12.9602C4.71195 13.2852 4.8556 13.5889 5.06953 13.8406C4.24996 14.6061 4.14205 15.8674 4.81967 16.761C5.49729 17.6546 6.74093 17.891 7.69916 17.3084C8.6574 16.7257 9.01981 15.5128 8.53828 14.5H12.0867C11.9469 14.7927 11.8745 15.1131 11.875 15.4375C11.875 16.6456 12.8544 17.625 14.0625 17.625C15.2706 17.625 16.25 16.6456 16.25 15.4375C16.25 14.2294 15.2706 13.25 14.0625 13.25H6.49766C6.1956 13.25 5.9368 13.0339 5.88281 12.7367L5.63516 11.375H14.6977C15.6038 11.3749 16.3802 10.7267 16.5422 9.83516L17.4922 4.61172C17.5247 4.42894 17.4744 4.24115 17.3547 4.09922ZM7.5 15.4375C7.5 15.9553 7.08027 16.375 6.5625 16.375C6.04473 16.375 5.625 15.9553 5.625 15.4375C5.625 14.9197 6.04473 14.5 6.5625 14.5C7.08027 14.5 7.5 14.9197 7.5 15.4375ZM15 15.4375C15 15.9553 14.5803 16.375 14.0625 16.375C13.5447 16.375 13.125 15.9553 13.125 15.4375C13.125 14.9197 13.5447 14.5 14.0625 14.5C14.5803 14.5 15 14.9197 15 15.4375ZM15.3125 9.61172C15.2584 9.90978 14.9982 10.1261 14.6953 10.125H5.40781L4.49922 5.125H16.1258L15.3125 9.61172Z" fill="white"/>
            </svg>
          </span>
          <span class="icon-container bg-[#F2EDDE] cursor-pointer " @click="roggellLang">
            <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.509563 12.5V0.579999H8.18956V1.78H1.78956V5.924H7.86956V7.124H1.78956V11.3H8.18956V12.5H0.509563Z" fill="black"/>
            </svg>
          </span>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 z-50 md:hidden">
      <div class="flex h-full justify-around items-center">
        <div @click="router.push('/')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer">
          <i class="fa-solid fa-house text-xl mb-1"></i>
          <span class="text-xs">{{ $t('الرئيسية') }}</span>
        </div>
        <div @click="router.push('/categories')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer">
          <i class="fa-solid fa-grip text-xl mb-1"></i>
          <span class="text-xs">{{ $t('الفئات') }}</span>
        </div>
        <div @click="router.push('/fashion')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer">
          <i class="fa-solid fa-shirt text-xl mb-1"></i>
          <span class="text-xs">{{ $t('الموضة') }}</span>
        </div>
        <div
          @click="authlogin ? router.push({ name: 'profile' }) : router.push({ name: 'authlog' })"
          class="flex flex-col items-center justify-center text-gray-600 cursor-pointer"
        >
          <i class="fa-solid fa-user text-xl mb-1"></i>
          <span class="text-xs">{{ $t('حسابي') }}</span>
        </div>
        <div @click="router.push('/stores')" class="flex flex-col items-center justify-center text-gray-600 cursor-pointer">
          <i class="fa-solid fa-store text-xl mb-1"></i>
          <span class="text-xs">{{ $t('الماركت') }}</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authlogin = ref(false);
const router = useRouter();
const lang = localStorage.getItem('appLang') || 'en';

const roggellLang = () => {
  const currentLang = localStorage.getItem('appLang') || 'en';
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('appLang', newLang);
  window.location.reload();
};
</script>

<style scoped>
.icon-container {
  @apply flex place-content-center p-[5%] rounded-md items-center text-[.5rem] h-[20px] w-[20px] sm:text-[.8rem] sm:h-[30px] sm:w-[30px] md:text-[1rem] md:h-[40px] md:w-[40px];
}
</style>
