import axios from "axios";
import { defineStore } from "pinia";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
axios.defaults.withCredentials = true;
//a1.anireki.com/v2/

export const useUserControl = defineStore("login", {
  state: () => ({
    isLogin: false,
    name: "",
    picture: "",
  }),
  actions: {
    async getUser(src: number) {
      try {
        if (this.name.length === 0) {
          let res = await axios.get("/auth/user");
          if (res.status === 200) {
            this.isLogin = true;
            this.name = res.data.name;
            this.picture = res.data.picture;
          } else if (res.status === 204 && src === 1) {
            window.location.href = "https://a2.anireki.com/v2/auth/google";
          }
        }
      } catch (error) {
        // console.log(error);
      }
    },
    async getConsole() {
      try {
        let res = await axios.get("/auth/console");
        if (res.status === 200) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    logout() {
      try {
        axios.post("/auth/logout");
        this.name = "";
        this.picture = "";
        this.isLogin = false;
      } catch (error) {
        // console.log(error);
      }
    },
  },
  // persist: true,
});
