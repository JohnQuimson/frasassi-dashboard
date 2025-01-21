import { createApp } from 'vue';
import { router } from './router';
import { store } from './store';
import App from './App.vue';
// CSS entry point
import './assets/scss/style.scss';
// JS entry point
import './assets/js/main';

store.initializeAuth();

// Vue App
createApp(App).use(router).mount('#app');
