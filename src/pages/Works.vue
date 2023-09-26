<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue';
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
// import WorksCard from '../components/WorksCard.vue';
import { useAnimeWorks } from '../stores/animeWorks'

const route = useRoute();
const animeWorks = useAnimeWorks();

const workSeason = ref<string>("")
const worksTitle = ref<string>("")
const worksTitle_jp = ref<string>("")
const startedAt_tw = ref<string>("")
const startedAt_jp = ref<string>("")
const worksImages = ref<any>()
const worksImagesUrl = ref<any>()
const worksImageLoad = ref<boolean>(false)

const changeTextref = ref<string>("");


const imageSel = (e: any) => {
    worksImages.value = e.target.files[0];
}


const updateWorks = () => {
    let data = {
        id: animeWorks.worksData.id,
        worksTitle_jp: animeWorks.worksData.title_jp,
        changeData: {},
        user: {
            name: animeWorks.userControll.name,
            picture: animeWorks.userControll.picture,
        },
        // image: '',
    }
    let changeText = "更新";

    if (animeWorks.worksData.title != worksTitle.value && worksTitle.value.length > 0) {
        Object.assign(data.changeData, { Title: { old: animeWorks.worksData.title, new: worksTitle.value } })
        changeText += `title: ${animeWorks.worksData.title} => ${worksTitle.value}\n`;
    }
    if (animeWorks.worksData.title_jp != worksTitle_jp.value && worksTitle_jp.value.length > 0) {
        Object.assign(data.changeData, { Title_jp: { old: animeWorks.worksData.title_jp, new: worksTitle_jp.value } });
        changeText += `title_jp: ${animeWorks.worksData.title_jp} => ${worksTitle_jp.value}\n`;
    }
    if (animeWorks.worksData.season != workSeason.value && workSeason.value.length > 0) {
        Object.assign(data.changeData, { season: { old: animeWorks.worksData.season, new: workSeason.value } });
        changeText += `season: ${animeWorks.worksData.season} => ${workSeason.value}\n`;
    }
    if (animeWorks.worksData.StartedAt_tw != startedAt_tw.value && startedAt_tw.value.length > 0) {
        Object.assign(data.changeData, { StartedAt_tw: { old: animeWorks.worksData.StartedAt_tw, new: startedAt_tw.value } });
        changeText += `StartedAt_tw: ${animeWorks.worksData.StartedAt_tw} => ${startedAt_tw.value}\n`;
    }
    if (animeWorks.worksData.StartedAt_jp != startedAt_jp.value && startedAt_jp.value.length > 0) {
        Object.assign(data.changeData, { StartedAt_jp: { old: animeWorks.worksData.StartedAt_jp, new: startedAt_jp.value } });
        changeText += `StartedAt_jp: ${animeWorks.worksData.StartedAt_jp} => ${startedAt_jp.value}\n`;
    }
    if (worksImages.value != undefined) {
        const imageID = animeWorks.worksData.images_url.split('/')[3];
        Object.assign(data.changeData, { image: { new: imageID } });
        Object.assign(data, { image: worksImages.value });
        changeText += `圖片\n`;
    }
    if (changeText != "更新") {
        console.log(data.changeData);
        changeTextref.value = changeText;
        // console.log(changeText);
        animeWorks.updateWorks(data);
    }

}

watch(worksImages, (worksImages) => {
    let fileReader = new FileReader();
    worksImageLoad.value = false;
    fileReader.readAsDataURL(worksImages)
    fileReader.addEventListener('load', () => {
        worksImagesUrl.value = fileReader.result
        worksImageLoad.value = true;
    })
})

onMounted(async () => {
    await animeWorks.getWorks(route?.params.id.toString());
    if (animeWorks.worksLoaded) {
        document.title = `${animeWorks.worksData.title} - Anireki`;
        startedAt_tw.value = animeWorks.worksData.StartedAt_tw;
        startedAt_jp.value = animeWorks.worksData.StartedAt_jp;
    } else {
        document.title = `Works - Anireki`;
    }
    // animeWorks.getAnimeData();
    // animeWorks.getWatchHistory();
})

</script>

<template>
    <Loading :console-show="false" :show="!animeWorks.worksLoaded" />
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Header class="console-header"></Header>
        <div class="content console-content">
            <div v-if="animeWorks.worksLoaded" class="works-container">
                <div class="works-content">
                    <div class="works-item">
                        <p>ID</p>
                        <input type="text" :placeholder="animeWorks.worksData.id" readonly="true">
                    </div>
                    <div class="works-item">
                        <p>年份季度 - winter,spring,summer,autumn</p>
                        <input type="text" v-model="workSeason" :placeholder="animeWorks.worksData.season">
                    </div>
                    <div class="works-item">
                        <p>中文名稱</p>
                        <input type="text" v-model="worksTitle" :placeholder="animeWorks.worksData.title">
                    </div>
                    <div class="works-item">
                        <p>日文名稱</p>
                        <input type="text" v-model="worksTitle_jp" :placeholder="animeWorks.worksData.title_jp">
                    </div>
                    <div style="display: flex;">
                        <div class="works-item">
                            <p>台灣首播日</p>
                            <input type="date" v-model="startedAt_tw" style="width: 180px;">
                        </div>
                        <div class="works-item" style="margin-left: 10px;">
                            <p>日本首播日</p>
                            <input type="date" v-model="startedAt_jp" style="width: 180px;">
                        </div>
                    </div>
                    <div class="works-item">
                        <p>主視覺圖</p>
                        <input class="works-item-imageUp" type="file" v-on:change="imageSel">
                    </div>
                    <Transition>
                        <div class="works-image">
                            <img :src="animeWorks.worksData.images_url" style="margin-right: 50px;" alt="">
                            <img :src="worksImagesUrl" alt="">
                        </div>
                    </Transition>
                    <div class="works-item">
                        <button @click="updateWorks">更新</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.works-container {
    height: 100%;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-width: 80%;

    .works-content {
        padding: 0.8em;
    }

    .works-item {
        display: flex;
        flex-direction: column;
        color: #fff;

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
            background-color: #f18d00;
            transition: 0.2s;

            &:hover {
                background-color: #d57d01;
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

            // &::placeholder {
            //     color: #fff;
            // }
        }
    }

    .works-image {
        display: flex;
        width: 360px;
        margin-bottom: 20px;

        >img {
            width: 100%;
        }
    }

    .works-item-imageUp {
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
</style>
