<script>
import axios from 'axios';
import { store } from '../store';

export default {
   data() {
      return {
         store,
         email: 'john@gmail.com',
         password: 'Password',
         loading: false,
         errorMessage: '',
      };
   },
   methods: {
      login() {
         this.loading = true;
         this.errorMessage = '';
         axios
            .post(`${this.store.api.baseUrl}/login`, {
               email: this.email,
               password: this.password,
            })
            .then((response) => {
               // Salva il token e i dati dell'utente nel localStorage
               localStorage.setItem('token', response.data.token);
               localStorage.setItem('user', JSON.stringify(response.data.data));

               // Aggiorna lo stato dell'autenticazione nello store
               this.store.auth.isAuthenticated = true;
               this.store.auth.user = response.data.data;
               // console.log('Utente loggato:', response.data.data);

               this.email = '';
               this.password = '';

               this.$router.push('/tour');
            })

            .catch((error) => {
               this.errorMessage = error.response.data;
            })

            .finally(() => {
               this.loading = false;
            });
      },
   },
};
</script>

<template>
   <div class="login-form">
      <div class="login-card">
         <h2 class="mb-5">Login</h2>
         <form @submit.prevent="login" class="d-flex flex-column gap-3">
            <input type="email" v-model="email" placeholder="Email" required />
            <input type="password" v-model="password" placeholder="Password" required />
            <button type="submit" class="btn btn-primary" :disabled="loading">
               <span v-if="loading">Caricamento...</span>
               <span v-else>Accedi</span>
            </button>
         </form>
         <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
   </div>
</template>

<style>
.login-form {
   width: 100vw;
   height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: center;
   background-color: #a0b2f7;

   .login-card {
      background-color: white;
      padding: 50px;
      border-radius: 5%;
      max-width: 500px;
   }
}

input {
   padding: 10px 20px;
   border: 1px solid black;
}

.error-message {
   color: red;
   margin-top: 10px;
}

.contact-message {
   color: rgb(0, 0, 0);
   margin-top: 10px;
}
</style>
