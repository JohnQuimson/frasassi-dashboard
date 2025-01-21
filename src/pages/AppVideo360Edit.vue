<script>
// import axios from 'axios';
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';

export default {
   name: 'Video360Edit',
   data() {
      return {
         store,
         video360: {
            nome: '',
            thumbnail: null,
            video: null,
         },
         error: null,
         isLoading: false,
      };
   },
   methods: {
      fetchVideo360() {
         const token = localStorage.getItem('token');
         const videoId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.videos}/${videoId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               this.video360 = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.error = 'Errore nel caricamento del video.';
            });
      },

      editVideo360() {
         this.isLoading = true;
         const formData = new FormData();
         formData.append('nome', this.video360.nome);
         if (this.video360.thumbnail) formData.append('thumbnail', this.video360.thumbnail);
         if (this.video360.video) formData.append('video', this.video360.video);

         axios
            .put(`${this.store.api.baseUrl}${this.store.api.apiUrls.videos}/${this.$route.params.id}`, formData)
            .then((response) => {
               const videoId = response.data.video.id;
               if (videoId) {
                  const userId = this.$route.params.userId;
                  this.$router.push(`/video360/user/${userId}`);
               } else {
                  console.error('ID video non trovato.');
               }
            })
            .catch((error) => {
               console.error(error);
               this.error = "Errore durante l'aggiornamento del video.";
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },
   created() {
      this.store.title = 'Modifica Video 360';
      this.fetchVideo360();
   },
};
</script>

<template>
   <div class="video-edit">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else>
         <div class="form-group">
            <label>Nome</label>
            <input type="text" v-model="video360.nome" class="form-control" />
         </div>
         <div class="form-group">
            <label>Thumbnail</label>
            <input type="file" @change="video360.thumbnail = $event.target.files[0]" class="form-control" />
         </div>
         <div class="form-group">
            <label>Video</label>
            <input type="file" @change="video360.video = $event.target.files[0]" class="form-control" />
         </div>
         <button @click="editVideo360" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Aggiornamento...' : 'Salva Modifiche' }}
         </button>
      </div>
   </div>
</template>

<style lang="scss">
.video-edit {
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
