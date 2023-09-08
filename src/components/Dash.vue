<script setup lang="ts">
const { time } = defineProps({
    time: { type: Number },
});

const promise = (time: number | undefined) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

await promise(time);
</script>

<template>
    <img src="https://seeklogo.com/images/V/vite-logo-BFD4283991-seeklogo.com.png" />
</template>