<script setup lang="ts">
import { onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue'

onMounted(() => {
    document.title = 'WatchList - Anireki';
})

</script>

<template>
    <Sidebar></Sidebar>
    <div class="main">
    </div>
</template>

<style lang="scss"></style>
