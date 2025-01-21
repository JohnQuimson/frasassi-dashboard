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
         default: 50000, // Default: 3 secondi
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
   background-color: green;
   color: white;
   position: fixed; /* Posizionamento fisso per rimanere visibile durante lo scrolling */
   bottom: 0; /* Centra verticalmente */
   left: 50%; /* Centra orizzontalmente */
   transform: translate(-50%, -50%); /* Corregge il posizionamento rispetto al centro */
   z-index: 1050; /* Garantisce che sia sopra gli altri elementi */
   padding: 1rem 2rem; /* Spaziatura interna */
   border-radius: 0.5rem; /* Arrotondamento degli angoli */
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Aggiunge un'ombra per risalto */
   text-align: center; /* Centra il testo */
   max-width: 90%; /* Limita la larghezza su schermi piccoli */
}
</style>
