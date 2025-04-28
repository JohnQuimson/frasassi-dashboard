<script>
export default {
   name: 'StatisticheModal',
   props: {
      visible: {
         type: Boolean,
         required: true,
      },
   },
   emits: ['close', 'action1', 'action2'],
   methods: {
      close() {
         this.$emit('close');
      },
      actionButton1() {
         this.$emit('action1');
      },
      actionButton2() {
         this.$emit('action2');
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
               <h5 class="modal-title">Statistiche</h5>
               <button type="button" class="close-modal" @click="close">
                  <i class="fa-solid fa-xmark"></i>
               </button>
            </div>
            <div class="modal-body">
               <p>Seleziona un'opzione:</p>
            </div>
            <div class="modal-footer">
               <button type="button" class="button-option" @click="actionButton1">Per Visore</button>
               <button type="button" class="button-option" @click="actionButton2">Per Quiz</button>
               <!-- <button type="button" class="button-close" @click="close">Chiudi</button> -->
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
            text-align: center;
            font-size: 16px;
            padding: 20px;
         }

         .modal-footer {
            border: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;

            .button-option {
               background-color: $primary-color;
               color: $white-color;
               border: 2px solid $primary-color;
               border-radius: 5px;
               padding: 8px 16px;
               font-size: 14px;

               &:hover {
                  background-color: darken($primary-color, 10%);
                  border-color: darken($primary-color, 10%);
               }
            }

            .button-close {
               background-color: $gray-color;
               color: $white-color;
               border: 2px solid $gray-color;
               border-radius: 5px;
               padding: 8px 16px;
               font-size: 14px;

               &:hover {
                  background-color: darken($gray-color, 10%);
                  border-color: darken($gray-color, 10%);
               }
            }
         }
      }
   }
}
</style>
