import axios from "axios";
import LZString from "lz-string";
import { defineStore } from "pinia";
// import { useUserControl } from "./userControl";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
axios.defaults.withCredentials = true;

interface logDataModel {
    user: string,
    userPicture: string,
    action: string,
    worksID: string,
    worksName: string,
    changeData: { object: { old: string, new: string } },
    date: string,
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
    }),
    actions: {
        async getLogs() {
            try {
                let res = await axios.get("/console/logs");
                const data = JSON.parse(LZString.decompressFromUTF16(res.data));
                console.log(data);
                this.logData = data;
                this.logLoading = true;
            } catch (error) {
                console.log(error);
            }
        },
    },
});
