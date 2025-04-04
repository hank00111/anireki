import axiosInstance from '../common/axiosRequest';
import LZString from "lz-string";
import { defineStore } from "pinia";
import { useUserControl } from "./userControl";

// const jsonConfig = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

const worksConfig = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};
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

export const useAnimeWorks = defineStore("animeWorks", {
	state: () => ({
		animeData: [
			{
				id: "",
				title: "",
				title_jp: "",
				season: "",
				copyright: "",
				images_url: "",
				imagesCover: false,
			},
		] as originDataModel[],
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
					// console.log(hValue);
					this.animeData.push(hValue);
				}
			}
		},
		async addWorks(data: object) {
			try {
				this.sendStatus = true;
				await axiosInstance
					.post("/console/add", data, worksConfig)
					.then((res) => {
						const d = JSON.parse(LZString.decompressFromUTF16(res.data));
						this.sendCode = d.Code;
						this.sendStatus = false;
						this.infoMsg = d.Msg;
						this.infoStatus = true;
						this.isLoaded = false;
					})
					.catch((error) => {
						this.sendCode = 1;
						this.sendStatus = false;
						this.infoStatus = true;
						console.log(`addWorks-1 ${error}`);
					});
			} catch (error) {
				this.sendStatus = false;
				console.log(`addWorks-2 ${error}`);
			}
		},
		async updateWorks(data: object) {
			this.sendStatus = true;
			await axiosInstance
				.post("/console/update", data, worksConfig)
				.then((res) => {
					const d = JSON.parse(LZString.decompressFromUTF16(res.data));
					this.sendCode = d.Code;
					this.sendStatus = false;
					this.infoMsg = d.Msg;
					this.infoStatus = true;
					this.watchData = [];
				})
				.catch((error) => {
					this.sendCode = 1;
					this.sendStatus = false;
					this.infoStatus = true;
					console.log(`updateWorks-1 ${error}`);
				});
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
				//請先登入
				console.log("error");
			} else {
				const addData = {
					watchData: [
						{
							worksID: worksId,
							watchDate: `${this.watchYear}.${this.watchMonth < 10 ? "0" + this.watchMonth.toString() : this.watchMonth.toString()
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
			} catch (error) { }
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
			await axiosInstance
				.post("/console/checkWorks", { WorksTitle_jp: worksTitle_jp })
				.then((res) => {
					const data = JSON.parse(LZString.decompressFromUTF16(res.data));
					data.Code === 10 ? (this.worksCheck = false) : (this.worksCheck = true);
					console.log(this.worksCheck);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		SysSeason() {
			const thisYear = new Date().getFullYear();
			const season = Math.ceil((new Date().getMonth() + 1) / 3);
			const seasons = ["winter", "spring", "summer", "autumn"];
			this.seasonID = `${thisYear}-${seasons[season - 1]}`;
			// return `${thisYear}-${seasons[season - 1]}`;
		},
	},
});
