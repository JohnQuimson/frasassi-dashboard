<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import { jsPDF } from 'jspdf';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';
import VisoreCard from '../elements/VisoreCard.vue';
import OrderSelect from '../elements/OrderSelect.vue';

export default {
   name: 'AppSessioneSingle',
   data() {
      return {
         store,
         searchQuery: '',
         selectedOrder: '',
         loading: false,
         sessione: null,
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
      VisoreCard,
      OrderSelect,
   },

   methods: {
      fetchSessione() {
         this.loading = true;
         const sessioneId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${sessioneId}`)
            .then((response) => {
               this.sessione = response.data;
               this.store.selectedSessione = response.data;
               this.store.title = `Sessione ${this.store.selectedSessione.titolo}`;
            })
            .catch((e) => {
               console.log(e);
               this.showAlert('error', 'Errore', 'Errore nel recupero delle sessioni');
            })
            .finally(() => {
               this.loading = false;
            });
      },

      getVisori() {
         this.loading = true;
         const sessioneId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${sessioneId}/visori`)
            .then((response) => {
               this.store.visori = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.showAlert('error', 'Errore', 'Errore nel recupero dei visori');
            })
            .finally(() => {
               this.loading = false;
            });
      },

      fetchStatsForVisori() {
         this.$nextTick(() => {
            this.store.visori.forEach((visore) => {
               const visoreRef = this.$refs[`visoreCard-${visore.id}`];
               if (visoreRef && Array.isArray(visoreRef) && visoreRef[0]) {
                  visoreRef[0].getStats();
               }
            });
         });
      },

      clearSearch() {
         this.searchQuery = '';
      },

      generatePDF() {
         this.store.visori.forEach((visore) => {
            const doc = new jsPDF();
            const margin = 20;
            const pageWidth = 210 - 2 * margin; // Larghezza disponibile su A4 verticale
            let yPosition = 30; // Posizione iniziale per il testo

            // Recupera nome sessione e ID visore
            const sessioneNome = this.store.selectedSessione.titolo || 'Sessione';
            const visoreId = visore.id || 'Visore';

            //  nome del file
            const fileName = `${sessioneNome.replace(/[^a-zA-Z0-9]/g, '-')}_visore${visoreId}.pdf`;

            // identificativo
            doc.setFontSize(12);
            doc.text(`Visore ${visoreId} - Sessione ${sessioneNome}`, margin, yPosition);
            yPosition += 10;

            // titolo statistiche
            doc.setFontSize(12);
            doc.text('Statistiche Risposte', margin, yPosition);
            yPosition += 10;

            //  statistiche
            if (visore.risposte) {
               const corrette = visore.risposte.filter((risposta) => risposta.isCorrect).length;
               const totali = visore.risposte.length;
               const percentuale = totali > 0 ? ((corrette / totali) * 100).toFixed(2) : '0.00';

               doc.setFontSize(8);
               doc.text(`Risposte corrette: ${corrette} / ${totali}`, margin, yPosition);
               yPosition += 5;
               doc.text(`Percentuale di correttezza: ${percentuale}%`, margin, yPosition);
               yPosition += 10;
            }

            // risposte
            if (visore.risposte) {
               visore.risposte.forEach((risposta) => {
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
            }

            // Salva il PDF con il nome personalizzato
            doc.save(fileName);
         });
      },
   },

   computed: {
      filteredVisori() {
         let visori = this.store.visori;

         // Filtro per id, nome e cognome
         if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            visori = visori.filter((visore) => {
               return (
                  String(visore.id).includes(query) ||
                  visore.cognome.toLowerCase().includes(query) ||
                  visore.nome.toLowerCase().includes(query)
               );
            });
         }

         return visori;
      },
   },

   watch: {
      'store.visori': {
         handler() {
            this.$nextTick(() => {
               this.fetchStatsForVisori();
            });
         },
         deep: true,
      },
   },

   created() {
      this.fetchSessione();

      this.getVisori();
   },
};
</script>

<template>
   <Loader v-if="loading" />

   <div v-else class="sessione-container pb-5">
      <div class="visore-header">
         <div class="container p-0 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar">
               <i class="fa-solid fa-magnifying-glass search-left"></i>
               <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input p-0"
                  placeholder="Cerca visore per numero"
               />
               <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
            </div>
            <!-- <OrderSelect v-model="selectedOrder" /> -->
         </div>
      </div>

      <div class="container p-0">
         <div v-if="!loading && !filteredVisori.length" class="mt-5 alert alert-info">Nessun dato trovato</div>

         <div v-else class="row g-3 m-0">
            <div class="container d-flex justify-content-between p-0 mt-5">
               <h2 class="visore-title">Lista visori</h2>
               <button @click="generatePDF" class="generate-pdf">Scarica risultati</button>
            </div>
            <div class="row g-3 m-0 p-0 d-flex justify-content-center">
               <!-- <div v-for="visore in store.visori" :key="visore.id" class="col-md-4">
                  <router-link :to="`/visore/${visore.id}`">
                     <div class="card p-3">
                        <h5>{{ visore.nome }} {{ visore.cognome }}</h5>
                     </div>
                  </router-link>
               </div> -->

               <VisoreCard
                  v-for="visore in filteredVisori"
                  :key="visore.id"
                  :visore="visore"
                  :ref="'visoreCard-' + visore.id"
               />
            </div>
         </div>
      </div>

      <AlertNotification
         v-if="alert.show"
         :type="alert.type"
         :title="alert.title"
         :message="alert.message"
         @closed="alert.show = false"
      />
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.sessione-container {
   width: 90%;
   margin: 0 auto;
   .visore-header {
      position: sticky;
      top: 0;
      right: 0;
      left: 0;
      z-index: 2;
      padding-bottom: 20px;
      background-color: $background-color;

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
   }

   .visore-title {
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
</style>
