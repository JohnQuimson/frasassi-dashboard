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
               <button type="button" class="button-delete" @click="confirm">Conferma</button>
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
   // position: fixed;
   // top: 0;
   // left: 0;
   // right: 0;
   // bottom: 0;
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
               background-color: transparent;
               color: $gray-color;
               border: 2px solid $gray-color;
               border-radius: 5px;
               margin-right: 10px;

               &:hover {
                  background-color: $gray-color;
                  color: $white-color;
               }
            }

            .button-delete {
               border: 2px solid $orange-color;
               border-radius: 5px;
               margin-right: 10px;
               background-color: $orange-color;
               color: $white-color;

               &:hover {
                  background-color: darken($orange-color, 5%);
                  border: 2px solid darken($orange-color, 5%);
               }
            }
         }
      }
   }
}
</style>
