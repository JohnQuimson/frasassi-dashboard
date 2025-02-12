<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';

export default {
   name: 'AppSessioneSingle',
   data() {
      return {
         store,
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
   },

   methods: {
      fetchSessione() {
         this.loading = true;
         const sessioneId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${sessioneId}`)
            .then((response) => {
               this.sessione = response.data;
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
   },

   created() {
      this.store.title = `Sessione ${this.store.selectedSessione.titolo}`;
      this.getVisori();
   },
};
</script>

<template>
   <Loader v-if="loading" />

   <div class="sessione-container pb-5">
      <!-- <div class="sessione-header">
         <div class="container d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar">
               <i class="fa-solid fa-magnifying-glass search-left"></i>
               <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca sessione" />
               <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
            </div>
            <OrderSelect v-model="selectedOrder" />
         </div>
      </div> -->

      <div class="container">
         <div class="row g-3">
            <h2 class="text-white">Lista Visori</h2>
            <div class="row g-3">
               <div v-for="visore in store.visori" :key="visore.id" class="col-md-4">
                  <router-link :to="`/visore/${visore.id}`">
                     <div class="card p-3">
                        <h5>{{ visore.nome }} {{ visore.cognome }}</h5>
                     </div>
                  </router-link>
               </div>
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
</style>
