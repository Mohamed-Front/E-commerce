<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import moment from 'moment';

// ──────────────────────────────────────────────────────────────
//  i18n / language helpers
// ──────────────────────────────────────────────────────────────
const currentLanguage = computed(() => localStorage.getItem('appLang') || 'en');
const labelField = computed(() => currentLanguage.value === 'en' ? 'name_en' : 'name_ar');
const isRTL = computed(() => currentLanguage.value === 'ar');

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

// ──────────────────────────────────────────────────────────────
//  Form state
// ──────────────────────────────────────────────────────────────
const loading = ref(false);
const errors = ref({});

const discountData = ref({
  type: 'product',          // fixed
  products: null,           // **single** product id (null = nothing selected)
  discount_type: 1,         // fixed – Fixed Amount
  discount_value: null,
  expires_at: null
});

// ──────────────────────────────────────────────────────────────
//  Product dropdown (searchable)
// ──────────────────────────────────────────────────────────────
const products = ref([]);               // raw objects from API
const productSearch = ref('');          // what the user typed
const productLoading = ref(false);      // spinner inside Dropdown

/** Debounce helper – prevents a request on every keystroke */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Fetch products from the backend */
const fetchProducts = async () => {
  productLoading.value = true;
  try {
    const { data } = await axios.get('/api/product', {
      params: {
        // send only when the user typed something
        ...(productSearch.value ? { search: productSearch.value } : {})
      }
    });
    // Laravel pagination → data.data.data
    products.value = data.data.data ?? [];
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.productLoad'),
      life: 3000
    });
  } finally {
    productLoading.value = false;
  }
};

/** Debounced version – called from the Dropdown @filter */
const debouncedFetch = debounce(fetchProducts, 300);

/** When the user types inside the Dropdown */
const onProductFilter = (event) => {
  productSearch.value = event.value ?? '';
  debouncedFetch();
};

/** When the component mounts – load *all* products (empty search) */
onMounted(() => {
  fetchProducts();
});

/** Re-fetch when language changes – we only need the label, not new data */
watch(currentLanguage, () => {
  // keep the same objects, just the UI label will change via computed `labelField`
});

/* -----------------------------------------------------------------
   Validation class – unchanged except the field name for the product
   ----------------------------------------------------------------- */
class Validation {
  constructor(errorsRef, t) {
    this.errors = errorsRef;
    this.t = t;
  }

  required(value, fieldName) {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      this.errors.value[fieldName] = this.t('validation.requiredFields', {
        field: this.t(`discount.${fieldName}`)
      });
      return false;
    }
    return true;
  }

  numericRange(value, fieldName, min, max) {
    if (value === null || value === undefined || isNaN(value)) {
      this.errors.value[fieldName] = this.t('validation.requiredFields', {
        field: this.t(`discount.${fieldName}`)
      });
      return false;
    }
    if (min !== null && value < min) {
      this.errors.value[fieldName] = this.t('validation.minValue', {
        field: this.t(`discount.${fieldName}`),
        min
      });
      return false;
    }
    return true;
  }

  isValid() {
    return Object.keys(this.errors.value).length === 0;
  }
}

/* -----------------------------------------------------------------
   Submit
   ----------------------------------------------------------------- */
const submitForm = async () => {
  errors.value = {};
  const validator = new Validation(errors, t);

  validator.required(discountData.value.products, 'select_product');
  validator.numericRange(discountData.value.discount_value, 'discount_value', 0, null);
  validator.required(discountData.value.expires_at, 'expiration_date');

  if (!validator.isValid()) {
    const msg = Object.values(errors.value).join(', ');
    toast.add({ severity: 'error', summary: t('error'), detail: msg, life: 3000 });
    return;
  }

  loading.value = true;
  const payload = {
    type: discountData.value.type,
    ids: [discountData.value.products],               // **array with one id**
    discount_type: discountData.value.discount_type,
    discount_value: discountData.value.discount_value,
    expires_at: moment(discountData.value.expires_at).format('YYYY-MM-DD')
  };

  try {
    await axios.post('/api/discount', payload);
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('discount.created_successfully'),
      life: 3000
    });
    router.push({ name: 'discount' });
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: err.response?.data?.message || t('error.createError'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    v-can="'create discounts'"
    class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ t('discount.create_new_discount') }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- hidden fixed fields -->
      <input type="hidden" v-model="discountData.type" />
      <input type="hidden" v-model="discountData.discount_type" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- ────── Product (searchable dropdown) ────── -->
        <div class="space-y-2">
          <label for="product_id" class="block text-sm font-medium text-gray-700">
            {{ t('discount.select_product') }} <span class="text-red-500">*</span>
          </label>

          <Dropdown
            id="product_id"
            v-model="discountData.products"
            :options="products"
            :optionLabel="labelField"
            optionValue="id"
            filter
            :filterPlaceholder="t('discount.searchProducts')"
            :placeholder="t('discount.searchProducts')"
            :loading="productLoading"
            class="w-full"
            :class="{ 'p-invalid': errors.select_product }"
            @filter="onProductFilter"
          />
          <small v-if="errors.select_product" class="p-error">
            {{ errors.select_product }}
          </small>
        </div>

        <!-- ────── Discount Value ────── -->
        <div class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ t('discount.discount_value') }} ({{ t('discount.fixed_amount') }})
            <span class="text-red-500">*</span>
          </label>

          <InputText
          type="number"
            id="discount_value"
            v-model="discountData.discount_value"

            :placeholder="t('discount.enter_discount_value')"
            class="w-full"
            :class="{ 'p-invalid': errors.discount_value }"
          />
          <small v-if="errors.discount_value" class="p-error">
            {{ errors.discount_value }}
          </small>
        </div>

        <!-- ────── Expiration Date ────── -->
        <div class="space-y-2">
          <label for="expires_at" class="block text-sm font-medium text-gray-700">
            {{ t('discount.expiration_date') }} <span class="text-red-500">*</span>
          </label>

          <Calendar
            id="expires_at"
            v-model="discountData.expires_at"
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            :placeholder="t('discount.select_expiration_date')"
            class="w-full"
            :class="{ 'p-invalid': errors.expiration_date }"
            showIcon
          />
          <small v-if="errors.expiration_date" class="p-error">
            {{ errors.expiration_date }}
          </small>
        </div>
      </div>

      <!-- ────── Buttons ────── -->
      <div class="pt-4 flex justify-center space-x-4">
        <Button
          type="button"
          :label="t('discount.cancel')"
          icon="pi pi-times"
          @click="router.go(-1)"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="t('discount.create_discount')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md"
        />
      </div>
    </form>

    <Toast />
  </div>
</template>

<style scoped>
/* RTL spacing */
[dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-right: 1rem;
  margin-left: 0;
}

/* Invalid border */
.p-invalid {
  @apply border-red-500 !important;
}

/* Small error text */
.p-error {
  @apply text-red-600 text-xs;
}

/* Dropdown scrollbars */
:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: #3b82f6;
  border-radius: 3px;
}
</style>
