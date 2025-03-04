import { defineStore } from "pinia";

interface AnimeSeason {
	name: string; // 例：2024年10月新番
	name_jp: string; // 例：2024 秋
	seasonID: string; // 例：2024-autumn
}

const SEASONS = [
	{ month: 10, nameCn: "10月新番", nameJp: "秋", id: "autumn" },
	{ month: 7, nameCn: "7月新番", nameJp: "夏", id: "summer" },
	{ month: 4, nameCn: "4月新番", nameJp: "春", id: "spring" },
	{ month: 1, nameCn: "1月新番", nameJp: "冬", id: "winter" },
];

const generateSeasons = (startYear: number, endYear: number = new Date().getFullYear()): AnimeSeason[] => {
	const seasons: AnimeSeason[] = [];
	for (let year = endYear; year >= startYear; year--) {
		for (const season of SEASONS) {
			seasons.push({
				name: `${year}年${season.nameCn}`,
				name_jp: `${year} ${season.nameJp}`,
				seasonID: `${year}-${season.id}`,
			});
		}
	}
	return seasons;
};

export const useAnimeYears = defineStore("animeYears", {
	state: () => ({
		animeYearsObj: generateSeasons(2010),
	}),
});
