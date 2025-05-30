import { defineStore } from "pinia";

interface LoginModalState {
  isVisible: boolean;
  title: string;
  message: string;
}

export const useLoginModalStore = defineStore("loginModal", {
  state: (): LoginModalState => ({
    isVisible: false,
    title: '',
    message: ''
  }),
  
  actions: {
    showModal(title: string, message: string = '') {
      this.title = title;
      this.message = message;
      this.isVisible = true;
    },
    
    hideModal() {
      this.isVisible = false;
      this.title = '';
      this.message = '';
    }
  }
});
