<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import CreateButton from '../elements/CreateButton.vue';
import OrderSelect from '../elements/OrderSelect.vue';
import Loader from '../elements/Loader.vue';
import ConfirmDeleteModal from '../elements/ConfirmDeleteModal.vue';
import AlertNotification from '../elements/AlertNotification.vue';
import SessioneCard from '../elements/SessioneCard.vue';

export default {
   name: 'AppSessione',
   data() {
      return {
         store,
         mySessioni: [],
         searchQuery: '',
         selectedOrder: '',
         loading: false,
         showModal: false,
         sessioneToDelete: null,
         alert: {
            show: false,
            type: 'success',
            title: '',
            message: '',
         },
      };
   },

   components: {
      CreateButton,
      OrderSelect,
      Loader,
      ConfirmDeleteModal,
      AlertNotification,
      SessioneCard,
   },

   methods: {
      getSessioni() {
         this.loading = true;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}`)
            .then((response) => {
               this.mySessioni = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.showAlert('error', 'Errore', 'Errore nel recupero delle sessioni');
            })
            .finally(() => {
               this.loading = false;
            });
      },

      confirmDelete(sessioneId) {
         this.sessioneToDelete = sessioneId;
         this.showModal = true;
      },

      deleteSessione() {
         axios
            .delete(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${this.sessioneToDelete}`)
            .then(() => {
               this.mySessioni = this.mySessioni.filter((sessione) => sessione.id !== this.sessioneToDelete);
               this.showAlert('success', 'Successo', 'La sessione è stata eliminata con successo.');
               this.sessioneToDelete = null;
               this.showModal = false;
            })
            .catch(() => {
               this.showAlert('danger', 'Errore', "Errore durante l'eliminazione della sessione. Riprova più tardi.");
            });
      },

      showAlert(type, title, message) {
         this.alert = {
            show: true,
            type,
            title,
            message,
         };

         setTimeout(() => {
            this.alert.show = false;
         }, 3000);
      },

      clearSearch() {
         this.searchQuery = '';
      },

      formatDate(dateString) {
         const date = new Date(dateString);
         const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
         };
         return new Intl.DateTimeFormat('it-IT', options).format(date);
      },
   },

   computed: {
      filteredSessioni() {
         let sortedSessioni = [...this.mySessioni].filter((sessione) => !sessione.isDeleted);

         if (this.selectedOrder) {
            sortedSessioni.sort((a, b) => {
               switch (this.selectedOrder) {
                  case '1': // Ordina per timestamp crescente
                     return new Date(a.timestamp) - new Date(b.timestamp);
                  case '2': // Ordina per timestamp decrescente
                     return new Date(b.timestamp) - new Date(a.timestamp);
                  default:
                     return 0;
               }
            });
         }

         if (this.searchQuery) {
            const lowerCaseQuery = this.searchQuery.toLowerCase();

            sortedSessioni = sortedSessioni.filter((sessione) => {
               const formattedDate = this.formatDate(sessione.timestamp).toLowerCase();

               return (
                  sessione.titolo.toLowerCase().includes(lowerCaseQuery) ||
                  sessione.nome.toLowerCase().includes(lowerCaseQuery) ||
                  sessione.cognome.toLowerCase().includes(lowerCaseQuery) ||
                  formattedDate.includes(lowerCaseQuery)
               );
            });
         }

         return sortedSessioni;
      },
   },

   created() {
      this.store.title = 'Sessioni';
      this.getSessioni();
   },
};
</script>

<template>
   <Loader v-if="loading" />

   <div class="sessione-container pb-5">
      <!-- <CreateButton to="/sessione-create" /> -->

      <div class="sessione-header">
         <div class="container p-0 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar">
               <i class="fa-solid fa-magnifying-glass search-left"></i>
               <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca sessione" />
               <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
            </div>
            <OrderSelect v-model="selectedOrder" />
         </div>
      </div>

      <div class="container p-0">
         <div v-if="!filteredSessioni.length" class="mt-5 alert alert-info">Nessun dato trovato</div>

         <div class="row g-3 d-flex justify-content-center">
            <SessioneCard
               v-for="sessione in filteredSessioni"
               :key="sessione.id"
               :sessione="sessione"
               :onDelete="confirmDelete"
               :formatDate="formatDate"
            />
         </div>
      </div>

      <ConfirmDeleteModal
         :visible="showModal"
         title="Conferma Eliminazione"
         message="Sei sicuro di voler eliminare questa sessione?"
         @confirm="deleteSessione"
         @cancel="showModal = false"
      />

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

   .sessione-header {
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
}
</style>
