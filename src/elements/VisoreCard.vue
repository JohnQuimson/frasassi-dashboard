<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';

export default {
   name: 'VisoreCard',
   props: {
      visore: Object,
   },
   data() {
      return {
         store,
         statistiche: {
            corrette: 0,
            errate: 0,
         },
      };
   },
   methods: {
      populateSelectedVisore() {
         store.selectedVisore = this.visore;
      },

      async getStats() {
         try {
            const visoreId = this.visore.id;
            const sessioneId = store.selectedSessione.id;

            const response = await axios.get(`${store.api.baseUrl}/risposte/statistiche/${visoreId}/${sessioneId}`);

            this.statistiche = response.data;
         } catch (error) {
            console.error('Errore nel caricamento delle statistiche:', error);
         }
      },
   },
   created() {
      this.getStats();
   },
};
</script>

<template>
   <div class="col-12">
      <router-link :to="`/visore/${visore.id}`" class="visore-card shadow-sm">
         <div class="card-body" @click="populateSelectedVisore()">
            <div class="card-title">
               <h5>Visore {{ visore.id }}</h5>
            </div>
            <div class="stats-container">
               <p class="m-0 stats">Corrette: {{ statistiche.corrette }}</p>
               <p class="m-0 stats">Errate: {{ statistiche.errate }}</p>
            </div>
         </div>
      </router-link>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.visore-card {
   background-color: $secondary-bg-color;
   border-radius: 20px;
   overflow: hidden;
   box-shadow: 10px 10px 18px rgba(0, 0, 0, 0.2);
   display: flex;
   padding: 20px;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   z-index: 10;

   .card-body {
      .card-title {
         font-size: 1.1rem;
         color: $white-color;
      }

      .stats-container {
         .stats {
            color: $gray-color;
         }
      }
   }

   &:hover {
      transform: scale(1.05);
      box-shadow: 15px 15px 30px rgba(0, 0, 0, 0.3);
   }
}
</style>
