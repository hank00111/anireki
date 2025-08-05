<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAnimeWorks } from "@/stores/animeWorks";
import WorksDialog from "@/components/WorksDialog.vue";
//const props =
const props = defineProps({
	fromPage: String,
});

const animeWorks = useAnimeWorks();
const refDialog = ref<boolean>(false);
const refDialogID = ref<string>("");

const dialogOpen = (id: string) => {
	refDialog.value = true;
	refDialogID.value = id;
};
const dialogClose = () => {
	refDialog.value = false;
};

onMounted(() => {
	if (props.fromPage === "home") {
		animeWorks.getWatchHistory();
	}
});
</script>

<template>
	<Transition name="works-card">
		<div v-if="fromPage === 'home'" class="home-card">
			<div v-for="data in animeWorks.animeData" class="home-works-card" @click="dialogOpen(data.id)">
				<div
					class="home-works-images"
					:class="{ imagesCover: data.imagesCover }"
					:style="{ backgroundImage: `url(${data.images_url})` }"
				></div>
				<div class="home-works-context">
					<p>{{ data.title === "" ? data.title_jp : data.title }}</p>
				</div>
			</div>
		</div>
		<div v-else-if="fromPage === 'history'" class="history-card">
			<div v-for="data in animeWorks.watchData" class="history-works-card" @click="dialogOpen(data.worksID)">
				<div
					class="history-works-images"
					:class="{ imagesCover: data.imagesCover }"
					:style="{ backgroundImage: `url(${data.images_url})` }"
				></div>
				<div class="history-works-context">
					<p class="history-works-context-title">{{ data.title === "" ? data.title_jp : data.title }}</p>
					<p class="history-works-context-date">觀看日期:{{ data.watchDate }}</p>
				</div>
			</div>
		</div>
		<div v-else class="home-card">
			<!-- <div v-for="data in animeWorks.animeData" class="home-works-card" v-on:click="dialogOpen(data.id)">
                <div class="home-works-images" :class="{ imagesCover: data.imagesCover }"
                    :style="{ backgroundImage: `url(${data.images_url})` }">
                </div>
                <div class="home-works-context">
                    <p>{{ data.title === "" ? data.title_jp : data.title }}</p>
                </div>
            </div> -->
		</div>
	</Transition>
	<WorksDialog
		:diaLogShow="refDialog"
		:worksID="refDialogID"
		@wokrs-dialog-close="dialogClose"
		@close-dialog="dialogClose"
	/>
</template>

<style lang="scss" scoped>
.home-card {
	gap: 12px;
	padding: 12px 10px 2px 15px;
	display: grid;
	grid-auto-rows: auto;
	grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));

	.home-works-card {
		border-radius: 8px;
		overflow: hidden;
		user-select: none;
		background-color: hsla(0, 0%, 100%, 0.19);
		transition: all 0.22s;
		transform: scale(1.01);
		transform: translateZ(0);
		contain: layout style paint;
		will-change: transform;
        
		.home-works-images {
			height: 0;
			overflow: hidden;
			padding-bottom: 140%;
			background-size: 100% 100%;
			background-position: center;
			background-color: #6b6363;
			contain: layout style paint;
			transform: translateZ(0);
		}

		.imagesCover {
			background-size: cover;
		}

		.home-works-context {
			> p {
				margin: 0;
				padding: 6px 6px;
				font-size: 1.1em;
				font-weight: 600;
				color: #ffffff;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				letter-spacing: 0.02em;
				text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
			}
		}

		&:hover {
			z-index: 100;
			transform: scale(1.06) translateZ(0);
			background-color: hsl(345, 38%, 37%);
			filter: drop-shadow(0 0 0.75rem black);
		}
	}
}

.history-card {
	gap: 8px;
	padding: 12px 10px 12px 15px;
	display: grid;
	grid-auto-rows: auto;
	grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));

	.history-works-card {
		border-radius: 8px;
		overflow: hidden;
		user-select: none;
		background-color: hsla(0, 0%, 100%, 0.19);
		transition: all 0.24s;
		font-size: 14px;
		will-change: transform;

		.history-works-images {
			height: 0;
			overflow: hidden;
			padding-bottom: 140%;
			background-size: 100% 100%;
			background-position: center;
			background-color: #6b6363;
			contain: layout style paint;
			transform: translateZ(0);
		}

		.imagesCover {
			background-size: cover;
		}

		.history-works-context {
			padding: 6px;

			> p {
				margin: 0;
				color: #eee;
				font-size: 14px;
				font-weight: 400;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				padding-bottom: 4px;
			}
		}

		&:hover {
			z-index: 2;
			transform: scale(1.05);
			background-color: hsl(345, 38%, 37%);
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
