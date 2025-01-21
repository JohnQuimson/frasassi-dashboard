import { createRouter, createWebHistory } from 'vue-router';
import { store } from './store'; // Assicurati di importare il tuo store
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

const router = createRouter({
   history: createWebHistory(),
   routes: [
      // {
      //    path: '/',
      //    name: 'main',
      //    component: AppMain,
      //    meta: { requiresAuth: true },
      // },
      {
         path: '/',
         redirect: '/tour',
      },
      {
         path: '/tour',
         name: 'Tours',
         component: AppTour,
         meta: { requiresAuth: true },
      },
      {
         path: '/tours/:user_id',
         name: 'TourByUser',
         component: AppTourByUser,
         meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
         path: '/tour-create',
         name: 'tourCreate',
         component: AppTourCreate,
         meta: { requiresAuth: true },
      },
      // {
      //    path: '/tour/:id',
      //    name: 'TourSingle',
      //    component: AppSingleTour,
      //    meta: { requiresAuth: true },
      // },
      {
         path: '/tour/edit/:id',
         name: 'TourEdit',
         component: AppTourEdit,
         meta: { requiresAuth: true },
      },
      {
         path: '/register',
         name: 'Register',
         component: AppRegister,
      },
      {
         path: '/login',
         name: 'Login',
         component: AppLogin,
      },
      {
         path: '/immagini/tour/:id',
         name: 'ImmaginiTour',
         component: AppImmaginiTour,
         meta: { requiresAuth: true },
      },
      {
         path: '/immagini/tour/:id/create',
         name: 'ImmaginiCreate',
         component: AppImmaginiCreate,
         meta: { requiresAuth: true },
      },
      {
         path: '/immagini/:id',
         name: 'ImmagineEdit',
         component: AppImmagineEdit,
         meta: { requiresAuth: true },
      },
      {
         path: '/user',
         name: 'Users',
         component: AppUser,
         meta: { requiresAuth: true, requiresAdmin: true }, // Rotta protetta per admin
      },
      {
         path: '/user-create',
         name: 'UserCreate',
         component: AppUserCreate,
         meta: { requiresAuth: true },
      },
      {
         path: '/user/edit/:id',
         name: 'UserEdit',
         component: AppUserEdit,
         meta: { requiresAuth: true },
      },
      {
         path: '/video360',
         name: 'Video360',
         component: AppVideo360,
         meta: { requiresAuth: true },
      },
      {
         path: '/video360/edit/:id',
         name: 'Video360Edit',
         component: AppVideo360Edit,
         meta: { requiresAuth: true },
      },
      {
         path: '/video360/user/:userId',
         name: 'Video360ByUser',
         component: AppVideo360ByUser,
         meta: { requiresAuth: true },
      },
      {
         path: '/video360-create',
         name: 'Video360Create',
         component: AppVideo360Create,
         meta: { requiresAuth: true },
      },
   ],
});

router.beforeEach((to, from, next) => {
   const isAuthenticated = store.auth.isAuthenticated;
   const userRole = store.auth.user?.role;
   const currentUserId = store.auth.user?.id; // ID dell'utente autenticato

   // Controlla se la rotta richiede autenticazione
   if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login'); // Se non autenticato, reindirizza a /login
   } else if (to.meta.requiresAdmin && userRole !== 'admin') {
      // Se non è admin, effettua il logout e reindirizza
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      store.auth.isAuthenticated = false;
      store.auth.user = null;
      next('/login');
   } else if (to.name === 'UserEdit') {
      // Verifica se l'utente sta cercando di modificare il proprio profilo
      const userIdToEdit = to.params.id;

      if (parseInt(userIdToEdit) !== currentUserId && userRole !== 'admin') {
         // Se l'utente non è lo stesso che sta tentando di modificare, reindirizza
         next(`/user/edit/${currentUserId}`); // Reindirizza alla pagina di modifica del proprio profilo
      } else {
         next(); // Permetti l'accesso se l'utente sta cercando di modificare il proprio profilo
      }
   } else {
      next(); // Altrimenti, consenti la navigazione
   }
});

export { router };
