<script setup lang="ts">
import { onMounted } from "vue";
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import WorksCard from "@/components/WorksCard.vue";
import Footer from "@/components/Footer.vue";
import Notifications from "@/components/Notifications.vue";
import { useAnimeWorks } from "@/stores/animeWorks";
import { useUserControl } from "@/stores/userControl";
import { updateSEO, generateWebsiteSchema } from "@/utils/seo";

const animeWorks = useAnimeWorks();
const userControll = useUserControl();

const rightEventClose = (e: { preventDefault: () => void }) => {
	e.preventDefault();
};

onMounted(() => {
	animeWorks.SysSeason();
	updateSEO("home");
	generateWebsiteSchema();
});

// onBeforeMount(() => {
// 	// animeWorks.getAnimeData();
// });
</script>

<template>
	<Sidebar @click.right="rightEventClose($event)"></Sidebar>
	<div class="main" @click.right="rightEventClose($event)">
		<div class="fixed-header">
			<Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
			<Header :is-home="true"></Header>
		</div>
		<div class="content">
			<WorksCard :from-Page="'home'" :is-login="userControll.isLogin"></WorksCard>
			<Footer />
		</div>
	</div>
</template>

<style scoped lang="scss">
.fixed-header {
	flex-shrink: 0;
	position: sticky;
	top: 0;
	z-index: 100;
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	height: auto !important;
	min-height: 0;
}

@media (max-width: 768px) {
	.main {
		height: calc(100vh - 72px);
	}
}
</style>
