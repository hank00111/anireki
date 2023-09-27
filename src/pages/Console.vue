<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
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

const timer = ref<any>() || null;

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
const headerCheck = (str: string) => {
    switch (str) {
        case 'StartedAt_jp':
            return '日本首播日'
        case 'StartedAt_tw':
            return '台灣首播日'
        case 'U':
            return '更新'
        case 'D':
            return '刪除'
        default:
            return ''
    }
}

const relativeTime = (date: string) => {
    const targetDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = +currentDate - +targetDate;
    const timeDiffSeconds = Math.floor(timeDifference / 1000);
    const rtf = new Intl.RelativeTimeFormat('zh-TW', { numeric: 'auto' });

    switch (true) {
        case (timeDiffSeconds < 60):
            return rtf.format(Math.round(-timeDifference / 1000), 'second');
        case (timeDiffSeconds < 3600):
            return rtf.format(Math.round(-timeDifference / 1000 / 60), 'minute');
        case (timeDiffSeconds < 86400):
            return rtf.format(Math.round(-timeDifference / 1000 / 60 / 60), 'hour');
        default:
            return date;
    }

}

onMounted(async () => {
    document.title = 'Console - Anireki';
    await anirekiConsole.getLogs();
    timer.value = setInterval(async () => {
        await anirekiConsole.getLogs();
    }, 30 * 1000);
})
onBeforeUnmount(() => {
    clearInterval(timer.value);
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
                <div v-for="data in anirekiConsole.logData" class="log-card">
                    <div class="log-card-text-bar">
                        <div class="log-card-text">
                            <img class="log-card-img mr-5" :src="data.userPicture" alt="">
                            <span class="mr-5 highlight">{{ data.user }}</span>
                            <span class="mr-5">{{ actionCheck(data.action) }}</span>
                            <span class="mr-5">
                                <router-link :to="{ name: 'works', params: { id: data.worksID } }"
                                    class="log-link highlight">
                                    {{ data.worksName + " #" + data.worksID }}
                                </router-link>
                            </span>
                        </div>
                        <div class="log-card-text-end"> {{ relativeTime(data.date) }}
                        </div>
                    </div>
                    <div class="log-card-table">
                        <div class="log-card-table-tr">
                            <div class="log-card-table-th" style="width: 15%;">項目</div>
                            <div class="log-card-table-th">After</div>
                            <div class="log-card-table-th">Before</div>
                        </div>
                        <div v-for="(item, key) in data.changeData" class="log-card-table-tr">
                            <div class="log-card-table-td">{{ headerCheck(key) }}</div>
                            <div class="log-card-table-td"> {{ item.old }}</div>
                            <div class="log-card-table-td"> {{ item.new }}</div>
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
    align-items: center;
    flex-direction: column;

    .log-card {
        color: #fff;
        width: 80%;
        padding: 10px;
        font-size: 1.1em;
        margin-top: 10px;
        border-radius: 15px;
        background: #525657;
        display: flex;
        flex-direction: column;
    }

    .log-card-text-bar {
        color: #fff;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .log-card-text {
        display: flex;
        align-items: center;
    }

    .log-card-img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        cursor: pointer;
    }

    .log-card-text-end {
        margin-left: auto;
        text-align: right !important;
    }

    .highlight {
        color: #88e4f0;
        cursor: pointer;
    }

    .mr-5 {
        margin-right: 5px;
    }

    .log-link {
        text-decoration: none;
    }

    .log-card-table {
        display: table;
        margin-top: 10px;
    }

    .log-card-table-tr {
        display: table-row;
    }

    .log-card-table-th {
        display: table-cell;
        padding: 6px;
        line-height: 34px;
        border: 1px solid #7c7c7c;
        border-bottom: 0.4px solid #7c7c7c;
        
    }

    .log-card-table-td {
        display: table-cell;
        padding: 6px;
        line-height: 34px;
        border: 1px solid #7c7c7c;
    }

}
</style>
