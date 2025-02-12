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
               response.data.forEach((risposta) => {
                  const quiz = risposta.domanda.quiz;
                  if (!grouped[quiz]) {
                     grouped[quiz] = [];
                  }
                  grouped[quiz].push(risposta);
               });
               this.myrisposte = grouped;
               console.log(JSON.parse(JSON.stringify(this.myrisposte)));
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
