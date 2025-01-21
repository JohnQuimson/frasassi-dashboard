<script>
export default {
   name: 'CreateButton',
   props: {
      to: {
         type: String,
         required: true,
      },
   },
};
</script>

<template>
   <router-link :to="to" class="create-btn" active-class="active">
      <i class="fa-solid fa-plus"></i>
   </router-link>
</template>

<style scoped lang="scss">
@use '../assets/scss/style.scss' as *;

.create-btn {
   position: absolute;
   bottom: 50px;
   right: 50px;
   width: 50px;
   height: 50px;
   border-radius: 50%;
   background-color: $primary-color;
   display: flex;
   align-items: center;
   justify-content: center;
   color: white;
   transition: transform 1s;
   z-index: 1000;

   &:hover {
      background-color: darken($primary-color, 10%);
      transform: rotate(360deg);
   }
}
</style>
