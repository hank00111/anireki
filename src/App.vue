<script setup lang="ts">
import { onMounted } from 'vue';
import { useDrakModeStore } from './stores/drakMode'
const drakMode = useDrakModeStore();

onMounted(() => {
  if (drakMode.drakState) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  document.title = 'Home - Anireki';

})
</script>

<template>
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
