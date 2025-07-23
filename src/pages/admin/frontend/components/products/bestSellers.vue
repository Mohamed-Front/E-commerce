<template>
  <productsSwiper :products="best_seller" />
</template>

<script setup>
import { ref, watch } from 'vue';
import productsSwiper from '../SwiperSlide/productsSwiper.vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t } = useI18n();

const best_seller = ref({
  title: t('category.bestsellers'),
  products: [],
});

const props = defineProps({
  Stor: {
    type: Object,
    required: true
  }
});

// تأكد أن عندك هذه الدالة (إذا مش موجودة، بدك تعرفها)
class Data {
  constructor(name, img, price, id) {
    this.name = name;
    this.img = img;
    this.price = price;
    this.id = id;
  }
}

const bestSellers = async () => {
  try {
    const id = props.Stor?.id;
    if (!id) return;

    const response = await axios.get(`api/home/best-sellers/${id}`);

    const lang = localStorage.getItem('appLang') || 'en';

    best_seller.value.products = response.data.data.data.map((product) => {
      return new Data(
        lang === 'en' ? product.name_en : product.name_ar || product.name_en,
        product.media?.[0]?.url || '',
        product.base_price,
        product.id
      );
    });
  } catch (error) {
    console.error('Failed to fetch best sellers:', error);
  }
};

watch(
  () => props.Stor?.id,
  (id) => {
    if (id) bestSellers();
  },
  { immediate: true }
);
</script>
