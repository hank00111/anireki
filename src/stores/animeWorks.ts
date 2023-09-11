import axios from "axios";
import LZString from "lz-string";
import { defineStore } from "pinia";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
// axios.defaults.baseURL = "http://localhost:5000/v2";
axios.defaults.withCredentials = true;

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

export const useAnimeWorks = defineStore("animeWorks", {
  state: () => ({
    animeData: [
      {
        id: "",
        title: "",
        title_jp: "",
        season: "",
        images_url: "",
      },
    ],
    worksCount: "",
    isLoaded: false,
    sendStatus: false,
    sendCode: 0,
    infoStatus: false,
    infoMsg: "123",
  }),
  actions: {
    async getCurrentSeason() {
      try {
        let res = await axios.get("/works/season/2023-summer");
        this.animeData = res.data;
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async addWorks(data: object) {
      try {
        this.sendStatus = true;
        await axios
          .post("/console/add", data, worksConfig)
          .then((res) => {
            // let b = JSON.stringify(a);
            // console.log(b);
            // let c = LZString.compressToUTF16(b);
            // console.log(c);
            // console.log(LZString.decompressFromUTF16(c));
            // console.log(JSON.parse(LZString.decompressFromUTF16(c)));
            const d = LZString.decompressFromUTF16(res.data);
            console.log(d);
            // console.log(d.Code);
            if (res.status === 200) {
              // this.infoStatus = true;
              this.sendStatus = false;
              // this.sendCode = res.data.Code;
              // this.infoMsg = res.data.Msg;
            }
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
    async getWorksCount() {
      try {
        let res = await axios.get("/console/workscount");
        this.worksCount = LZString.decompressFromUTF16(res.data);
        this.isLoaded = true;
      } catch (error) {
        console.log(error);
      }
      // setTimeout(() => (this.isLoaded = true), 2000);
    },
  },
  //   persist: true,
});
