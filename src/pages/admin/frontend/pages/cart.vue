<template>
  <div class="flex lg:flex-row flex-col gap-10">
    <section class="flex-1">
      <img src="../imges/banner2.png" alt="" />
      <div class="flex gap-2 mt-4">
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectedOption = option.value"
          :class="[
            'cursor-pointer border rounded-lg px-3 py-2 flex items-center justify-between gap-2',
            selectedOption === option.value ? 'border-[var(--color-all)] bg-[var(--color-all)]' : 'border-gray-300',
          ]"
        >
          <span class="font-medium text-sm">{{ option.label }}</span>
          <div
            class="w-5 h-5 border rounded flex items-center justify-center"
            :class="selectedOption === option.value ? 'bg-white border-white' : 'bg-white border-gray-400'"
          >
            <svg
              v-if="selectedOption === option.value"
              class="w-3 h-3 text-[var(--color-all)]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
      <div
        class="py-4 border-[var(--color-all)] border rounded-lg flex justify-center items-center mt-4 text-[var(--color-all)]"
      >
        {{ selectedOption }}
      </div>
      <div v-for="product in products" :key="product.id" class="flex items-center mt-4">
        <img
          :src="product.img"
          :alt="product.name"
          class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 object-cover border border-[var(--main-text-color)]"
        />
        <div class="flex flex-col mx-4 gap-1 flex-1">
          <h3 class="text-lg font-bold">{{ product.name }}</h3>
          <p class="text-[#A17D1C] text-sm">Price : JOD {{ product.price }}</p>
          <div class="flex items-center justify-between">
            <p class="text-[#A17D1C] text-sm">Quantity : {{ product.quantity }}</p>
            <div class="border border-black p-2 rounded-md">
              <span @click="pronum('plus', product.id)" class="cursor-pointer">+</span>
              <span class="mx-3">{{ product.quantity }}</span>
              <span @click="pronum('minus', product.id)" class="cursor-pointer">-</span>
            </div>
            <button @click="removeProduct(product.id)" class="text-white bg-[var(--color-all)] p-1 text-sm rounded-md">
              {{ $t('remove') }}
            </button>
          </div>
        </div>
      </div>
      <div class="bg-[#F5F5F5] p-4 mt-4">
        <div class="flex flex-col gap-6">
          <span class="flex justify-between items-center">
            <h4 class="text-[#A17D1C]">Shipping Period</h4>
            <p>3H</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-[#A17D1C]">Sub-Total</h4>
            <p>JOD 0</p>
          </span>
          <span class="flex justify-between items-center">
            <h4 class="text-[#A17D1C]">Total</h4>
            <p>JOD 0</p>
          </span>
        </div>
        <div class="flex justify-center">
          <button
            class="w-[50%] mt-4 lg:py-[6px] py-[6px] text-[8px] sm:text-[1rem] lg:text-[1.2rem] bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-md"
          >
            Check Out
          </button>
        </div>
      </div>
    </section>
    <section class="lg:w-1/4 w-full p-4">
      <div class="flex flex-col gap-6">
        <span class="flex justify-between items-center">
          <h4 class="text-[#A17D1C]">SubTotal</h4>
          <p>JOD 0</p>
        </span>
        <span class="flex justify-between items-center">
          <h4 class="text-[#A17D1C]">Shipping Fee</h4>
          <p>JOD 0</p>
        </span>
        <span class="flex justify-between items-center">
          <h4 class="text-[#A17D1C]">Total</h4>
          <p>JOD 0</p>
        </span>
      </div>
      <div class="flex flex-col items-center justify-center">
        <input
          v-model="value"
          type="text"
          placeholder="Coupon Code"
          class="bg-[#FAF7F0] placeholder-[#A17D1C] border border-[#F0E3C2] rounded-md w-full mt-4 px-2 lg:py-[8px] py-[6px] text-[6px] sm:text-[1rem] lg:text-[1rem] focus:outline-none"
        />
        <button
          class="w-full mt-4 lg:py-[8px] py-[6px] text-[6px] sm:text-[1rem] lg:text-[1rem] bg-[#F5F0DB] rounded-md transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-md"
        >
          Apply
        </button>
        <button
          class="w-full mt-4 lg:py-[8px] py-[6px] text-[6px] sm:text-[1rem] lg:text-[1rem] bg-[var(--main-text-color)] rounded-md text-white transition-transform duration-150 ease-in-out active:scale-95 hover:shadow-md"
        >
          Check Out All
        </button>
      </div>
    </section>
  </div>
  <div class="w-[75%]">
      <Swiper :products="Suggestions" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import Swiper from '../components/SwiperSlide/productsSwiper.vue'
  import imge3 from '../imges/prand 1.png'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const selectedOption = ref('Store 1')
  const options = [
    { label: 'Store 1', value: 'Store 1' },
    { label: 'Store 2', value: 'Store 2' },
    { label: 'Store 3', value: 'Store 3' },
  ]

  const products = ref([
    {
      id: 1,
      name: 'Product 1',
      price: 10,
      quantity: 1,
      img: 'https://plus.unsplash.com/premium_photo-1675896084254-dcb626387e1e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 20,
      quantity: 3,
      img: 'https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png',
    },
  ])

  const removeProduct = (id) => {
    products.value = products.value.filter((product) => product.id !== id)
  }
  const pronum = (type, id) => {
    const product = products.value.find((p) => p.id === id)
    if (type === 'plus') {
      product.quantity++
    } else if (type === 'minus' && product.quantity > 1) {
      product.quantity--
    }
  }

    class Data {
    constructor(name = 'No name', img = '', price = '$$') {
      this.name = name
      this.img = img
      this.price = price
    }
  }
  const Suggestions = ref({
    title: t('category.suggestions'),
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
</script>

<style></style>
