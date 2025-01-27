<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import Loader from '../elements/Loader.vue';
import AlertNotification from '../elements/AlertNotification.vue';

export default {
   name: 'AppSessioneSingle',
   data() {
      return {
         store,
         loading: false,
         sessione: null,
         alert: {
            show: false,
            type: 'success',
            title: '',
            message: '',
         },
      };
   },
   methods: {
      fetchSessione() {
         this.loading = true;
         const sessioneId = this.$route.params.id;
         axios
            .get(`${this.store.api.baseUrl}${this.store.api.apiUrls.sessioni}/${sessioneId}`)
            .then((response) => {
               this.sessione = response.data;
            })
            .catch((e) => {
               console.log(e);
               this.showAlert('error', 'Errore', 'Errore nel recupero delle sessioni');
            })
            .finally(() => {
               this.loading = false;
            });
      },
   },
   computed: {
      // Your computed properties here
   },
   mounted() {
      // Code to run when the component is mounted
   },

   created() {
      this.store.title = `Sessione`;
   },
};
</script>

<template>
   <div class="app-sessione-single">
      <h1 class="text-white">{{ this.store.selectedSessione }}</h1>
   </div>
</template>

<style scoped lang="scss">
/* Your styles here */
</style>
