import axios from "axios";
import LZString from "lz-string";
import { defineStore } from "pinia";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
// axios.defaults.baseURL = "http://localhost:5000/v2";
axios.defaults.withCredentials = true;

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
    // drakState: false,
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
          .post("/works/console/add", JSON.stringify({
            data: "Fred",
            lastName: "Flintstone",
          }))
          .then(function (response) {
            // console.log(response);
            console.log(JSON.parse(LZString.decompressFromUTF16(response.data)));
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
  },
  //   persist: true,
});
