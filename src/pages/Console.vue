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

const actionCheck = (str: string) => {
    switch (str) {
        case 'W':
            return '新增了'
        case 'U':
            return '更新了'
        case 'D':
            return '刪除了'
        default:
            return 'Error'
    }
}

onMounted(async () => {
    document.title = 'Console - Anireki';
    await anirekiConsole.getLogs();
    console.log(animeWorks.infoStatus)
})
</script>

<template>
    <Loading :console-show="false" :show="!userControll.checkConsole && anirekiConsole.logLoading" />
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
        <Header class="console-header" :is-console="true"></Header>
        <div class="content console-content">
            <div class="log-container">
                <div class="log-card">
                    <div v-for="data in anirekiConsole.logData" class="log-card-text-bar">
                        <div class="log-card-text">
                            <span class="log-card-img mr-5">
                                <img :src="data.userPicture" alt="">
                            </span>
                            <span class="mr-5">{{ data.user }}</span>
                            <span class="mr-5">{{ actionCheck(data.action) }}</span>
                            <span class="mr-5">{{ data.worksName + " #" + data.worksID }}</span>
                        </div>
                        <div class="log-card-text-end">
                            {{ data.date }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.log-container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;

    .log-card {
        color: #fff;
        width: 80%;
        height: 100px;
        padding: 12px;
        font-size: 1.1em;
        margin-top: 10px;
        border-radius: 15px;
        background: #525657;
    }


    .log-card-text {
        display: flex;
        align-items: center;
    }

    .log-card-img {
        height: 32px;
        width: 32px;

        >img {
            height: 32px;
            width: 32px;
            border-radius: 50%;
            cursor: pointer;

        }
    }

    .log-card-text-bar {
        display: flex;
        align-items: center;
    }

    .log-card-text-end {
        margin-left: auto;
        text-align: right !important;
    }

    .mr-5 {
        margin-right: 5px;
    }

}
</style>
