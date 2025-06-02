import axiosInstance from "@/api";
import LZString from "lz-string";
import { defineStore } from "pinia";
import { useErrorStore } from "@/stores/errorStore";

export const useUserControl = defineStore("login", {
  state: () => ({
    isLogin: false,
    checkConsole: false,
    name: "",
    picture: "",
    consoleAccess: false,
  }),
  actions: {
    resetUserState() {
      this.name = "";
      this.picture = "";
      this.isLogin = false;
      this.consoleAccess = false;
      this.checkConsole = false;
    },
    async getUser(src: number) {
      try {
        if (this.name.length === 0) {
          const res = await axiosInstance.get("/auth/user");
          if (res.status === 200) {
            const data = JSON.parse(LZString.decompressFromUTF16(res.data));
            this.isLogin = true;
            this.name = data.name;
            this.picture = data.picture;
            this.consoleAccess = data.console || false;
          } else if (res.status === 204) {
            this.resetUserState();
            if (src === 1) {
              window.location.href = "https://a2.anireki.com/v2/auth/google";
            }
          }
        }
      } catch (error) {
        this.resetUserState();
        const errorStore = useErrorStore();
        errorStore.addError('無法取得使用者資訊', 'error');
        console.error('Failed to get user info:', error);
      }
    },
    async getConsole() {
      try {
        let res = await axiosInstance.get("/auth/console");
        if (res.status === 200) {
          this.checkConsole = true;
          return true;
        } else {
          this.checkConsole = false;
          return false;
        }
      } catch (error) {
        this.checkConsole = false;
        const errorStore = useErrorStore();
        errorStore.addError('無法取得控制台權限', 'error');
        return false;
      }
    },
    async logout() {
      try {
        await axiosInstance.post("/auth/logout");
        this.resetUserState();
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.addError('登出失敗', 'error');
        console.error('Failed to logout:', error);
      }
    }
  },
  // persist: true,
});
