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
    testdat: {
      data: "Fred",
      lastName: "Flintstone",
    },
    worksCount: "",
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
    async addWorks() {
      try {
        await axios
          .post("/works/console/add", this.testdat)
          .then(function (response) {
            // let b = JSON.stringify(a);
            // console.log(b);
            // let c = LZString.compressToUTF16(b);
            // console.log(c);
            // console.log(LZString.decompressFromUTF16(c));
            // console.log(JSON.parse(LZString.decompressFromUTF16(c)));
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        // this.animeData = res.data;
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getWorksCount() {
      try {
        let res = await axios.get("/works/console/workscount");
        console.log(LZString.decompressFromUTF16(res.data))
        // this.animeData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  //   persist: true,
});
