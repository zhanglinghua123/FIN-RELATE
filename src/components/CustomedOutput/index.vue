<!--  -->
<template>
  <div class="output-layout">
    <component class="demo" :is="selectedDemo"></component>
  </div>
</template>
<script>
import Demo3 from "../demo/demo3.vue"

export default {
  components: {
    Demo3,
  }
}
</script>
<script setup>
import { ref, onMounted } from 'vue'

const selectOptions = ref([
  { value: "Demo3", label: "Demo3" },
]);
let selectedDemo = ref("Demo3");
</script>
<style scoped>
.output-layout {
  min-height: 60vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 20px;
  /* height: 600px; */
  /* display: flex; */
  /* flex-direction: column; */
  /* height: 6px; */
  /* justify-content: space-evenly; */
}

.demo {
  width: 100%;
  height: calc(60vh - 40px)
}
</style>