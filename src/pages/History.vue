<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import WorksCard from '../components/WorksCard.vue';

onMounted(() => {
    document.title = 'History - Anireki';
})

</script>

<template>
    <Sidebar></Sidebar>
    <div class="main">
        <Header></Header>
        <div class="content">
            <div class="home-title">Time Line</div>
            <WorksCard :is-home="false"></WorksCard>
        </div>
    </div>
</template>

<style lang="scss"></style>
