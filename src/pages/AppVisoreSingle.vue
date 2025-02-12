<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';
import RispostaCard from '../elements/RispostaCard.vue';

export default {
   name: 'AppVisoreSingle',
   data() {
      return {
         store,
         searchQuery: '',
         loading: false,
         visore: null,
         myrisposte: [],
         filterQuiz: 'all',
         quizOptions: [],
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
      RispostaCard,
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

               this.populateQuizOptions();
            })
            .catch((error) => {
               console.error(error);
               this.showAlert('error', 'Errore', 'Errore nel recupero delle risposte');
            })
            .finally(() => {
               this.loading = false;
            });
      },

      populateQuizOptions() {
         this.quizOptions = Object.keys(this.myrisposte);
         this.quizOptions.unshift('all');
      },

      clearSearch() {
         this.searchQuery = '';
      },
   },

   computed: {
      filteredRisposte() {
         let risposteFiltrate = this.myrisposte;

         // Filtro per ricerca testuale
         if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            const filtered = {};

            Object.keys(risposteFiltrate).forEach((quiz) => {
               const risposte = risposteFiltrate[quiz].filter((risposta) => {
                  return risposta.domanda.domanda.toLowerCase().includes(query);
               });

               if (risposte.length > 0) {
                  filtered[quiz] = risposte;
               }
            });

            risposteFiltrate = filtered;
         }

         // Filtro per select
         if (this.filterQuiz !== 'all') {
            return { [this.filterQuiz]: risposteFiltrate[this.filterQuiz] || [] };
         }

         return risposteFiltrate;
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
      <div class="visore-header">
         <div class="container d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar">
               <i class="fa-solid fa-magnifying-glass search-left"></i>
               <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca sessione" />
               <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
            </div>
            <!-- select filter -->
            <div class="filter">
               <select id="quizFilter" v-model="filterQuiz" class="form-select w-auto">
                  <option value="all" disabled>Filtra per Quiz</option>
                  <option v-for="quiz in quizOptions" :key="quiz" :value="quiz">
                     {{ quiz === 'all' ? 'Tutti' : quiz }}
                  </option>
               </select>
            </div>
         </div>

         <!-- Sezione Statistiche -->
         <div class="col-12 mt-5">
            <h2 class="text-info">Statistiche</h2>
            <p class="text-white m-0">Risposte corrette: {{ statistiche.corrette }} / {{ statistiche.totali }}</p>
            <p class="text-white m-0">Percentuale di correttezza: {{ statistiche.percentuale }}%</p>
         </div>
      </div>

      <div class="container">
         <div class="row">
            <ul class="ps-0">
               <li v-for="(risposte, quiz) in filteredRisposte" :key="quiz">
                  <h3 class="text-info mt-5">{{ quiz }}</h3>
                  <div class="row g-3 d-flex justify-content-center mb-5">
                     <RispostaCard
                        v-for="risposta in risposte"
                        :key="risposta.id"
                        :domanda="risposta.domanda.domanda"
                        :opzione="risposta.opzione.testo"
                        :isCorrect="risposta.isCorrect"
                     />
                  </div>
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.visore-header {
   position: sticky;
   top: 0;
   right: 0;
   left: 0;
   z-index: 2;
   padding-bottom: 20px;
   background-color: $background-color;
   border-bottom: 1px solid rgb(54, 54, 54);

   .search-bar {
      background-color: $secondary-bg-color;
      border-radius: 20px;
      position: relative;
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
      width: 250px;

      .search-left {
         padding: 10px;
         color: $gray-color;
      }

      .search-input {
         border: none;
         max-width: 70%;
         width: 90%;
         background-color: $secondary-bg-color;
         font-size: 14px;
         color: $gray-color;

         &:focus-visible {
            outline: $primary-color;
         }
      }

      .search-right {
         position: absolute;
         right: 10px;
         color: $gray-color;

         &:hover {
            color: $primary-color;
            cursor: pointer;
         }
      }

      .x-placeholder {
         padding: 10px;
         opacity: 0;
      }
   }

   .filter {
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);

      select {
         width: 100%;
         height: 80%;
         border-radius: 20px;
         font-size: 14px;
         background-color: $secondary-bg-color;
         border: none;
         color: $gray-color;

         &:focus {
            box-shadow: none;
         }

         option {
            font-size: 16px;
            padding: 0 20px;
            color: $gray-color;

            &:disabled {
               color: $gray-color;
               background-color: $secondary-bg-color;
            }
         }
      }
   }
}
</style>
