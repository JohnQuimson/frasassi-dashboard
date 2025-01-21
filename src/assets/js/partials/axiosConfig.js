import axios from 'axios';
import { router } from '../../../router';

// Configura Axios
const instance = axios.create({
   baseURL: 'http://localhost:3000', // URL del backend
});

// Aggiungi il token JWT a ogni richiesta
instance.interceptors.request.use((config) => {
   const token = localStorage.getItem('token'); // Prendi il token salvato
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

instance.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
         // Se il token è scaduto
         console.warn('Token non valido o scaduto, reindirizzamento a /login...');
         localStorage.removeItem('token');
         // window.location.href = '/login';
         router.push('/login');
      }
      return Promise.reject(error);
   }
);

export default instance;
