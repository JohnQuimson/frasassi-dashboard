<script>
import { store } from '../store';
import axios from '../assets/js/partials/axiosConfig';
import CreateButton from '../elements/CreateButton.vue';
import OrderSelect from '../elements/OrderSelect.vue';
import Loader from '../elements/Loader.vue';
import ConfirmDeleteModal from '../elements/ConfirmDeleteModal.vue';
import AlertNotification from '../elements/AlertNotification.vue';

export default {
   name: 'AppSessione',
   data() {
      return {
         store,
         mySessions: [],
         searchQuery: '',
         selectedOrder: '',
         loading: false,
         showModal: false,
         sessionToDelete: null,
         alert: {
            show: false,
            type: 'success',
            title: '',
            message: '',
         },
      };
   },

   components: {
      CreateButton,
      OrderSelect,
      Loader,
      ConfirmDeleteModal,
      AlertNotification,
   },

   methods: {},

   created() {
      this.store.title = 'Sessioni';
   },
};
</script>

<template>
   <div>sessione</div>
</template>

<style scoped>
h1 {
   color: #42b983;
}
</style>
