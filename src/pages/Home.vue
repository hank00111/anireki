<script setup lang="ts">
import { onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { useAnimeWorks } from '../stores/animeWorks'

const animeWorks = useAnimeWorks();
// current season
onMounted(async () => {
    document.title = 'Home - Anireki';
    animeWorks.getCurrentSeason();
})
</script>

<template>
    <Sidebar></Sidebar>

    <div class="main">
        <Header></Header>
        <div class="content">
            <h1>2023 夏季新番</h1>
            <div class="home-info">
                <div v-for="data in    animeWorks.animeData   " class="works">
                    <div class="works-img">
                        <img v-lazy="data.images_url" :alt="data.title_jp">
                    </div>
                    <div>
                        <p class="works-info">{{ data.title }}</p>
                    </div>
                </div>
                <!-- <div class="works">
                    <div class="works-img">
                        <img src="https://p2.anireki.com/1.jpg" alt="data.title_jp">
                    </div>
                    <div>
                        <p class="works-info">堀與宮村 -piece-</p>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss" >
.home-info {
    gap: 8px;
    padding: 12px;
    display: grid;
    flex-wrap: wrap;
    grid-auto-rows: auto;
    grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));
    // grid-template-columns: repeat(3, 1fr);

    .works {
        display: flex;
        flex-direction: column;
        border-radius: 7px;
        overflow: hidden;
        user-select: none;
        background-color: hsla(0, 0%, 100%, 0.19);
        transition: all 0.2s;

        .works-img {
            width: 100%;
            height: 100%;
            overflow: hidden;

            >img {
                width: 100%;
                height: 100%;
                aspect-ratio: 225 / 325;
            }
        }

        .works-info {
            padding: 4px;
            margin: 0;
            font-weight: 700;
            white-space: nowrap;
        }

        &:hover {
            z-index: 2;
            background-color: hsl(0, 10%, 20%);
            transition-duration: 400ms;
            transform: scale(1.05);
            filter: drop-shadow(0 0 0.75rem black);
        }
    }
}
</style>