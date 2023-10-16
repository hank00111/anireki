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
  imagesCover: boolean;
};
interface originDataModel {
  id: string;
  title: string,
  title_jp: string,
  season: string,
  images_url: string;
  imagesCover: boolean;
  StartedAt_jp: string;
  StartedAt_tw: string;
  createdAt: string;
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
        imagesCover: false
      },
    ],
    originData: [] as originDataModel[],
    // originData: [{
    //   id: "1",
    //   title: "",
    //   title_jp: "",
    //   season: "",
    //   images_url: "",
    //   StartedAt_jp: "",
    //   StartedAt_tw: "",
    //   createdAt: "",
    //   imagesCover: false
    // },],
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
    seasonID: '2023-autumn',
    worksLoaded: false,
    worksData: {
      id: "",
      title: "",
      title_jp: "",
      season: "",
      images_url: "",
      StartedAt_jp: "",
      StartedAt_tw: "",
      createdAt: "",
    },
  }),
  actions: {
    async getAnimeData() {
      try {
        let res = await axios.get("/works/all");
        const data = JSON.parse(LZString.decompressFromUTF16(res.data));
        // this.animeData = data;
        this.originData = data;
        this.getSeason(this.seasonID);
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
    async getWorks(worksID: string) {
      await axios.get(`/works/${worksID}`).then((res) => {
        const data = JSON.parse(LZString.decompressFromUTF16(res.data));
        this.worksData = data[0];
        this.worksLoaded = true
      }).catch((error) => {
        console.log(error);
        this.worksLoaded = false;
      });
    },
    getSeason(seasonID: string) {
      this.animeData = [];
      if (seasonID === 'all') {
        this.animeData = this.originData;
        return;
      }

      for (const [_, hValue] of Object.entries(this.originData)) {
        if (hValue.season === seasonID) {
          // console.log(hValue);
          const wData = {
            id: hValue.id,
            title: hValue.title,
            title_jp: hValue.title_jp,
            season: hValue.season,
            images_url: hValue.images_url,
            imagesCover: hValue.imagesCover,
          };
          this.animeData.push(wData);
        }
      }
    },
    async addWorks(data: object) {
      try {
        this.sendStatus = true;
        await axios
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
      await axios
        .post("/console/update", data, worksConfig)
        .then((res) => {
          const d = JSON.parse(LZString.decompressFromUTF16(res.data));
          this.sendCode = d.Code;
          this.sendStatus = false;
          this.infoMsg = d.Msg;
          this.infoStatus = true;
          // console.log(d);
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
                  imagesCover: matchingAnime.imagesCover,
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
    async addWatchHistory(worksId: string) {
      if (this.userControll.name.length < 1) {
        //請先登入
        console.log("error");
      } else {
        const addData = {
          watchData: [{
            worksID: worksId,
            watchDate: `${this.watchYear}.${(this.watchMonth < 10 ? "0" + this.watchMonth.toString() : this.watchMonth.toString())}.${this.watchDay < 10 ? "0" + this.watchDay.toString() : this.watchDay.toString()}`
          }]
        };
        await axios
          .post("/user/watchistory", addData)
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
                  imagesCover: matchingAnime.imagesCover,
                };
                this.watchData.push(wData);
              }
            }
          })
          .catch((error) => {
            console.log(`addWorks-1 ${error}`);
          });
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
                  imagesCover: matchingAnime.imagesCover,
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
    },
    SysSeason() {
      const thisYear = new Date().getFullYear();
      const season = Math.ceil((new Date().getMonth() + 1) / 3);
      const seasons = ['winter', 'spring', 'summer', 'autumn'];
      this.seasonID = `${thisYear}-${seasons[season - 1]}`;
      // return `${thisYear}-${seasons[season - 1]}`;
    },
  },
});
