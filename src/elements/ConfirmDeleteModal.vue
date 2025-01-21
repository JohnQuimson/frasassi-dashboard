<template>
   <div
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block; background-color: rgba(0, 0, 0, 0.5)"
      v-if="visible"
   >
      <div class="modal-dialog" role="document">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title">{{ title }}</h5>
               <button type="button" class="btn-close" @click="cancel"></button>
            </div>
            <div class="modal-body">
               <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" @click="cancel">Annulla</button>
               <button type="button" class="btn btn-danger" @click="confirm">Conferma</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   name: 'ConfirmDeleteModal',
   props: {
      visible: {
         type: Boolean,
         required: true,
      },
      title: {
         type: String,
         default: 'Conferma Azione',
      },
      message: {
         type: String,
         default: 'Sei sicuro di voler procedere?',
      },
   },
   emits: ['confirm', 'cancel'],
   methods: {
      confirm() {
         this.$emit('confirm');
      },
      cancel() {
         this.$emit('cancel');
      },
   },
};
</script>

<style scoped>
.modal {
   display: flex;
   align-items: center;
   justify-content: center;
}
</style>
