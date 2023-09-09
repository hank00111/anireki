<script setup lang="ts">
import Header from '../components/Header.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import { ref, reactive, onMounted, onBeforeMount, watchEffect, watch } from 'vue';
import { useAnimeWorks } from '../stores/animeWorks'

const animeWorks = useAnimeWorks();

interface seasonModel {
    [key: string]: any;
    [index: number]: any;
}
const refTitle = ref<string>("")
const refTitle_jp = ref<string>("")
const refImages = ref<any>()
const refImagesUrl = ref<any>()
const refImageLoad = ref<boolean>(false)

const startYear = ref<string>('1996')
const thisYear = ref<number>(new Date().getFullYear())
const endYear = ref<string>((thisYear.value + 4).toString())
const yearsArray = ref<string[]>(
    [...new Array(+endYear.value - +startYear.value)].map((_, i) => (+startYear.value + i).toString()).reverse()
)

const thisSeason = ref<number>(Math.ceil((new Date().getMonth() + 1) / 3))
const seaSon = reactive<seasonModel>({ 1: '春季', 2: '夏季', 3: '秋季', 4: '冬季', })

const sendData = () => {
    if (animeWorks.worksCount.length >= 1 && refTitle_jp.value.length >= 1) {
        let data = {
            id: animeWorks.worksCount,
            year: thisYear.value,
            season_id: thisSeason.value,
            title: refTitle.value,
            title_jp: refTitle_jp.value,
            image: refImages.value
        }
        animeWorks.addWorks(data);
    } else {
        console.log("ID ERROR")
    }
}
const imageSel = (e: any) => {
    refImages.value = e.target.files[0];
    console.log(e.target.files[0])
}

onBeforeMount(() => {
    animeWorks.getWorksCount();
})

onMounted(() => {
    document.title = 'Console - Anireki';
})

watch(refImages, (refImages) => {
    let fileReader = new FileReader();
    refImageLoad.value = false;
    fileReader.readAsDataURL(refImages)
    fileReader.addEventListener('load', () => {
        refImagesUrl.value = fileReader.result
        refImageLoad.value = true;
    })
})
watchEffect(() => {
    // console.log(thisYear.value)
    // console.log(seaSon[thisSeason.value])
})
</script>

<template>
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Header class="console-header"></Header>
        <div class="content console-content">
            <Transition>
                <div v-if="animeWorks.isLoaded" class="console-container">
                    <div class="card">
                        <div class="card-item">
                            <p>ID</p>
                            <input type="text" :placeholder="animeWorks.worksCount" readonly="true">
                        </div>
                        <div class="card-item">
                            <p>年份</p>
                            <select v-model="thisYear">
                                <option v-for="year in yearsArray" :value="year" :key="year">{{ year }}</option>
                            </select>
                        </div>
                        <div class="card-item">
                            <p>季度</p>
                            <select v-model="seaSon[thisSeason]">
                                <option v-for="(value, index) in seaSon" :value="value" :key="index">{{ value }}</option>
                            </select>
                        </div>
                        <div class="card-item">
                            <p>動畫名稱</p>
                            <input type="text">
                        </div>
                        <div class="card-item">
                            <p>日文名稱</p>
                            <input type="text">
                        </div>
                        <div class="card-item">
                            <p>主視覺圖</p>
                            <input class="card-item-imageUp" type="file" :multiple="true" v-on:change="imageSel">
                        </div>
                        <Transition>
                            <div v-if="refImageLoad" class="card-image"
                                :style="{ backgroundImage: `url(${refImagesUrl})` }"></div>
                        </Transition>
                        <div class="card-item">
                            <button @click="sendData">新增</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss">
.console-container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-width: 80%;
    transition: 0.2s;

    .card {
        // background-color: #2e2f31;
        border-radius: 10px;
        padding: 1.1em;

        .card-item {
            display: flex;
            flex-direction: column;
            color: #ffffff;

            >p {
                margin: 0;
                font-size: 1.3em;
                font-weight: 600;
            }

            >button {
                border: 0;
                height: 48px;
                font-size: 20px;
                font-weight: 600;
                border-radius: 10px;
                background-color: #00a760;
                transition: 0.2s;

                &:hover {
                    background-color: #67be8d;
                }
            }

            >input {
                border: 2px solid #57595d;
                border-radius: 10px;
                color: #ffffff;
                font-size: 1.4em;
                margin-top: 10px;
                margin-bottom: 20px;
                max-width: 100%;
                padding: 10px;
                vertical-align: middle;
                background-color: #141516;
                outline: none;
                transition: 0.2s;

                &:focus {
                    border: 2px solid #91ddf9;
                }

                &:hover {
                    border: 2px solid #91ddf9;
                }
            }

            >select {
                border: 2px solid #57595d;
                border-radius: 10px;
                color: #ffffff;
                font-size: 1.2em;
                margin-top: 10px;
                margin-bottom: 20px;
                padding: 12px;
                background-color: #141516;
                transition: 0.2s;
                background-image: url(../assets/sel.svg);
                background-repeat: no-repeat;
                background-position: right 0.45em center;
                background-size: 28px 28px;
                appearance: none;

                &:focus {
                    outline: none;
                }

                &:hover {
                    border: 2px solid #91ddf9;
                }
            }

            .card-item-imageUp {
                border: 0;
                padding: 0;
                font-size: 20px;
                background-color: #111111;
                margin-bottom: 25px;
                font-size: 1.2em;
                width: 50%;

                &:focus {
                    border: 0;
                }

                &:hover {
                    border: 0;
                }

                &::file-selector-button {
                    cursor: pointer;
                    border: 1px solid rgba(0, 0, 0, 0.16);
                    border-radius: 10px;
                    padding: 2px 10px;
                    font-weight: 600;
                    transition: 200ms;
                    margin-right: 10px;
                }

                &::file-selector-button:hover {
                    background-color: #bbbcbd;
                }
            }
        }

        .card-image {
            height: 0;
            overflow: hidden;
            padding-bottom: 141.5%;
            background-size: cover;
            background-position: center;
            background-color: #6b6363;
            background-repeat: no-repeat;
            margin-bottom: 25px;
        }
    }

}
</style>
