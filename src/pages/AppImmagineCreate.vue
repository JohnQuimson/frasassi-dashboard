<script>
// import axios from 'axios';
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';

export default {
   name: 'ImmagineCreate',
   data() {
      return {
         model: {
            immagine: {
               nome: '',
               immagine: null,
            },
         },
         store,
         isLoading: false,
         error: null,
         successMessage: null,
         tourId: null,
      };
   },
   methods: {
      createImmagine() {
         this.isLoading = true;
         const formData = new FormData();
         formData.append('nome', this.model.immagine.nome);
         formData.append('immagine', this.model.immagine.immagine);
         formData.append('tour_virtualeId', this.tourId); // Usa l'ID del tour dalla route

         axios
            .post(`${this.store.api.baseUrl}${this.store.api.apiUrls.immagini}`, formData)
            .then((res) => {
               console.log(res);
               // alert(res.data.message);
               this.model.immagine = {
                  nome: '',
                  immagine: null,
               };
               this.$router.push(`/immagini/tour/${this.tourId}`);
            })
            .catch((error) => {
               console.log(error);
               this.error = 'Si è verificato un errore durante la creazione dell immagine';
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },
   created() {
      this.store.title = 'Crea Immagine';
      this.tourId = this.$route.params.id;
   },
};
</script>

<template>
   <div class="immagini-create">
      <div class="container">
         <div class="card">
            <div class="card-header">
               <h4>Aggiungi</h4>
            </div>
            <div class="card-body">
               <div class="mb-3">
                  <label for="">Nome</label>
                  <input type="text" v-model="model.immagine.nome" class="form-control" />
               </div>

               <div class="mb-3">
                  <label for="">Immagine</label>
                  <input type="file" @change="model.immagine.immagine = $event.target.files[0]" class="form-control" />
               </div>

               <div class="mb-3">
                  <button type="button" @click="createImmagine" :disabled="isLoading" class="btn btn-primary">
                     Crea
                  </button>
                  <span v-if="error" class="error">{{ error }}</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss"></style>
