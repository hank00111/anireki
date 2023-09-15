<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useAnimeWorks } from '../stores/animeWorks';

const props = defineProps({
    show: Boolean,
    X: Number,
    Y: Number,
    id: String,
})
const animeWorks = useAnimeWorks();
const menu = ref();
const w = ref(0);
const h = ref(0);
const addWatchHistory = () => {
    animeWorks.addWatchHistory(props?.id || '0');
    console.log("add")

}

watchEffect(() => {
    if (menu.value != undefined) {
        let dw = 160;
        let dh = 48;
        w.value = props.X || 0;
        h.value = props.Y || 0;

        if ((w.value + dw) >= window.innerWidth) {
            w.value = w.value - dw;
            console.log(w)
        }
        if ((h.value + dh) >= window.innerHeight) {
            h.value = h.value - dh;
            console.log(h)
        }
    }
})
// onMounted(() => window.addEventListener('mousemove', update))
// onUnmounted(() => window.removeEventListener('mousemove', update))

</script>

<template>
    <div v-if="show" class="context" id="con" :style="{ transform: `translate(${w}px,${h}px)` }" ref="menu">
        <div class="context-menu">
            <ul class="context-menu-ul">
                <li>
                    <button class="context-menu-ul-li-button" @click="addWatchHistory">
                        <span>
                            新增至觀看紀錄
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
    <div v-else></div>
</template>

<style lang="scss">
.context {
    // vertical-align: baseline;
    z-index: 9999;
    position: absolute;
    inset: 0px auto auto 0px;
    // margin: 0px;
    // transform: translate(612px, 525px);

    .context-menu-ul {
        -webkit-app-region: no-drag;
        background-color: #282828;
        border-radius: 4px;
        -webkit-box-shadow: 0 16px 24px rgba(0, 0, 0, .3), 0 6px 8px rgba(0, 0, 0, .2);
        box-shadow: 0 16px 24px rgba(0, 0, 0, .3), 0 6px 8px rgba(0, 0, 0, .2);
        max-height: calc(100vh - 24px);
        max-width: 350px;
        min-width: 160px;
        overflow-y: auto;
        padding: 4px;
        margin: 0;
    }

    .context-menu-ul-li-button {
        background: transparent;
        border: 0;
        border-radius: 2px;
        color: hsla(0, 0%, 100%, .9);
        cursor: default;
        text-decoration: none;
        -webkit-padding-end: 8px;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        gap: 8px;
        height: 40px;
        justify-content: space-between;
        padding: 12px;
        padding-inline-end: 8px;
        position: relative;
        text-align: start;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 100%;

        &:hover {
            background-color: hsla(0, 0%, 100%, .1);
            color: #fff;
            text-decoration: none;
        }

        >span {
            font-size: 1.1em;
        }
    }
}
</style>
