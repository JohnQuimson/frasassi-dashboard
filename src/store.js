import { reactive, watch } from 'vue';

export const store = reactive({
   title: 'Dashboard',
   searchText: '',
   loading: true,

   api: {
      baseUrl: 'http://localhost:3000',
      apiUrls: {
         // tours: '/tours',
         // immagini: '/immagini',
         // users: '/users',
         // videos: '/video360',
         sessioni: '/sessioni',
         visori: '/visori',
      },
   },

   // selectedUser: JSON.parse(localStorage.getItem('selectedUser')) || {
   //    id: null,
   //    name: null,
   //    email: null,
   //    role: null,
   // },

   selectedSessione: JSON.parse(localStorage.getItem('selectedSessione')) || {
      titolo: null,
   },

   selectedVisore: JSON.parse(localStorage.getItem('selectedVisore')) || {
      nome: null,
   },

   // selectedVideo: {
   //    nome: null,
   // },

   // auth: {
   //    user: null,
   //    isAuthenticated: false,
   // },

   // tours: [],
   // images: [],
   // users: [],

   sessioni: [],
   risposte: [],

   // Funzione per inizializzare lo stato dell'autenticazione all'avvio
   initializeAuth() {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (token && user) {
         this.auth.isAuthenticated = true;
         this.auth.user = user;
      }
   },
});

// Watch per selectedUser
// watch(
//    () => store.selectedUser,
//    (newValue) => {
//       localStorage.setItem('selectedUser', JSON.stringify(newValue));
//    },
//    { deep: true }
// );

// Watch per selectedTour
// watch(
//    () => store.selectedTour,
//    (newValue) => {
//       localStorage.setItem('selectedTour', JSON.stringify(newValue));
//    },
//    { deep: true }
// );

watch(
   () => store.selectedSessione,
   (newValue) => {
      localStorage.setItem('selectedSessione', JSON.stringify(newValue));
   },
   { deep: true }
);
watch(
   () => store.selectedVisore,
   (newValue) => {
      localStorage.setItem('selectedVisore', JSON.stringify(newValue));
   },
   { deep: true }
);

// Inizializza lo stato dell'autenticazione quando l'app parte
store.initializeAuth();
