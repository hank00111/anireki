<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
import WorksCard from "../components/WorksCard.vue";
import { useAnimeWorks } from "../stores/animeWorks";
import Notifications from "../components/Notifications.vue";

const animeWorks = useAnimeWorks();
const rightEventClose = (e: { preventDefault: () => void }) => {
	e.preventDefault();
};
onMounted(() => {
	document.title = "Home - Anireki";
	console.log(import.meta.env.VITE_API_BASE_URL);
});
onBeforeMount(() => {
	animeWorks.SysSeason();
	animeWorks.getAnimeData();
});

// watchEffect(() => {
//animeWorks.infoMsg
// })
</script>

<template>
	<Sidebar @click.right="rightEventClose($event)"></Sidebar>
	<div class="main" @click.right="rightEventClose($event)">
		<Notifications :show="animeWorks.infoStatus" :info="animeWorks.infoMsg"></Notifications>
		<Header :is-home="true"></Header>
		<div class="content">
			<div class="home-title"></div>
			<WorksCard :from-Page="1"></WorksCard>
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-title {
	margin-left: 18px;
	font-weight: bold;
	font-size: 2.5em;
	line-height: normal;
	color: #fff;
	user-select: none;
}

// .home-info {
//     gap: 8px;
//     padding: 12px 12px 12px 15px;
//     display: grid;
//     flex-wrap: wrap;
//     grid-auto-rows: auto;
//     grid-template-columns: repeat(var(--grid-container-columns), minmax(0, 1fr));
//     // grid-template-columns: repeat(3, 1fr);

//     .works-card {
//         display: inline-block;
//         border-radius: 8px;
//         overflow: hidden;
//         user-select: none;
//         background-color: hsla(0, 0%, 100%, 0.19);
//         transition: all 0.24s;

//         // will-change: transform;
//         .works-images {
//             height: 0;
//             overflow: hidden;
//             padding-bottom: 140%;
//             background-size: 100% 100%;
//             background-position: center;
//             background-color: #6b6363;
//         }

//         .works-context {
//             >p {
//                 margin: 0;
//                 padding: 8px 6px;
//                 font-size: 1.1em;
//                 font-weight: 700;
//                 color: #eee;
//                 white-space: nowrap;
//                 text-overflow: ellipsis;
//                 overflow: hidden;
//             }
//         }

//         &:hover {
//             z-index: 2;
//             transform: scale(1.05);
//             background-color: hsl(345, 17%, 36%);
//             filter: drop-shadow(0 0 0.75rem black);
//         }
//     }
// }
</style>
