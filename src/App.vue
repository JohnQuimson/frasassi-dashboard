<script>
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppMain from './components/AppMain.vue';
import AppFooter from './components/AppFooter.vue';
import { store } from './store.js';

export default {
   name: 'App',

   components: {
      AppHeader,
      AppSidebar,
      AppMain,
      AppFooter,
   },

   data() {
      return {
         store,
      };
   },

   computed: {
      isLoginPage() {
         return this.$route.name === 'Login';
      },
   },
};
</script>

<template>
   <div v-if="!isLoginPage" class="master-container">
      <AppSidebar />
      <div class="right-container">
         <AppHeader />
         <main>
            <router-view></router-view>
         </main>
      </div>

      <!-- <AppFooter /> -->
   </div>

   <AppLogin v-else />
</template>

<style lang="scss">
@use './assets/scss/style.scss' as *;

.master-container {
   display: flex;
   background-color: $background-color;

   .right-container {
      width: 100%;
      overflow: hidden;
   }
}

main {
   height: 85vh;
   overflow-y: auto;
   width: 100%;
}
</style>
