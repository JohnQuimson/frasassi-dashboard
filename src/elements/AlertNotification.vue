<template>
   <div v-if="visible" class="alert-dismissible fade show notification" role="alert">
      {{ message }}
      <!-- <button type="button" class="btn-close" @click="closeAlert" aria-label="Close"></button> -->
   </div>
</template>

<script>
export default {
   name: 'AlertNotification',
   props: {
      message: {
         type: String,
         required: true,
      },
      duration: {
         type: Number,
         default: 5000, // Default: 3 secondi
      },
   },
   data() {
      return {
         visible: true,
      };
   },
   methods: {
      closeAlert() {
         this.visible = false;
         this.$emit('closed'); // Emette un evento al genitore
      },
   },
   mounted() {
      if (this.duration > 0) {
         setTimeout(() => {
            this.visible = false;
            this.$emit('closed'); // Chiude l'alert automaticamente
         }, this.duration);
      }
   },
};
</script>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.notification {
   background-color: #0dc143;
   color: white;
   position: fixed;
   bottom: 0;
   left: 50%;
   transform: translate(-50%, -50%);
   z-index: 1050;
   padding: 1rem 2rem;
   border-radius: 0.5rem;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   text-align: center;
   max-width: 90%;
}
</style>
