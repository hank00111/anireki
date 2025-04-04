import { defineStore } from "pinia";

type ErrorType = 'error' | 'warning' | 'info';

interface ErrorMessage {
  id: number;
  message: string;
  type: ErrorType;
  timestamp: number;
}

export const useErrorStore = defineStore("errorStore", {
  state: () => ({
    errors: [] as ErrorMessage[],
    nextId: 0
  }),
  
  actions: {
    addError(message: string, type: ErrorType = 'error') {
      const error = {
        id: this.nextId++,
        message,
        type,
        timestamp: Date.now()
      };
      
      this.errors.push(error);
      setTimeout(() => this.removeError(error.id), 3000);
    },

    removeError(id: number) {
      const index = this.errors.findIndex(e => e.id === id);
      if (index > -1) this.errors.splice(index, 1);
    }
  }
});