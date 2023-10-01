<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import Notifications from '../components/Notifications.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import { useAnimeWorks } from '../stores/animeWorks'
import { useUserControl } from '../stores/userControl'
import { useAnirekiConsole } from '../stores/anirekiConsole'

const animeWorks = useAnimeWorks();
const userControll = useUserControl();
const anirekiConsole = useAnirekiConsole();

onMounted(async () => {
    await animeWorks.getAnimeData();
})
onBeforeUnmount(async () => {
})
</script>

<template>
    <Loading :console-show="false" :show="!userControll.checkConsole && anirekiConsole.logLoading" />
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
        <Header class="console-header" :is-console="true"></Header>
        <div class="content console-content">
            <div class="works-list-container">
                <div v-for="data in animeWorks.originData" class="works-list-card">
                    <div class="works-list-image-container">
                        <div class="works-list-image" :style="{ backgroundImage: `url(${data.images_url})` }">
                        </div>
                    </div>
                    <div class="works-list-context">
                        <p>{{ data.id }}</p>
                        <p>{{ data.title }}</p>
                        <p>{{ data.title_jp }}</p>
                        <p>{{ data.season }}</p>
                        <p>{{ data.StartedAt_jp }}</p>
                        <p>{{ data.StartedAt_tw }}</p>
                        <p>{{ data.createdAt }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.works-list-container {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .works-list-card {
        height: 12em;
        margin: 8px 8px;
        display: flex;
        background: #5a5a5a;
        border-radius: 10px;
    }

    .works-list-image-container {
        background: #b96868;
        height: 100%;
        width: 8em;
        border-radius: 10px 0px 0px 10px;
    }

    .works-list-image {
        background: transparent 50% no-repeat;
        background-size: cover;
        height: 100%;
    }

    .works-list-context {
        padding: 6px;

        >p {
            margin: 0;
            color: #fff;
        }
    }
}
</style>