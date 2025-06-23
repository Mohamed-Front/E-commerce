<template>
  <div class="app-navbar-actions">


     <settings-dropdown class="app-navbar-actions__item" />
    <language-dropdown style="width: 100% !important;text-align: justify !important;padding-right: 15px;font-size: 17px !important; " class="app-navbar-actions__item" />
    <!-- <profile-dropdown class="app-navbar-actions__item app-navbar-actions__item--profile text-black">
      <span>Admin</span>

    </profile-dropdown> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted,ref, computed } from 'vue'
import axios from "axios";
  import LanguageDropdown from './dropdowns/LanguageDropdown.vue'
  import ProfileDropdown from './dropdowns/ProfileDropdown.vue'
  import NotificationDropdown from './dropdowns/NotificationDropdown.vue'
  import MessageDropdown from './dropdowns/MessageDropdown.vue'
  import ColorDropdown from './dropdowns/ColorDropdown.vue'
  import * as PusherPushNotifications from "@pusher/push-notifications-web";
  import LocaleSelect from '../../LocaleSelect.vue'
  const x =ref(0)
  onMounted(() => {




})
  withDefaults(
    defineProps<{
      userName?: string
      isTopBar?: boolean
    }>(),
    {
      userName: '',
      isTopBar: false,
    },
  )

  defineEmits<{
    (e: 'update:isTopBar', isTopBar: boolean): void
  }>()

  // const isTopBarProxy = computed({
  //   get() {
  //     return props.isTopBar
  //   },
  //
  //   set(isTopBar: boolean) {
  //     emit('update:isTopBar', isTopBar)
  //   },
  // })


  // const beamsClient = new PusherPushNotifications.Client({
  //   instanceId: '140343aa-f173-4a2d-940a-7724c7c12be1',
  // });
  //
  // beamsClient.start()
  //   .then(() => beamsClient.addDeviceInterest('hello'))
  //   .then(() => console.log('Successfully registered and subscribed!'))
  //   .catch(console.error);
</script>

<style lang="scss">
  .app-navbar-actions {
    display: flex;
    align-items: center;

    .va-dropdown__anchor {
      color: var(--va-primary);
      fill: var(--va-primary);
    }

    &__item {
      padding: 0;
      margin-left: 1.25rem;
      margin-right: 1.25rem;

      svg {
        height: 24px;
      }

      &:last-of-type {
        margin-right: 0;
      }

      &--profile {
        display: flex;
        justify-content: center;
        margin: auto 0 auto 1.25rem;
      }

      .va-dropdown-content {
        background-color: var(--va-white);
      }

      @media screen and (max-width: 640px) {
        margin-right: 0;

        &:first-of-type {
          margin-left: 0;
        }

        &--profile {
          position: absolute;
          right: 0.75rem;
          top: 1.25rem;
          height: fit-content;
          margin: auto;
        }
      }
    }
  }
</style>
