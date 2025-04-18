<template>
    <!-- main navbar -->
    <nav class="h-[65px] bg-[#fff] flex py-[12.5px] px-[20px]">
        <!-- section 1 -->
        <div class="min-w-[30%] h-[40px] gap-2 flex place-content-center items-center ml-4">
            <!-- logo -->
            <div class="main-logo w-[30%]"><a class="flex place-content-center items-center" href="#"><img
                        src="../imges/shiftlogo.png" alt="shift7"></a>
            </div>
            <!-- Super Market store -->
            <div
                class="rounded-md cursor-pointer h-[30px] w-[30%] md:h-[40px] bg-[#CB2A2C] text-white flex place-content-evenly items-center">
                <!-- Market text -->
                <div>
                    <div class="font-[Arvo] text-[.3rem] mb-[2px] sm:text-[.3rem] lg:text-[.7rem]">SUPER <i
                            class="fa-solid fa-signal text-[.3rem] lg:text-[.6rem]"
                            style="color: white;transform: rotate(-90deg);"></i></div>
                    <div class="font-[Arvo] text-[.3rem] sm:text-[.5rem] lg:text-[.7rem]">MARKET</div>
                </div>
                <!-- Market icon -->
                <i class="fa-solid fa-bag-shopping text-[.5rem] sm:text-[.9rem] lg:text-[1rem]"></i>
            </div>
            <!-- SHIFT 7 Mall -->
            <div
                class="rounded-md cursor-pointer bg-[#E6AC31] h-[30px] w-[30%] md:h-[40px] text-white flex place-content-evenly items-center">
                <!-- text Mall -->
                <div>
                    <div
                        class="font-[Arvo] text-[.3rem] mb-[2px] tracking-wider font-black sm:text-[.3rem] lg:text-[.7rem]">
                        MALL <i class="fa-solid fa-signal text-[.3rem] lg:text-[.6rem]"
                            style="color: white;transform: rotate(-90deg);"></i>
                    </div>
                    <div
                        class="font-[Arvo] tracking-widest font-black text-[.3] text-[.3rem] sm:text-[.5rem] lg:text-[.7rem]">
                        SHIFT7</div>
                </div>
                <!-- Mall icon -->
                <i class="fa-solid fa-bag-shopping text-[.7rem] sm:text-[.9rem] lg:text-[1rem]"></i>
            </div>
        </div>
        <!-- section 2 -->
        <div class="w-[70%] flex place-content-between items-center">
            <!-- nav search -->
            <i class="fa-solid fa-magnifying-glass rounded-l-md w-[20px] h-[20px] sm:w-[30px] text-[.7rem] sm:text-[1rem] sm:h-[30px] md:h-[40px] md:w-[40px] bg-[#F2EDDE] text-center place-content-center"
                style="color: #a6853b;"></i>
            <!-- nav search input -->
            <div class="w-[80%] rounded-r-md"><input
                    class="pr-2 sm:h-[30px] md:h-[40px] w-[90%] h-[20px] text-[.4rem] sm:text-[.7rem] md:text-[1rem] text-[#A6853B] font-bold placeholder:text-[#A6853B] placeholder:font-bold focus:outline-none bg-[#F2EDDE]"
                    type="text" placeholder="ابـــدأ بالبحــــــــث"></div>
            <!-- nav other -->
            <div class="w-[30%] flex gap-2 items-center place-content-end">
                <span class="icon-container"><i class="fa-solid fa-user" style="color: #000000;"></i></span>
                <span class="icon-container"><i class="fa-solid fa-cart-shopping" style="color: #000000;"></i></span>
                <span class="icon-container"><i class="fa-solid fa-e" style="color: #000000;"></i></span>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.icon-container {
    @apply bg-[#F2EDDE] flex place-content-center items-center text-[.5rem] h-[20px] w-[20px] sm:text-[.8rem] sm:h-[30px] sm:w-[30px] md:text-[1rem] md:h-[40px] md:w-[40px];
}
</style>