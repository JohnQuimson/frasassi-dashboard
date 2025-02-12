<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';

export default {
   name: 'AppVisoreSingle',
   data() {
      return {
         store,
         loading: false,
         visore: null,
         myrisposte: [],
         statistiche: {
            corrette: 0,
            totali: 0,
            percentuale: 0,
         },
         alert: {
            show: false,
            type: 'success',
            title: '',
            message: '',
         },
      };
   },

   components: {
      Loader,
      AlertNotification,
   },

   methods: {
      fetchRisposte() {
         this.loading = true;
         const sessioneId = this.store.selectedSessione.id;
         const visoreId = this.store.selectedVisore.id;

         axios
            .get(`${this.store.api.baseUrl}/risposte/sessione/${sessioneId}/visore/${visoreId}`)
            .then((response) => {
               // Raggruppa per `domanda.quiz`
               const grouped = {};
               let totali = 0;
               let corrette = 0;

               response.data.forEach((risposta) => {
                  const quiz = risposta.domanda.quiz;
                  if (!grouped[quiz]) {
                     grouped[quiz] = [];
                  }
                  grouped[quiz].push(risposta);

                  // Calcolo statistiche
                  totali++;
                  if (risposta.isCorrect) {
                     corrette++;
                  }
               });

               this.myrisposte = grouped;

               // Calcola le statistiche
               this.statistiche = {
                  corrette: corrette,
                  totali: totali,
                  percentuale: totali > 0 ? ((corrette / totali) * 100).toFixed(2) : 0,
               };

               console.log(JSON.parse(JSON.stringify(this.myrisposte)));
               console.log(this.statistiche);
            })
            .catch((error) => {
               console.error(error);
               this.showAlert('error', 'Errore', 'Errore nel recupero delle risposte');
            })
            .finally(() => {
               this.loading = false;
            });
      },
   },

   created() {
      this.store.title = `Visore ${this.store.selectedVisore.nome}`;
      this.fetchRisposte();
   },
};
</script>

<template>
   <div class="visore-container pb-5">
      <div class="container">
         <div class="row">
            <!-- Sezione Statistiche -->
            <div class="col-12 mb-4">
               <h2 class="text-info">Statistiche</h2>
               <p class="text-white">Risposte corrette: {{ statistiche.corrette }} / {{ statistiche.totali }}</p>
               <p class="text-white">Percentuale di correttezza: {{ statistiche.percentuale }}%</p>
            </div>

            <!-- Lista delle Risposte Raggruppate per Quiz -->
            <ul>
               <li v-for="(risposte, quiz) in myrisposte" :key="quiz">
                  <h3 class="text-info">{{ quiz }}</h3>
                  <ul>
                     <li v-for="risposta in risposte" :key="risposta.id">
                        <p class="text-white">{{ risposta.domanda.domanda }}</p>
                        <p class="text-white">{{ risposta.opzione.testo }}</p>
                        <p class="text-white">Corretta: {{ risposta.isCorrect ? 'Sì' : 'No' }}</p>
                     </li>
                  </ul>
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.app-visore-single {
   /* your styles here */
}
</style>
