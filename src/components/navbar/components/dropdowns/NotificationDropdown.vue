<template>
  <va-dropdown class="notification-dropdown" :offset="[13, 0]" stick-to-edges>
    <template #anchor>
      <va-icon-notification
        class="notification-dropdown__icon"
        :class="{ 'notification-dropdown__icon--unread': !allRead }"
      > pp</va-icon-notification>

    </template>

  </va-dropdown>
</template>

<script setup lang="ts">

  import { onMounted,ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import VaIconNotification from '../../../icons/VaIconNotification.vue'
  import axios from "axios";
  const { t } = useI18n()
  const notificationsProxy = ref([])
  const allnotification=()=>{
    console.log("saffasd")
  }

  onMounted(() => {





})
  const allRead = computed(() => {
    return notificationsProxy.value.every((notification) => !notification.unread)
  })

  function markAllAsRead() {
    notificationsProxy.value = notificationsProxy.value.map((notification) => ({
      ...notification,
      unread: false,
    }))
  }
</script>

<style lang="scss" scoped>
  .notification-dropdown {
    cursor: pointer;

    .notification-dropdown__icon {
      position: relative;
      display: flex;
      align-items: center;

      &--unread::before {
        content: '';
        position: absolute;
        right: 0;
        left: 0;
        top: -0.5rem;
        // background-color: $brand-danger;
        height: 0.375rem;
        width: 0.375rem;
        margin: 0 auto;
        border-radius: 0.187rem;
      }
    }

    &__content {
      max-width: 20rem;
      overflow: scroll !important;
    }

    &__item {
      cursor: pointer;
      margin-bottom: 0.75rem;
      flex-wrap: nowrap;
      position: relative;

      &--unread {
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 0.375rem;
          width: 0.375rem;
          margin: auto;
          border-radius: 0.187rem;
        }
      }

      &:hover {
        color: var(--va-primary);
      }

      &__avatar {
        border-radius: 50%;
        width: 1.5rem;
        height: 1.5rem;
        min-width: 1.5rem;
      }
    }

    .va-dropdown__anchor {
      display: inline-block;
    }
  }
</style>
