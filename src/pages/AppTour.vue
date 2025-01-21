<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import CreateButton from '../elements/CreateButton.vue';
import OrderSelect from '../elements/OrderSelect.vue';
import Loader from '../elements/Loader.vue';
import ConfirmDeleteModal from '../elements/ConfirmDeleteModal.vue';
import AlertNotification from '../elements/AlertNotification.vue';
import TourCard from '../elements/TourCard.vue';

export default {
   name: 'AppTour',
   data() {
      return {
         store,
         mytours: [],
         error: null,
         searchQuery: '',
         selectedOrder: '',
         loading: false,
         showModal: false,
         tourToDelete: null,
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
      TourCard,
   },
   methods: {
      showAlert(type, title, message) {
         this.alert = {
            show: true,
            type,
            title,
            message,
         };

         // Nasconde l'alert automaticamente dopo 3 secondi
         setTimeout(() => {
            this.alert.show = false;
         }, 3000);
      },
      getToursByUser() {
         this.loading = true;
         const token = localStorage.getItem('token');
         const user = JSON.parse(localStorage.getItem('user'));

         if (!user || !user.id) {
            this.error = 'Utente non trovato. Effettua il login.';
            this.loading = false;
            return;
         }

         const userId = user.id;

         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.tours}/${userId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               this.mytours = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.showAlert('danger', 'Errore', "Errore nel recupero dei tour per l'utente.");
            })
            .finally(() => {
               this.loading = false;
            });
      },
      confirmDelete(tourId) {
         this.tourToDelete = tourId;
         this.showModal = true;
      },
      deleteTour() {
         const token = localStorage.getItem('token');
         axios
            .delete(`${this.store.api.baseUrl}/tours/${this.tourToDelete}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then(() => {
               this.mytours = this.mytours.filter((tour) => tour.id !== this.tourToDelete);
               this.showAlert('success', 'Successo', 'Il tour è stato eliminato con successo.');
               this.tourToDelete = null;
               this.showModal = false;
            })
            .catch((error) => {
               console.error("Errore durante l'eliminazione del tour:", error);
               this.showAlert('danger', 'Errore', "Errore durante l'eliminazione del tour. Riprova più tardi.");
            });
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

      populateSelectedTour(nomeTour) {
         this.store.selectedTour.nome = nomeTour;
      },
   },
   computed: {
      filteredTours() {
         let sortedTours = [...this.mytours].filter((tour) => !tour.is_deleted);

         if (this.selectedOrder) {
            sortedTours.sort((a, b) => {
               switch (this.selectedOrder) {
                  case '1': // Data creazione ascendente
                     return new Date(a.data_creazione) - new Date(b.data_creazione);
                  case '2': // Data creazione discendente
                     return new Date(b.data_creazione) - new Date(a.data_creazione);
                  case '3': // Data aggiornamento ascendente
                     return new Date(a.data_update) - new Date(b.data_update);
                  case '4': // Data aggiornamento discendente
                     return new Date(b.data_update) - new Date(a.data_update);
                  default:
                     return 0;
               }
            });
         }

         return sortedTours.filter((tour) => tour.nome.toLowerCase().includes(this.searchQuery.toLowerCase()));
      },
   },
   created() {
      this.store.title = 'Tour Virtuali';
      this.getToursByUser();
   },
};
</script>

<template>
   <Loader v-if="loading" />
   <div v-else class="tour-container">
      <CreateButton to="/tour-create" />

      <div class="tour-header container d-flex justify-content-between align-items-center mb-4">
         <div class="d-flex align-items-center search-bar">
            <i class="fa-solid fa-magnifying-glass search-left"></i>
            <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca tour virtuale" />
            <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
         </div>
         <OrderSelect v-model="selectedOrder" />
      </div>

      <div class="container">
         <div v-if="!filteredTours.length" class="alert alert-info">Nessun dato trovato</div>
         <div class="row">
            <TourCard
               v-for="tour in filteredTours"
               :key="tour.id"
               :tour="tour"
               :onDelete="confirmDelete"
               :populateSelectedTour="populateSelectedTour"
            />
            <!-- <div v-for="tour in filteredTours" :key="tour.id" class="col-6 col-md-4 col-lg-3">
               <div class="card shadow-sm">
                  <img
                     v-if="tour.thumbnail"
                     :src="`${this.store.api.baseUrl}/${tour.thumbnail}`"
                     class="card-img-top"
                     alt="Thumbnail"
                  />
                  <div class="card-body">
                     <h5 class="card-title">{{ tour.nome }}</h5>
                     <p class="card-text">
                        <small class="text-muted">creato: {{ formatDate(tour.data_creazione) }}</small>
                     </p>
                     <p class="card-text">
                        <small class="text-muted">aggiornato: {{ formatDate(tour.data_update) }}</small>
                     </p>
                  </div>
                  <div class="card-footer d-flex justify-content-between align-items-center">
                     <button class="btn btn-danger" @click.stop="confirmDelete(tour.id)">
                        <i class="fa-solid fa-trash-can"></i>
                     </button>
                     <router-link :to="`/tour/edit/${tour.id}`" class="btn btn-warning btn-sm me-2">
                        <i class="fa-solid fa-pen-to-square"></i>
                     </router-link>
                     <router-link
                        :to="`/immagini/tour/${tour.id}`"
                        @click="populateSelectedTour(tour.nome)"
                        class="btn btn-dark btn-sm"
                     >
                        <i class="fa-solid fa-image"></i>
                     </router-link>
                  </div>
               </div>
            </div> -->
         </div>
      </div>

      <ConfirmDeleteModal
         :visible="showModal"
         title="Conferma Eliminazione"
         message="Sei sicuro di voler eliminare questo tour? Questa operazione è irreversibile."
         @confirm="deleteTour"
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

.tour-header {
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

.card {
   .card-img-top {
      max-height: 180px;
      object-fit: cover;
   }

   .card-body {
      .card-title {
         font-size: 1.1rem;
         font-weight: bold;
      }

      .card-text {
         font-size: 0.9rem;
      }

      button,
      .router-link {
         font-size: 0.9rem;
      }
   }
}
</style>
