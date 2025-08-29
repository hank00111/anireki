import axiosInstance from "@/api";
import { useUserControl } from "@/stores/userControl";
import LZString from "lz-string";
import { defineStore } from "pinia";

// const jsonConfig = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// { id: "1", watchDate: "2023.09.10" },
// { id: "2", watchDate: "2023.09.11" },
interface historyDataModel {
	worksID: string;
	watchDate: string;
}

interface watchDataModel {
	worksID: string;
	title: string;
	title_jp: string;
	media: string;
	season: string;
	watchDate: string;
	copyright: string;
	images_url: string;
	imagesCover: boolean;
}

interface originDataModel {
	id: string;
	title: string;
	title_jp: string;
	media: string;
	season: string;
	copyright: string;
	images_url: string;
	imagesCover: boolean;
	StartedAt_jp: string;
	StartedAt_tw: string;
	createdAt: string;
}

interface watchLaterModel {
	worksID: string;
	title: string;
	title_jp: string;
	images_url: string;
	imagesCover: boolean;
}

interface watchLaterDataModel {
	worksID: string;
	createdAt: string;
}

interface AnnictWork {
	id: number;
	title: string;
	title_en: string;
	title_kana: string;
	media: string;
	season_name: string;
	season_year: number;
	official_site_url: string;
	images: {
		recommended_url?: string;
		facebook?: {
			og_image_url?: string;
		};
		twitter?: {
			mini_avatar_url?: string;
			normal_avatar_url?: string;
			bigger_avatar_url?: string;
			original_avatar_url?: string;
			image_url?: string;
		};
	};
	episodes_count: number;
	released_on: string;
}

export const useAnimeWorks = defineStore("animeWorks", {
	state: () => ({
		animeData: [] as originDataModel[],
		originData: [] as originDataModel[],
		// animeData: [
		//   {
		//     id: "1",
		//     title: "1",
		//     title_jp: "",
		//     season: "",
		//     copyright: "1",
		//     images_url: "",
		//     imagesCover: false
		//   },
		// ] as originDataModel[],
		// originData: [{
		//   id: "1",
		//   title: "",
		//   title_jp: "",
		//   media: "",
		//   season: "",
		//   images_url: "",
		//   copyright: "1",
		//   StartedAt_jp: "",
		//   StartedAt_tw: "",
		//   createdAt: "",
		//   imagesCover: false
		// }],
		historyData: [] as historyDataModel[],
		watchData: [] as watchDataModel[],
		worksCount: "",
		isLoaded: false,
		sendStatus: false,
		sendCode: 0,
		infoStatus: false,
		infoMsg: "",
		watchYear: new Date().getFullYear(),
		watchMonth: new Date().getMonth() + 1,
		watchDay: new Date().getDate(),
		userControll: useUserControl(),
		seasonSel: 1,
		seasonID: "2024-winter",
		worksLoaded: false,
		allWorksLoaded: false,
		worksData: {
			id: "",
			title: "",
			title_jp: "",
			season: "",
			images_url: "",
			StartedAt_jp: "",
			StartedAt_tw: "",
			createdAt: "",
		} as originDataModel,
		worksCheck: false,
		annictWorks: [] as AnnictWork[],
		selectedAnnictWork: null as AnnictWork | null,
		watchLater: [] as watchLaterModel[],
		watchLaterData: [] as watchLaterDataModel[],
	}),
	actions: {
		async getAnimeData() {
			try {
				let res = await axiosInstance.get("/works/all");
				const data = JSON.parse(LZString.decompressFromUTF16(res.data));
				this.originData = data;
				this.getSeason(this.seasonID);
				this.allWorksLoaded = true;
			} catch (error) {
				this.allWorksLoaded = false;
				console.log(error);
			}
		},
		// async getCurrentSeason() {
		//   try {
		//     let res = await axiosInstance.get("/works/season/2023-summer");
		//     this.animeData = res.data;
		//   } catch (error) {
		//     console.log(error);
		//   }
		// },
		async getWorksCount() {
			try {
				let res = await axiosInstance.get("/console/workscount");
				this.worksCount = LZString.decompressFromUTF16(res.data);
				this.isLoaded = true;
			} catch (error) {
				console.log(error);
			}
		},
		async getWorks(worksID: string) {
			await axiosInstance
				.get(`/works/${worksID}`)
				.then((res) => {
					const data = JSON.parse(LZString.decompressFromUTF16(res.data));
					this.worksData = data[0];
					this.worksLoaded = true;
				})
				.catch((error) => {
					console.log(error);
					this.worksLoaded = false;
				});
		},
		getSeason(seasonID: string) {
			this.animeData = [];
			if (seasonID === "all") {
				this.animeData = this.originData;
				return;
			}

			for (const [_, hValue] of Object.entries(this.originData)) {
				if (hValue.season === seasonID) {
					this.animeData.push(hValue);
				}
			}
		},
		async getWatchHistory() {
			try {
				await axiosInstance
					.get("/user/watchistory")
					.then((res) => {
						this.watchData = [];
						this.historyData = JSON.parse(LZString.decompressFromUTF16(res.data));

						for (const [_, hValue] of Object.entries(this.historyData)) {
							const matchingAnime = this.originData.find((anime) => anime.id === hValue.worksID);
							if (matchingAnime) {
								// const index = this.animeData.indexOf(matchingAnime);
								const wData = {
									worksID: matchingAnime.id,
									title: matchingAnime.title,
									title_jp: matchingAnime.title_jp,
									media: matchingAnime.media,
									season: matchingAnime.season,
									copyright: matchingAnime.copyright,
									watchDate: hValue.watchDate,
									images_url: matchingAnime.images_url,
									imagesCover: matchingAnime.imagesCover,
								};
								this.watchData.push(wData);
							}
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.log(error);
			}
		},
		async addWatchHistory(worksId: string) {
			if (this.userControll.name.length < 1) {
				// Please login first
				console.log("error");
			} else {
				const addData = {
					watchData: [
						{
							worksID: worksId,
							watchDate: `${this.watchYear}.${
								this.watchMonth < 10 ? "0" + this.watchMonth.toString() : this.watchMonth.toString()
							}.${this.watchDay < 10 ? "0" + this.watchDay.toString() : this.watchDay.toString()}`,
						},
					],
				};
				await axiosInstance
					.post("/user/watchistory", addData)
					.then((res) => {
						this.watchData = [];
						this.historyData = JSON.parse(LZString.decompressFromUTF16(res.data));

						for (const [_, hValue] of Object.entries(this.historyData)) {
							const matchingAnime = this.originData.find((anime) => anime.id === hValue.worksID);
							if (matchingAnime) {
								// const index = this.animeData.indexOf(matchingAnime);
								const wData = {
									worksID: matchingAnime.id,
									title: matchingAnime.title,
									title_jp: matchingAnime.title_jp,
									media: matchingAnime.media,
									season: matchingAnime.season,
									copyright: matchingAnime.copyright,
									watchDate: hValue.watchDate,
									images_url: matchingAnime.images_url,
									imagesCover: matchingAnime.imagesCover,
								};
								this.watchData.push(wData);
							}
						}
						this.infoMsg = "已將動畫加入觀看紀錄";
						this.infoStatus = true;
					})
					.catch((error) => {
						this.infoMsg = "觀看紀錄加入異常";
						this.infoStatus = true;
						console.log(`addWorks-1 ${error}`);
					});
				this.watchYear = new Date().getFullYear();
				this.watchMonth = new Date().getMonth() + 1;
				this.watchDay = new Date().getDate();
			}
		},
		async deleteWatchHistory(worksId: string) {
			try {
				await axiosInstance
					.delete("/user/watchistory", { data: { worksID: worksId } })
					.then((res) => {
						this.watchData = [];
						this.historyData = JSON.parse(LZString.decompressFromUTF16(res.data));

						for (const [_, hValue] of Object.entries(this.historyData)) {
							const matchingAnime = this.originData.find((anime) => anime.id === hValue.worksID);
							if (matchingAnime) {
								const wData = {
									worksID: matchingAnime.id,
									title: matchingAnime.title,
									title_jp: matchingAnime.title_jp,
									media: matchingAnime.media,
									season: matchingAnime.season,
									copyright: matchingAnime.copyright,
									watchDate: hValue.watchDate,
									images_url: matchingAnime.images_url,
									imagesCover: matchingAnime.imagesCover,
								};
								this.watchData.push(wData);
							}
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.log(error);
			}
		},
		checkWatchHistory(worksId: string) {
			const find = this.historyData.find((item) => item.worksID === worksId);
			if (find) {
				return true;
			} else {
				return false;
			}
		},
		//watchLater
		async getWatchLater() {
			try {
				await axiosInstance
					.get("/user/watchlater")
					.then((res) => {
						this.watchLater = [];
						this.watchLaterData = JSON.parse(LZString.decompressFromUTF16(res.data));

						for (const [_, hValue] of Object.entries(this.watchLaterData)) {
							const matchingAnime = this.originData.find((anime) => anime.id === hValue.worksID);
							if (matchingAnime) {
								const watchLaterWorks = {
									worksID: matchingAnime.id,
									title: matchingAnime.title,
									title_jp: matchingAnime.title_jp,
									images_url: matchingAnime.images_url,
									imagesCover: matchingAnime.imagesCover,
								};
								this.watchLater.push(watchLaterWorks);
							}
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {}
		},
		async addWatchLater(worksId: string) {
			if (this.userControll.name.length < 1) {
				console.log("error");
			} else {
				const addData = {
					watchLaterData: {
						worksID: worksId,
					},
				};
				await axiosInstance
					.post("/user/watchlater", addData)
					.then((res) => {
						this.watchLater = [];
						this.watchLaterData = JSON.parse(LZString.decompressFromUTF16(res.data));

						for (const [_, hValue] of Object.entries(this.watchLaterData)) {
							const matchingAnime = this.originData.find((anime) => anime.id === hValue.worksID);
							if (matchingAnime) {
								const watchLaterWorks = {
									worksID: matchingAnime.id,
									title: matchingAnime.title,
									title_jp: matchingAnime.title_jp,
									images_url: matchingAnime.images_url,
									imagesCover: matchingAnime.imagesCover,
								};
								this.watchLater.push(watchLaterWorks);
							}
						}
						this.infoMsg = "已將動畫加入稍後觀看";
						this.infoStatus = true;
					})
					.catch((error) => {
						this.infoMsg = "稍後觀看加入異常";
						this.infoStatus = true;
						console.log(`addWorks-1 ${error}`);
					});
			}
		},
		// async deleteWatchLater(worksId: string) { },
		checkWatchLater(worksId: string) {
			const find = this.watchLaterData.find((item) => item.worksID === worksId);
			if (find) {
				return true;
			} else {
				return false;
			}
		},
		async checkWorks(worksTitle_jp: string) {
			try {
				if (!worksTitle_jp || worksTitle_jp.trim() === "") {
					this.annictWorks = [];
					return;
				}

				console.log(`[INFO] [AnimeWorks] Sending check request: ${worksTitle_jp}`);
				const response = await axiosInstance.post("/console/checkWorks", { WorksTitle_jp: worksTitle_jp });
				const data = JSON.parse(LZString.decompressFromUTF16(response.data));

				data.Code === 10 ? (this.worksCheck = false) : (this.worksCheck = true);

				if (data.annictWorks && data.annictWorks.length > 0) {
					console.log(`[INFO] [AnimeWorks] Received ${data.annictWorks.length} results`);
					this.annictWorks = data.annictWorks;
				} else {
					console.log("[INFO] [AnimeWorks] No results found");
					this.annictWorks = [];
				}

				return data;
			} catch (error) {
				console.error(`[ERROR] [AnimeWorks] Check works error: ${error}`);
				this.annictWorks = [];
				throw error;
			}
		},
		selectAnnictWork(work: AnnictWork | null) {
			this.selectedAnnictWork = work;
		},
		clearAnnictWorks() {
			this.annictWorks = [];
			this.selectedAnnictWork = null;
		},
		SysSeason() {
			const thisYear = new Date().getFullYear();
			const season = Math.ceil((new Date().getMonth() + 1) / 3);
			const seasons = ["winter", "spring", "summer", "autumn"];
			this.seasonID = `${thisYear}-${seasons[season - 1]}`;
			return this.seasonID;
		},
	},
});
