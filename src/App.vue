<script setup lang="ts">
import { onMounted, onErrorCaptured } from "vue";
// import { useAnimeWorks } from "@/stores/animeWorks";
import { useDrakModeStore } from "@/stores/drakMode";
// import { useUserControl } from "@/stores/userControl";
import { useLoginModalStore } from "@/stores/loginModalStore";
import { useErrorStore } from "@/stores/errorStore";
import ErrorNotifications from "@/components/ErrorNotifications.vue";
import LoginModal from "@/components/LoginModal.vue";

const drakMode = useDrakModeStore();
const errorStore = useErrorStore();

// const animeWorks = useAnimeWorks();
// const userControll = useUserControl();
const loginModalStore = useLoginModalStore();

onErrorCaptured((_instance) => {
	errorStore.addError("アプリケーションエラーが発生しました", "error");
	return false;
});

const fnInit = () => {
	if (drakMode.drakState) {
		document.documentElement.setAttribute("data-theme", "dark");
	} else {
		document.documentElement.setAttribute("data-theme", "dark");
	}
	document.title = "Home - Anireki";
};

onMounted(() => {
	fnInit();
});
</script>

<template>
	<ErrorNotifications />
	<LoginModal
		:isVisible="loginModalStore.isVisible"
		:title="loginModalStore.title"
		:message="loginModalStore.message"
		@close="loginModalStore.hideModal"
	/>
	<router-view />
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}

.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
