<script setup lang="ts">
import { onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'


onMounted(() => {
    document.title = 'Console - Anireki';
})
</script>

<template>
    <Sidebar></Sidebar>
    <div class="main">
        <Header></Header>
        <div class="content">Console</div>
    </div>
</template>

<style lang="scss"></style>
