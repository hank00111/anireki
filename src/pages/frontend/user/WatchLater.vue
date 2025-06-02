<script setup lang="ts">
import { onMounted } from 'vue';

import Header from '../../../components/Header.vue'
import Sidebar from '../../../components/Sidebar.vue'
import WorksCard from '../../../components/WorksCard.vue';
import { updateSEO } from '../../../utils/seo';


onMounted(() => {
    updateSEO('watchlater');
})

</script>

<template>
    <Sidebar></Sidebar>
    <div class="main">
        <Header></Header>
        <div class="content">
            <WorksCard :from-Page="3"></WorksCard>
        </div>
    </div>
</template>

<style lang="scss"></style>
