<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
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
   },

   computed: {
      filteredVisori() {
         let visori = this.store.visori;

         // Filtro per nome e cognome
         if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            visori = visori.filter((visore) => {
               return visore.nome.toLowerCase().includes(query) || visore.cognome.toLowerCase().includes(query);
            });
         }

         // Ordinamento in base alla selezione
         if (this.selectedOrder === 'nome') {
            visori.sort((a, b) => a.nome.localeCompare(b.nome));
         } else if (this.selectedOrder === 'cognome') {
            visori.sort((a, b) => a.cognome.localeCompare(b.cognome));
         } else if (this.selectedOrder === 'data') {
            visori.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
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
      this.store.title = `Sessione ${this.store.selectedSessione.titolo}`;
      this.getVisori();
   },
};
</script>

<template>
   <Loader v-if="loading" />

   <div class="sessione-container pb-5">
      <div class="visore-header">
         <div class="container p-0 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar">
               <i class="fa-solid fa-magnifying-glass search-left"></i>
               <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca visore" />
               <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
            </div>
            <!-- <OrderSelect v-model="selectedOrder" /> -->
         </div>
      </div>

      <div class="container p-0">
         <div v-if="!filteredVisori.length" class="mt-5 alert alert-info">Nessun dato trovato</div>

         <div v-else class="row g-3">
            <div class="container p-0 mt-5">
               <h2 class="visore-title">Lista visori</h2>
            </div>
            <div class="row g-3 d-flex justify-content-center">
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
</style>
