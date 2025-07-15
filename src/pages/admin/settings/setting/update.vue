
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



  onMounted(() => {

      axios
        .get('api/setting', {
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

  })
</script>
