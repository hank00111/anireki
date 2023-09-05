import axios from "axios";
import { defineStore } from "pinia";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
axios.defaults.withCredentials = true;

export const useAnimeWorks = defineStore("animeWorks", {
  state: () => ({
    animeData: [],
    // drakState: false,
  }),
  actions: {
    async getCurrentSeason() {
      try {
        let res = await axios.get("/works/season/2023-summer");
        this.animeData = res.data;
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
  //   persist: true,
});
