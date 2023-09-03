<script setup lang="ts">
import { onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'


onMounted(() => {
    document.title = 'Home - Anireki';
})
</script>

<template>
    <Sidebar></Sidebar>

    <div class="main">
        <Header></Header>
        <div class="content">123</div>
    </div>
</template>

<style leng="scss"></style>