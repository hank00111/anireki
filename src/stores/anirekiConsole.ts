import axiosInstance from "@/api";
import LZString from "lz-string";
import { defineStore } from "pinia";

const worksConfig = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};

interface logDataModel {
	user: string;
	userPicture: string;
	action: string;
	worksID: string;
	worksName: string;
	changeData: { object: { old: string; new: string } };
	date: string;
}

// {
//     user: "",
//     userPicture: "",
//     action: "",
//     worksID: "1",
//     worksName: "123",
//     date: "",
//     changeData: StartedAt_tw:{old: "", new: ""}
// },

export const useAnirekiConsole = defineStore("anirekiConsole", {
	state: () => ({
		logLoading: false,
		logData: [] as logDataModel[],
		sendStatus: false,
		sendCode: 0,
		infoStatus: false,
		infoMsg: "",
		isLoaded: false,
	}),
	actions: {
		async getLogs() {
			try {
				let res = await axiosInstance.get("/console/logs");
				const data = JSON.parse(LZString.decompressFromUTF16(res.data));
				this.logData = data;
				this.logLoading = true;
			} catch (error) {
				console.log(error);
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
			}		},
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
				})
				.catch((error) => {
					this.sendCode = 1;
					this.sendStatus = false;
					this.infoStatus = true;
					console.log(`updateWorks-1 ${error}`);
				});
		},
	},
});
