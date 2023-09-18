<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAnimeWorks } from '../stores/animeWorks'
import WorksDialog from './WorksDialog.vue'
//const props = 
const props = defineProps({
    isHome: Boolean
})

const animeWorks = useAnimeWorks();
const refDialog = ref<boolean>(false)
const refDialogID = ref<string>('')

const dialogOpen = (id: string) => {
    refDialog.value = true;
    refDialogID.value = id;
}
const dialogClose = () => {
    refDialog.value = false;
}

onMounted(() => {
    if (props.isHome) {
        animeWorks.getWatchHistory()
    }
})

</script>

<template>
    <Transition name="works-card">
        <!-- <div v-if="isHome" class="home-card">
            <div v-for="data in animeWorks.animeData" class="home-works-card" v-on:click="dialogOpen(data.id)">
                <div class="home-works-images" :style="{ backgroundImage: `url(${data.images_url})` }">
                </div>
                <div class="home-works-context">
                    <p>{{ data.title }}</p>
                </div>
            </div>
        </div> -->
        <div v-if="isHome" class="test-card">
            <div v-for="data in animeWorks.animeData" class="test-works-card" v-on:click="dialogOpen(data.id)">
                <div class="test-images">
                    <img :src='data.images_url' alt="horimiya">
                </div>
                <div class="test-works-context">
                    <p>{{ data.title }}</p>
                </div>
            </div>
        </div>
        <div v-else class="history-card">
            <div v-for="data in animeWorks.watchData" class="history-works-card" v-on:click="dialogOpen(data.worksID)">
                <div class="history-works-images" :style="{ backgroundImage: `url(${data.images_url})` }">
                </div>
                <div class="history-works-context">
                    <p>{{ data.title }}</p>
                    <p>觀看日期:{{ data.watchDate }}</p>
                </div>
            </div>
        </div>
    </Transition>
    <WorksDialog :diaLogShow="refDialog" :worksID="refDialogID" @wokrs-dialog-close="dialogClose"
        @close-dialog="dialogClose" />
</template>

<style lang="scss">
.test-card {
    // margin: 0 -12px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    min-height: 215px;
    padding: 12px 10px 12px 15px;

    .test-works-card {
        width: calc(var(--card-columns));
        //var(--card-columns)
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0px 4px 8px;
        box-sizing: border-box;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.22s;
        background-color: hsla(0, 0%, 100%, 0.19);

        &:hover {
            z-index: 2;
            transform: scale(1.06);
            background-color: hsl(345, 17%, 36%);
            filter: drop-shadow(0 0 0.75rem black);
        }
    }

    .test-images {
        position: relative;
        padding: 0 0 140.5% 0;
        height: 0;
        overflow: hidden;

        >img {
            width: 100%;
            transition-duration: 500ms;
            transform: scale(1.01);
        }
    }

    .test-works-context {
        >p {
            margin: 0;
            padding: 6px;
            font-weight: 700;
            color: #eee;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

}

.home-card {
    gap: 8px;
    padding: 12px 12px 12px 15px;
    display: grid;
    flex-wrap: wrap;
    grid-auto-rows: auto;
    grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));

    .home-works-card {
        border-radius: 8px;
        overflow: hidden;
        user-select: none;
        background-color: hsla(0, 0%, 100%, 0.19);
        transition: all 0.22s;

        // will-change: transform;
        .home-works-images {
            height: 0;
            overflow: hidden;
            padding-bottom: 140%;
            background-size: 100% 100%;
            background-position: center;
            background-color: #6b6363;
        }

        .home-works-context {
            >p {
                margin: 0;
                padding: 6px;
                font-weight: 700;
                color: #eee;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        &:hover {
            z-index: 2;
            transform: scale(1.05);
            background-color: hsl(345, 17%, 36%);
            filter: drop-shadow(0 0 0.75rem black);
        }
    }
}

.history-card {
    gap: 8px;
    padding: 12px 12px 12px 15px;
    display: grid;
    flex-wrap: wrap;
    grid-auto-rows: auto;
    grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));

    .history-works-card {
        border-radius: 8px;
        overflow: hidden;
        user-select: none;
        background-color: hsla(0, 0%, 100%, 0.19);
        transition: all 0.24s;

        .history-works-images {
            height: 0;
            overflow: hidden;
            padding-bottom: 140%;
            background-size: 100% 100%;
            background-position: center;
            background-color: #6b6363;
        }

        .history-works-context {
            padding: 6px;

            >p {
                margin: 0;
                font-weight: 700;
                color: #eee;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        &:hover {
            z-index: 2;
            transform: scale(1.05);
            background-color: hsl(345, 17%, 36%);
            filter: drop-shadow(0 0 0.75rem black);
        }
    }


}

.works-card-enter-from {
    opacity: 0;
}

.works-card-leave-to {
    opacity: 0;
}

.works-card-enter-active,
.works-card-leave-active {
    transition: opacity 0.3s;
}
</style>
