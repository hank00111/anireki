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

const showMenu = ref(false);
const selectItem = ref(animeWorks.seasonSel);
const yearNav = ref();
const yearNavWidth = ref(0);

const yearList = ref([
    { name: '2024年1月新番', seasonID: '2024-winter' },
    { name: '2023年10月新番', seasonID: '2023-autumn' },
    { name: '2023年7月新番', seasonID: '2023-summer' },
    { name: '2023年4月新番', seasonID: '2023-spring' },
    { name: '2023年1月新番', seasonID: '2023-winter' },])

const userControll = useUserControl();

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

const getAllAnimre = () => {
    selectItem.value = -1;
    animeWorks.getSeason('all');
}

const getLeft = () => {
    let left = 0;

    if (yearNavWidth.value < 325) {
        left = (selectItem.value - 1) * -146;
        if (selectItem.value <= 1) {
            return 0;
        }
        return left - 120;
    }

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

const getYearNavWidth = () => {
    if (yearNav.value) {
        yearNavWidth.value = yearNav.value.clientWidth;
    }
}

const checkMobile = () => {
    if (window.innerWidth < 425) {
        return true;
    }
    return false;
}

onMounted(() => {
    getYearNavWidth();

    window.addEventListener("resize", getYearNavWidth, true);

    yearList.value.forEach((year, index) => {
        if (year.seasonID == animeWorks.seasonID) {
            selectItem.value = index;
            animeWorks.seasonSel = index;
        }
    })
})

onUnmounted(() => {
    window.removeEventListener("resize", getYearNavWidth, true);
});


</script>

<template>
    <div class="header">
        <div v-if="props.isHome" class="anime-panel">
            <div v-if="checkMobile()" class="all-anime" @click="getAllAnimre" :class="{ selectedH: selectItem === -1 }">所有動畫
            </div>
            <div class="year-nav" ref="yearNav">
                <div v-for="(year, index) in yearList" class="year-items"
                    :style="{ transform: `translate(${getLeft()}px,0)` }" :class="{ selected: selectItem === index }"
                    @click="goToSeason(index)">
                    {{ year.name }}
                </div>
            </div>
        </div>

        <div class="userPanel">
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
}
</style>
