<script>
import axios from '../assets/js/partials/axiosConfig';
import { store } from '../store';

export default {
   data() {
      return {
         formData: {
            username: '',
            role: '',
            email: '',
            password: '',
         },
         roles: ['user', 'admin'],
         store,
         loading: false,
         error: null,
         success: false,
      };
   },
   methods: {
      async createUser() {
         this.loading = true;
         this.error = null;
         this.success = false;

         try {
            const response = await axios.post(
               `${this.store.api.baseUrl}${this.store.api.apiUrls.users}`,
               this.formData,
               {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
               }
            );

            console.log('Utente creato:', response.data);
            this.success = true;
            this.$router.push('/user');

            // Resetta il modulo
            this.formData = {
               username: '',
               role: '',
               email: '',
               password: '',
            };
         } catch (err) {
            console.error("Errore nella creazione dell'utente:", err.response?.data || err.message);
            this.error = err.response?.data?.message || "Errore nella creazione dell'utente";
         } finally {
            this.loading = false;
         }
      },
   },

   created() {
      this.store.title = 'Crea Utente';
   },
};
</script>

<template>
   <div class="user-create">
      <form @submit.prevent="createUser">
         <div class="form-group">
            <label for="username">Username</label>
            <input
               type="text"
               id="username"
               v-model="formData.username"
               placeholder="Inserisci il nome utente"
               required
            />
         </div>

         <div class="form-group">
            <label for="role">Ruolo</label>
            <select id="role" v-model="formData.role" required>
               <option value="" disabled selected>Scegli un ruolo</option>
               <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
         </div>

         <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="formData.email" placeholder="Inserisci l'email" required />
         </div>

         <div class="form-group">
            <label for="password">Password</label>
            <input
               type="password"
               id="password"
               v-model="formData.password"
               placeholder="Inserisci la password"
               required
            />
         </div>

         <button type="submit" :disabled="loading">
            {{ loading ? 'Creazione in corso...' : 'Crea Utente' }}
         </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Utente creato con successo!</p>
   </div>
</template>

<style scoped>
.user-create {
   max-width: 400px;
   margin: 0 auto;
}
.form-group {
   margin-bottom: 1rem;
}
label {
   display: block;
   margin-bottom: 0.5rem;
   font-weight: bold;
}
input,
select {
   width: 100%;
   padding: 0.5rem;
   font-size: 1rem;
}
button {
   padding: 0.7rem;
   background-color: #007bff;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
}
button:disabled {
   background-color: #cccccc;
}
.error {
   color: red;
   margin-top: 1rem;
}
.success {
   color: green;
   margin-top: 1rem;
}
</style>
