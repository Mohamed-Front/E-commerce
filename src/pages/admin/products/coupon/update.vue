<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);
const isEditing = ref(false);

// Form Data
const couponData = ref({
  code: '',
  discount_type: null,
  discount_value: null,
  expires_at: ''
});

// Fetch coupon data if in edit mode
const fetchCoupon = async (id) => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/coupon/${id}`);
    const data = response.data.data;

    couponData.value = {
      code: data.code,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      expires_at: moment(data.expires_at).toDate() // Convert to Date object for Calendar
    };

    isEditing.value = true;

  }  finally {
    loading.value = false;
  }
};

// Check if we're editing on component mount
onMounted(() => {
  if (route.params.id) {
    fetchCoupon(route.params.id);
  }
});

// Generate random code
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'C-';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  couponData.value.code = result;
};

// Submit form
const submitForm = async () => {
  loading.value = true;

  try {
    // Format the date before sending
    const payload = {
      ...couponData.value,
      expires_at: moment(couponData.value.expires_at).format('YYYY-MM-DD')
    };

    if (isEditing.value) {
      await axios.put(`/api/coupon/${route.params.id}`, payload);
      toast.add({
        severity: 'success',
        summary: t("success"),
        detail: t("coupon.updated_successfully"),
        life: 3000
      });
    } else {
      await axios.post("/api/coupon", payload);
      toast.add({
        severity: 'success',
        summary: t("success"),
        detail: t("coupon.created_successfully"),
        life: 3000
      });
    }

 router.push({name:'coupon'})
  }  finally {
    loading.value = false;
  }
};
</script>

<template>
  <div  v-can="'edit coupons'" class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ isEditing ? $t("coupon.edit_coupon") : $t("coupon.create_new_coupon") }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6">
        <!-- Code -->
        <div class="space-y-2">
          <label for="code" class="block text-sm font-medium text-gray-700">
            {{ $t("coupon.code") }} <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <InputText
              id="code"
              v-model="couponData.code"
              :placeholder='$t("coupon.enter_code")'
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
              :disabled="isEditing"
            />
            <Button
              v-if="!isEditing"
              type="button"
              @click="generateRandomCode"
              icon="pi pi-refresh"
              class="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              :title="$t('coupon.generate_random_code')"
            />
          </div>
        </div>

        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="discount_type" class="block text-sm font-medium text-gray-700">
            {{ $t("coupon.discount_type") }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
            id="discount_type"
            v-model="couponData.discount_type"
            :options="[
              { label: $t('coupon.fixed_amount'), value: 1 },
              { label: $t('coupon.percentage'), value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder='$t("coupon.select_discount_type")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Discount Value -->
        <div class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ $t("coupon.discount_value") }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="discount_value"
            v-model="couponData.discount_value"
            :min="0"
            :max="couponData.discount_type === 2 ? 100 : null"
            :placeholder='$t("coupon.enter_discount_value")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
          <small class="text-gray-500 text-xs" v-if="couponData.discount_type === 2">
            {{ $t("coupon.percentage_note") }}
          </small>
        </div>

        <!-- Expiration Date -->
        <div class="space-y-2">
          <label for="expires_at" class="block text-sm font-medium text-gray-700">
            {{ $t("coupon.expiration_date") }} <span class="text-red-500">*</span>
          </label>
          <Calendar
            id="expires_at"
            v-model="couponData.expires_at"
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            :placeholder='$t("coupon.select_expiration_date")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center gap-4">
        <Button
          type="button"
          @click="router.push({ name: 'coupons' })"
          :label="$t('cancel')"
          icon="pi pi-times"
          class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-md transition-all duration-300"
        />
        <Button
          type="submit"
          :label="isEditing ? $t('coupon.update_coupon') : $t('coupon.create_coupon')"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ isEditing ? $t("coupon.update_coupon") : $t("coupon.create_coupon") }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
  </div>
  <Toast />
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

/* Calendar styling */
:deep(.p-calendar) {
  width: 100%;
}
:deep(.p-datepicker) {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
