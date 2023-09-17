import axios from "axios";
import LZString from "lz-string";
import { defineStore } from "pinia";
import { useUserControl } from "./userControl";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
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
// { id: "1", watchDate: "2023.09.10" },
// { id: "2", watchDate: "2023.09.11" },
interface historyDataModel {
  id: string;
  watchDate: string;
};

interface watchDataModel {
  id: string;
  title: string,
  title_jp: string,
  watchDate: string;
  images_url: string;
};
//https://p2.anireki.com/2.jpg
export const useAnimeWorks = defineStore("animeWorks", {
  state: () => ({
    animeData: [
      {
        id: "2",
        title: "幻日夜羽 -鏡中暉光-",
        title_jp: "幻日のヨハネ",
        season: "",
        images_url: "",
      },
    ],
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
    async getWatchHistory() {
      try {
        let res = await axios.get("/works/getwatchistory");
        console.log(res);
        // await axios.get("/works/getwatchistory")
        //   .then((res) => {
        //     // const d = JSON.parse(LZString.decompressFromUTF16(res.data));
        //     console.log(res);
        //   }).catch((error) => {
        //     console.log(error);
        //   });

        // this.worksCount = LZString.decompressFromUTF16(res.data);
        // this.isLoaded = true;
      } catch (error) {
        console.log(error);
      }
      //animeData find historyData
      // let index = 0;
      // const findC = this.animeData.find((item) => {
      //   console.log(item);
      //   item.id === "1";
      // });
      // const find = this.historyData.find(
      //   (item) => item.id === this.animeData[0].id
      // );
      // Object.keys(this.animeData).forEach(([key], index) => {
      //   console.log(index, this.animeData[index].id, key);
      // });

      // for (const [hKey, hValue] of Object.entries(this.historyData)) {
      //   const matchingAnime = this.animeData.find(
      //     (anime) => anime.id === hValue.id
      //   );
      //   console.log(hKey);
      //   if (matchingAnime) {
      //     // const index = this.animeData.indexOf(matchingAnime);
      //     const wData = {
      //       id: matchingAnime.id,
      //       title: matchingAnime.title,
      //       title_jp: matchingAnime.title_jp,
      //       watchDate: hValue.watchDate,
      //       images_url: matchingAnime.images_url,
      //     };
      //     this.watchData.push(wData);
      //   }
      // }

      // Object.keys(this.historyData).forEach(([hKey], hIndex) => {
      //   Object.keys(this.animeData).forEach(([key], index) => {
      //     if (this.historyData[hIndex].id === this.animeData[index].id) {
      //       console.log(index, this.animeData[index].id, key);
      //     }
      //   });
      // });
      // console.log(index, this.historyData[index].id, key);
      // let wData = {
      //   id: this.animeData[index].id,
      //   watchDate: "2023.09.10",
      //   images_url: this.animeData[index].images_url,
      // };
      // this.watchDate.push(wData);
      // Object.keys(this.animeData).forEach((key) => {
      //   // name Bobby Hadz 0
      //   // country Chile 1
      //   console.log(key);
      // });
      // console.log(this.animeData);
      // try {
      //   let res = await axios.get("/console/workscount");
      //   this.worksCount = LZString.decompressFromUTF16(res.data);
      //   this.isLoaded = true;
      // } catch (error) {
      //   console.log(error);
      // }
      // setTimeout(() => (this.isLoaded = true), 2000);
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
    async addWatchHistory(worksId: string) {
      if (this.userControll.name.length < 1) {
        //請先登入
        console.log("error");
      } else {
        const addData = {
          watchData: [{
            worksID: worksId,
            watchDate: `${this.watchYear}.${(this.watchMonth > 10 ? "0" + this.watchMonth : this.watchMonth)}.${this.watchDay}`
          }]
        };
        await axios
          .post("/works/addwatchistory", addData)
          .then((res) => {
            const d = JSON.parse(LZString.decompressFromUTF16(res.data));
            console.log(d);
          })
          .catch((error) => {
            console.log(`addWorks-1 ${error}`);
          });
        //setp1. add watch history to firebase
        //setp2. response historyData
        //setp3. change dailog status
        //setp3. watchData push historyData and animeData
        //setp4. redenr watchData in history page
        // const find = this.animeData.find((item) => item.id === worksId);

        // console.log(`${addData} ${addData.watchDate}`);
        // console.log("" + this.watchDay);
        this.watchYear = new Date().getFullYear();
        this.watchMonth = new Date().getMonth() + 1;
        this.watchDay = new Date().getDate();
      }
    },
  },
  //   persist: true,
});
