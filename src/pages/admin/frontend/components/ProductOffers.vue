<<template>
  <!-- main body -->
  <main class="bg-[#FAF7F0] ">



    <!-- main content -->
    <div class="">
      <!-- section 1 -->
      <section class="mx-auto   max-w-7xl">


        <!-- more products -->
        <!-- Exclusive_offers -->
        <productsSwiper  :products="exclusive_offers" />
        <!-- best_seller -->
        <productsSwiper  :products="Best_seller" />
        <!-- New_arrival -->
        <productsSwiper :products="New_arrival" />


      </section>

    </div>
  </main>
</template>

<script setup>
  import { onBeforeMount, ref, computed } from 'vue'

  import axios from 'axios'

  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import 'swiper/css'
  import 'swiper/css/navigation'

  // components
  import productsSwiper from '../components/SwiperSlide/productsSwiper.vue'

  const { t } = useI18n()


   const exclusive_offers = ref({ title: '', products: [] })
  // constructor
  class Data {
    constructor(name = 'No name', img = '', price = '$$', id) {
      this.name = name
      this.img = img
      this.price = price
      this.id = id
    }
  }
  const Best_seller = ref({ title: '', products: [] })
  // api data
  const Stor = ref({})
  const banners_slider = ref([])
  const titels = ref({})
  const storimg = ref({})
  const New_arrival = ref({ title: '', products: [] })
  const isLoading = ref(false)
  const error = ref(null)
  const locale = ref(localStorage.getItem('appLang') || 'ar')


    const stor_id= ref(localStorage.getItem('defaultStoreId'))




  const fetchBestSeller = async () => {
    try {
      const response = await axios.get(`api/home/best-sellers/${stor_id.value}`)
      const data = response.data.data.data || []
    Best_seller.value = {
        title: t('category.bestsellers') || 'New Arrivals',
        products: data.map((product) => ({
          variant_id: product?.variant_id,
          data:product,
          id: product.id,
           data:product.is_stock,
           in_cart:product.in_cart,
          is_wished:product.is_wished,
          sub_name: locale.value === 'ar' ? product.sub_name_ar || product.sub_name_en : product.sub_name_en || product.sub_name_ar,
          name: locale.value === 'ar' ? product.name_ar : product.name_en,
          price: parseFloat(product.base_price).toFixed(2),
          img: product.media.find((media) => media.name === 'product_main_image')?.url || product.key_default_image,
        }))
      }
    } catch (err) {
      console.error('Error fetching new arrivals:', err)
      error.value = t('category.errorLoading') || 'Failed to load new arrivals.'
    } finally {
      isLoading.value = false
    }
  }
    const fetchNewArrivals = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`api/home/new-arrivals/${stor_id.value}`)
      const data = response.data.data.data || []
      New_arrival.value = {
        title: t('category.newlyarrived') || 'New Arrivals',
        products: data.map((product) => ({
          id: product.id,
          data:product,
           in_cart:product.in_cart,
          data:product.is_stock,
          is_wished:product.is_wished,
          variant_id:product.variant_id,
          sub_name: locale.value === 'ar' ? product.sub_name_ar || product.sub_name_en : product.sub_name_en || product.sub_name_ar,
          name: locale.value === 'ar' ? product.name_ar : product.name_en,
          price: parseFloat(product.base_price).toFixed(2),
          img: product.media.find((media) => media.name === 'product_main_image')?.url || product.key_default_image,

        })),
      }
    } catch (err) {
      console.error('Error fetching new arrivals:', err)
      error.value = t('category.errorLoading') || 'Failed to load new arrivals.'
    } finally {
      isLoading.value = false
    }
  }
    const fetchExclusiveOffers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`api/home/discounts/${stor_id.value}`)
      const data = response.data.data.data || []
      exclusive_offers.value = {
        title: t('category.exclusive') || 'New Arrivals',
        products: data.map((product) => ({
          variant_id:product.variant_id,
          is_wished:product.is_wished,
          id: product.id,
           in_cart:product.in_cart,
           data:product.is_stock,
          data:product,
          sub_name: locale.value === 'ar' ? product.sub_name_ar || product.sub_name_en : product.sub_name_en || product.sub_name_ar,
          name: locale.value === 'ar' ? product.name_ar : product.name_en,
          price: parseFloat(product.base_price).toFixed(2),
          img: product.media.find((media) => media.name === 'product_main_image')?.url || product.key_default_image,

        })),
      }
    } catch (err) {
      console.error('Error fetching new arrivals:', err)
      error.value = t('category.errorLoading') || 'Failed to load new arrivals.'
    } finally {
      isLoading.value = false
    }
  }

  const loaddata = async () => {
    try {

      // Fetch categories
      const categoryResponse = await axios.get(`api/home/get-categories/${stor_id.value}`)
      categoryResponse.data?.data?.data?.forEach((category) => {
        titels.value[category.id] = {
          name: localStorage.getItem('appLang') == 'en' ? category.name_en : category.name_ar || category.name_en,
          id: category.id,
        }
      })

      // Fetch banner slider images
      const bannerResponse = await axios.get('api/home/get-media-link')
      banners_slider.value = bannerResponse.data.data.map(item => ({
        url: item.url,
        id: item.id
      }))

      // Fetch store images
      if (Stor.value.media?.length > 0) {
        storimg.value = {
          store_image: Stor.value.media.find((img) => img.name == 'store_image')?.url,
          sub_banner_image: Stor.value.media.find((img) => img.name == 'sub_banner_image')?.url,
          slider_images_one: Stor.value.media.find((img) => img.name == 'slider_images_one')?.url,
          slider_images_two: Stor.value.media.find((img) => img.name == 'slider_images_two')?.url,
          slider_images_three: Stor.value.media.find((img) => img.name == 'slider_images_three')?.url,
          main_banner_image: Stor.value.media.find((img) => img.name == 'main_banner_image')?.url,
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  onBeforeMount(async () => {
    await Promise.all([fetchNewArrivals() ,fetchBestSeller(),loaddata(),fetchExclusiveOffers()])
  });
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

  .Variety:hover div {
    filter: blur(3px);
  }

  .Variety div:hover {
    filter: blur(0px);
  }

  /* Fancy titles slider styles */
  .titles-swiper {
    padding: 0 10px;
  }

  .titles-swiper :deep(.swiper-button-next),
  .titles-swiper :deep(.swiper-button-prev) {
    color: var(--main-text-color);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .titles-swiper :deep(.swiper-button-next:hover),
  .titles-swiper :deep(.swiper-button-prev:hover) {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  .titles-swiper :deep(.swiper-button-next:after),
  .titles-swiper :deep(.swiper-button-prev:after) {
    font-size: 14px;
    font-weight: bold;
  }

  .titels {
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .titels:hover {
    background: linear-gradient(45deg, #6B7280, var(--main-text-color));
  }
</style>
>
