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
    
    // Context7 improvement: Simplified login success handling
    async handleSuccessfulLogin() {
      try {
        // Context7 fix: Router will handle navigation through router.beforeEach
        // No need for manual navigation here as user will be redirected automatically
        if (this.pendingRoute) {
          console.log(`[INFO] [LoginModal] Login successful, router will handle navigation to: ${this.pendingRoute.path}`);
        }
        
        this.hideModal();
      } catch (error) {
        console.error('[ERROR] [LoginModal] Login success handling failed:', error);
        this.hideModal(); // Always hide modal
      }
    }
  }
});
