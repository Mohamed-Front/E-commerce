<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";
const users =ref([])
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const loading = ref(false);

// Form Data
const addressData = ref({});


const fetchUsers =()=>{
  axios.get('api/user').then((res)=>{
    users.value=res.data.data.data

  })
}
// Submit form
const submitForm = async () => {
  loading.value = true;
  try {
     addressData.value.is_default=  addressData.value.is_default ? '1' : '0'
    await axios.post("/api/address", addressData.value);
    router.push({ name: 'address' });
    toast.add({
      severity: 'success',
      summary: t("success"),
      detail: t("address.created_successfully"),
      life: 3000
    });
  } finally {
    loading.value = false;
  }

};
  onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div v-can="'create address'" class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t("address.create_new_address") }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
         <div class="grid grid-cols-1 gap-6  lg:grid-cols-2">
        <!-- Address Line 1 -->

        <div class="space-y-2">
          <label for="address_line_1" class="block text-sm font-medium text-gray-700">
            {{ $t("user.name") }} <span class="text-red-500">*</span>
          </label>
           <Dropdown
            filter
            v-model="addressData.user_id"
            :options="users"
            optionLabel="name"
            optionValue="id"
             :placeholder='$t("user.name")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

        </div>

        <div class="space-y-2">
          <label for="address_line_1" class="block text-sm font-medium text-gray-700">
            {{ $t("address.line1") }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="address_line_1"
            v-model="addressData.address_line_1"
            :placeholder='$t("address.enter_line1")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Address Line 2 -->
        <div class="space-y-2">
          <label for="address_line_2" class="block text-sm font-medium text-gray-700">
            {{ $t("address.line2") }}
          </label>
          <InputText
            id="address_line_2"
            v-model="addressData.address_line_2"
            :placeholder='$t("address.enter_line2")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- City -->
        <div class="space-y-2">
          <label for="city" class="block text-sm font-medium text-gray-700">
            {{ $t("address.city") }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="city"
            v-model="addressData.city"
            :placeholder='$t("address.enter_city")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- Country -->
        <div class="space-y-2">
          <label for="country" class="block text-sm font-medium text-gray-700">
            {{ $t("address.country") }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="country"
            v-model="addressData.country"
            :placeholder='$t("address.enter_country")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <!-- ZIP Code -->
        <div class="space-y-2">
          <label for="zip_code" class="block text-sm font-medium text-gray-700">
            {{ $t("address.zip_code") }}
          </label>
          <InputText
            id="zip_code"
            v-model="addressData.zip_code"
            :placeholder='$t("address.enter_zip_code")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Default Address -->
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="w-5 h-5 mx-2" v-model="addressData.is_default" :binary="true" />
            <span class="text-sm font-medium text-gray-700 mx-1">{{ $t("address.set_as_default") }}</span>
          </label>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center">
        <Button
          type="submit"
          :label="$t('address.create_address')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r mx-2 from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{ $t("address.create_address") }}</span>
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

/* Input styling */
:deep(.p-inputtext) {
  width: 100%;
}
</style>
