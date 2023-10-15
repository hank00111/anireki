<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserControl } from '../stores/userControl'
import { useAnimeWorks } from '../stores/animeWorks'
const props = defineProps({
    isHome: Boolean,
    isConsole: Boolean,
})

const router = useRouter();
const animeWorks = useAnimeWorks();
const userControll = useUserControl();

const showMenu = ref<boolean>(false);
const selectItem = ref(animeWorks.seasonSel);
const userPanel = ref<any>(null);
const isMobile = ref<boolean>(false);
const navCenter = ref<number>(0);
const nextEnd = ref<boolean>(false);
const prevEnd = ref<boolean>(false);
const yearTextX = ref<number>(0);
const yearTextOpacity = ref<number>(1);

const yearList = ref([
    { name: '2024年1月新番', name_jp: '2024 冬', seasonID: '2024-winter' },
    { name: '2023年10月新番', name_jp: '2023 秋', seasonID: '2023-autumn' },
    { name: '2023年7月新番', name_jp: '2023 夏', seasonID: '2023-summer' },
    { name: '2023年4月新番', name_jp: '2023 春', seasonID: '2023-spring' },
    { name: '2023年1月新番', name_jp: '2023 冬', seasonID: '2023-winter' },])


const userLogout = () => {
    showMenu.value = !showMenu
    userControll.logout();
}

const goToSeason = (index: number) => {
    selectItem.value = index;
    animeWorks.seasonSel = index;
    animeWorks.seasonID = yearList.value[index].seasonID;
    animeWorks.getSeason(yearList.value[index].seasonID);
}

const getAllAnime = () => {
    selectItem.value = -1;
    animeWorks.getSeason('all');
}

const getLeft = () => {
    let left = 0;

    left = (selectItem.value - 1) * -146;
    if (selectItem.value <= 1) {
        left = 0;
    }
    return left;
}

const toConsole = () => {
    showMenu.value = !showMenu.value;
    router.push('/console');
}

const toForm = () => {
    window.location.href = "https://forms.gle/mq6hLwdMR4i6e9Mh8";
}

const yearNavCenter = () => {
    const c = window.innerWidth / 2;
    const y_c = (window.innerWidth - 32 - userPanel.value.offsetWidth) / 2;
    navCenter.value = c - y_c + 20;
}

const checkMobile = () => {
    yearNavCenter();
    window.innerWidth < 768 ? isMobile.value = true : isMobile.value = false;
}

const yearAnime = (next: boolean) => {
    yearTextOpacity.value = 0;
    next ? yearTextX.value = -55 : yearTextX.value = 55;
    setTimeout(() => {
        yearTextX.value = 0;
        yearTextOpacity.value = 1;
    }, 180)
}

const yearControl = (next: boolean) => {
    if (next) {
        selectItem.value -= 1;
        goToSeason(selectItem.value);
    } else {
        selectItem.value += 1;
        goToSeason(selectItem.value);
    }
    yearAnime(next);
    selectItem.value <= 0 ? nextEnd.value = true : nextEnd.value = false;
    selectItem.value >= yearList.value.length - 1 ? prevEnd.value = true : prevEnd.value = false;
}

onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile, true);

    yearList.value.forEach((year, index) => {
        if (year.seasonID == animeWorks.seasonID) {
            selectItem.value = index;
            animeWorks.seasonSel = index;
        }
    })
})

onUnmounted(() => {
    window.removeEventListener("resize", checkMobile, true);
});


</script>

<template>
    <div class="header">
        <div v-if="props.isHome" class="anime-panel">
            <div v-if="!isMobile" class="anime-panel-container">
                <div class="all-anime" @click="getAllAnime" :class="{ selectedH: selectItem === -1 }">所有動畫
                </div>
                <div class="year-nav">
                    <div v-for="(year, index) in yearList" class="year-items"
                        :style="{ transform: `translate(${getLeft()}px,0)` }" :class="{ selected: selectItem === index }"
                        @click="goToSeason(index)">
                        {{ year.name }}
                    </div>
                </div>
            </div>
            <div v-else class="anime-panel-container">
                <div class="mobile-year-nav" :style="{ marginLeft: `${navCenter}px` }">
                    <div class="year-next" @click="yearControl(true)">
                        <svg v-if="!nextEnd" width="32" height="32" viewBox="0 -960 960 900"  fill="#0fff">
                            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                    </div>
                    <div class="mobile-year"
                        :style="{  opacity: `${yearTextOpacity}` }">
                        {{ yearList[selectItem].name_jp }}</div>
                    <div class="year-prev" @click="yearControl(false)">
                        <svg v-if="!prevEnd" width="32" height="32" viewBox="0 -960 960 820" fill="#0fff">
                            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div v-else></div>

        <div class="userPanel" ref="userPanel">
            <div v-if="userControll.name.length != 0 ? true : false" class="userLoggedin">
                <button @click="showMenu = !showMenu">
                    <img draggable="false" :src=userControll.picture alt="">
                </button>
                <div v-if="showMenu" class="userMenu">
                    <div class="contextMenu">
                        <ul>
                            <li @click="toForm()">
                                <button>
                                    <span>聯絡我們</span>
                                </button>
                            </li>
                            <li v-if="userControll.consoleAccess" @click="toConsole()">
                                <button>
                                    <span>控制台</span>
                                </button>
                            </li>
                            <li @click="showMenu = !showMenu">
                                <button>
                                    <span>設定</span>
                                </button>
                            </li>
                            <li @click="userLogout"><button><span>登出</span></button></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-else class="userLogin">
                <button @click="userControll.getUser(1)">
                    <span>登入</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.anime-panel {
    width: calc(100% - 70px);
    display: flex;
    align-items: center;
}

.anime-panel-container {
    display: flex;
    width: 100%;
    overflow: hidden;
}

.all-anime {
    font-size: 18px;
    padding: 4px 0px;
    color: #ffffff5a;
    user-select: none;
    cursor: pointer;
    transition: transform .4s, color .4s;


    &:hover {
        color: #fff;
    }
}

.selectedH {
    color: #fff;
    background-color: #23262b;
    box-sizing: border-box;
    font-weight: 700;
    border-bottom: solid 2px #89c3eb;
    transition: transform .4s, color .4s;
}

.year-nav {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    overflow-x: auto;

    .year-items {
        color: #ffffff5a;
        display: block;
        white-space: nowrap;
        font-size: 18px;
        padding: 4px 0px;
        margin: 0px 2px;
        min-width: 144px;
        text-align: center;
        user-select: none;
        cursor: pointer;
        transition: transform .4s, color .4s;

        &:hover {
            color: #fff;
        }
    }

    .selected {
        color: #fff;
        background-color: #23262b;
        box-sizing: border-box;
        font-weight: 700;
        border-bottom: solid 2px #89c3eb;
        transition: transform .4s, color .4s;
    }
}

.year-nav::-webkit-scrollbar {
    display: none;
}

.mobile-year-nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;

    .year-next {
        width: 48px;
        display: flex;
        justify-content: center;
        user-select: none;
        transform-origin: 43% 55%;
        transform: rotate(-180deg);
        z-index: 100;
    }

    .year-prev {
        width: 48px;
        display: flex;
        justify-content: center;
        user-select: none;
        z-index: 100;
    }

    .mobile-year {
        display: flex;        
        width: 72px;
        color: #fff;
        font-size: 19px;
        transition: opacity 0.1s ease-in-out;
    }
}
</style>
