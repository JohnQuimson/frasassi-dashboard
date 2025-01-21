<script>
// import axios from 'axios';
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';

export default {
   name: 'TourSingle',
   data() {
      return {
         store,
         tour: null, // Contiene i dati del singolo tour
         error: null, // Per gestire eventuali errori
      };
   },
   methods: {
      getSingleTour() {
         const token = localStorage.getItem('token');
         const tourId = this.$route.params.id; // Ottiene l'ID dal parametro della route
         axios
            .get(`http://localhost:3000/tours/${tourId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               this.tour = response.data; // Salva i dati del singolo tour
            })
            .catch((error) => {
               console.error('Errore durante il recupero del tour:', error);
               this.error = 'Impossibile caricare il tour. Riprova più tardi.';
            });
      },
   },
   created() {
      this.getSingleTour(); // Carica il singolo tour quando il componente è creato
   },
};
</script>

<template>
   <div class="tour-single">
      <!-- Header con titolo e pulsante di modifica -->
      <div class="single-header d-flex justify-content-between align-items-center">
         <h1>{{ tour?.nome || 'Dettagli Tour' }}</h1>
         <router-link v-if="tour" :to="`/tour/edit/${tour.id}`" class="btn btn-warning"> Modifica </router-link>
      </div>

      <!-- Messaggio di errore -->
      <div v-if="error" class="error text-danger">
         {{ error }}
      </div>

      <!-- Dettagli del tour -->
      <div v-else-if="tour" class="tour-details">
         <p>{{ tour.descrizione }}</p>
         <div class="h-50 my-3">
            <img
               v-if="tour.thumbnail"
               :src="`${this.store.api.baseUrl}/${tour.thumbnail}`"
               alt="Thumbnail del tour"
               class="img-fluid rounded"
            />
         </div>
         <p>Lingua: {{ tour.lingua }}</p>
         <p>Creato il: {{ new Date(tour.data_creazione).toLocaleDateString() }}</p>
      </div>

      <!-- Messaggio di caricamento -->
      <div v-else>
         <p class="text-muted">Caricamento in corso...</p>
      </div>
   </div>
</template>

<style lang="scss">
.tour-single {
   padding: 20px;

   .tour-details {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      img {
         max-width: 100%;
         height: auto;
         border-radius: 5px;
         margin-bottom: 10px;
      }

      h1 {
         font-size: 24px;
         margin-bottom: 10px;
      }

      p {
         font-size: 16px;
         margin: 5px 0;
      }
   }

   .error {
      color: red;
      font-weight: bold;
      text-align: center;
   }
}
</style>
