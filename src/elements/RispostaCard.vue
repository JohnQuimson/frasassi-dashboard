<script>
export default {
   name: 'RispostaCard',
   props: {
      domanda: {
         type: String,
         required: true,
      },
      opzione: {
         type: String,
         required: true,
      },
      isCorrect: {
         type: Boolean,
         required: true,
      },
   },
};
</script>

<template>
   <div class="col-12">
      <div class="risposta-card shadow-sm">
         <div class="card-body">
            <h4 class="card-title">{{ domanda }}</h4>
            <p class="card-text">Risposta: {{ opzione }}</p>
            <p class="card-text" :class="{ 'text-success': isCorrect, 'text-danger': !isCorrect }">
               {{ isCorrect ? 'Corretta' : 'Errata' }}
            </p>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.risposta-card {
   background-color: $secondary-bg-color;
   border-radius: 20px;
   overflow: hidden;
   box-shadow: 10px 10px 18px rgba(0, 0, 0, 0.2);
   display: flex;
   flex-direction: column;
   padding: 20px;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   z-index: 10;

   .card-body {
      .card-title {
         font-size: 1.1rem;
         color: $white-color;
      }
      .card-text {
         font-size: 1rem;
         color: $gray-color;
      }
   }
}
</style>
