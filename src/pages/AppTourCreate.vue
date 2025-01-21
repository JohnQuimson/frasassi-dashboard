<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';

export default {
   name: 'TourCreate',
   data() {
      return {
         model: {
            tour: {
               nome: '',
               descrizione: '',
               thumbnail: null,
               lingua: 'Italiano',
            },
         },
         languages: ['Italiano', 'Inglese', 'Spagnolo', 'Francese', 'Cinese'],
         store,
         isLoading: false,
         error: null,
      };
   },

   created() {
      this.store.title = `Crea Tour Virtuale`;
   },

   methods: {
      createTour() {
         this.isLoading = true;

         const selectedUser = this.store.selectedUser;
         if (!selectedUser || !selectedUser.id) {
            this.error = 'Nessun utente selezionato per creare il tour';
            this.isLoading = false;
            return;
         }

         const formData = new FormData();
         formData.append('nome', this.model.tour.nome);
         formData.append('descrizione', this.model.tour.descrizione);
         formData.append('thumbnail', this.model.tour.thumbnail);
         formData.append('lingua', this.model.tour.lingua);
         formData.append('userId', selectedUser.id);

         console.log('Dati inviati al backend:', {
            nome: this.model.tour.nome,
            descrizione: this.model.tour.descrizione,
            thumbnail: this.model.tour.thumbnail,
            lingua: this.model.tour.lingua,
            userId: selectedUser.id,
         });

         axios
            .post(`${this.store.api.baseUrl}${this.store.api.apiUrls.tours}`, formData)
            .then((res) => {
               console.log(res);
               alert(res.data.message);
               this.model.tour = {
                  nome: '',
                  descrizione: '',
                  thumbnail: null,
                  lingua: 'Italiano',
               };

               if (selectedUser.id === store.auth.user.id) {
                  this.$router.push('/tour');
               } else {
                  this.$router.push(`/tours/${this.store.selectedUser.id}`);
               }
            })
            .catch((error) => {
               console.log(error);
               this.error = 'Si è verificato un errore durante la creazione del tour';
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },
};
</script>

<template>
   <div class="tour-create">
      <h1>Crea un nuovo Tour</h1>

      <div class="container">
         <div class="card">
            <div class="card-header">
               <h4>Aggiungi</h4>
            </div>
            <div class="card-body">
               <div class="mb-3">
                  <label for="">Nome</label>
                  <input type="text" v-model="model.tour.nome" class="form-control" />
               </div>
               <div class="mb-3">
                  <label for="">Descrizione</label>
                  <input type="text" v-model="model.tour.descrizione" class="form-control" />
               </div>
               <div class="mb-3">
                  <label for="">Thumbnail</label>
                  <input type="file" @change="model.tour.thumbnail = $event.target.files[0]" class="form-control" />
               </div>
               <div class="mb-3">
                  <label for="">Lingua</label>
                  <select v-model="model.tour.lingua" class="form-select">
                     <option v-for="language in languages" :key="language" :value="language">
                        {{ language }}
                     </option>
                  </select>
               </div>
               <div class="mb-3">
                  <button type="button" @click="createTour" :disabled="isLoading" class="btn btn-primary">Crea</button>
                  <span v-if="error" class="error">{{ error }}</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss">
.tour-create {
   max-width: 600px;
   margin: 0 auto;

   form {
      display: flex;
      flex-direction: column;

      div {
         margin-bottom: 1rem;
      }

      label {
         font-weight: bold;
         margin-bottom: 0.5rem;
         display: block;
      }

      input,
      select,
      textarea {
         width: 100%;
         padding: 0.5rem;
         font-size: 1rem;
         border: 1px solid #ccc;
         border-radius: 4px;
      }

      button {
         padding: 0.7rem;
         font-size: 1rem;
         color: #fff;
         background-color: #007bff;
         border: none;
         border-radius: 4px;
         cursor: pointer;

         &:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
         }
      }

      .error {
         color: red;
         font-weight: bold;
      }
   }
}
</style>
