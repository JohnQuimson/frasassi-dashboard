<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';
import RispostaCard from '../elements/RispostaCard.vue';
import { jsPDF } from 'jspdf';

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

      generatePDF() {
         const doc = new jsPDF();
         const margin = 20;
         const pageWidth = 210 - 2 * margin; // Larghezza disponibile su A4 verticale
         let yPosition = 30; // Posizione iniziale per il testo

         // Recupera nome sessione e ID visore
         const sessioneNome = this.store.selectedSessione.titolo || 'Sessione';
         const visoreId = this.store.selectedVisore.id || 'Visore';

         // Crea il nome del file in formato "nome sessione: visore id.pdf"
         const fileName = `${sessioneNome.replace(/[^a-zA-Z0-9]/g, '-')}_visore${visoreId}.pdf`;

         doc.setFontSize(12);
         doc.text(`Visore ${visoreId} - Sessione ${sessioneNome}`, margin, yPosition);
         yPosition += 10;

         // Aggiungi il titolo
         doc.setFontSize(12);
         doc.text('Statistiche Risposte', margin, yPosition);
         yPosition += 10;

         // Aggiungi le statistiche
         doc.setFontSize(9);
         doc.text(`Risposte corrette: ${this.statistiche.corrette} / ${this.statistiche.totali}`, margin, yPosition);
         yPosition += 5;
         doc.text(`Percentuale di correttezza: ${this.statistiche.percentuale}%`, margin, yPosition);
         yPosition += 10;

         // Aggiungi le risposte
         Object.keys(this.filteredRisposte).forEach((quiz) => {
            if (yPosition + 10 > 280) {
               doc.addPage();
               yPosition = 20;
            }

            doc.setFontSize(10);
            doc.text(quiz, margin, yPosition);
            yPosition += 10;

            this.filteredRisposte[quiz].forEach((risposta) => {
               if (yPosition + 10 > 280) {
                  doc.addPage();
                  yPosition = 20;
               }

               const isCorrect = risposta.isCorrect ? 'Corretto' : 'Sbagliato';
               doc.setFontSize(8);

               // Usa splitTextToSize per formattare il testo all'interno della larghezza disponibile
               let domandaText = doc.splitTextToSize(`Domanda: ${risposta.domanda.domanda}`, pageWidth);
               let opzioneText = doc.splitTextToSize(`Risposta: ${risposta.opzione.testo}`, pageWidth);
               let rispostaText = doc.splitTextToSize(`Esito: ${isCorrect}`, pageWidth);

               // Aggiungi il testo riformattato al PDF
               doc.text(domandaText, margin, yPosition);
               yPosition += domandaText.length * 5;

               doc.text(opzioneText, margin, yPosition);
               yPosition += opzioneText.length * 5;

               doc.text(rispostaText, margin, yPosition);
               yPosition += rispostaText.length * 5 + 5; // Spazio extra tra le risposte
            });

            yPosition += 10; // Spazio extra tra i quiz
         });

         // Salva il PDF con il nome personalizzato
         doc.save(fileName);
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
      this.store.title = `Visore ${this.store.selectedVisore.id} - Sessione ${this.store.selectedSessione.titolo}`;
      this.fetchRisposte();
   },
};
</script>

<template>
   <div class="visore-container pb-5">
      <div class="visore-header">
         <div class="container p-0 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar">
               <i class="fa-solid fa-magnifying-glass search-left"></i>
               <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca risposta" />
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
         <div class="container p-0 mt-5 d-flex justify-content-between align-items-center">
            <div>
               <h2 class="stat-title">Statistiche</h2>
               <p class="text-white m-0">Risposte corrette: {{ statistiche.corrette }} / {{ statistiche.totali }}</p>
               <p class="text-white m-0">Percentuale di correttezza: {{ statistiche.percentuale }}%</p>
            </div>

            <button @click="generatePDF" class="generate-pdf">Genera PDF</button>
         </div>
      </div>

      <div class="container">
         <div class="row">
            <ul class="ps-0">
               <li v-for="(risposte, quiz) in filteredRisposte" :key="quiz">
                  <h3 class="quiz-title mt-5">{{ quiz }}</h3>
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

   .stat-title {
      font-size: 2rem;
      color: $primary-color;
   }

   .generate-pdf {
      background-color: $primary-color;
      border: none;
      border-radius: 20px;
      padding: 10px 20px;
      transition: transform 0.3s ease-in-out;

      &:hover {
         transform: scale(1.1);
      }
   }
}

.quiz-title {
   font-size: 2rem;
   color: $primary-color;
}
</style>
