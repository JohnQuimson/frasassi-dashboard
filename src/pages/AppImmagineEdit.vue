<script>
// import axios from 'axios';
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';

export default {
   name: 'ImmagineEdit',
   data() {
      return {
         store,
         immagine: {
            nome: '',
            immagine: null,
         },
         error: null,
         isLoading: false,
      };
   },
   methods: {
      fetchImmagine() {
         const token = localStorage.getItem('token');
         const immagineId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.immagini}/${immagineId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               this.immagine = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.error = "Errore nel caricamento dell'immagine.";
            });
      },

      // Modifica l'immagine
      editImmagine() {
         this.isLoading = true;
         const formData = new FormData();
         formData.append('nome', this.immagine.nome);
         if (this.immagine.immagine) formData.append('immagine', this.immagine.immagine);

         axios
            .put(`${this.store.api.baseUrl}${this.store.api.apiUrls.immagini}/${this.$route.params.id}`, formData)
            .then((response) => {
               const tourVirtualeId = response.data.immagine.tour_virtualeId;
               if (tourVirtualeId) {
                  this.$router.push(`/immagini/tour/${tourVirtualeId}`);
               } else {
                  console.error('Tour virtuale ID non trovato.');
               }
            })
            .catch((error) => {
               console.error(error);
               this.error = "Errore durante l'aggiornamento dell'immagine.";
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },
   created() {
      this.store.title = 'Modifica Immagine';
      this.fetchImmagine();
   },
};
</script>

<template>
   <div class="tour-edit">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else>
         <div class="form-group">
            <label>Nome</label>
            <input type="text" v-model="immagine.nome" class="form-control" />
            <!-- Corretto a immagine.nome -->
         </div>
         <div class="form-group">
            <label>immagine</label>
            <input type="file" @change="immagine.immagine = $event.target.files[0]" class="form-control" />
            <!-- Corretto a immagine.immagine -->
         </div>
         <button @click="editImmagine" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Aggiornamento...' : 'Salva Modifiche' }}
         </button>
      </div>
   </div>
</template>

<style lang="scss">
.tour-edit {
   max-width: 600px;
   margin: 0 auto;

   .form-group {
      margin-bottom: 1rem;
   }

   label {
      font-weight: bold;
   }

   .btn {
      margin-top: 1rem;
   }
}
</style>
