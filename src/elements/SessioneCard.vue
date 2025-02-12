<script>
import { store } from '../store';

export default {
   name: 'SessionCard',

   data() {
      return {
         store,
      };
   },

   props: {
      sessione: Object,
      onDelete: Function,
      formatDate: Function,
   },

   methods: {
      onDeleteClick() {
         this.onDelete(this.sessione.id);
      },

      populateSelectedSessione() {
         store.selectedSessione = this.sessione;
      },
   },
};
</script>

<template>
   <div class="col-10">
      <div class="sessione-card shadow-sm" @click="populateSelectedSessione()">
         <router-link :to="`/sessioni/${sessione.id}`" class="card-body">
            <h5 class="card-title">{{ sessione.titolo }}</h5>
            <div class="operator-info">
               <p class="card-text m-0">Nome: {{ sessione.nome }}</p>
               <p class="card-text m-0">Cognome: {{ sessione.cognome }}</p>
               <p class="card-text m-0">Data: {{ formatDate(sessione.timestamp) }}</p>
            </div>
         </router-link>
         <div class="card-buttons d-flex justify-content-between align-items-center">
            <router-link :to="`/sessioni/edit/${sessione.id}`" class="action-button">
               <i class="fa-solid fa-pen-to-square"></i>
            </router-link>
            <button class="action-button" @click.stop="onDeleteClick">
               <i class="fa-solid fa-trash-can"></i>
            </button>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.sessione-card {
   background-color: $secondary-bg-color;
   border-radius: 20px;
   overflow: hidden;
   box-shadow: 10px 10px 18px rgba(0, 0, 0, 0.2);
   display: flex;
   padding: 20px;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   z-index: 10;

   .card-body {
      .card-title {
         font-size: 1.1rem;
         color: $white-color;
      }

      .operator-info {
         margin-top: 20px;
         .card-text {
            font-size: 1rem;
            color: $gray-color;
         }
      }
   }

   .card-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .action-button {
         font-size: 0.9rem;
      }
   }

   &:hover {
      transform: scale(1.05);
      box-shadow: 15px 15px 30px rgba(0, 0, 0, 0.3);
   }
}
</style>
