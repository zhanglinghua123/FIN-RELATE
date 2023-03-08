<!--  -->
<template>
  <div class="output-layout">
  <!-- <a-select ref="select" v-model:value="selectedDemo" @change="loadDemo" :options="selectOptions">
                                                      </a-select> -->

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
  padding-top: 140px;
  height: 542px;
  /* height: 600px; */
  /* display: flex; */
  /* flex-direction: column; */
  /* height: 6px; */
  /* justify-content: space-evenly; */
}

.demo {
  width: 640px;
  height: 402px;
  border: 1px solid;
}
</style>