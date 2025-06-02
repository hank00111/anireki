<script setup lang="ts">
import Header from '../../../components/Header.vue'
import Loading from '../../../components/Loading.vue'
import SelBar from '../../../components/SelBar.vue';
import ConsoleSidebar from '../../../components/ConsoleSidebar.vue'
import { ref, reactive, onMounted, onBeforeMount, watchEffect, watch } from 'vue';
import { useAnimeWorks } from '../../../stores/animeWorks'
import { useRouter } from 'vue-router';
import { useErrorStore } from '../../../stores/errorStore';

const animeWorks = useAnimeWorks();
const router = useRouter();
const errorStore = useErrorStore();

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

const showAnnictResults = ref<boolean>(false);
const selectedAnnictWorkId = ref<number | null>(null);

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
        }).catch((error: any) => {
            errorStore.addError(`新增作品失敗: ${error.message || error}`, 'error');
        });
    } else {
        errorStore.addError('請檢查日文名稱', 'error');
    }
};

const selControl = (e: string) => {
    refSel.value = e;
}

const titleCheck = () => {
    console.log("輸入檢查中");
}


const handlePaste = async () => {
    setTimeout(async () => {
        if (refTitle_jp.value && refTitle_jp.value.length >= 2) {
            try {
                refSendPrev.value = Date.now();
                await animeWorks.checkWorks(refTitle_jp.value);
                showAnnictResults.value = animeWorks.annictWorks.length > 0;
                console.log(`貼上後搜索結果: ${animeWorks.annictWorks.length} 個結果`);
            } catch (error: any) {
                errorStore.addError(`貼上後搜尋失敗: ${error.message || error}`, 'error');
            }
        }
    }, 100);
}

const selectAnnictWork = (work: any) => {
    if (!work) return;
    refTitle_jp.value = work.title;
    selectedAnnictWorkId.value = work.id;

    const mediaType = work.media ? work.media.toUpperCase() : '';
    if (mediaType === 'TV') {
        refMedia.value = 'TV';
    } else if (mediaType === 'MOVIE') {
        refMedia.value = '映画';
    } else if (mediaType === 'OVA') {
        refMedia.value = 'OVA';
    } else {
        refMedia.value = '其他';
    }

    if (work.season_name) {
        const seasonParts = work.season_name.split('-');
        const year = seasonParts[0];
        const season = seasonParts[1];

        if (year) {
            thisYear.value = year;
        }

        if (season) {
            const seasonMap: { [key: string]: number } = {
                'winter': 1,
                'spring': 2,
                'summer': 3,
                'autumn': 4,
                'fall': 4
            };

            if (seasonMap[season.toLowerCase()]) {
                refSeason.value = seasonMap[season.toLowerCase()];
                thisSeason.value = seaSon[refSeason.value];
            }
        }
    } else if (work.season_year) {
        thisYear.value = work.season_year.toString();
    }

    if (work.released_on) {
        refStartedAt_jp.value = work.released_on;
    }

    showAnnictResults.value = false;
    animeWorks.selectAnnictWork(work);
}

// Close Annict results window
const closeAnnictResults = () => {
    showAnnictResults.value = false;
    animeWorks.clearAnnictWorks();
}

onBeforeMount(() => {
    animeWorks.getWorksCount();
    animeWorks.clearAnnictWorks();
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

watch(refTitle_jp, async (newValue, oldValue) => {
    if (newValue && newValue.length > 5 && (!oldValue || newValue.length - oldValue.length > 3)) {
        console.log("檢測到可能的貼上操作");
        refSendPrev.value = Date.now();
        try {
            await animeWorks.checkWorks(newValue);
            showAnnictResults.value = animeWorks.annictWorks.length > 0;
        } catch (error: any) {            
            errorStore.addError(`處理文字失敗: ${error.message || error}`, 'error');
        }
        return;
    }

    refSendNow.value = Date.now();
    if (newValue.length >= 2 && refSendNow.value - refSendPrev.value >= 500) {
        refSendLimit.value += 1;
        refSendPrev.value = Date.now();

        try {
            await animeWorks.checkWorks(newValue);
            showAnnictResults.value = animeWorks.annictWorks.length > 0;
        } catch (error: any) {
            errorStore.addError(`搜尋失敗: ${error.message || error}`, 'error');
        }
    }

    if (refSendLimit.value >= 10) {
        refSendLimit.value = 0;
        setTimeout(async () => {
            refSendPrev.value = Date.now();
            try {
                await animeWorks.checkWorks(newValue);
                showAnnictResults.value = animeWorks.annictWorks.length > 0;
            } catch (error: any) {
                errorStore.addError(`延遲搜尋失敗: ${error.message || error}`, 'error');
            }
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
                            <input type="text" v-model="refTitle_jp" @input="titleCheck()" @paste="handlePaste">                            <Transition>
                                <div v-if="showAnnictResults && animeWorks.annictWorks.length > 0"
                                    class="annict-results">
                                    <button class="annict-close-btn" @click="closeAnnictResults">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div v-for="work in animeWorks.annictWorks" :key="work.id" class="annict-work"
                                        @click="selectAnnictWork(work)">
                                        <div class="annict-work-image">
                                            <img v-if="work.images && work.images.recommended_url"
                                                :src="work.images.recommended_url" alt="作品封面">
                                            <img v-else-if="work.images && work.images.facebook && work.images.facebook.og_image_url"
                                                :src="work.images.facebook.og_image_url" alt="作品封面">
                                            <div v-else class="no-image">暫無圖片</div>
                                        </div>
                                        <div class="annict-work-info">
                                            <p class="annict-work-title">{{ work.title }}</p>
                                            <div class="annict-work-details">
                                                <span v-if="work.season_name && work.season_year">{{ work.season_year }}
                                                    {{ work.season_name }}</span>
                                                <span v-if="work.media">{{ work.media }}</span>
                                                <span v-if="work.released_on" class="annict-work-date">放送日: {{
                                                    work.released_on }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="annict-source">source from annict</div>
                                </div>
                            </Transition>
                        </div>
                        <div v-if="selectedAnnictWorkId" class="card-item external-links-container">
                            <div class="external-links">
                                <a :href="`https://annict.com/works/${selectedAnnictWorkId}`" target="_blank"
                                    class="external-link annict-link">
                                    https://annict.com/works/{{ selectedAnnictWorkId }}
                                    <span class="external-link-icon">↗</span>
                                </a>
                                <a :href="`https://abema.tv/search?q=${encodeURIComponent(refTitle_jp)}`"
                                    target="_blank" class="external-link abema-link">
                                    https://abema.tv/search?q={{ refTitle_jp }}
                                    <span class="external-link-icon">↗</span>
                                </a>
                            </div>
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
        position: relative;
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
            margin-bottom: 30px; 
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
            background-image: url(../../../assets/sel.svg);
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

.annict-results {
    position: absolute;
    width: 100%;
    max-height: 350px;
    overflow-y: auto;
    border: 2px solid #57595d;
    border-radius: 10px;
    background-color: #1a1a1a;
    z-index: 10;
    padding: 10px;
    margin-top: 0;
    top: calc(100% - 20px);
    left: 0; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

    .annict-close-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 11;
        
        &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
        
        &:active {
            transform: scale(0.95);
        }
        
        svg {
            width: 14px;
            height: 14px;
        }
    }

    .annict-source {
        font-size: 0.75em;
        color: #888888;
        text-align: right;
        margin-top: 5px;
        padding-right: 5px;
        font-weight: 500;
        letter-spacing: 0.02em; 
        opacity: 0.85;
        font-family: 'Noto Sans JP', sans-serif;
    }

    .annict-work {
        display: flex;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: #2a2a2a;
        }

        .annict-work-image {
            width: 60px;
            height: 60px;
            overflow: hidden;
            margin-right: 10px;
            border-radius: 5px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .no-image {
                width: 100%;
                height: 100%;
                background-color: #333;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #aaa;
                font-size: 0.8em;
                text-align: center;
            }
        }

        .annict-work-info {
            .annict-work-title {
                margin: 0 0 5px 0;
                color: #ffffff;
                font-size: 1em;
            }

            .annict-work-details {
                font-size: 0.85em;
                color: #c0c0c0;

                span {
                    margin-right: 10px;
                }

                .annict-work-date {
                    color: #91ccff;
                }
            }
        }
    }
}

.card-item {
    position: relative;
    // ...existing code...
}

.annict-link-container {
    margin-top: -15px;
    margin-bottom: 15px;

    .annict-link {
        display: inline-flex;
        align-items: center;
        color: #91ccff;
        font-size: 0.9em;
        text-decoration: none;
        padding: 6px 10px;
        border-radius: 6px;
        background-color: rgba(30, 30, 30, 0.5);
        transition: all 0.2s ease;

        &:hover {
            background-color: rgba(50, 50, 50, 0.7);
            color: #b3daff;
            text-decoration: underline;
        }

        .annict-link-icon {
            margin-left: 5px;
            font-size: 0.9em;
        }
    }
}

.ml-10 {
    margin-left: 10px;
}

.external-links-container {
    margin-top: -15px;
    margin-bottom: 15px;

    .external-links {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .external-link {
        display: inline-flex;
        align-items: center;
        color: #91ccff;
        font-size: 0.9em;
        text-decoration: none;
        padding: 6px 10px;
        border-radius: 6px;
        background-color: rgba(30, 30, 30, 0.5);
        transition: all 0.2s ease;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
            background-color: rgba(50, 50, 50, 0.7);
            color: #b3daff;
            text-decoration: underline;
        }

        .external-link-icon {
            margin-left: 5px;
            font-size: 0.9em;
            flex-shrink: 0;
        }
    }

    .abema-link {
        color: #ff8e8e;

        &:hover {
            color: #ffaeae;
        }
    }

}
</style>
