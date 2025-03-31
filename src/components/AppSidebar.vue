<script>
import { store } from '../store';

export default {
   name: 'Sidebar',
   data() {
      return {
         store,
         links: [{ name: 'Sessioni', path: '/sessioni', icon: 'fa-solid fa-users' }],
         isCollapsed: JSON.parse(localStorage.getItem('isCollapsed')) || false,
      };
   },
   computed: {},
   methods: {
      toggleSidebar() {
         this.isCollapsed = !this.isCollapsed;
         localStorage.setItem('isCollapsed', JSON.stringify(this.isCollapsed));
      },
   },

   created() {},
};
</script>

<template>
   <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]" class="d-flex flex-column text-white">
      <div class="sidebar-content">
         <div class="sidebar-logo mt-5">
            <img class="img-fluid" src="/public/img/logo.png" alt="Logo" />
         </div>

         <ul class="nav flex-column mt-5">
            <li class="nav-item" v-for="item in links" :key="item.name">
               <router-link
                  :to="item.path"
                  class="nav-link d-flex align-items-center justify-content-center"
                  active-class="active"
               >
                  <i :class="item.icon" class="me-2 icona"></i>
                  <span class="name">{{ item.name }}</span>
               </router-link>
            </li>
         </ul>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.sidebar {
   width: 30%;
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
   width: 60%;
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
