<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import WorksCard from '../components/WorksCard.vue';
import { useAnimeWorks } from '../stores/animeWorks'
import { updateSEO } from '../utils/seo';

const animeWorks = useAnimeWorks();

onMounted(() => {
    updateSEO('history');
    animeWorks.getAnimeData().then(() => {
        animeWorks.getWatchHistory();
    });
})

</script>

<template>
    <Sidebar></Sidebar>
    <div class="main">
        <Header></Header>
        <div class="content">
            <!-- <div class="home-title">Time Line</div> -->
            <WorksCard :from-Page="2"></WorksCard>
        </div>
    </div>
</template>

<style lang="scss"></style>
