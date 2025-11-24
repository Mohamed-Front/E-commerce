<template>
  <div class="bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8 text-right">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ t('dashboard.title') }}</h1>
      <p class="text-lg text-gray-600">{{ t('dashboard.subtitle') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <!-- Total Users -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.totalUsers') }}</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.total_users }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +5%
              </span>
              <span class="text-gray-500 mr-2">{{ t('dashboard.lastMonth') }}</span>
            </p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Products -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.totalProducts') }}</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.total_products }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +10%
              </span>
              <span class="text-gray-500 mr-2">{{ t('dashboard.lastMonth') }}</span>
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0v6l-8 4m0-10l-8 4m8 4V3m-8 4v6" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Sales -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-orange-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.totalSales') }}</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ formatCurrency(data.total_sales) }}{{ $t("currencyLabel") }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +8%
              </span>
              <span class="text-gray-500 mr-2">{{ t('dashboard.lastMonth') }}</span>
            </p>
          </div>
          <div class="bg-orange-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Stores -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-purple-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.totalStores') }}</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.total_stores }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +2%
              </span>
              <span class="text-gray-500 mr-2">{{ t('dashboard.lastMonth') }}</span>
            </p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Top Selling Products Chart -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">{{ t('dashboard.topSellingProducts') }}</h2>
        </div>
        <div class="relative ">
          <canvas ref="topSellingChart"></canvas>
        </div>
      </div>

      <!-- Sales Summary Chart -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ t('dashboard.salesSummary') }}</h2>
        <div class="relative ">
          <canvas ref="salesSummaryChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800">{{ t('dashboard.recentActivity') }}</h2>
        </div>
        <div class="overflow-y-auto max-h-96">
          <div v-for="(activity, index) in recentActivities" :key="index" class="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div class="flex items-start">
              <div :class="`p-3 rounded-lg ${activity.iconBg} ${activity.iconText} ml-4`">
                <svg :class="`w-6 h-6`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path :stroke-width="activity.iconWidth" :d="activity.iconPath" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="text-base font-medium text-gray-800">{{ t(activity.title) }}</h3>
                  <span class="text-xs text-gray-500">{{ activity.time }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ t(activity.description) }}</p>
                <div v-if="activity.status" class="mt-2">
                  <span :class="`px-2 py-1 text-xs font-medium rounded-full ${activity.statusClass}`">
                    {{ t(activity.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Summary -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ t('dashboard.monthlySummary') }}</h2>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="stat in monthlyStats" :key="stat.name" class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">{{ t(stat.name) }}</p>
            <h3 class="text-xl font-bold text-gray-800 mt-1">{{ stat.value }}</h3>
            <p class="text-xs mt-2 flex items-center">
              <span :class="`font-medium ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`">
                <svg class="h-3 w-3 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.trend > 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'" />
                </svg>
                {{ Math.abs(stat.trend) }}%
              </span>
              <span class="text-gray-500 mr-2">{{ t('dashboard.lastMonth') }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

// Register Chart.js components
Chart.register(...registerables);

// Initialize i18n
const { t } = useI18n();

// Refs for chart instances
const topSellingChart = ref<HTMLCanvasElement | null>(null);
const salesSummaryChart = ref<HTMLCanvasElement | null>(null);

// Data state
const data = ref({
  total_users: 0,
  total_categories: 0,
  total_products: 0,
  total_stores: 0,
  total_orders: 0,
  total_sales: '0.00',
  total_brands: 0,
  total_coupons: 0,
  discounted_coupons: 0,
  total_reviews: 0,
  top_selling_products: [] as Array<{
    id: number;
    name_ar: string;
    name_en: string;
    base_price: string;
    order_item_count: number;
  }>,
  least_selling_products: [] as Array<any>,
});

// Sample data for recent activities
const recentActivities = ref([

]);

// Monthly stats
const monthlyStats = ref([

]);

// Colors for charts
const typeColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Utility to format currency
const formatCurrency = (value: string) => {
  return `${parseFloat(value).toFixed(2)}`;
};

// Fetch data from API
const fetchData = async () => {
  try {
    const response = await axios.get('api/dashboard');
    data.value = response.data.data;

    // Top Selling Products Chart
    if (topSellingChart.value) {
      new Chart(topSellingChart.value, {
        type: 'bar',
        data: {
          labels: data.value.top_selling_products.map((product) => t('dashboard.language') === 'ar' ? product.name_ar : product.name_en),
          datasets: [
            {
              label: t('dashboard.topSellingProducts'),
              data: data.value.top_selling_products.map((product) => product.order_item_count),
              backgroundColor: '#3B82F6',
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#1F2937',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                padding: 12,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                padding: 12,
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        },
      });
    }

    // Sales Summary Chart
    if (salesSummaryChart.value) {
      new Chart(salesSummaryChart.value, {
        type: 'line',
        data: {
          labels: [
            t('dashboard.months.january'),
            t('dashboard.months.february'),
            t('dashboard.months.march'),
            t('dashboard.months.april'),
            t('dashboard.months.may'),
            t('dashboard.months.june'),
            t('dashboard.months.july'),
            t('dashboard.months.august'),
            t('dashboard.months.september'),
            t('dashboard.months.october'),
            t('dashboard.months.november'),
            t('dashboard.months.december'),
          ],
          datasets: [
            {
              label: t('dashboard.sales'),
              data: [15000, 16000, 17000, 16500, 18000, 19000, parseFloat(data.value.total_sales), 19500, 18500, 17500, 16500, 15500],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#10B981',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#1F2937',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                padding: 12,
                callback: function (value) {
                  return `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`;
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                padding: 12,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        },
      });
    }
  } catch (error) {
    console.error(t('dashboard.errorFetchingData'), error);
  }
};

// Initialize charts
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Custom scrollbar for activity feed */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: rgba(156, 163, 175, 0.1);
}

/* Animation for cards */
.card-enter-active,
.card-leave-active {
  transition: all 0.4s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* RTL adjustments */
.text-right {
  text-align: right;
}
</style>
