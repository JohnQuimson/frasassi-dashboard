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
   <div class="col-10">
      <div class="visore-card shadow-sm" @click="populateSelectedVisore()">
         <router-link :to="`/visore/${visore.id}`">
            <div class="card-title">
               <h5>{{ visore.nome }} {{ visore.cognome }}</h5>
            </div>
         </router-link>
      </div>
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
}
</style>
