<script>
import { store } from '../store';

export default {
   name: 'Header',
   data() {
      return {
         store,
         showUserInfoTooltip: false,
      };
   },

   computed: {
      title() {
         return this.store.title;
      },

      userInfo() {
         return {
            id: `${this.store.auth.user.id}`,
            nome: `${this.store.auth.user.username}`,
            email: `${this.store.auth.user.email}`,
            role: `${this.store.auth.user.role}`,
         };
      },

      isLoggedIn() {
         return store.auth.isAuthenticated;
      },
   },

   methods: {
      toggleUserInfoTooltip() {
         this.showUserInfoTooltip = !this.showUserInfoTooltip;
      },

      closeTooltip() {
         this.showUserInfoTooltip = false;
      },

      logout() {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         store.auth.isAuthenticated = false;
         store.auth.user = null;
         this.$router.push('/login');
      },
   },
};
</script>

<template>
   <header>
      <div class="container p-0">
         <h1>{{ title }}</h1>

         <!-- Bottone per mostrare le info utente -->
         <!-- <button @click="toggleUserInfoTooltip" class="user-info-btn">
            <i class="fa-solid fa-user"></i>
         </button> -->

         <!-- Tooltip (nuvoletta) con le informazioni utente -->
         <!-- <div v-if="showUserInfoTooltip" class="user-info-tooltip">
            <h2>Informazioni Utente</h2>
            <p><strong>Nome:</strong> {{ userInfo.nome }}</p>
            <p><strong>Email:</strong> {{ userInfo.email }}</p>
            <p><strong>Ruolo:</strong> {{ userInfo.role }}</p>
            <div class="tooltip-footer d-flex">
               <button
                  v-if="isLoggedIn"
                  class="btn btn-danger mt-auto w-100 d-flex align-items-center justify-content-center"
                  @click="logout"
               >
                  <i class="fa-solid fa-right-from-bracket"></i>
               </button>
               <router-link class="btn btn-warning" @click="closeTooltip" :to="`/user/edit/${userInfo.id}`">
                  <i class="fa-solid fa-pen-to-square"></i>
               </router-link>
            </div>
            <span @click="toggleUserInfoTooltip" class="close-user-info">
               <i class="fa-solid fa-xmark"></i>
            </span>
         </div> -->
      </div>
   </header>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

header {
   background-color: $background-color;
   height: 15vh;
   display: flex;
   justify-content: space-between;
   align-items: flex-end;

   .container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h1 {
         text-transform: uppercase;
         color: $primary-color;
         font-size: 28px;
         font-weight: 600;
      }

      .user-info-btn {
         background-color: $gray-color;
         color: white;
         border: none;
         border-radius: 50%;
         cursor: pointer;
         position: relative;
         width: 40px;
         height: 40px;

         &:hover {
            background-color: darken($gray-color, 10%);
         }
      }
   }
}

.user-info-tooltip {
   position: absolute;
   top: 50px;
   right: 20px;
   background-color: white;
   padding: 12px;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   width: 220px;
   margin-top: 10px;
   z-index: 10;

   &:before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent white transparent;
   }

   h2 {
      margin-top: 0;
      font-size: 18px;
   }

   p {
      font-size: 14px;
   }

   .close-user-info {
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;

      &:hover {
         color: $danger-color;
      }
   }
}
</style>
