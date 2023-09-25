<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted } from 'vue';
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
// import WorksCard from '../components/WorksCard.vue';
import { useAnimeWorks } from '../stores/animeWorks'

const route = useRoute();
const animeWorks = useAnimeWorks();
onMounted(async () => {
    await animeWorks.getWorks(route?.params.id.toString());
    if (animeWorks.worksLoaded) {
        document.title = `${animeWorks.worksData.title} - Anireki`;
    } else {
        document.title = `Works - Anireki`;
    }
    // animeWorks.getAnimeData();
    // animeWorks.getWatchHistory();
})

</script>

<template>
    <Loading :console-show="false" :show="!animeWorks.worksLoaded" />
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Header class="console-header"></Header>
        <!-- <Header></Header>
        <div class="content">
            <div class="home-title">Time Line</div>
            <WorksCard :is-home="false"></WorksCard>
        </div> -->
        <div class="content console-content">
            <div v-if="animeWorks.worksLoaded" class="works-container">
                <div class="works-content">
                    <div class="card-item">
                        <p>ID</p>
                        <input type="text" :placeholder="animeWorks.worksCount" readonly="true">
                    </div>
                    {{ $route.params.id }}
                </div>
            </div>

            <!-- <div class="home-title">Time Line</div>
            <WorksCard :is-home="false"></WorksCard> -->
        </div>
    </div>
</template>

<style lang="scss">
.works-container {
    height: 100%;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-width: 80%;

    .works-content {
        padding: 0.8em;
    }
}
</style>
