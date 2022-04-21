import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
	state: () => ({
		login: "",
		password: "",
		topic: "",
		url: "",
		configured: false
	}),
});
