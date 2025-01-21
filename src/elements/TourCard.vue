<script>
import { store } from '../store';

export default {
   name: 'TourCard',

   data() {
      return {
         store,
      };
   },

   props: {
      tour: Object,
      onDelete: Function,
      populateSelectedTour: Function,
   },
   methods: {
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

      onDeleteClick() {
         this.onDelete(this.tour.id);
      },

      getFlagClass() {
         const language = this.tour.lingua;

         switch (language) {
            case 'Italiano':
               return 'fi fi-it';
            case 'Inglese':
               return 'fi fi-gb';
            case 'Spagnolo':
               return 'fi fi-es';
            case 'Francese':
               return 'fi fi-fr';
            case 'Cinese':
               return 'fi fi-cn';
            default:
               return '';
         }
      },
   },
};
</script>

<template>
   <div class="col-6 col-md-4 col-lg-3">
      <div class="card shadow-sm">
         <img
            v-if="tour.thumbnail"
            :src="`${this.store.api.baseUrl}/${tour.thumbnail}`"
            class="card-img-top"
            alt="Thumbnail"
         />
         <div class="card-body">
            <h5 class="card-title">{{ tour.nome }}</h5>
            <div class="flag-container">
               <span v-if="getFlagClass()" :class="getFlagClass()" class="flag"></span>
            </div>

            <p></p>
            <p class="card-description">{{ tour.descrizione }}</p>
         </div>
         <div class="card-footer d-flex justify-content-between align-items-center">
            <button class="action-button" @click.stop="onDeleteClick">
               <i class="fa-solid fa-trash-can"></i>
            </button>
            <router-link :to="`/tour/edit/${tour.id}`" class="action-button">
               <i class="fa-solid fa-pen-to-square"></i>
            </router-link>
            <router-link
               :to="`/immagini/tour/${tour.id}`"
               @click="populateSelectedTour(tour.nome)"
               class="action-button"
            >
               <i class="fa-solid fa-image"></i>
            </router-link>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.card {
   background-color: $secondary-bg-color;
   border-radius: 20px;
   overflow: hidden;
   box-shadow: 10px 10px 18px rgba(0, 0, 0, 0.2);

   .card-img-top {
      max-height: 180px;
      object-fit: cover;
   }

   .card-body {
      .card-title {
         font-size: 1.1rem;
         color: $white-color;
      }

      .card-description {
         font-size: 1rem;
         padding: 10px 0;
         color: $gray-color;
         margin: 0;
      }

      .card-text {
         font-size: 0.9rem;
         color: $gray-color;
         margin: 0;
      }

      button,
      .router-link {
         font-size: 0.9rem;
      }

      .flag-container {
         position: absolute;
         top: 10px;
         right: 10px;
         width: 30px;
         height: 30px;
         overflow: hidden;
         display: flex;
         justify-content: center;
         align-items: center;
         z-index: 1;
         opacity: 0.8;

         .flag {
            font-size: 20px;
         }
      }
   }
}
</style>
