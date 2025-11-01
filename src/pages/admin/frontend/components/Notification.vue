<template>
  <div class="relative">
    <!-- Notification Icon with Badge -->
    <span
      class="icon-container bg-[#F2EDDE] cursor-pointer hover:bg-gray-200 transition-colors relative"
      @click.stop="toggleNotifications"
    >
      <i class="fa-solid fa-bell text-black"></i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
      >
        {{ unreadCount }}
      </span>
    </span>

    <!-- Notifications Dropdown -->
    <transition name="dropdown-fancy">
      <div
        v-if="isNotificationsOpen"
        class="absolute top-full rtl:left-0 ltr:right-0  mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 overflow-hidden dropdown-fancy"
        ref="notificationsDropdown"
      >
        <div class="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
          <p class="text-sm font-semibold text-gray-700">{{ $t('notifications') }}</p>
        </div>
        <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
          {{ $t('no_notifications') }}
        </div>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="markAsRead(notification)"
          class="flex items-start px-4 py-3 transition-all duration-200 cursor-pointer dropdown-item"
          :class="{ 'bg-gray-50': !notification.is_seen }"
        >
          <i
            class="fa-solid fa-circle text-xs mr-2 mt-1"
            :class="notification.is_seen ? 'text-gray-300' : 'text-amber-600'"
          ></i>
          <div class="flex-1">
            <p class="text-sm text-gray-700 font-semibold" :class="{ 'font-semibold': !notification.is_seen }">
              {{ notification.title }}
            </p>
            <p class="text-sm text-gray-600" :class="{ 'font-medium': !notification.is_seen }">
              {{ notification.body }}
            </p>
            <p class="text-xs text-gray-500">{{ formatDate(notification.created_at) }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// State
const notifications = ref([]);
const isNotificationsOpen = ref(false);
const notificationsDropdown = ref(null);

// Computed
const unreadCount = ref(0);

// Fetch notifications from API
const fetchNotifications = async () => {
  // try {
  //   const response = await axios.get('api/user-notification');
  //   notifications.value = response.data.data.data || [];
  //   unreadCount.value = notifications.value.filter(n => !n.is_seen).length;
  // } catch (error) {
  //   console.error('Error fetching notifications:', error);
  // }
};

// Mark notification as read
const markAsRead = async (notification) => {
  if (!notification.is_seen) {
    try {
      await axios.post(`api/user-notification/${notification.id}/mark-as-read`);
      notification.is_seen = true;
      unreadCount.value = notifications.value.filter(n => !n.is_seen).length;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
};

// Toggle notifications dropdown
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Click outside handler
const handleClickOutside = (event) => {
  if (
    isNotificationsOpen.value &&
    notificationsDropdown.value &&
    !notificationsDropdown.value.contains(event.target) &&
    !event.target.closest('.icon-container .fa-bell')
  ) {
    isNotificationsOpen.value = false;
  }
};

onMounted(() => {
  fetchNotifications();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.icon-container {
  @apply flex place-content-center p-2 rounded-md items-center text-[0.5rem] h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] md:h-[36px] md:w-[36px] transition-all duration-200;
}

.dropdown-fancy-enter-active,
.dropdown-fancy-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fancy-enter-from,
.dropdown-fancy-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-fancy-enter-to,
.dropdown-fancy-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-fancy {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.dropdown-item {
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
  transition: left 0.5s;
}

.dropdown-item:hover::before {
  left: 100%;
}

.dropdown-item:hover {
  background-color: #FFFBEB;
}
</style>
