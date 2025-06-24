<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('navigation.quickBooks') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button :label="t('quickBooks.connect')" class="p-button-success" @click="connect" />
            </div>
          </template>
        </Toolbar>

        <Toast />
      </div>
    </div>
  </div>
</template>

<script setup>
  // imports
  import axios from 'axios'
  import { code } from 'ionicons/icons'
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useToast } from 'primevue/usetoast'

  // main declerations
  const { t } = useI18n()
  const route = useRoute()
  const toast = useToast()

  // variables

  // functions
  const connect = () => {
    axios.get('api/quickbooks/connect').then((response) => {
      if (response.data.is_success) {
        window.open(response.data.data, '_blank')
      } else {
        toast.add({ severity: 'error', summary: 'Error Message', detail: t('quickBooks.erorrContent'), life: 3000 })
      }
    })
  }

  onMounted(() => {
    if (route.query.code && route.query.realmId) {
      axios
        .get('api/quickbooks/callback', {
          params: {
            code: route.query.code,
            realmId: route.query.realmId,
          },
        })
        .then((response) => {
          toast.add({
            severity: 'success',
            summary: 'Success Message',
            detail: t('quickBooks.successContent'),
            life: 3000,
          })
        })
        .catch((error) => {
          toast.add({ severity: 'error', summary: 'Error Message', detail: t('quickBooks.erorrContent'), life: 3000 })
        })
    }
  })
</script>
