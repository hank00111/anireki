<script setup lang="ts">
import { onMounted } from 'vue';
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import Header from '../components/Header.vue'


onMounted(() => {
    document.title = 'Console - Anireki';
})
</script>

<template>
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Header class="console-header"></Header>
        <div class="content console-content">活動</div>
    </div>
</template>

<style lang="scss"></style>
