<script setup lang="ts">
import { ref } from 'vue';

defineProps({
    show: Boolean,
    consoleShow: Boolean
})
const consoleLoad = ref<string>('console-loading ')
// console.log(props)

</script>

<template>
    <Transition name="loading">
        <div v-if="show" class="loading-mask">
            <div class="loading" :class="[consoleShow ? consoleLoad : '']">
                <div class="loader">
                </div>
            </div>
        </div>
        <div v-else></div>
    </Transition>
</template>

<style lang="scss">
.loading-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #0000009a;
    display: flex;
    justify-content: center;
    align-items: center;

    .loading {
        width: 110px;
        height: 110px;
        
        .loader {
            position: relative;
        }

        .loader::after,
        .loader::before {
            content: '';
            width: 110px;
            height: 110px;
            border-radius: 100%;
            border: 0.23em solid #9ff4ff;
            position: absolute;
            left: 0;
            top: 0;
            animation: animloader 2s linear infinite;
        }

        .loader::after {
            animation-delay: 1s;
            opacity: 0;
        }
    }

    .console-loading {
        margin-left: 215px;
        margin-bottom: 50px;
    }
}

.loading-enter-from {
    opacity: 0;
}

.loading-leave-to {
    opacity: 0;
}

.loading-enter-active,
.loading-leave-active {
    transition: opacity 0.5s;
}

@keyframes animloader {
    0% {
        transform: scale(0.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0;
    }
}
</style>
