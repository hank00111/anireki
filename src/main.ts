import { createApp } from "vue";
// import "./style.css";
import "./assets/style.scss";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// import VueLazyload from 'vue-lazyload'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
// app.use(VueLazyload)

app.mount("#app");
