<template>
  <productsSwiper :products="Exclusive_offers" />
</template>

<script setup>
import { ref, watch } from 'vue';
import productsSwiper from '../SwiperSlide/productsSwiper.vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t } = useI18n();

const Exclusive_offers = ref({
  title: t('category.exclusive'),
  products: [],
});

const props = defineProps({
  Stor: {
    type: Object,
    required: true
  }
});

class Data {
  constructor(name, img, price, id) {
    this.name = name;
    this.img = img;
    this.price = price;
    this.id = id;
  }
}

const Exclusiveoffers = async () => {
  try {
    const id = props.Stor?.id;
    if (!id) return;

    const response = await axios.get(`api/home/discounts/${id}`);

    const lang = localStorage.getItem('appLang') || 'en';

    Exclusive_offers.value.products = response.data.data.data.map((product) => {
      return new Data(
        lang === 'en' ? product.name_en : product.name_ar || product.name_en,
        product.media?.[0]?.url || '', // حماية من null
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
    if (id) Exclusiveoffers();
  },
  { immediate: true }
);
</script>
