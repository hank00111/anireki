import { defineStore } from "pinia";

export const useDrakModeStore = defineStore("drakMode", {
  state: () => ({
    drakState: true,
  }),
  actions: {
    SwichDarkMode() {
      this.drakState = !this.drakState;
      //console.log(this.drakState)
    },
  },
  persist: true,
});
