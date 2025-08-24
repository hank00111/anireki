import { defineStore } from "pinia";
import type { RouteLocationNormalized } from "vue-router";

interface LoginModalState {
  isVisible: boolean;
  title: string;
  message: string;
  pendingRoute: RouteLocationNormalized | null;
}

export const useLoginModalStore = defineStore("loginModal", {
  state: (): LoginModalState => ({
    isVisible: false,
    title: '',
    message: '',
    pendingRoute: null
  }),
  
  actions: {
    showModal(title: string, message: string = '', pendingRoute?: RouteLocationNormalized) {
      this.title = title;
      this.message = message;
      this.pendingRoute = pendingRoute || null;
      this.isVisible = true;
      
      console.log(`[LOGIN_MODAL] Showing modal for route: ${pendingRoute?.path || 'unknown'}`);
    },
    
    hideModal() {
      this.isVisible = false;
      this.title = '';
      this.message = '';
      this.pendingRoute = null;
    },
    
    // Context7 best practice: Handle successful login navigation
    async handleSuccessfulLogin() {
      const { default: router } = await import('@/router');
      
      if (this.pendingRoute) {
        console.log(`[LOGIN_MODAL] Redirecting to pending route: ${this.pendingRoute.path}`);
        await router.push(this.pendingRoute);
      }
      
      this.hideModal();
    }
  }
});
