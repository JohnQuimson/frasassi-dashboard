<script>
import { store } from '../store';

export default {
   name: 'Sidebar',
   data() {
      return {
         store,
         links: [
            // { name: 'Main', path: '/', icon: 'fa-solid fa-house' },
            // { name: 'Tour Virtuali', path: '/tour', icon: 'fa-solid fa-vr-cardboard' },
            // { name: 'Video 360', path: '/video360', icon: 'fa-solid fa-video' },
            { name: 'Sessioni', path: '/sessioni', icon: 'fa-solid fa-users' },
         ],
         // adminLinks: [{ name: 'Users', path: '/user', icon: 'fa-solid fa-user' }],
         isCollapsed: JSON.parse(localStorage.getItem('isCollapsed')) || false, // Recupera lo stato salvato o imposta false
      };
   },
   computed: {
      // isLoggedIn() {
      //    return store.auth.isAuthenticated;
      // },
      // username() {
      //    return store.auth.user?.username || '';
      // },
      // role() {
      //    return store.auth.user?.role || '';
      // },
   },
   methods: {
      // logout() {
      //    localStorage.removeItem('token');
      //    localStorage.removeItem('user');
      //    store.auth.isAuthenticated = false;
      //    store.auth.user = null;
      //    this.$router.push('/login');
      // },
      toggleSidebar() {
         this.isCollapsed = !this.isCollapsed;
         localStorage.setItem('isCollapsed', JSON.stringify(this.isCollapsed));
      },

      // populateSelectedUser() {
      //    this.store.selectedUser.id = this.store.auth.user.id;
      //    this.store.selectedUser.name = this.store.auth.user.username;
      //    this.store.selectedUser.email = this.store.auth.user.email;
      //    this.store.selectedUser.role = this.store.auth.user.role;
      // },
   },

   created() {},
};
</script>

<template>
   <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]" class="d-flex flex-column text-white">
      <div class="sidebar-content">
         <div class="sidebar-logo mt-5">
            <img class="img-fluid" src="/public/img/logo_ldmultimedia_bianco.png" alt="Logo" />
         </div>

         <ul class="nav flex-column mt-5">
            <li class="nav-item" v-for="item in links" :key="item.name">
               <router-link
                  :to="item.path"
                  class="nav-link d-flex align-items-center justify-content-start"
                  active-class="active"
               >
                  <i :class="item.icon" class="me-2 icona"></i>
                  <span class="name">{{ item.name }}</span>
               </router-link>
            </li>
            <!-- <li v-if="role === 'admin'" class="nav-item" v-for="item in adminLinks" :key="item.name">
               <router-link
                  :to="item.path"
                  class="nav-link d-flex align-items-center justify-content-start"
                  active-class="active"
               >
                  <i :class="item.icon" class="me-2"></i>
                  <span>{{ item.name }}</span>
               </router-link>
            </li> -->
         </ul>

         <!-- <router-link v-if="!isLoggedIn && !isCollapsed" to="/login" class="btn btn-light mt-auto">Login</router-link> -->
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.sidebar {
   width: 50%;
   transition: width 0.8s ease;
   height: 100vh;

   .nav-link {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      border-left: 2px solid $secondary-bg-color;

      &:hover {
         border-left: 2px solid white;
      }

      .icona {
         width: 30px;
         font-size: 22px;
      }
      .name {
         font-size: 18px;
      }
   }
   .active {
      // background: rgb(41, 41, 41);
      // background: linear-gradient(270deg, rgba(41, 41, 41, 0) 85%, rgba(160, 178, 247, 0.19931722689075626) 100%);
      // border-left: 2px solid $primary-color;
      color: $primary-color;
   }

   .btn-danger {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: center;
   }
}

.sidebar-collapsed {
   width: 20%;
   height: 100vh;
   background-color: $background-color;

   .user-info {
      display: none;
   }

   .text-center {
      display: none;
   }

   .sidebar-logo {
      width: 45%;
      margin: 0 auto;
      transition: width 0.8s ease;

      img {
         width: 100%;
      }
   }
}

.sidebar-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   height: 80px;

   .fa-xmark {
      cursor: pointer;
      font-size: 1.5rem;

      &:hover {
         color: #f39c12;
      }
   }

   .fa-bars {
      cursor: pointer;
      font-size: 1.5rem;

      &:hover {
         color: #f39c12;
      }
   }
}

.sidebar-logo {
   width: 30%;
   margin: 0 auto;

   img {
      width: 100%;
   }
}

.sidebar-content {
   height: 95%;
   width: 80%;
   margin: auto;
   background-color: $secondary-bg-color;
   border-radius: 30px;
}
</style>
