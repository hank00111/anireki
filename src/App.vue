<script setup lang="ts">
import { onMounted } from 'vue';
import { useDrakModeStore } from '@/stores/drakMode'
import { useUserControl } from '@/stores/userControl'
import { useLoginModalStore } from '@/stores/loginModalStore'
import ErrorNotifications from '@/components/ErrorNotifications.vue'
import LoginModal from '@/components/LoginModal.vue'

const drakMode = useDrakModeStore();
const userControll = useUserControl();
const loginModalStore = useLoginModalStore();

onMounted(() => {
  if (drakMode.drakState) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  document.title = 'Home - Anireki';

  userControll.getUser(0);
})
</script>

<template>
  <ErrorNotifications />
  <LoginModal 
    :isVisible="loginModalStore.isVisible"
    :title="loginModalStore.title"
    :message="loginModalStore.message"
    @close="loginModalStore.hideModal"
  />
  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
