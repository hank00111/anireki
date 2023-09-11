<script setup lang="ts">
import { watchEffect, onMounted, onBeforeMount } from 'vue';
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
// import Loading from '../components/Loading.vue'
import { useAnimeWorks } from '../stores/animeWorks'
// const showModal = ref(false)
const animeWorks = useAnimeWorks();

// current season
onMounted(() => {
    document.title = 'Home - Anireki';
})
onBeforeMount(async () => {
    await animeWorks.getCurrentSeason();
})

watchEffect(() => {

})
// <Loading :show="showModal" />
</script>

<template>
    <Sidebar></Sidebar>
    <div class="main">
        <Header></Header>
        <div class="content">
            <div class="home-title">2023 夏季新番</div>
            <div class="home-info">
                <div v-for="data in animeWorks.animeData" class="works-card">
                    <div class="works-images" :style="{ backgroundImage: `url(${data.images_url})` }">
                    </div>
                    <div class="works-context">
                        <p>{{ data.title }}</p>
                    </div>
                </div>
                <!-- <div class="works-card">
                    <div class="works-images" :style="{ backgroundImage: `url(https://p2.anireki.com/2.jpg)` }">
                    </div>
                    <div class="works-context">
                        <p>幻日夜羽 -鏡中暉光-</p>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss" >
.home-title {
    margin-left: 18px;
    font-weight: bold;
    font-size: 2.5em;
    line-height: normal;
    color: #fff;
}

.home-info {
    gap: 8px;
    padding: 12px 12px 12px 15px;
    display: grid;
    flex-wrap: wrap;
    grid-auto-rows: auto;
    grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));
    // grid-template-columns: repeat(3, 1fr);

    .works-card {
        display: inline-block;
        border-radius: 8px;
        overflow: hidden;
        user-select: none;
        background-color: hsla(0, 0%, 100%, 0.19);
        transition: all 0.24s;
        // will-change: transform;
        .works-images {
            height: 0;
            overflow: hidden;
            padding-bottom: 140%;
            background-size: 100% 100%;
            background-position: center;
            background-color: #6b6363;
        }

        .works-context {
            >p {
                margin: 0;
                padding: 4px;
                font-weight: 700;
                color: #eee;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        &:hover {
            z-index: 2;
            transform: scale(1.05);            
            background-color: hsl(345, 17%, 36%);
            filter: drop-shadow(0 0 0.75rem black);
        }
    }
}
</style>