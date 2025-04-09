<script>
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';
import Loader from '../elements/Loader.vue';

export default {
   name: 'SessioneEdit',
   data() {
      return {
         store,
         sessione: {
            nome: '',
            cognome: '',
            titolo: '',
         },
         error: null,
         isLoading: false,
         isModified: false,
      };
   },

   components: {
      Loader,
   },

   methods: {
      fetchSessione() {
         const sessioneId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${sessioneId}`)
            .then((response) => {
               this.sessione = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.error = 'Errore nel caricamento della sessione.';
            });
      },

      editSessione() {
         this.isLoading = true;
         axios
            .put(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${this.$route.params.id}`, {
               nome: this.sessione.nome,
               cognome: this.sessione.cognome,
               titolo: this.sessione.titolo,
            })
            .then((response) => {
               console.log(response.data);
               this.$router.push(`/sessioni`);
            })
            .catch((error) => {
               console.error('Errore:', error.response || error.message || error);
               this.error = "Errore durante l'aggiornamento della sessione.";
            })
            .finally(() => {
               this.isLoading = false;
            });
      },

      checkModified() {
         this.isModified = this.sessione.nome !== '' || this.sessione.cognome !== '' || this.sessione.titolo !== '';
      },
   },

   created() {
      this.store.title = 'Modifica Sessione';
      this.fetchSessione();
   },
};
</script>

<template>
   <Loader v-if="isLoading" />

   <div class="sessione-container">
      <div class="sessione-header">
         <div class="container d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center search-bar"></div>
         </div>
      </div>

      <div class="container">
         <div class="row g-3">
            <div class="col-12">
               <div class="sessione-card shadow-sm">
                  <div class="card-body">
                     <input
                        type="text"
                        v-model="sessione.titolo"
                        class="form-control input-titolo"
                        placeholder="Titolo"
                        @input="checkModified"
                     />

                     <div class="operator-info">
                        <div class="container-nome">
                           <p class="card-text m-0">Nome:</p>
                           <input
                              type="text"
                              v-model="sessione.nome"
                              class="form-control input-nome"
                              placeholder="Nome"
                              @input="checkModified"
                           />
                        </div>

                        <div class="container-cognome">
                           <p class="card-text m-0">Cognome:</p>
                           <input
                              type="text"
                              v-model="sessione.cognome"
                              class="form-control input-cognome"
                              placeholder="Cognome"
                              @input="checkModified"
                           />
                        </div>

                        <!-- <p class="card-text m-0">Data:</p> -->
                     </div>
                  </div>
                  <div class="card-buttons">
                     <button
                        @click="editSessione"
                        class="edit-button"
                        :disabled="isLoading || !isModified"
                        :class="{ 'disabled-button': isLoading || !isModified }"
                     >
                        {{ isLoading ? 'Aggiornamento...' : 'Salva' }}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.sessione-card {
   background-color: $secondary-bg-color;
   border-radius: 20px;
   overflow: hidden;
   box-shadow: 10px 10px 18px rgba(0, 0, 0, 0.2);
   display: flex;
   padding: 20px;

   .card-body {
      .input-titolo::-webkit-input-placeholder,
      .input-nome::-webkit-input-placeholder,
      .input-cognome::-webkit-input-placeholder {
         color: #666666;
      }

      .input-titolo {
         font-size: 1.1rem;
         color: $white-color;
         background-color: transparent;
         width: 50%;
         border: 1px solid #444444;
      }
      .operator-info {
         margin-top: 20px;
         display: flex;
         flex-direction: column;
         gap: 10px;

         .container-nome {
            display: flex;
            align-items: center;
            gap: 20px;

            .input-nome {
               font-size: 1rem;
               color: $white-color;
               background-color: transparent;
               width: 50%;
               border: 1px solid #444444;
            }
         }

         .container-cognome {
            display: flex;
            align-items: center;
            gap: 20px;

            .input-cognome {
               font-size: 1rem;
               color: $white-color;
               background-color: transparent;
               width: 50%;
               border: 1px solid #444444;
            }
         }
         .card-text {
            font-size: 1rem;
            color: $gray-color;
         }
      }
   }

   .card-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: end;

      .edit-button {
         font-size: 0.9rem;
         border-radius: 10px;
         background-color: $primary-color;
         border: none;
         padding: 5px 15px;
         color: $white-color;
         cursor: pointer;

         &:hover {
            background-color: darken($primary-color, 5%);
         }

         &.disabled-button {
            background-color: #ccc;
            cursor: not-allowed;
         }
      }
   }
}
</style>
