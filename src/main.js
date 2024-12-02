import { createApp } from "vue";

import ViewUIPlus from "view-ui-plus";
import "view-ui-plus/dist/styles/viewuiplus.css";

import App from "./App.vue";

//ElementPlus UI
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

//路由
import router from "./router/index.js";
//axios
import axios from "axios";
//echarts
import ECharts from "vue-echarts";
import "echarts";
//Store状态管理
import store from "./store/index.js";

const app = createApp(App);
app
  .component("e-charts", ECharts)
  .use(router)
  .use(store)
  .use(ViewUIPlus)
  .use(ElementPlus)
  .mount("#app");
axios.defaults.baseURL = "http://localhost:10086";
app.config.globalProperties.$http = axios;
