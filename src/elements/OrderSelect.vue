<script>
export default {
   name: 'OrderSelect',
   props: {
      modelValue: {
         type: String,
         default: '',
      },
   },
   computed: {
      selectedOrder: {
         get() {
            return this.modelValue;
         },
         set(value) {
            this.$emit('update:modelValue', value);
         },
      },
   },
   methods: {
      emitOrderChange() {
         this.$emit('order-changed', this.selectedOrder);
      },
   },
};
</script>

<template>
   <div class="filter">
      <select v-model="selectedOrder" class="form-select" aria-label="Ordina per" @change="emitOrderChange">
         <option value="" disabled>Ordina per</option>
         <option value="1">Primo creato</option>
         <option value="2">Ultimo creato</option>
      </select>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.filter {
   border-radius: 20px;
   display: flex;
   align-items: center;
   justify-content: center;
   box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);

   select {
      width: 100%;
      height: 80%;
      border-radius: 20px;
      font-size: 14px;
      background-color: $secondary-bg-color;
      border: none;
      color: $gray-color;

      &:focus {
         box-shadow: none;
      }

      option {
         font-size: 16px;
         padding: 0 20px;
         color: $gray-color;

         &:disabled {
            color: $gray-color;
            background-color: $secondary-bg-color;
         }
      }
   }
}
</style>
