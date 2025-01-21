<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';

export default {
   name: 'UserEdit',
   data() {
      return {
         store,
         user: {
            username: '',
            role: '',
            email: '',
         },
         passwordChange: {
            newPassword: '',
            confirmPassword: '',
         },
         error: null,
         passwordError: null,
         isLoading: false,
      };
   },
   methods: {
      fetchUser() {
         const token = localStorage.getItem('token');
         const userId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.users}/${userId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((response) => {
               console.log('respo', response);
               this.user = response.data;
            })
            .catch((error) => {
               console.error(error);
               this.error = "Errore nel caricamento dell'utente.";
            });
      },

      saveChanges() {
         this.isLoading = true;

         // Verifica se le nuove password corrispondono
         if (
            this.passwordChange.newPassword &&
            this.passwordChange.newPassword !== this.passwordChange.confirmPassword
         ) {
            this.passwordError = 'Le nuove password non coincidono.';
            this.isLoading = false;
            return;
         }

         const token = localStorage.getItem('token');
         const payload = {
            username: this.user.username,
            role: this.user.role,
            email: this.user.email,
            is_deleted: this.user.is_deleted || false,
            password: this.passwordChange.newPassword || '', // Includi la password solo se fornita
         };

         axios
            .put(`${this.store.api.baseUrl}${this.store.api.apiUrls.users}/${this.$route.params.id}`, payload, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            })
            .then(() => {
               alert('Modifiche salvate con successo!');
               this.$router.push('/user'); // Naviga alla lista utenti
            })
            .catch((error) => {
               console.error('Errore durante il salvataggio:', error);
               this.error = 'Errore durante il salvataggio delle modifiche.';
            })
            .finally(() => {
               this.isLoading = false;
            });
      },
   },

   created() {
      this.store.title = `Modifica Utente`;
      this.fetchUser();
   },
};
</script>

<template>
   <div class="container">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <form v-else @submit.prevent="saveChanges">
         <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="user.username" class="form-control" required />
         </div>
         <div class="form-group">
            <label for="role">Ruolo</label>
            <select id="role" v-model="user.role" class="form-control" required>
               <option value="user">User</option>
               <option value="admin">Admin</option>
            </select>
         </div>
         <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="user.email" class="form-control" required />
         </div>

         <hr />

         <h3>Cambia Password (Opzionale)</h3>
         <div v-if="passwordError" class="alert alert-danger">{{ passwordError }}</div>
         <div class="form-group">
            <label for="newPassword">Nuova Password</label>
            <input type="password" id="newPassword" v-model="passwordChange.newPassword" class="form-control" />
         </div>
         <div class="form-group">
            <label for="confirmPassword">Conferma Nuova Password</label>
            <input type="password" id="confirmPassword" v-model="passwordChange.confirmPassword" class="form-control" />
         </div>

         <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Salvando...' : 'Salva Modifiche' }}
         </button>
      </form>
   </div>
</template>

<style lang="scss" scoped></style>
