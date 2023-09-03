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
      window.location.href = "https://a2.anireki.com/v2/auth/google";
      console.log(src)
      // try {
      //   if (this.name.length === 0) {
      //     let res = await axios.post("/user", { withCredentials: true });
      //     if (res.status === 200) {
      //       this.isLogin = true;
      //       this.name = res.data.name;
      //       this.picture = res.data.picture;
      //     } else if (res.status === 204 && src === 1) {
      //       window.location.href = "https://a2.anireki.com/v2/auth/google";
      //     }
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    },
    async logout() {
      try {
        await axios.post("/logout", { withCredentials: true });
        this.isLogin = false;
        this.name = "";
        this.picture = "";
        console.log("clear", this.name);
      } catch (error) {
        console.log(error);
      }
    },
  },
  //   actions: {
  //     async getUser(src: number) {
  //       try {
  //         if (this.name.length === 0) {
  //           let res = await axios.post("user", { withCredentials: true });
  //           if (res.status === 200) {
  //             this.isLogin = true;
  //             this.name = res.data.name;
  //             this.picture = res.data.picture;
  //           } else if (res.status === 204 && src === 1) {
  //             //Login
  //             window.location.href = "http://localhost:5000/auth/google";
  //           }
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     },
  //     async logout() {
  //       try {
  //         await axios.post("logout", { withCredentials: true });
  //         this.isLogin = false;
  //         this.name = "";
  //         this.picture = "";
  //         console.log("clear", this.name);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     },
  //   },
  // persist: true,
});

// if (res.status === 204 && src === 1) {
//   console.log(src);
//   window.location.href = "http://localhost:5000/auth/google";
// } else if (res.status === 200) {
//   this.isLogin = true;
// }
