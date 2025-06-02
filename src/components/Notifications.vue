<script setup lang="ts">
import { watchEffect } from 'vue';
import { useAnimeWorks } from '@/stores/animeWorks'
const animeWorks = useAnimeWorks();
defineProps({
    show: Boolean,
    info: String,
})

// onMounted(() => {
//     if (animeWorks.infoStatus) {
//         setTimeout(() => {
//             animeWorks.infoStatus = false
//         }, 4000)
//     }
// })

watchEffect(() => {
    if (animeWorks.infoStatus) {
        setTimeout(() => {
            animeWorks.infoStatus = false
        }, 3000)
    }
})

</script>

<template>
    <Transition name="notifications">
        <div v-if="show" class="notifications">
            <!-- <div class="loading" :class="[consoleShow ? consoleLoad : '']">
                <div class="loader">
                </div>
            </div> -->
            <div class="notifications-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
                    <path
                        d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                {{ info }}
            </div>
        </div>
        <div v-else></div>
    </Transition>
</template>

<style lang="scss" scoped>
.notifications {
    position: fixed;
    z-index: 9998;
    top: 0;
    width: 100%;
    height: 64px;
    background-color: #007c45;
    // margin-right: 240px;

    .notifications-content {
        color: #fff;
        padding: 10px;
        display: flex;
        font-size: 1.25em;
        font-weight: 600;
        line-height: 44px;
        flex-direction: row;
        padding-right: 235px;
        transform: scale(1, 0.95);

        >svg {
            margin-top: 10px;
            margin-right: 5px;
        }
    }

}

.notifications-enter-from {
    transform: translateY(-100%);
}

.notifications-leave-to {
    transform: translateY(-100%);
}

.notifications-enter-active {
    transition: 0.5s ease-out;
}

.notifications-leave-active {
    transition: 0.8s ease-in-out;
}
</style>
