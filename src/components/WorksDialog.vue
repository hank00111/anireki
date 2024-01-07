<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useAnimeWorks } from '../stores/animeWorks'
import { useUserControl } from '../stores/userControl';
import DateSel from './DateSel.vue'

const props = defineProps({
    diaLogShow: Boolean,
    worksID: String
})

const animeWorks = useAnimeWorks();
const userControll = useUserControl();
const showAnime = ref();
const dateShow = ref(false);
const deleteShow = ref(false);
const seasonCoverClass = ref('');
const viewed = ref(false);
const isWatchLater = ref(false);


const dateOpen = () => {
    animeWorks.watchYear = new Date().getFullYear();
    animeWorks.watchMonth = new Date().getMonth() + 1;
    animeWorks.watchDay = new Date().getDate();
    dateShow.value = !dateShow.value;
}
const deleteOpen = () => {
    dateShow.value = !dateShow.value;
    deleteShow.value = !deleteShow.value;
}
const addToWatchHistory = () => {
    dateShow.value = !dateShow.value;
    if (props.worksID) {
        animeWorks.addWatchHistory(props.worksID);
    }
}

const deleteWatchHistory = () => {
    dateShow.value = !dateShow.value;
    deleteShow.value = !deleteShow.value;
    if (props.worksID) {
        animeWorks.deleteWatchHistory(props.worksID);
    }
}

const seasonCover = (season: string) => {
    const seasonMappings: { [key: string]: { className: string; text: string } } = {
        winter: { className: "tag-Fuyu", text: "冬" },
        spring: { className: "tag-Haru", text: "春" },
        summer: { className: "tag-Natsu", text: "夏" },
        autumn: { className: "tag-Aki", text: "秋" }
    };

    for (const key in seasonMappings) {
        if (season.includes(key)) {
            seasonCoverClass.value = seasonMappings[key].className;
            return season.replace(`-${key}`, seasonMappings[key].text);
        }
    }
}

const addToWatchLater = () => {
    isWatchLater.value = true;
}

const deleteWatchLater = () => {
    isWatchLater.value = false;
}

watchEffect(() => {
    if (props.diaLogShow) {
        showAnime.value = animeWorks.originData.find((anime) => anime.id === props.worksID);
        if (props.worksID) {
            viewed.value = animeWorks.checkWatchHistory(props.worksID);
        }
    } else {
        dateShow.value = false;
        deleteShow.value = false;
    }
})
// onMounted(() => {
//     // animeWorks.getWatchHistory()
//     // refDialog.value = props.diaLogShow
// })
</script>

<template>
    <Transition name="works-dialog">
        <div class="wokrs-dialog-mask" v-if="props.diaLogShow">
            <div class="works-dialog-warp" @click="$emit('wokrs-dialog-close')"></div>
            <div class="wokrs-dialog-container">
                <Transition name="works-dialog">
                    <div v-if="dateShow" class="works-dialog-date-container">
                        <div v-if="userControll.isLogin" class="wokrs-dialog-date-ch">
                            <div v-if="!deleteShow" class="works-dialog-date">
                                <p>日期選擇</p>
                                <div class="works-dialog-date-context">
                                    <DateSel />
                                </div>
                                <div class="works-dialog-date-bt">
                                    <button @click="addToWatchHistory(); $emit('close-dialog');">確定</button>
                                </div>
                            </div>
                            <div v-else class="wokrs-dialog-delete">
                                <p>確定刪除觀看紀錄?</p>
                                <div class="works-dialog-delete-bt">
                                    <button @click="deleteWatchHistory(); $emit('close-dialog');">確定</button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="wokrs-dialog-date-ch">
                            <div class="wokrs-dialog-login">
                                <a href="https://a2.anireki.com/v2/auth/google">
                                    請先登入
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-else></div>
                </Transition>

                <div class="wokrs-dialog-img-area">
                    <div class="wokrs-dialog-img" :style="{ backgroundImage: `url(${showAnime.images_url})` }">
                    </div>
                </div>

                <div class="wokrs-dialog-info">
                    <div class="works-dialog-info-tag">
                        <span v-show="showAnime.media">{{ showAnime.media }}</span>
                        <span v-show="showAnime.media" class="ml-6" :class="[seasonCoverClass]">
                            {{ seasonCover(showAnime.season) }}</span>
                    </div>
                    <div class="works-dialog-info-title">
                        {{ showAnime.title === "" ? showAnime.title_jp : showAnime.title }}
                    </div>
                    <div class="works-dialog-info-title_jp"> {{ showAnime.title_jp }}</div>
                    <div class="works-dialog-info-context">
                        <div class="works-dialog-info-copyright">
                            <span>© </span>
                            <span>{{ showAnime.copyright }}</span>
                        </div>
                    </div>
                    <div class="works-dialog-control-bt">
                        <div v-if="!isWatchLater" class="works-dialog-control-watchlater" @click="addToWatchLater">
                            <svg height="34" width="34" viewBox="0 -1020 960 960" fill="currentColor">
                                <path
                                    d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
                            </svg>
                        </div>
                        <div v-else class="works-dialog-control-watchlater" :class="{ isWatchlater: isWatchLater }"
                            @click="deleteWatchLater">
                            <svg height="34" width="34" viewBox="0 -1020 960 960" fill="currentColor">
                                <path
                                    d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z" />
                            </svg>
                        </div>
                        <button v-if="!viewed" @click="dateOpen">新增至觀看紀錄</button>
                        <button v-else class="works-dialog-control-bt-delete" @click="deleteOpen">刪除觀看紀錄</button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss">
.wokrs-dialog-mask {
    position: fixed;
    z-index: 2000;
    inset: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1717178e;
    backdrop-filter: blur(4px);
}

.works-dialog-warp {
    width: 100%;
    height: 100%;
}

.wokrs-dialog-container {
    position: fixed;
    width: 70%;
    height: 65%;
    margin: 0 auto;
    display: flex;
    border-radius: 15px;
    background: #232932;
    filter: drop-shadow(0 0 0.75rem black);

    .wokrs-dialog-img-area {
        width: 685px;
        // min-width: 450px;

        .wokrs-dialog-img {
            width: 100%;
            height: 100%;
            border-radius: 14px 0px 0px 14px;
            // background-size: contain;
            // background-position: center;
            // background-repeat: no-repeat;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            object-fit: cover;

        }
    }

    .wokrs-dialog-info {
        width: 100%;
        height: 100%;
        padding: 8px;
        word-break: break-all;
        position: relative;
        display: flex;
        flex-direction: column;

        .works-dialog-info-tag {
            display: flex;

            .tag-Fuyu {
                background-color: #8791B5;
            }

            .tag-Haru {
                background-color: #e94e66;
            }

            .tag-Natsu {
                background-color: #6FA0D8;
            }

            .tag-Aki {
                background-color: #F36E3C;
            }

            >span {
                background-color: #2985be;
                padding: 0.24em 0.64em;
                font-size: .82em;
                line-height: 1;
                color: #fff;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
                border-radius: 1rem;
                user-select: none;
            }
        }


        .works-dialog-info-title {
            color: #fff;
            font-size: 1.6em;
            font-weight: 700;
            letter-spacing: .02em;
            line-height: 36px;
        }

        .works-dialog-info-title_jp {
            font-size: 1.1em;
            letter-spacing: .02em;
        }

        .works-dialog-info-context {
            height: 100%;
        }

        .works-dialog-info-copyright {
            font-size: 70%;
            margin-bottom: 8px;
        }

        .works-dialog-control-bt {
            display: flex;
            justify-content: right;
            user-select: none;

            >button {
                color: #fff;
                border: 0;
                padding: 0;
                width: 176px;
                height: 54px;
                font-size: 1.2em;
                font-weight: 600;
                border-radius: 10px;
                background: hsla(0, 0%, 100%, .2);
                transition: all 0.3s;

                &:hover {
                    background: #fff;
                    color: #000;
                }

                &:active {
                    transition: all 0.2s;
                    transform: scale(0.9);
                }
            }

            .works-dialog-control-watchlater {
                display: flex;
                margin-right: 10px;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    color: #ffb429;
                }
            }

            .isWatchlater {
                color: #ffb429;
            }
        }

        .works-dialog-control-bt-delete {
            background: hsla(0, 100%, 50%, 0.5);
        }
    }

}

.works-dialog-date-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    backdrop-filter: blur(5px);

    .wokrs-dialog-date-ch {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wokrs-dialog-delete {
        color: #fff;
        padding: 16px;
        font-size: 1.3em;
        border-radius: 10px;
        background: #232932;
        filter: drop-shadow(0 0em 0.8em black);

        >p {
            margin-top: 4px;
        }

        .works-dialog-delete-bt {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;

            >button {
                color: #fff;
                border: 0;
                padding: 0;
                width: 96px;
                height: 44px;
                font-size: 1.1em;
                font-weight: 600;
                border-radius: 10px;
                background: hsla(0, 0%, 100%, .2);
                transition: all 0.3s;

                &:hover {
                    background: #fff;
                    color: #000;
                }

                &:active {
                    transition: all 0.2s;
                    transform: scale(0.9);
                }
            }
        }
    }

    .wokrs-dialog-login {
        color: #fff;
        width: 120px;
        height: 50px;
        background: hsla(0, 0%, 100%, .2);
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 5px;

        >a {
            font-size: 1.2em;
            display: block;
            width: 100%;
            color: #fff;
            line-height: 50px;
            text-decoration: none;
        }
    }

    .works-dialog-date {
        position: relative;
        min-width: 35%;
        display: flex;
        border-radius: 10px;
        flex-direction: column;
        background: #232932;
        padding: 4px;
        filter: drop-shadow(0 0em 0.8em black);

        >p {
            color: #fff;
            margin: 0;
            padding: 12px;
            font-size: 1.5em;
        }

        .works-dialog-date-context {
            min-height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .works-dialog-date-bt {
            display: flex;
            align-items: end;
            justify-content: flex-end;
            height: 100%;
            padding: 10px 10px 10px 0;

            >button {
                color: #fff;
                border: 0;
                padding: 0;
                width: 120px;
                height: 54px;
                font-size: 1.2em;
                font-weight: 600;
                border-radius: 10px;
                background: hsla(0, 0%, 100%, .2);
                transition: all 0.3s;

                &:hover {
                    background: #fff;
                    color: #000;
                }

                &:active {
                    transition: all 0.2s;
                    transform: scale(0.9);
                }
            }
        }
    }
}

.works-dialog-enter-from {
    opacity: 0;
}

.works-dialog-leave-to {
    opacity: 0;
}

.works-dialog-enter-active,
.works-dialog-leave-active {
    transition: opacity 0.3s;
}
</style>
