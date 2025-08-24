import { defineStore } from "pinia";

type ErrorType = "error" | "warning" | "info";

interface ErrorMessage {
	id: number;
	message: string;
	type: ErrorType;
	timestamp: number;
}

export const useErrorStore = defineStore("errorStore", {
	state: () => ({
		errors: [] as ErrorMessage[],
		nextId: 0,
	}),

	actions: {
		addError(message: string, type: ErrorType = "error") {
			const isDuplicate = this.errors.some(
				(error) => error.message === message && error.type === type && Date.now() - error.timestamp < 1000
			);

			if (isDuplicate) {
				return;
			}

			const error = {
				id: this.nextId++,
				message,
				type,
				timestamp: Date.now(),
			};

			this.errors.push(error);

			const timeout = type === "error" ? 7000 : type === "warning" ? 5000 : 3000;
			setTimeout(() => this.removeError(error.id), timeout);
		},

		removeError(id: number) {
			const index = this.errors.findIndex((e) => e.id === id);
			if (index > -1) this.errors.splice(index, 1);
		},

		clearAllErrors() {
			this.errors = [];
		},
	},
});
