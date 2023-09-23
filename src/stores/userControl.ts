import axios from "axios";
import LZString from "lz-string";
import { defineStore } from "pinia";
axios.defaults.baseURL = "https://a2.anireki.com/v2";
axios.defaults.withCredentials = true;
//a1.anireki.com/v2/

export const useUserControl = defineStore("login", {
  state: () => ({
    isLogin: false,
    checkConsole: false,
    name: "",
    picture: "",
    consoleAccess: false,
  }),
  actions: {
    async getUser(src: number) {
      try {
        if (this.name.length === 0) {
          let res = await axios.get("/auth/user");
          if (res.status === 200) {
            const data = JSON.parse(LZString.decompressFromUTF16(res.data));
            this.isLogin = true;
            this.name = data.name;
            this.picture = data.picture;
            this.consoleAccess = data.console || false;
            // console.log(this.name);
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
          // console.log(this.name);
          this.checkConsole = true;
          return true;
        } else {
          this.checkConsole = false;
          return false;
        }
      } catch (error) {
        this.checkConsole = false;
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
