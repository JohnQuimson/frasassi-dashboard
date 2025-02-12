<script>
import { store } from '../store';

export default {
   name: 'VisoreCard',

   data() {
      return {
         store,
      };
   },

   props: {
      visore: Object,
   },

   methods: {
      populateSelectedVisore() {
         store.selectedVisore = this.visore;
      },
   },
};
</script>

<template>
   <div class="col-12">
      <router-link :to="`/visore/${visore.id}`" class="visore-card shadow-sm">
         <div class="card-body" @click="populateSelectedVisore()">
            <div class="card-title">
               <h5>{{ visore.nome }} {{ visore.cognome }}</h5>
               <!-- <p class="text-danger">ID: {{ visore.id }}</p> -->
            </div>
         </div>
      </router-link>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.visore-card {
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
   }

   &:hover {
      transform: scale(1.05);
      box-shadow: 15px 15px 30px rgba(0, 0, 0, 0.3);
   }
}
</style>
