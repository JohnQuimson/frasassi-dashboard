<script>
import draggable from 'vuedraggable';
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';
import CreateButton from '../elements/CreateButton.vue';
import OrderSelect from '../elements/OrderSelect.vue';
import Loader from '../elements/Loader.vue';
import ConfirmDeleteModal from '../elements/ConfirmDeleteModal.vue';

export default {
   name: 'ImmaginiTour',

   data() {
      return {
         store,
         immagini: null,
         error: null,
         myimages: [],
         deleteSuccess: '',
         dragging: false,
         dndEnabled: true,
         searchQuery: '',
         selectedOrder: '',
         loading: false,
         showModal: false,
         imageToDelete: null,
      };
   },

   components: {
      draggable,
      CreateButton,
      OrderSelect,
      Loader,
      ConfirmDeleteModal,
   },

   methods: {
      getImagesByTour() {
         this.loading = true;
         const token = localStorage.getItem('token');
         const tourId = this.$route.params.id;

         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.immagini}/tour/${tourId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               if (response.data.length === 0) {
                  this.myimages = [];
               } else {
                  this.myimages = response.data;
               }
            })
            .catch((error) => {
               this.error = null;
            })
            .finally(() => {
               this.loading = false;
            });
      },

      confirmDelete(imageId) {
         this.imageToDelete = imageId;
         this.showModal = true;
      },

      deleteImage(imageId) {
         const token = localStorage.getItem('token');
         axios
            .delete(`${this.store.api.baseUrl}${this.store.api.apiUrls.immagini}/${imageId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then(() => {
               this.deleteSuccess = 'Immagine eliminata con successo';
               this.myimages = this.myimages.filter((image) => image.id !== imageId);
               this.imageToDelete = null;
               this.showModal = false;

               setTimeout(() => {
                  this.deleteSuccess = '';
               }, 5000);
            })
            .catch((error) => {
               alert("Errore durante l'eliminazione dell'immagine. Riprova più tardi.");
            });
      },

      // Funzione per gestire la fine del drag-and-drop
      onDragEnd() {
         this.myimages.forEach((image, index) => {
            image.posizione = index + 1;
         });

         this.updateImagePositions();
      },

      updateImagePositions() {
         const token = localStorage.getItem('token');
         const tourId = this.$route.params.id;

         if (!tourId) {
            console.error('Tour ID non trovato');
            this.error = 'ID tour non valido';
            return;
         }

         const updatedImages = this.myimages.map((image) => ({
            id: image.id,
            nome: image.nome,
            immagine: image.immagine,
            data_creazione: image.data_creazione,
            data_update: image.data_update,
            posizione: image.posizione,
            is_deleted: image.is_deleted,
            tour_virtualeId: image.tour_virtualeId,
         }));

         axios
            .put(
               `${this.store.api.baseUrl}${this.store.api.apiUrls.immagini}/tour/${tourId}/update-positions`,
               updatedImages,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            )
            .then((response) => {
               console.log('Posizioni aggiornate con successo', response.data);
            })
            .catch((error) => {
               console.error("Errore durante l'aggiornamento delle posizioni", error);
               this.error = "Errore durante l'aggiornamento delle posizioni. Riprova più tardi.";
            });
      },

      clearSearch() {
         this.searchQuery = '';
      },

      onOrderChange(order) {
         console.log('Ordine cambiato:', order);
      },

      formatDate(date) {
         const d = new Date(date);
         const day = d.getDate().toString().padStart(2, '0');
         const month = (d.getMonth() + 1).toString().padStart(2, '0');
         const year = d.getFullYear();
         const hours = d.getHours().toString().padStart(2, '0');
         const minutes = d.getMinutes().toString().padStart(2, '0');

         return `${day}/${month}/${year} ${hours}:${minutes}`;
      },
   },

   computed: {
      draggingInfo() {
         return this.dragging ? 'in corso' : '';
      },

      // filteredImages() {
      //    return this.myimages
      //       .filter((image) => !image.is_deleted)
      //       .filter((image) => image.nome.toLowerCase().includes(this.searchQuery.toLowerCase()));
      // },

      filteredImages() {
         let sortedImages = [...this.myimages].filter((image) => !image.is_deleted);

         if (this.selectedOrder) {
            sortedImages.sort((a, b) => {
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

         return sortedImages.filter((image) => image.nome.toLowerCase().includes(this.searchQuery.toLowerCase()));
      },
   },

   created() {
      this.store.title = `Immagini Tour Virtuale: ${this.store.selectedTour.nome}`;
      this.getImagesByTour();
   },
};
</script>

<template>
   <Loader v-if="loading" />

   <div v-else class="images-container">
      <CreateButton :to="`/immagini/tour/${$route.params.id}/create`" />

      <div class="images-header container d-flex justify-content-between align-items-center mb-4">
         <div class="d-flex align-items-center search-bar">
            <i class="fa-solid fa-magnifying-glass search-left"></i>
            <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca immagine" />
            <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
         </div>

         <!-- <order-select v-model="selectedOrder" @order-changed="onOrderChange" /> -->
      </div>

      <div v-if="deleteSuccess" class="alert alert-success" role="alert">
         {{ deleteSuccess }}
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="container">
         <draggable
            :list="myimages"
            :disabled="!dndEnabled"
            item-key="id"
            class="row"
            ghost-class="ghost"
            @start="dragging = true"
            @end="onDragEnd"
         >
            <template #item="{ element }">
               <div v-if="filteredImages.includes(element)" class="col-6 col-md-4 col-lg-3">
                  <div class="image-card">
                     <div class="image-container">
                        <img :src="`${store.api.baseUrl}/${element.immagine}`" alt="Immagine" class="" />
                        <h5 class="card-title">{{ element.nome }}</h5>

                        <div class="overlay">
                           <div class="image-card-body"></div>
                           <div class="card-footer d-flex justify-content-between">
                              <button class="action-button" @click.stop="confirmDelete(element.id)">
                                 <i class="fa-solid fa-trash-can"></i>
                              </button>
                              <router-link :to="`/immagini/${element.id}`" class="action-button">
                                 <i class="fa-solid fa-pen-to-square"></i>
                              </router-link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </template>
         </draggable>
      </div>
      <ConfirmDeleteModal
         :visible="showModal"
         title="Conferma Eliminazione"
         message="Sei sicuro di voler eliminare questa Immagine? Questa operazione è irreversibile."
         @confirm="deleteImage(imageToDelete)"
         @cancel="showModal = false"
      />
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.images-header {
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

.ghost {
   opacity: 0.5;
   background: #c8ebfb;
}

.image-card {
   background-color: transparent;
   border-radius: 20px;
   overflow: hidden;
   position: relative;
   box-shadow: 10px 10px 18px rgba(0, 0, 0, 0.2);
   height: 300px;

   .image-container {
      position: relative;
      height: 100%;
      width: 100%;

      img {
         height: 100%;
         width: 100%;
         object-fit: cover;
         opacity: 0.8;
      }

      .card-title {
         font-size: 1.1rem;
         margin: 0;
         position: absolute;
         top: 10px;
         left: 10px;
         color: $white-color;
      }

      .overlay {
         position: absolute;
         top: 50%;
         left: 0;
         width: 100%;
         height: 50%;
         background: linear-gradient(to top, $primary-color, transparent);
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         padding: 10px;
         color: $white-color;

         .image-card-body {
            .card-description {
               font-size: 1rem;
               margin: 0;
            }
         }

         .card-footer {
            display: flex;
            justify-content: space-between;
         }
      }
   }
}
</style>
