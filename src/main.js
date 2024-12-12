import { createApp } from 'vue'

import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'

import App from './App.vue'

//ElementPlus UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//路由
import router from './router/index.js'
//axios
import axios from 'axios'
//echarts
import ECharts from 'vue-echarts'
import 'echarts'
//Store状态管理
import store from './store/index.js'

const app = createApp(App)
app.component('e-charts',ECharts).use(router).use(store).use(ViewUIPlus).use(ElementPlus).mount('#app')
axios.defaults.baseURL="/"
app.config.globalProperties.$http=axios


axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('satoken');
      if (token) {
        config.headers['satoken']  = token;
        console.log('satoken:'+token);
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  