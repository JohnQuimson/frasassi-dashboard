<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';

export default {
   name: 'Video360Create',
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
      createVideo360() {
         this.isLoading = true;
         const formData = new FormData();
         formData.append('nome', this.video360.nome);
         if (this.video360.thumbnail) formData.append('thumbnail', this.video360.thumbnail);
         if (this.video360.video) formData.append('video', this.video360.video);

         // Aggiungi userId preso dallo store
         const userId = this.store.selectedUser.id;
         if (!userId) {
            this.error = 'Utente non trovato.';
            this.isLoading = false;
            return;
         }

         formData.append('userId', userId); // Aggiungi userId nel form-data

         axios
            .post('http://localhost:3000/video360', formData, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            })
            .then((response) => {
               // Redirect dopo la creazione
               this.$router.push(`/video360/user/${userId}`);
            })
            .catch((error) => {
               console.error(error);
               this.error = 'Errore nella creazione del video 360.';
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },
};
</script>

<template>
   <div class="video-create">
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
         <button @click="createVideo360" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Creazione...' : 'Crea Video 360' }}
         </button>
      </div>
   </div>
</template>

<style lang="scss">
.video-create {
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
