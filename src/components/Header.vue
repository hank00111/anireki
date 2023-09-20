<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useUserControl } from '../stores/userControl'
import { useAnimeWorks } from '../stores/animeWorks'
const props = defineProps({
    isHome: Boolean
})
const animeWorks = useAnimeWorks();

const showMenu = ref(false);
const selectItem = ref(animeWorks.seasonSel);

const yearList = ref([
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
    left = (selectItem.value - 1) * -165;
    if (selectItem.value <= 1) {
        left = 0;
    }
    return left;
    //console.log(selectItem.value + " " + index + " " + left);
}

onMounted(() => {
    // animeWorks.getSeason(yearList.value[animeWorks.seasonSel].seasonID);
})
watchEffect(() => {

})

</script>

<template>
    <div class="header">
        <div v-if="props.isHome" class="anime-panel ">
            <div class="all-anime" @click="getAllAnimre" :class="{ selected: selectItem === -1 }">所有動畫</div>
            <div class="year-nav">
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
                            <li @click="showMenu = !showMenu"><button><span>設定</span></button></li>
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
    width: 88%;
    display: flex;
    align-items: center;

    .all-anime {
        font-size: 1.25em;
        min-width: 100px;
        color: #ffffff5a;
        user-select: none;
        cursor: pointer;
    }

    .year-nav {
        display: flex;
        align-items: center;
        overflow: hidden;
        width: 80%;
        min-width: 495px;
        height: 100%;

        .year-items {
            color: #ffffff5a;
            font-size: 1.25em;
            margin-left: 5px;
            width: 160px;
            min-width: 160px;
            height: 100%;
            line-height: 44px;
            text-align: center;
            user-select: none;
            cursor: pointer;
            transition: all 0.4s;
        }
    }

    .selected {
        color: #fff;
        box-sizing: border-box;
        font-weight: 700;
        border-bottom: solid 1px #39aceb;
        transition: all 0.4s;
    }
}
</style>
