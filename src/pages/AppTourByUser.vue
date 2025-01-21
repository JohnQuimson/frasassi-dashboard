<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import CreateButton from '../elements/CreateButton.vue';
import OrderSelect from '../elements/OrderSelect.vue';
import Loader from '../elements/Loader.vue';
import ConfirmDeleteModal from '../elements/ConfirmDeleteModal.vue';
import TourCard from '../elements/TourCard.vue';

export default {
   name: 'TourByUser',
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
      };
   },

   components: {
      CreateButton,
      OrderSelect,
      Loader,
      ConfirmDeleteModal,
      TourCard,
   },

   methods: {
      getToursByUser() {
         this.loading = true;
         const userId = this.$route.params.user_id;
         const token = localStorage.getItem('token');
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
               this.error = "Errore nel recupero dei tour per l'utente";
            })
            .finally(() => {
               this.loading = false;
            });
      },

      confirmDelete(tourId) {
         this.tourToDelete = tourId;
         this.showModal = true;
      },

      deleteTour(tourId) {
         const token = localStorage.getItem('token');
         axios
            .delete(`${this.store.api.baseUrl}/tours/${tourId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then(() => {
               this.mytours = this.mytours.filter((tour) => tour.id !== tourId);
               this.tourToDelete = null;
               this.showModal = false;
            })
            .catch((error) => {
               console.error("Errore durante l'eliminazione del tour:", error);
               alert("Errore durante l'eliminazione del tour. Riprova più tardi.");
            });
      },

      clearSearch() {
         this.searchQuery = '';
      },

      onOrderChange(order) {
         console.log('Ordine cambiato:', order);
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
      // filteredTours() {
      //    return this.mytours
      //       .filter((tour) => !tour.is_deleted)
      //       .filter((tour) => tour.nome.toLowerCase().includes(this.searchQuery.toLowerCase()));
      // },
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
      this.store.title = `Gestione Tour Virtuali di ${this.store.selectedUser.name}`;
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

         <order-select v-model="selectedOrder" />
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
         </div>
      </div>

      <ConfirmDeleteModal
         :visible="showModal"
         title="Conferma Eliminazione"
         message="Sei sicuro di voler eliminare questo tour? Questa operazione è irreversibile."
         @confirm="deleteTour(tourToDelete)"
         @cancel="showModal = false"
      />
   </div>
</template>

<style lang="scss" scoped>
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
   border-radius: 10px;
}

.card-body {
   padding: 15px;
}

.card-footer {
   padding: 10px;
   background-color: #f8f9fa;
}

.card-title {
   font-size: 1.2rem;
   font-weight: bold;
}

.card-text {
   margin-bottom: 5px;
}

.card-img-top {
   object-fit: cover;
   height: 200px;
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
}
</style>
