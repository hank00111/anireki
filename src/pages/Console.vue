<script setup lang="ts">
import {  onMounted } from 'vue';
import Header from '../components/Header.vue'
import Notifications from '../components/Notifications.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import { useAnimeWorks } from '../stores/animeWorks'

const animeWorks = useAnimeWorks();

onMounted(() => {
    document.title = 'Console - Anireki';
    // if (noti.value) {
    //     setTimeout(() => {
    //         noti.value = !noti.value
    //     }, 2000)
    // }
    console.log(animeWorks.infoStatus)
})
</script>

<template>
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
        <Header class="console-header"></Header>
        <div class="content console-content">活動</div>
    </div>
</template>

<style lang="scss"></style>
