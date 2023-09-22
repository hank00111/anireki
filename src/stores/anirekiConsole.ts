import axios from "axios";
// import LZString from "lz-string";
import { defineStore } from "pinia";
// import { useUserControl } from "./userControl";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
axios.defaults.withCredentials = true;

interface logData {
    user: string,
    userPicture: string,
    action: string,
    worksID: string,
    worksName: string,
    createdAt: string,
}

export const useAnirekiConsole = defineStore("anirekiConsole", {
    state: () => ({
        logLoading: false,
        logData: [],
    }),
    actions: {
        async getLogs() {
            try {
                // let res = await axios.get("/works/all");
                // const data = JSON.parse(LZString.decompressFromUTF16(res.data));
                // this.animeData = data;
                // this.originData = data;
                // this.getSeason(this.seasonID);
            } catch (error) {
                console.log(error);
            }
        },
    },
});
