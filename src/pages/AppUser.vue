<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import CreateButton from '../elements/CreateButton.vue';
import Loader from '../elements/Loader.vue';

export default {
   name: 'Users',
   data() {
      return {
         store,
         error: null,
         deleteSuccess: '',
         myusers: [],
         searchQuery: '',
         loading: false,
      };
   },

   components: {
      CreateButton,
      Loader,
   },

   methods: {
      getUsers() {
         this.loading = true;

         const token = localStorage.getItem('token');
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.users}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               this.store.users = response.data;
               this.myusers = this.store.users;
            })
            .catch((error) => {
               console.error(error);
            })
            .finally(() => {
               this.loading = false;
            });
      },

      deleteUser(UserId) {
         const token = localStorage.getItem('token');
         axios
            .delete(`${this.store.api.baseUrl}${this.store.api.apiUrls.users}/${UserId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then(() => {
               this.deleteSuccess = 'Utente eliminato con successo';
               // this.myusers = this.myusers.filter((user) => user.id !== UserId);

               setTimeout(() => {
                  this.deleteSuccess = '';
               }, 5000);
            })
            .catch((error) => {
               console.error("Errore durante l'eliminazione dell'utente:", error);
               alert("Errore durante l'eliminazione dell'utente. Riprova più tardi.");
            });
      },

      restoreUser(UserId) {
         const token = localStorage.getItem('token');
         axios
            .put(
               `${this.store.api.baseUrl}${this.store.api.apiUrls.users}/restore/${UserId}`,
               {},
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            )
            .then(() => {
               this.deleteSuccess = 'Utente ripristinato con successo';
               const userIndex = this.myusers.findIndex((user) => user.id === UserId);
               if (userIndex > -1) this.myusers[userIndex].is_deleted = false;

               setTimeout(() => {
                  this.deleteSuccess = '';
               }, 5000);
            })
            .catch((error) => {
               console.error("Errore durante il ripristino dell'utente:", error);
               alert("Errore durante il ripristino dell'utente. Riprova più tardi.");
            });
      },

      toggleSwitch(user) {
         if (user.is_deleted) {
            this.deleteUser(user.id);
         } else {
            this.restoreUser(user.id);
         }
      },

      populateSelectedUser(user) {
         this.store.selectedUser.id = user.id;
         this.store.selectedUser.name = user.username;
         this.store.selectedUser.email = user.email;
         this.store.selectedUser.role = user.role;
      },

      clearSearch() {
         this.searchQuery = '';
      },
   },
   computed: {
      filteredUsers() {
         return this.myusers.filter((user) => user.username.toLowerCase().includes(this.searchQuery.toLowerCase()));
      },
   },
   created() {
      this.store.title = 'Gestione Utenti';
      this.getUsers();
   },
};
</script>

<template>
   <Loader v-if="loading" />

   <div v-else class="users-container">
      <CreateButton to="/user-create" />
      <div class="users-header container d-flex justify-content-between align-items-center mb-4">
         <div class="d-flex align-items-center search-bar">
            <i class="fa-solid fa-magnifying-glass search-left"></i>
            <input v-model="searchQuery" type="text" class="search-input p-0" placeholder="Cerca utente" />
            <i v-if="searchQuery.length > 0" @click="clearSearch" class="fa-solid fa-xmark search-right"></i>
         </div>
      </div>

      <div class="container">
         <div v-if="deleteSuccess" class="alert alert-success">{{ deleteSuccess }}</div>
         <div v-if="error" class="alert alert-danger">{{ error }}</div>

         <div class="row g-3">
            <div
               v-for="user in filteredUsers"
               :key="user.id"
               class="col-12 col-md-4 col-lg-6 d-flex justify-content-between align-items-center"
            >
               <div class="user-card shadow-sm">
                  <div class="card-body">
                     <h5 class="card-title mb-2">{{ user.username }}</h5>

                     <p class="card-text m-0">
                        <small class="text-muted">Email: {{ user.email }}</small>
                     </p>
                     <p class="card-text">
                        <small class="text-muted">Ruolo: {{ user.role }}</small>
                     </p>

                     <!-- Stato Eliminato -->
                     <div class="form-check form-switch">
                        <input
                           class="form-check-input"
                           type="checkbox"
                           role="switch"
                           id="flexSwitchCheckDefault"
                           v-model="user.is_deleted"
                           @change="toggleSwitch(user)"
                        />
                        <label class="form-check-label" for="flexSwitchCheckDefault">Eliminato</label>
                     </div>
                  </div>
                  <div class="card-footer mt-3 d-flex justify-content-between align-items-center">
                     <!-- <button class="btn btn-danger btn-sm" @click.stop="deleteUser(user.id)">
                        <i class="fa-solid fa-trash-can"></i>
                     </button> -->
                     <router-link v-if="user" :to="`/user/edit/${user.id}`" class="btn btn-warning btn-sm">
                        <i class="fa-solid fa-pen-to-square"></i>
                     </router-link>
                     <router-link
                        v-if="user"
                        :to="`/tours/${user.id}`"
                        class="btn btn-dark btn-sm"
                        @click.stop="populateSelectedUser(user)"
                     >
                        <i class="fa-solid fa-vr-cardboard"></i>
                     </router-link>
                     <router-link
                        :to="`/video360/user/${user.id}`"
                        class="btn btn-dark btn-sm"
                        @click.stop="populateSelectedUser(user)"
                     >
                        <i class="fa-solid fa-video"></i>
                     </router-link>
                  </div>
               </div>
            </div>
         </div>

         <div v-if="!filteredUsers.length" class="alert alert-info mt-4">Nessun dato trovato</div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.users-header {
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

.user-card {
   width: 80%;
   background-color: $gray-color;
   margin: 0 auto;
   padding: 20px 50px;
   border-radius: 10px;
}
</style>
