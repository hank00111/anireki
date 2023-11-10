<script setup lang="ts">
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import SelBar from '../components/SelBar.vue';
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import { ref, reactive, onMounted, onBeforeMount, watchEffect, watch } from 'vue';
import { useAnimeWorks } from '../stores/animeWorks'
import { useRouter } from 'vue-router';

const animeWorks = useAnimeWorks();
const router = useRouter();

interface seasonModel {
    [key: number]: any;
    [value: string]: any;
};

const refTitle = ref<string>("");
const refTitle_jp = ref<string>("");
const refImages = ref<any>();
const refImagesUrl = ref<any>();
const refImageLoad = ref<boolean>(false);
const refStartedAt_tw = ref<string>('');
const refStartedAt_jp = ref<string>('');

const startYear = ref<string>('1996');
const thisYear = ref<string>((new Date().getFullYear()).toString());
const endYear = ref<string>((+thisYear.value + 4).toString());
const yearsArray = ref<string[]>(
    [...new Array(+endYear.value - +startYear.value)].map((_, i) => (+startYear.value + i).toString()).reverse()
);

const seaSon = reactive<seasonModel>({ 1: '冬季', 2: '春季', 3: '夏季', 4: '秋季' });
const thisSeason = ref<string>(seaSon[Math.ceil((new Date().getMonth() + 1) / 3)]);
const refSeason = ref<number>(Math.ceil((new Date().getMonth() + 1) / 3));

const media = ref<string[]>(['TV', '映画', 'OVA', '其他']);
const refMedia = ref<string>('TV');
const refCopyRight = ref<string>('');

const refSel = ref<string>('');
const refSendNow = ref<number>(Date.now());
const refSendPrev = ref<number>(0);
const refSendLimit = ref<number>(0);




const imageSel = (e: any) => {
    refImages.value = e.target.files[0];
};

const sendData = () => {
    if (animeWorks.worksCount.length >= 1 && refTitle_jp.value.length >= 1) {
        let data = {
            works: {
                id: animeWorks.worksCount,
                year: thisYear.value,
                media: refMedia.value,
                season_id: refSeason.value,
                copyright: refCopyRight.value,
                title: refTitle.value,
                title_jp: refTitle_jp.value,
                StartedAt_tw: refStartedAt_tw.value,
                StartedAt_jp: refStartedAt_jp.value,
            },
            user: {
                name: animeWorks.userControll.name,
                picture: animeWorks.userControll.picture,
            },
            image: refImages.value
        }
        animeWorks.addWorks(data).then(() => {
            if (animeWorks.sendCode === 0) {
                router.push('/console')
            }
        });
    } else {
        console.log(`SEND ERROR ${animeWorks.worksCount} ${refTitle_jp.value}`)
    }
};

const selControl = (e: string) => {
    refSel.value = e;
}

const titleCheck = () => {

}

onBeforeMount(() => {
    animeWorks.getWorksCount();
});

onMounted(() => {
    document.title = 'Console - Anireki';
});

watch(refImages, (refImages) => {
    let fileReader = new FileReader();
    refImageLoad.value = false;
    fileReader.readAsDataURL(refImages)
    fileReader.addEventListener('load', () => {
        refImagesUrl.value = fileReader.result
        refImageLoad.value = true;
    })
});

watch(thisSeason, (thisSeason) => {
    refSeason.value = parseInt(Object.keys(seaSon).find(key => seaSon[key] === thisSeason) || '5')
    // console.log(refSeason.value);
});

watch(refTitle_jp, (refTitle_jp) => {
    refSendNow.value = Date.now();
    if (refTitle_jp.length >= 1 && refSendNow.value - refSendPrev.value >= 500) {
        console.log(Date.now());
        refSendLimit.value += 1;
        refSendPrev.value = Date.now();
        animeWorks.checkWorks(refTitle_jp);
    }

    if (refSendLimit.value >= 10) {
        refSendLimit.value = 0;
        setTimeout(() => {
            refSendPrev.value = Date.now();
            animeWorks.checkWorks(refTitle_jp);
        }, 5000);
    }
});

watchEffect(() => {
    // console.log(refTitle_jp.value);
    // if (dataStaus.value) {
    //     setTimeout(() => {
    //         dataStaus.value = !dataStaus.value
    //     }, 4000)
    // }
    // console.log(thisYear.value);
});

</script>

<template>
    <Loading :console-show="false" :show="animeWorks.sendStatus" />
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
                        <div class="card-item-block">
                            <div class="card-item-2">
                                <span>播映方式:</span>
                                <SelBar :selID="'A'" :selected="refSel" :selDataArray="media"
                                    v-model:selDataString="refMedia" @click="selControl('A')" />
                            </div>
                            <div class="card-item-2 ml-10">
                                <span>年份:</span>
                                <SelBar :selID="'B'" :selected="refSel" :selDataArray="yearsArray"
                                    v-model:selDataString="thisYear" @click="selControl('B')" />
                            </div>
                            <div class="card-item-2 ml-10">
                                <span>季度:</span>
                                <SelBar :selID="'C'" :selected="refSel" :selDataObject="seaSon"
                                    v-model:selDataString="thisSeason" @click="selControl('C')" />
                            </div>
                        </div>
                        <div class="card-item">
                            <p>日文名稱</p>
                            <input type="text" v-model="refTitle_jp" @input="titleCheck()">
                        </div>
                        <div class="card-item">
                            <p>中文名稱</p>
                            <input type="text" v-model="refTitle">
                        </div>
                        <div class="card-item">
                            <p>Copyright</p>
                            <input type="text" v-model="refCopyRight">
                        </div>
                        <div style="display: flex;">
                            <div class="card-item">
                                <p>日本首播日</p>
                                <input type="date" v-model="refStartedAt_jp" style="width: 180px;">
                            </div>
                            <div class="card-item" style="margin-left: 10px;">
                                <p>台灣首播日</p>
                                <input type="date" v-model="refStartedAt_tw" style="width: 180px;">
                            </div>
                        </div>
                        <div class="card-item">
                            <p>主視覺圖</p>
                            <input class="card-item-imageUp" type="file" :multiple="true" v-on:change="imageSel">
                        </div>
                        <Transition>
                            <div v-if="refImages" class="card-image">
                                <img :src="refImagesUrl" alt="1">
                            </div>
                            <div v-else></div>
                        </Transition>
                        <div class="card-item">
                            <button @click="sendData">新增</button>
                        </div>
                    </div>
                </div>
                <div v-else></div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss">
.console-container {
    height: 100%;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-width: 80%;
    transition: 0.2s;

    .card {
        border-radius: 10px;
        padding: 1.1em;
    }

    .card-item {
        display: flex;
        flex-direction: column;
        color: #ffffff;

        >p {
            margin: 0;
            font-size: 1.3em;
            // font-weight: 600;
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
                border: 2px solid #79d5ff;
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
        margin-bottom: 25px;

        >img {
            width: 100%;
        }
    }

    .card-item-2 {
        display: flex;
        align-items: center;
        font-size: 1.3em;
        color: #fff;
    }

    .card-item-block {
        display: flex;
        margin-bottom: 20px;
    }

}
</style>
