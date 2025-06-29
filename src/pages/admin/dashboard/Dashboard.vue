<template>
  <div class="dashboard">


    <dashboard-info-block />


  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import DashboardCharts from './DashboardCharts.vue'
  import DashboardInfoBlock from './DashboardInfoBlock.vue'
  import DashboardTabs from './DashboardTabs.vue'
  import DashboardMap from './DashboardMap.vue'
  import axios from 'axios'

  const dashboardMap = ref()
  const test = ref()

  function addAddressToMap({ city, country }: { city: { text: string }; country: string }) {
    dashboardMap.value.addAddress({ city: city.text, country })
  }
  onMounted(() => {
    console.log('hello world')
    axios.get('/api/evaluations').then((res) => {
      test.value = res.data

      console.log(res.data)
    })
  })
</script>

<style lang="scss">
  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
