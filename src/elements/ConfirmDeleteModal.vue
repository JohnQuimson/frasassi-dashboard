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

<template>
   <div
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: flex; background-color: rgba(0, 0, 0, 0.5)"
      v-if="visible"
   >
      <div class="modal-dialog" role="document">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title">{{ title }}</h5>
               <button type="button" class="close-modal" @click="cancel"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
               <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
               <button type="button" class="button-annulla" @click="cancel">Annulla</button>
               <button type="button" class="button-delete" @click="confirm">Elimina</button>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.modal {
   align-items: center;
   justify-content: center;
   z-index: 1050;
   background-color: rgba(0, 0, 0, 0.5);

   .modal-dialog {
      .modal-content {
         background: rgba(255, 255, 255, 0.05);
         backdrop-filter: blur(1.5px);
         -webkit-backdrop-filter: blur(1.5px);
         border-radius: 10px;
         border: 1px solid rgba(255, 255, 255, 0.18);
         color: $white-color;

         .modal-header {
            border: none;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .close-modal {
               background-color: transparent;
               border: none;
               color: $gray-color;
               font-size: 22px;

               &:hover {
                  color: $white-color;
               }
            }
         }

         .modal-body {
            border: none;
         }

         .modal-footer {
            border: none;

            .button-annulla {
               background-color: $gray-color;
               color: $white-color;
               border: 2px solid $gray-color;
               border-radius: 5px;
               margin-right: 10px;

               &:hover {
                  background-color: darken($gray-color, 10%);
                  border: 2px solid darken($gray-color, 10%);
                  color: white;
               }
            }

            .button-delete {
               border: 2px solid $primary-color;
               border-radius: 5px;
               margin-right: 10px;
               background-color: $primary-color;
               color: $white-color;

               &:hover {
                  background-color: red;
                  border: 2px solid red;
               }
            }
         }
      }
   }
}
</style>
