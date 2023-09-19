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
  worksID: string;
  watchDate: string;
};

interface watchDataModel {
  worksID: string;
  title: string,
  title_jp: string,
  season: string,
  watchDate: string;
  images_url: string;
};
interface originDataModel {
  id: string;
  title: string,
  title_jp: string,
  season: string,
  images_url: string;
};
//https://p2.anireki.com/2.jpg
// {
//   id: "1",
//   title: "456",
//   title_jp: "",
//   season: "2023-spring",
//   images_url: "",
// }, {
//   id: "1",
//   title: "123",
//   title_jp: "",
//   season: "2023-summer",
//   images_url: "",
// }]
export const useAnimeWorks = defineStore("animeWorks", {
  state: () => ({
    animeData: [
      {
        id: "1",
        title: "",
        title_jp: "",
        season: "",
        images_url: "",
      },
    ],
    originData: [] as originDataModel[],
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
    async getAnimeData() {
      try {
        let res = await axios.get("/works/all");
        const data = JSON.parse(LZString.decompressFromUTF16(res.data));
        this.animeData = data;
        this.originData = data;
        this.getSeason('2023-summer');
      } catch (error) {
        console.log(error);
      }
    },
    async getCurrentSeason() {
      try {
        let res = await axios.get("/works/season/2023-summer");
        this.animeData = res.data;
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    getSeason(seasonID: string) {
      this.animeData = [];
      for (const [_, hValue] of Object.entries(this.originData)) {
        if (hValue.season === seasonID) {
          // console.log(hValue);
          const wData = {
            id: hValue.id,
            title: hValue.title,
            title_jp: hValue.title_jp,
            season: hValue.season,
            images_url: hValue.images_url,
          };
          this.animeData.push(wData);
        }
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
        await axios.get("/user/watchistory")
          .then((res) => {
            this.watchData = [];
            this.historyData = JSON.parse(LZString.decompressFromUTF16(res.data));

            for (const [_, hValue] of Object.entries(this.historyData)) {
              const matchingAnime = this.originData.find(
                (anime) => anime.id === hValue.worksID
              );
              if (matchingAnime) {
                // const index = this.animeData.indexOf(matchingAnime);
                const wData = {
                  worksID: matchingAnime.id,
                  title: matchingAnime.title,
                  title_jp: matchingAnime.title_jp,
                  season: matchingAnime.season,
                  watchDate: hValue.watchDate,
                  images_url: matchingAnime.images_url,
                };
                this.watchData.push(wData);
              }
            }

          }).catch((error) => {
            console.log(error);
          });
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
          .post("/user/addwatchistory", addData)
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
    async deleteWatchHistory(worksId: string) {
      try {
        console.log(worksId);
        await axios.delete("/user/watchistory", { data: { worksID: worksId } })
          .then((res) => {
            this.watchData = [];
            this.historyData = JSON.parse(LZString.decompressFromUTF16(res.data));

            for (const [_, hValue] of Object.entries(this.historyData)) {
              const matchingAnime = this.animeData.find(
                (anime) => anime.id === hValue.worksID
              );
              if (matchingAnime) {
                // const index = this.animeData.indexOf(matchingAnime);
                const wData = {
                  worksID: matchingAnime.id,
                  title: matchingAnime.title,
                  title_jp: matchingAnime.title_jp,
                  season: matchingAnime.season,
                  watchDate: hValue.watchDate,
                  images_url: matchingAnime.images_url,
                };
                this.watchData.push(wData);
              }
            }

          }).catch((error) => {
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
    }
  },
  //   persist: true,
});
