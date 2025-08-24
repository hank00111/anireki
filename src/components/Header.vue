<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAnimeWorks } from "@/stores/animeWorks";
import { useAnimeYears } from "@/stores/animeYears";
import { useUserControl } from "@/stores/userControl";
import { useErrorStore } from "@/stores/errorStore";

const props = defineProps({
	isHome: Boolean,
	isConsole: Boolean,
	seasonID: String,
});

const router = useRouter();
const animeWorks = useAnimeWorks();
const animeYears = useAnimeYears();
const userControl = useUserControl();

const showMenu = ref<boolean>(false);
const selectItem = ref(animeWorks.seasonSel);
const userPanel = ref<any>(null);
const isMobile = ref<boolean>(false);
const navCenter = ref<number>(0);
const nextEnd = ref<boolean>(false);
const prevEnd = ref<boolean>(false);
const yearTextOpacity = ref<number>(1);
const yearListShow = ref<boolean>(false);
const isLoggingIn = ref<boolean>(false);

const yearList = ref(animeYears.animeYearsObj);

const yearNavLeft = computed(() => {
	if (selectItem.value <= 1) return 0;
	return (selectItem.value - 1) * -148;
});

const navigationState = computed(() => {
	return {
		nextEnd: selectItem.value <= 0,
		prevEnd: selectItem.value >= yearList.value.length - 1,
	};
});

const userLogout = () => {
	showMenu.value = false;
	yearListShow.value = false;
	userControl.logout();
};

const handleHeaderLogin = async () => {
	if (isLoggingIn.value) return;

	isLoggingIn.value = true;
	showMenu.value = false;
	yearListShow.value = false;

	try {
		await userControl.getUser(1, router.currentRoute.value.fullPath);
	} catch (error) {
		const errorStore = useErrorStore();
		errorStore.addError("ログインに失敗しました。再試行してください。", "error");
	} finally {
		isLoggingIn.value = false;
	}
};

const goToSeason = (index: number) => {
	selectItem.value = index;
	animeWorks.seasonSel = index;
	animeWorks.seasonID = yearList.value[index].seasonID;
	animeWorks.getSeason(yearList.value[index].seasonID);
	// console.log(yearList.value[index].seasonID);
};

const getAllAnime = () => {
	selectItem.value = -1;
	animeWorks.getSeason("all");
};

const toConsole = () => {
	showMenu.value = !showMenu.value;
	router.push("/console");
};

const toForm = () => {
	window.location.href = "https://forms.gle/mq6hLwdMR4i6e9Mh8";
};

const yearNavCenter = () => {
	const c = window.innerWidth / 2;
	const y_c = (window.innerWidth - 32 - userPanel.value.offsetWidth) / 2;
	navCenter.value = c - y_c + 20;
};

const checkMobile = () => {
	yearNavCenter();
	window.innerWidth < 768 ? (isMobile.value = true) : (isMobile.value = false);
};

const yearAnime = () => {
	yearTextOpacity.value = 0;
	setTimeout(() => {
		yearTextOpacity.value = 1;
	}, 180);
};

const yearControl = (direction: "next" | "prev", index?: number) => {
	if (index !== undefined) {
		yearListShow.value = false;
		goToSeason(index);
	} else {
		const newIndex = direction === "next" ? selectItem.value - 1 : selectItem.value + 1;

		if (newIndex >= 0 && newIndex < yearList.value.length) {
			goToSeason(newIndex);
		}
	}
	yearAnime();
	nextEnd.value = navigationState.value.nextEnd;
	prevEnd.value = navigationState.value.prevEnd;
};

const yearListOpen = () => {
	showMenu.value = false;
	yearListShow.value = !yearListShow.value;
};

const yearWheel = (event: any) => {
	if (event.deltaY > 0) {
		selectItem.value >= yearList.value.length - 1 ? 0 : goToSeason(selectItem.value + 1);
	} else {
		selectItem.value <= 0 ? 0 : goToSeason(selectItem.value - 1);
	}
};

const handleClickOutside = (event: Event) => {
	if (userPanel.value && !userPanel.value.contains(event.target as Node)) {
		showMenu.value = false;
		yearListShow.value = false;
	}
};

let resizeTimeout: number | null = null;
// const handleResize = () => {
// 	if (resizeTimeout) {
// 		window.clearTimeout(resizeTimeout);
// 	}
// 	resizeTimeout = window.setTimeout(() => {
// 		checkMobile();
// 	}, 250);
// };

const fnCheckCurrentSeason = () => {
	//props.seasonID
	if (yearList.value?.length > 0) {
		const foundIndex = yearList.value.findIndex((year) => year.seasonID === animeWorks.seasonID);
		if (foundIndex !== -1) {
			selectItem.value = foundIndex;
			animeWorks.seasonSel = foundIndex;
		}
	}
};

const fnInit = () => {
	checkMobile();
	fnCheckCurrentSeason();
};

onMounted(() => {
	fnInit();
	window.addEventListener("resize", checkMobile, true);
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	window.removeEventListener("resize", checkMobile, true);
	document.removeEventListener("click", handleClickOutside);
	if (resizeTimeout) {
		window.clearTimeout(resizeTimeout);
	}
	isLoggingIn.value = false;
	showMenu.value = false;
	yearListShow.value = false;
});
</script>

<template>
	<div class="header">
		<div v-if="props.isHome" class="anime-panel">
			<div v-if="!isMobile" class="anime-panel-container">
				<div class="all-anime" @click="getAllAnime" :class="{ selectedH: selectItem === -1 }">所有動畫</div>
				<div class="year-nav" @wheel="yearWheel">
					<div
						v-for="(year, index) in yearList"
						class="year-items"
						:style="{ transform: `translate(${yearNavLeft}px,0)` }"
						:class="{ selected: selectItem === index }"
						@click="goToSeason(index)"
					>
						{{ year.name }}
					</div>
				</div>
			</div>
			<div v-else class="anime-panel-container">
				<div class="mobile-year-nav" :style="{ marginLeft: `${navCenter}px` }">
					<div class="year-next">
						<svg
							v-if="!navigationState.nextEnd"
							@click="yearControl('next')"
							width="32"
							height="32"
							viewBox="0 -960 960 800"
							fill="#5c9291"
						>
							<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
						</svg>
					</div>
					<div class="mobile-year" :style="{ opacity: `${yearTextOpacity}` }" @click="yearListOpen">
						{{ yearList[selectItem].name_jp }}
					</div>
					<div v-show="yearListShow" class="mobile-year-nav-list">
						<ul>
							<li v-for="(year, index) in yearList" @click="yearControl('prev', index)">
								{{ year.name_jp }}
							</li>
						</ul>
					</div>
					<div class="year-prev">
						<svg
							v-if="!navigationState.prevEnd"
							@click="yearControl('prev')"
							width="32"
							height="32"
							viewBox="0 -960 960 800"
							fill="#5c9291"
						>
							<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
		<div v-else></div>

		<div class="userPanel" ref="userPanel">
			<div v-if="userControl.isLogin" class="userLoggedin">
				<button
					@click="
						showMenu = !showMenu;
						yearListShow = false;
					"
				>
					<img draggable="false" :src="userControl.picture" alt="" />
				</button>
				<div v-if="showMenu" class="userMenu">
					<div class="contextMenu">
						<ul>
							<li @click="toForm()">
								<button>
									<span>聯絡我們</span>
								</button>
							</li>
							<li v-if="userControl.consoleAccess" @click="toConsole()">
								<button>
									<span>控制台</span>
								</button>
							</li>
							<li @click="showMenu = !showMenu">
								<button>
									<span>設定</span>
								</button>
							</li>
							<li @click="userLogout">
								<button><span>登出</span></button>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div v-else class="userLogin">
				<button @click="handleHeaderLogin" :disabled="isLoggingIn">
					<span v-if="isLoggingIn">登入中...</span>
					<span v-else>登入</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.anime-panel {
	width: calc(100% - 70px);
	display: flex;
	align-items: center;
}

.anime-panel-container {
	display: flex;
	width: 100%;
	gap: 4px;
	overflow: hidden;
}

.all-anime {
	font-size: 18px;
	padding: 4px 0px;
	color: #ffffff5a;
	user-select: none;
	cursor: pointer;
	transition: transform 0.4s, color 0.4s;

	&:hover {
		color: #fff;
	}
}

.selectedH {
	color: #fff;
	background-color: #23262b;
	box-sizing: border-box;
	font-weight: 700;
	border-bottom: solid 2px #89c3eb;
	transition: transform 0.4s, color 0.4s;
}

.year-nav {
	flex: 1;
	display: flex;
	align-items: center;
	overflow: hidden;
	max-width: 90%;
	height: 100%;
	overflow-x: auto;

	.year-items {
		color: #ffffff5a;
		height: 36px;
		display: block;
		white-space: nowrap;
		font-size: 18px;
		padding: 4px 0px;
		margin: 0px 2px;
		min-width: 144px;
		text-align: center;
		user-select: none;
		cursor: pointer;
		transition: transform 0.4s, color 0.4s;

		&:hover {
			color: #fff;
		}
	}

	.selected {
		color: #fff;
		background-color: #23262b;
		box-sizing: border-box;
		font-weight: 700;
		border-bottom: solid 2px #89c3eb;
		transition: transform 0.4s, color 0.4s;
	}
}

.year-nav::-webkit-scrollbar {
	display: none;
}

.mobile-year-nav {
	display: flex;
	flex-direction: row;
	width: 100%;
	align-items: center;
	justify-content: center;

	.year-next {
		width: 32px;
		height: 32px;
		user-select: none;
		transform-origin: 49.2% 58.5%;
		transform: rotate(-180deg);
	}

	.year-prev {
		width: 32px;
		height: 32px;
		user-select: none;
	}

	.mobile-year {
		color: #fff;
		width: 100px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		font-size: 19px;
		transition: opacity 0.1s ease-in-out;
	}
}

.mobile-year-nav-list {
	z-index: 100;
	position: absolute;
	max-height: 340px;
	inset: 0px auto auto auto;
	transform: translate(0px, 50px);

	> ul {
		margin: 0;
		padding: 0;
		background-color: #525657;
		border-radius: 4px;
		-webkit-box-shadow: 0 16px 24px rgba(0, 0, 0, 0.3), 0 6px 8px rgba(0, 0, 0, 0.2);
		box-shadow: 0 16px 24px rgba(0, 0, 0, 0.3), 0 6px 8px rgba(0, 0, 0, 0.2);
		width: 160px;
		max-height: 340px;
		overflow: hidden;
		overflow-y: scroll;

		> li {
			font-size: 19px;
			line-height: 34px;
			text-align: center;
		}
	}

	> ul::-webkit-scrollbar {
		display: none;
	}
}
</style>
