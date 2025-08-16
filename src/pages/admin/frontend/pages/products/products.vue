<template>
  <div>
    <!-- Display Best Sellers -->
     <productsSwiper :products="exclusiveOffers" :title="bestSellers.title" />
    <productsSwiper :products="bestSellers" :title="bestSellers.title" />
    <productsSwiper :products="newArrivals" :title="bestSellers.title" />

    <!-- Add similar components for New Arrivals and Exclusive Offers if needed -->
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import productsSwiper from '../../components/SwiperSlide/productsSwiper.vue';

// Initialize reactive variables
const { t, locale } = useI18n();
const route = useRoute();
const stor_id= ref(localStorage.getItem('defaultStoreId'))
const bestSellers = ref({ title: '', products: [] });
const newArrivals = ref({ title: '', products: [] });
const exclusiveOffers = ref({ title: '', products: [] });
const isLoading = ref(false);
const error = ref(null);

// Fetch Best Sellers
const fetchBestSeller = async () => {
  try {
    const response = await axios.get(`/api/home/best-sellers/${stor_id.value}`);
    const data = response.data.data.data || [];
    bestSellers.value = {
      title: t('category.bestsellers') || 'Best Sellers',
      products: data.map((product) => ({
        id: product.id,
        name: locale.value === 'ar' ? product.name_ar : product.name_en,
        tax: product.tax,
        price: parseFloat(product.base_price).toFixed(2),
        img: product.media?.find((media) => media.name === 'product_main_image')?.url || product.key_default_image || '',
      })),
    };
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    error.value = t('category.errorLoading') || 'Failed to load best sellers.';
  }
};

// Fetch New Arrivals
const fetchNewArrivals = async () => {
  try {
    const response = await axios.get(`/api/home/new-arrivals/${stor_id.value}`);
    const data = response.data.data.data || [];
    newArrivals.value = {
      title: t('category.newlyarrived') || 'New Arrivals',
      products: data.map((product) => ({
        id: product.id,
          tax: product.tax,
        name: locale.value === 'ar' ? product.name_ar : product.name_en,
        price: parseFloat(product.base_price).toFixed(2),
        img: product.media?.find((media) => media.name === 'product_main_image')?.url || product.key_default_image || '',
      })),
    };
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    error.value = t('category.errorLoading') || 'Failed to load new arrivals.';
  }
};

// Fetch Exclusive Offers
const fetchExclusiveOffers = async () => {
  try {
    const response = await axios.get(`/api/home/exclusive-offers/${stor_id.value}`);
    const data = response.data.data || [];
    exclusiveOffers.value = {
      title: t('category.exclusive') || 'Exclusive Offers',
      products: data.map((product) => ({
        id: product.id,
          tax: product.tax,
        name: locale.value === 'ar' ? product.name_ar : product.name_en,
        price: parseFloat(product.base_price).toFixed(2),
        img: product.media?.find((media) => media.name === 'product_main_image')?.url || product.key_default_image || '',
      })),
    };
  } catch (err) {
    console.error('Error fetching exclusive offers:', err);
    error.value = t('category.errorLoading') || 'Failed to load exclusive offers.';
  }
};

// Placeholder for loaddata function (implement as needed)
const loaddata = async () => {
  console.log('loaddata function called');
  // Add your implementation here
};

// Fetch all data on component mount
onBeforeMount(async () => {
  isLoading.value = true;
  await Promise.all([
    fetchNewArrivals(),
    fetchBestSeller(),
    loaddata(),
    fetchExclusiveOffers(),
  ]);
  isLoading.value = false;
});
</script>
