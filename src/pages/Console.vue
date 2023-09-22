<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '../components/Header.vue'
// import Loading from '../components/Loading.vue'
import Notifications from '../components/Notifications.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import { useAnimeWorks } from '../stores/animeWorks'
import { useUserControl } from '../stores/userControl'

const animeWorks = useAnimeWorks();
const userControll = useUserControl();

onMounted(() => {
    document.title = 'Console - Anireki';
    // if (noti.value) {
    //     setTimeout(() => {
    //         noti.value = !noti.value
    //     }, 2000)
    // }
    console.log(animeWorks.infoStatus)
})
</script>

<template>
    <Loading :console-show="false" :show="!userControll.checkConsole" />
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
        <Header class="console-header" :is-console="true"></Header>
        <div class="content console-content">
            <div class="log-container">
                <div class="log-card">
                    <div class="log-card-text-bar">
                        <div class="log-card-text">
                            <span class="mr-5">{{ userControll.picture }}</span>
                            <span class="mr-5">{{ userControll.name }}</span>
                            <span class="mr-5">新增了</span>
                            <span class="mr-5">進擊的巨人 #12</span>
                        </div>
                        <div class="log-card-text-end">
                            2023/09/23 12:00:00
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
        padding: 14px;
        font-size: 1.1em;
        margin-top: 10px;
        border-radius: 15px;
        background: #525657;
    }

    .log-card-text-bar {
        display: flex;
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
