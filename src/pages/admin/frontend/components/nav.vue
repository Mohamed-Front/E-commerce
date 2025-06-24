<template>
  <!-- main navbar -->
  <nav class="h-[65px] bg-[#fff] flex py-[12.5px] px-[20px]">
    <!-- section 1 -->
    <div class="min-w-[30%] h-[40px] gap-2 flex place-content-center items-center ml-4">
      <!-- logo -->
      <div class="main-logo w-[30%] cursor-pointer">
        <a class="flex place-content-center items-center"
          ><img src="../../../../assets/shiftlogo.png.png" width="70" alt="shift7 logo" @click="router.push('/')"
        /></a>
      </div>
      <!-- Super Market store -->
      <div
        @click="router.push('/stores')"
        class="rounded-md cursor-pointer h-[30px] w-[30%] md:h-[40px] bg-[var(--main-text-color)] text-white flex place-content-evenly items-center"
      >
        <!-- Market text -->
        <div>
          <div class="font-[Arvo] text-[.3rem] mb-[2px] sm:text-[.3rem] lg:text-[.7rem]">
            SUPER
            <i
              class="fa-solid fa-signal text-[.3rem] lg:text-[.6rem]"
              style="color: white; transform: rotate(-90deg)"
            ></i>
          </div>
          <div class="font-[Arvo] text-[.3rem] sm:text-[.5rem] lg:text-[.7rem]">MARKET</div>
        </div>
        <!-- Market icon -->

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 20 20"
          fill="none"
          class="text-[.5rem] sm:text-[.9rem] lg:text-[1rem]"
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
      <!-- SHIFT 7 Mall -->
      <div
        class="rounded-md cursor-pointer bg-[#E6AC31] h-[30px] w-[30%] md:h-[40px] text-white flex place-content-evenly items-center"
      >
        <!-- text Mall -->
        <div>
          <div class="font-[Arvo] text-[.3rem] mb-[2px] tracking-wider font-black sm:text-[.3rem] lg:text-[.7rem]">
            MALL
            <i
              class="fa-solid fa-signal text-[.3rem] lg:text-[.6rem]"
              style="color: white; transform: rotate(-90deg)"
            ></i>
          </div>
          <div class="font-[Arvo] tracking-widest font-black text-[.3] text-[.3rem] sm:text-[.5rem] lg:text-[.7rem]">
            SHIFT7
          </div>
        </div>
        <!-- Mall icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 20 20"
          fill="none"
          class="text-[.5rem] sm:text-[.9rem] lg:text-[1rem]"
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
    <!-- section 2 -->
    <div class="w-[70%] flex place-content-between items-center">
      <!-- nav search -->
      <i
        class="fa-solid fa-magnifying-glass rounded-l-md w-[20px] h-[20px] sm:w-[30px] text-[.7rem] sm:text-[1rem] sm:h-[30px] md:h-[40px] md:w-[40px] bg-[#F2EDDE] text-center place-content-center"
        style="color: #a6853b"
      ></i>
      <!-- nav search input -->
      <div class="w-[80%] rounded-r-md">
        <input
          class="pr-2 sm:h-[30px] md:h-[40px] w-[90%] h-[20px] text-[.4rem] sm:text-[.7rem] md:text-[1rem] text-[#A6853B] font-bold placeholder:text-[#A6853B] placeholder:font-bold focus:outline-none bg-[#F2EDDE]"
          type="text"
          :placeholder="$t('search')"
        />
      </div>
      <!-- nav other -->
      <div class="w-[30%] flex md:justify-end md:gap-2 gap-1 justify-evenly items-center place-content-end">
        <span class="icon-container bg-[var(--main-text-color)] cursor-pointer"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.0406 15.5625C15.8508 13.5055 14.0172 12.0305 11.8773 11.3313C14.053 10.0361 15.0951 7.44698 14.4235 5.00575C13.7518 2.56451 11.5319 0.872875 9 0.872875C6.46806 0.872875 4.24816 2.56451 3.57652 5.00575C2.90487 7.44698 3.94704 10.0361 6.12266 11.3313C3.98281 12.0297 2.14922 13.5047 0.959375 15.5625C0.840586 15.7562 0.836273 15.9991 0.948109 16.1969C1.05995 16.3947 1.27031 16.5162 1.49752 16.5142C1.72473 16.5123 1.93298 16.3872 2.04141 16.1875C3.51328 13.6438 6.11484 12.125 9 12.125C11.8852 12.125 14.4867 13.6438 15.9586 16.1875C16.067 16.3872 16.2753 16.5123 16.5025 16.5142C16.7297 16.5162 16.9401 16.3947 17.0519 16.1969C17.1637 15.9991 17.1594 15.7562 17.0406 15.5625ZM4.625 6.5C4.625 4.08375 6.58375 2.125 9 2.125C11.4162 2.125 13.375 4.08375 13.375 6.5C13.375 8.91625 11.4162 10.875 9 10.875C6.58483 10.8724 4.62758 8.91517 4.625 6.5Z"
              fill="#fff"
            /></svg
        ></span>
        <span class="icon-container bg-[#E6AC31] cursor-pointer"
          ><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 18 18" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.3547 3.59922C17.2359 3.45709 17.0602 3.37497 16.875 3.375H4.27187L3.88984 1.27656C3.78186 0.682187 3.26426 0.250087 2.66016 0.25H1.25C0.904822 0.25 0.625 0.529822 0.625 0.875C0.625 1.22018 0.904822 1.5 1.25 1.5H2.65625L4.65312 12.4602C4.71195 12.7852 4.8556 13.0889 5.06953 13.3406C4.24996 14.1061 4.14205 15.3674 4.81967 16.261C5.49729 17.1546 6.74093 17.391 7.69916 16.8084C8.6574 16.2257 9.01981 15.0128 8.53828 14H12.0867C11.9469 14.2927 11.8745 14.6131 11.875 14.9375C11.875 16.1456 12.8544 17.125 14.0625 17.125C15.2706 17.125 16.25 16.1456 16.25 14.9375C16.25 13.7294 15.2706 12.75 14.0625 12.75H6.49766C6.1956 12.75 5.9368 12.5339 5.88281 12.2367L5.63516 10.875H14.6977C15.6038 10.8749 16.3802 10.2267 16.5422 9.33516L17.4922 4.11172C17.5247 3.92894 17.4744 3.74115 17.3547 3.59922ZM7.5 14.9375C7.5 15.4553 7.08027 15.875 6.5625 15.875C6.04473 15.875 5.625 15.4553 5.625 14.9375C5.625 14.4197 6.04473 14 6.5625 14C7.08027 14 7.5 14.4197 7.5 14.9375ZM15 14.9375C15 15.4553 14.5803 15.875 14.0625 15.875C13.5447 15.875 13.125 15.4553 13.125 14.9375C13.125 14.4197 13.5447 14 14.0625 14C14.5803 14 15 14.4197 15 14.9375ZM15.3125 9.11172C15.2584 9.40978 14.9982 9.62609 14.6953 9.625H5.40781L4.49922 4.625H16.1258L15.3125 9.11172Z"
              fill="#fff"
            /></svg
        ></span>
        <span class="icon-container bg-[#F2EDDE] cursor-pointer" @click="roggellLang"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 12" fill="none" class="m-[1px]">
            <path
              d="M0.509563 12V0.079999H8.18956V1.28H1.78956V5.424H7.86956V6.624H1.78956V10.8H8.18956V12H0.509563Z"
              fill="black"
            />
          </svg>
        </span>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const lang = localStorage.getItem('appLang') || 'en'
  const roggellLang = () => {
    // Function to toggle language
    const currentLang = localStorage.getItem('appLang') || 'en'
    const newLang = currentLang === 'en' ? 'ar' : 'en'
    localStorage.setItem('appLang', newLang)
    window.location.reload()
  }
</script>

<style scoped>
  .icon-container {
    @apply flex place-content-center p-[5%] rounded-md items-center text-[.5rem] h-[20px] w-[20px] sm:text-[.8rem] sm:h-[30px] sm:w-[30px] md:text-[1rem] md:h-[40px] md:w-[40px];
  }
</style>
