<script>
import { store } from '../store';

export default {
   name: 'Main',

   data() {
      return {
         store,
      };
   },

   methods: {},

   created() {
      this.store.title = 'Dashboard';
   },
};
</script>

<template>
   <div class="main-container">main</div>
</template>

<style lang="scss" scoped>
.main-container {
   background-color: red;
   // height: 90vh;
   // overflow-y: auto;
   // width: 100%;
}
</style>
