<template>
  <section class="overview-layput">
    <CustomedInput></CustomedInput>
    <section class="button-layout">
      <button>生成</button>
    </section>
    <CustomedOutput></CustomedOutput>
  </section>
  
</template>

<script setup>
  import CustomedInput from './components/CustomedInput/index.vue'
  import CustomedOutput from './components/CustomedOutput/index.vue'
</script>


<style scoped>
#app{
  width: 100vw;
}
.button-layout{
  display: flex;
  align-items: center;
}
.button-layout button{
  width: 150px;
  height: 40px;
}
.overview-layput{
  display: flex;
  /* margin: auto; */
  justify-content: space-evenly;
  align-items: center;
  width: 1500px;
  left: 50%;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
