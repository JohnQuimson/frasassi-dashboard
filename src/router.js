import { createRouter, createWebHistory } from 'vue-router';
import AppMain from './components/AppMain.vue';
import AppTour from './pages/AppTour.vue';
import AppTourByUser from './pages/AppTourByUser.vue';
import AppTourCreate from './pages/AppTourCreate.vue';
import AppSingleTour from './pages/AppSingleTour.vue';
import AppTourEdit from './pages/AppTourEdit.vue';
import AppRegister from './pages/AppRegister.vue';
import AppLogin from './pages/AppLogin.vue';
import AppImmaginiTour from './pages/AppImmaginiTour.vue';
import AppImmaginiCreate from './pages/AppImmagineCreate.vue';
import AppImmagineEdit from './pages/AppImmagineEdit.vue';
import AppUser from './pages/AppUser.vue';
import AppUserEdit from './pages/AppUserEdit.vue';
import AppUserCreate from './pages/AppUserCreate.vue';
import AppVideo360 from './pages/AppVideo360.vue';
import AppVideo360Edit from './pages/AppVideo360Edit.vue';
import AppVideo360ByUser from './pages/AppVideo360ByUser.vue';
import AppVideo360Create from './pages/AppVideo360Create.vue';
import AppSessione from './pages/AppSessione.vue';
import AppSessioneEdit from './pages/AppSessioneEdit.vue';

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

      // **************************
      // Da eliminare
      // **************************
      // {
      //    path: '/tour',
      //    name: 'Tours',
      //    component: AppTour,
      // },
      // {
      //    path: '/tours/:user_id',
      //    name: 'TourByUser',
      //    component: AppTourByUser,
      // },
      // {
      //    path: '/tour-create',
      //    name: 'tourCreate',
      //    component: AppTourCreate,
      // },
      // {
      //    path: '/tour/edit/:id',
      //    name: 'TourEdit',
      //    component: AppTourEdit,
      // },
      // {
      //    path: '/register',
      //    name: 'Register',
      //    component: AppRegister,
      // },
      // {
      //    path: '/login',
      //    name: 'Login',
      //    component: AppLogin,
      // },
      // {
      //    path: '/immagini/tour/:id',
      //    name: 'ImmaginiTour',
      //    component: AppImmaginiTour,
      // },
      // {
      //    path: '/immagini/tour/:id/create',
      //    name: 'ImmaginiCreate',
      //    component: AppImmaginiCreate,
      // },
      // {
      //    path: '/immagini/:id',
      //    name: 'ImmagineEdit',
      //    component: AppImmagineEdit,
      // },
      // {
      //    path: '/user',
      //    name: 'Users',
      //    component: AppUser,
      // },
      // {
      //    path: '/user-create',
      //    name: 'UserCreate',
      //    component: AppUserCreate,
      // },
      // {
      //    path: '/user/edit/:id',
      //    name: 'UserEdit',
      //    component: AppUserEdit,
      // },
      // {
      //    path: '/video360',
      //    name: 'Video360',
      //    component: AppVideo360,
      // },
      // {
      //    path: '/video360/edit/:id',
      //    name: 'Video360Edit',
      //    component: AppVideo360Edit,
      // },
      // {
      //    path: '/video360/user/:userId',
      //    name: 'Video360ByUser',
      //    component: AppVideo360ByUser,
      // },
      // {
      //    path: '/video360-create',
      //    name: 'Video360Create',
      //    component: AppVideo360Create,
      // },
      // **************************
      // Da eliminare
      // **************************
   ],
});

export { router };
