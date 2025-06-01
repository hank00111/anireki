<script setup lang="ts">
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";
import Loading from "../components/Loading.vue";
import Notifications from "../components/Notifications.vue";
import ConsoleSidebar from "../components/ConsoleSidebar.vue";
import ContextMenu from "../components/ContextMenu.vue";
import DeleteConfirmModal from "../components/DeleteConfirmModal.vue";
import { useAnimeWorks } from "../stores/animeWorks";
import { useUserControl } from "../stores/userControl";
import { useAnirekiConsole } from "../stores/anirekiConsole";

const animeWorks = useAnimeWorks();
const userControll = useUserControl();
const anirekiConsole = useAnirekiConsole();

const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedWorksId = ref("");
const selectedWorksTitle = ref("");

const showDeleteModal = ref(false);

const dateConvert = (date: string) => {
	const objectDate = new Date(+date * 1000);
	const year = objectDate.getFullYear();
	const month =
		objectDate.getMonth() + 1 < 10 ? "0" + (objectDate.getMonth() + 1) : objectDate.getMonth() + 1;
	const day = objectDate.getDate() < 10 ? "0" + objectDate.getDate() : objectDate.getDate();
	return `${year}-${month}-${day}`;
};

const handleRightClick = (event: MouseEvent, worksId: string, worksTitle: string) => {
	event.preventDefault();
	showContextMenu.value = true;
	contextMenuX.value = event.clientX;
	contextMenuY.value = event.clientY;
	selectedWorksId.value = worksId;
	selectedWorksTitle.value = worksTitle;
};

const hideContextMenu = () => {
	showContextMenu.value = false;
};

const handleDeleteRequest = () => {
	showContextMenu.value = false;
	showDeleteModal.value = true;
};

const confirmDelete = async () => {
	showDeleteModal.value = false;
	await animeWorks.deleteWorks(selectedWorksId.value);
};

const cancelDelete = () => {
	showDeleteModal.value = false;
};

onMounted(async () => {
	await animeWorks.getAnimeData();
});
</script>

<template>
	<Loading :console-show="false" :show="!userControll.checkConsole && anirekiConsole.logLoading" />
	<ConsoleSidebar></ConsoleSidebar>
	<div class="main" @click="hideContextMenu">
		<Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
		<Header class="console-header" :is-console="true"></Header>
		<div class="content console-content">
			<div class="works-list-container">
				<div
					v-for="data in animeWorks.originData"
					:key="data.id"
					class="works-list-card"
					@contextmenu="handleRightClick($event, data.id, data.title)"
				>
					<router-link class="works-list-image-container" :to="{ name: 'works', params: { id: data.id } }">
						<div class="works-list-image" :style="{ backgroundImage: `url(${data.images_url})` }"></div>
					</router-link>
					<div class="works-list-context">
						<p>ID:{{ data.id }}</p>
						<p>中文名稱:{{ data.title }}</p>
						<p>日文名稱:{{ data.title_jp }}</p>
						<p>季度:{{ data.season }}</p>
						<p>播映方式:{{ data.media }}</p>
						<p>Copyright:{{ data.copyright }}</p>
						<p>
							日本首播日:{{ !data.StartedAt_jp || data.StartedAt_jp === "" ? "Null" : data.StartedAt_jp }}
						</p>
						<p>
							台灣首播日:{{ !data.StartedAt_tw || data.StartedAt_tw === "" ? "Null" : data.StartedAt_tw }}
						</p>
						<p>建立時間:{{ dateConvert(data.createdAt) }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ContextMenu
		:show="showContextMenu"
		:X="contextMenuX"
		:Y="contextMenuY"
		:id="selectedWorksId"
		@delete="handleDeleteRequest"
	/>

	<DeleteConfirmModal
		:show="showDeleteModal"
		:works-title="selectedWorksTitle"
		@confirm="confirmDelete"
		@cancel="cancelDelete"
	/>
</template>

<style lang="scss">
.works-list-container {
	width: 100%;
	height: 100%;
	padding-left: 10px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	.works-list-card {
		height: auto; //12em
		margin: 8px 8px;
		display: flex;
		background: #5a5a5a;
		border-radius: 10px;
		width: var(--card-columns);

		&:hover {
			background: #4d6070;
			transition-duration: 200ms;
		}
	}

	.works-list-image-container {
		background: #b96868;
		height: 100%;
		min-width: 8em;
		border-radius: 10px 0px 0px 10px;
	}

	.works-list-image {
		background: transparent 50% no-repeat;
		background-size: cover;
		height: 100%;
		border-radius: 10px 0px 0px 10px;
	}

	.works-list-context {
		padding: 6px;
		overflow: hidden;

		> p {
			margin: 0;
			color: #fff;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
</style>
