<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';

export default {
   name: 'AppVisoreSingle',
   data() {
      return {
         store,
         loading: false,
         visore: null,
         alert: {
            show: false,
            type: 'success',
            title: '',
            message: '',
         },
      };
   },

   components: {
      Loader,
      AlertNotification,
   },

   methods: {},
   created() {
      this.store.title = `Visore ${this.store.selectedVisore.nome}`;
   },
};
</script>

<template>
   <div class="app-visore-single">
      <!-- your template here -->
   </div>
</template>

<style scoped lang="scss">
.app-visore-single {
   /* your styles here */
}
</style>
