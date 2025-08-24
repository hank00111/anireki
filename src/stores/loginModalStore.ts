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
		title: "",
		message: "",
		pendingRoute: null,
	}),

	actions: {
		showModal(title: string, message: string = "", pendingRoute?: RouteLocationNormalized) {
			this.title = title;
			this.message = message;
			this.pendingRoute = pendingRoute || null;
			this.isVisible = true;
		},

		hideModal() {
			this.isVisible = false;
			this.title = "";
			this.message = "";
			this.pendingRoute = null;
		},

		async handleSuccessfulLogin() {
			try {
				this.hideModal();
			} catch (error) {
				this.hideModal();
			}
		},
	},
});
