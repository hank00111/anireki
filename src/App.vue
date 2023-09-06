<script setup lang="ts">
import { onMounted } from 'vue';
import { useDrakModeStore } from './stores/drakMode'
import { useUserControl } from './stores/userControl'
import { useAnimeWorks } from './stores/animeWorks'

const drakMode = useDrakModeStore();
const userControll = useUserControl();
const animeWorks = useAnimeWorks();

onMounted(() => {
  if (drakMode.drakState) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
  document.title = 'Home - Anireki';
  userControll.getUser(0);
  
  animeWorks.getCurrentSeason();
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
