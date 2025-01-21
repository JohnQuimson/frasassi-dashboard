<script>
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';

export default {
   name: 'TourEdit',
   data() {
      return {
         store,
         tour: {
            nome: '',
            descrizione: '',
            thumbnail: null,
            lingua: 'Italiano',
         },
         languages: ['Italiano', 'Inglese', 'Spagnolo', 'Francese', 'Cinese'],
         error: null,
         isLoading: false,
      };
   },
   methods: {
      fetchTour() {
         const token = localStorage.getItem('token');
         const tourId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.tours}/single-tour/${tourId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               const data = response.data;
               this.tour = {
                  nome: data.nome,
                  descrizione: data.descrizione,
                  lingua: data.lingua,
                  thumbnail: null, // Manteniamo vuoto per consentire la modifica
               };
            })
            .catch((error) => {
               console.error(error);
               this.error = 'Errore nel caricamento del tour.';
            });
      },

      editTour() {
         this.isLoading = true;
         const formData = new FormData();
         formData.append('nome', this.tour.nome);
         formData.append('descrizione', this.tour.descrizione);
         if (this.tour.thumbnail) formData.append('thumbnail', this.tour.thumbnail);
         formData.append('lingua', this.tour.lingua);

         axios
            .put(`${this.store.api.baseUrl}${this.store.api.apiUrls.tours}/${this.$route.params.id}`, formData)
            .then((response) => {
               console.log('Tour modificato con successo:', response.data);
               alert('Tour aggiornato con successo!');
               this.$router.push(`/tour`);
            })
            .catch((error) => {
               console.error(error);
               this.error = 'Errore durante l’aggiornamento del tour.';
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },
   created() {
      this.store.title = `Modifica Tour Virtuale`;
      this.fetchTour();
   },
};
</script>

<template>
   <div class="tour-edit">
      <h1>Modifica Tour</h1>

      <div class="container">
         <div class="card">
            <div class="card-header">
               <h4>Modifica</h4>
            </div>
            <div class="card-body">
               <div class="mb-3">
                  <label for="">Nome</label>
                  <input type="text" v-model="tour.nome" class="form-control" />
               </div>
               <div class="mb-3">
                  <label for="">Descrizione</label>
                  <textarea v-model="tour.descrizione" class="form-control"></textarea>
               </div>
               <div class="mb-3">
                  <label for="">Thumbnail</label>
                  <input type="file" @change="tour.thumbnail = $event.target.files[0]" class="form-control" />
               </div>
               <div class="mb-3">
                  <label for="">Lingua</label>
                  <select v-model="tour.lingua" class="form-select">
                     <option v-for="language in languages" :key="language" :value="language">
                        {{ language }}
                     </option>
                  </select>
               </div>
               <div class="mb-3">
                  <button type="button" @click="editTour" :disabled="isLoading" class="btn btn-primary">
                     {{ isLoading ? 'Salvataggio...' : 'Salva Modifiche' }}
                  </button>
                  <span v-if="error" class="error">{{ error }}</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss">
.tour-edit {
   max-width: 600px;
   margin: 0 auto;

   .card {
      margin-top: 20px;
   }

   .mb-3 {
      margin-bottom: 1rem;
   }

   .error {
      color: red;
      font-weight: bold;
   }
}
</style>
