import { createRouter, createWebHistory } from 'vue-router';
import AppSessione from './pages/AppSessione.vue';
import AppSessioneEdit from './pages/AppSessioneEdit.vue';
import AppSessioneSingle from './pages/AppSessioneSingle.vue';
import AppVisoreSingle from './pages/AppVisoreSingle.vue';

const router = createRouter({
   history: createWebHistory(),
   routes: [
      {
         path: '/',
         redirect: '/sessioni',
      },
      {
         path: '/sessioni',
         name: 'AppSessione',
         component: AppSessione,
      },
      {
         path: '/sessioni/edit/:id',
         name: 'SessioneEdit',
         component: AppSessioneEdit,
      },
      {
         path: '/sessioni/:id',
         name: 'AppSessioneSingle',
         component: AppSessioneSingle,
      },
      {
         path: '/visore/:id',
         name: 'VisoreSingle',
         component: AppVisoreSingle,
      },
   ],
});

export { router };
