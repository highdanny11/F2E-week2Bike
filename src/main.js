import { createApp } from 'vue';
import 'bootstrap';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import { getToken } from '@/assets/javascript/GetAPI';

const init = async () => {
  const app = createApp(App);
  app.use(VueAxios, axios);
  app.use(router);
  await getToken();
  app.mount('#app');
};

init();
