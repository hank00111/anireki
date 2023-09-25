<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
// import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
// import WorksCard from '../components/WorksCard.vue';
import { useAnimeWorks } from '../stores/animeWorks'

const route = useRoute();
const animeWorks = useAnimeWorks();
onMounted(async () => {
    // document.title = 'History - Anireki';
    await animeWorks.getWorks(route?.params.id[0]);
    if (animeWorks.worksLoaded) {
        document.title = `${route?.params.id[0] || 'un'} - Anireki`;
    }else{
        document.title = `Works - Anireki`;
    }
    // animeWorks.getAnimeData();
    // animeWorks.getWatchHistory();
})

</script>

<template>
    <Loading :console-show="false" :show="animeWorks.worksLoaded" />
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <!-- <Header></Header>
        <div class="content">
            <div class="home-title">Time Line</div>
            <WorksCard :is-home="false"></WorksCard>
        </div> -->
        <div class="content console-content">
            <div v-if="animeWorks.worksLoaded">
                {{ $route.params.id }}
            </div>

            <!-- <div class="home-title">Time Line</div>
            <WorksCard :is-home="false"></WorksCard> -->
        </div>
    </div>
</template>

<style lang="scss"></style>
