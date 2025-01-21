<script>
import axios from 'axios';
import { store } from '../store';

export default {
   name: 'Register',
   data() {
      return {
         store,
         username: '',
         email: '',
         password: '',
         role: 'user',
      };
   },
   methods: {
      register() {
         axios
            .post(`${this.store.api.baseUrl}/register`, {
               username: this.username,
               email: this.email,
               password: this.password,
               role: this.role,
            })
            .then((response) => {
               localStorage.setItem('token', response.data.token);
               this.$router.push('/tour');
            })
            .catch((error) => {
               console.error(error);
            });
      },
   },
   created() {},
};
</script>

<template>
   <div class="registration-form">
      <h2>Registrazione</h2>
      <form @submit.prevent="register">
         <input type="text" v-model="username" placeholder="Nome utente" required />
         <input type="email" v-model="email" placeholder="Email" required />
         <input type="password" v-model="password" placeholder="Password" required />
         <select v-model="role">
            <option value="user">Utente</option>
            <option value="admin">Admin</option>
         </select>
         <button type="submit" class="btn btn-primary">Registrati</button>
      </form>
   </div>
</template>

<style lang="scss"></style>
