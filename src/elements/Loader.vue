<template>
   <div class="loader-container">
      <span class="loader"></span>
   </div>
</template>

<style scoped>
.loader-container {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
}

.loader {
   width: 45px;
   aspect-ratio: 1;
   --c: no-repeat linear-gradient(#ffffff 0 0);
   background: var(--c) 0% 100%, var(--c) 50% 100%, var(--c) 100% 100%;
   animation: l2 1s infinite linear;
}

@keyframes l2 {
   0% {
      background-size: 20% 100%, 20% 100%, 20% 100%;
   }
   20% {
      background-size: 20% 60%, 20% 100%, 20% 100%;
   }
   40% {
      background-size: 20% 80%, 20% 60%, 20% 100%;
   }
   60% {
      background-size: 20% 100%, 20% 80%, 20% 60%;
   }
   80% {
      background-size: 20% 100%, 20% 100%, 20% 80%;
   }
   100% {
      background-size: 20% 100%, 20% 100%, 20% 100%;
   }
}
</style>
