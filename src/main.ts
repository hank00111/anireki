import { createApp } from "vue";
// import "./style.css";
import "./assets/style.scss";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { generateWebsiteSchema } from "@/utils/seo";
// import VueLazyload from 'vue-lazyload'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);

// Mount app and initialize SEO
app.mount("#app");

// Generate initial structured data after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  generateWebsiteSchema();
});
