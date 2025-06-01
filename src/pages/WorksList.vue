<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Loading from "../components/Loading.vue";
import Notifications from "../components/Notifications.vue";
import ConsoleSidebar from "../components/ConsoleSidebar.vue";
import ContextMenu from "../components/ContextMenu.vue";
import DeleteConfirmModal from "../components/DeleteConfirmModal.vue";
import { useAnimeWorks } from "../stores/animeWorks";
import { useUserControl } from "../stores/userControl";
import { useAnirekiConsole } from "../stores/anirekiConsole";

const router = useRouter();
const animeWorks = useAnimeWorks();
const userControll = useUserControl();
const anirekiConsole = useAnirekiConsole();

const searchQuery = ref("");
const selectedMedia = ref("all");
const selectedSeason = ref("all");
const selectedYear = ref("all");
const sortBy = ref("newest");

const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedWorksId = ref("");
const selectedWorksTitle = ref("");
const showDeleteModal = ref(false);

const mediaOptions = computed(() => {
	const media = [...new Set(animeWorks.originData.map((item) => item.media))];
	return media.filter((m) => m && m !== "");
});

const seasonOptions = computed(() => {
	return [
		{ label: "冬", value: "winter" },
		{ label: "春", value: "spring" },
		{ label: "夏", value: "summer" },
		{ label: "秋", value: "autumn" },
	];
});

const yearOptions = computed(() => {
	const years = [
		...new Set(
			animeWorks.originData.map((item) => {
				if (item.season && item.season.includes("-")) {
					const year = parseInt(item.season.split("-")[0]);
					return isNaN(year) ? null : year;
				}
				return null;
			})
		),
	]
		.filter((y) => y !== null)
		.sort((a, b) => b - a);
	return years;
});

const filteredData = computed(() => {
	let filtered = animeWorks.originData;

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.title.toLowerCase().includes(query) ||
				item.title_jp.toLowerCase().includes(query) ||
				item.id.includes(query)
		);
	}

	if (selectedMedia.value !== "all") {
		filtered = filtered.filter((item) => item.media === selectedMedia.value);
	}
	if (selectedYear.value !== "all" || selectedSeason.value !== "all") {
		filtered = filtered.filter((item) => {
			if (selectedYear.value !== "all" && selectedSeason.value !== "all") {
				const targetSeason = `${selectedYear.value}-${selectedSeason.value}`;
				return item.season === targetSeason;
			} else if (selectedYear.value !== "all" && selectedSeason.value === "all") {
				return item.season && item.season.startsWith(`${selectedYear.value}-`);
			} else if (selectedYear.value === "all" && selectedSeason.value !== "all") {
				return item.season && item.season.endsWith(`-${selectedSeason.value}`);
			}
			return true;
		});
	}

	return filtered.sort((a, b) => {
		switch (sortBy.value) {
			case "newest":
				return parseInt(b.createdAt) - parseInt(a.createdAt);
			case "oldest":
				return parseInt(a.createdAt) - parseInt(b.createdAt);
			case "title-asc":
				return a.title.localeCompare(b.title);
			case "title-desc":
				return b.title.localeCompare(a.title);
			default:
				return 0;
		}
	});
});

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

const clearFilters = () => {
	searchQuery.value = "";
	selectedMedia.value = "all";
	selectedSeason.value = "all";
	selectedYear.value = "all";
	sortBy.value = "newest";
};

// 新增作品導航方法
const navigateToAddWorks = () => {
	router.push({ name: "addworks" });
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
		<!-- <Header class="console-header" :is-console="true"></Header> -->

		<div class="filter-container">
			<div class="filter-row">
				<div class="filter-group">
					<label>検索</label>
					<input v-model="searchQuery" placeholder="作品名・ID で検索..." class="search-input" />
				</div>
				<div class="filter-group">
					<label>メディア</label>
					<select v-model="selectedMedia" class="filter-select">
						<option value="all">すべて</option>
						<option v-for="media in mediaOptions" :key="media" :value="media">
							{{ media }}
						</option>
					</select>
				</div>

				<div class="filter-group">
					<label>年度</label>
					<select v-model="selectedYear" class="filter-select">
						<option value="all">すべて</option>
						<option v-for="year in yearOptions" :key="year" :value="year">{{ year }}年</option>
					</select>
				</div>

				<div class="filter-group">
					<label>シーズン</label>
					<select v-model="selectedSeason" class="filter-select">
						<option value="all">すべて</option>
						<option v-for="season in seasonOptions" :key="season.value" :value="season.value">
							{{ season.label }}
						</option>
					</select>
				</div>

				<div class="filter-group">
					<label>並び替え</label>
					<select v-model="sortBy" class="filter-select">
						<option value="newest">新しい順</option>
						<option value="oldest">古い順</option>
						<option value="title-asc">タイトル昇順</option>
						<option value="title-desc">タイトル降順</option>
					</select>
				</div>
				<div class="filter-actions">
					<button @click="navigateToAddWorks" class="add-works-btn">作品を追加</button>
					<button @click="clearFilters" class="clear-btn">フィルターをクリア</button>
					<span class="result-count"> {{ filteredData.length }} 件の作品 </span>
				</div>
			</div>
		</div>

		<div class="content console-content">
			<div class="works-list-container">
				<div
					v-for="data in filteredData"
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
.filter-container {
	background: #232932;
	padding: 10px 20px 10px 20px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-row {
	display: flex;
	align-items: flex-end;
	gap: 16px;
	margin-bottom: 16px;
	flex-wrap: wrap;

	&:last-child {
		margin-bottom: 0;
	}
}

.filter-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 120px;

	label {
		color: #e0e0e0;
		font-size: 12px;
		font-weight: 500;
	}
}

.search-input,
.filter-select {
	padding: 8px 12px;
	border: 1px solid #4a4a4a;
	border-radius: 6px;
	background: #1a1a1a;
	color: #fff;
	font-size: 14px;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: #6b9bd2;
		box-shadow: 0 0 0 2px rgba(107, 155, 210, 0.2);
	}

	&:hover {
		border-color: #5a5a5a;
	}
}

.search-input {
	min-width: 200px;

	&::placeholder {
		color: #888;
	}
}

.filter-select {
	min-width: 140px;
	cursor: pointer;
	position: relative;
	appearance: none;
	background-image: url(../assets/sel.svg);
	background-repeat: no-repeat;
	background-position: right 12px center;
	background-size: 12px 12px;
	padding-right: 32px;

	option {
		background: #1a1a1a;
		color: #fff;
	}
}

.filter-actions {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-left: auto;
}

.add-works-btn {
	padding: 8px 16px;
	background: #4a9eff;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	gap: 6px;

	.add-icon {
		font-size: 16px;
		font-weight: bold;
		line-height: 1;
	}

	&:hover {
		background: #3a8bef;
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}
}

.clear-btn {
	padding: 8px 16px;
	background: #d64545;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background: #c23939;
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}
}

.result-count {
	color: #b0b0b0;
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
}

@media (max-width: 768px) {
	.filter-row {
		flex-direction: column;
		align-items: stretch;
	}

	.filter-actions {
		margin-left: 0;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
	}

	.add-works-btn,
	.clear-btn {
		flex: 1;
		min-width: 120px;
	}

	.result-count {
		flex-basis: 100%;
		text-align: center;
	}

	.search-input {
		min-width: auto;
	}
}

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
