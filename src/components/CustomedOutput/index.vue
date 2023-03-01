<!--  -->
<template>
  <div class="output-layout">
    <a-select ref="select" v-model:value="selectedDemo" @change="loadDemo" :options="selectOptions">
    </a-select>

    <component class="demo" :is="selectedDemo"></component>
  </div>
</template>
<script>
import Demo1 from '../demo/demo1.vue'
import Demo2 from '../demo/demo2.vue'
export default {
  components: {
    Demo1,
    Demo2
  }
}
</script>
<script setup>
import { ref, onMounted } from 'vue'

const selectOptions = ref([
  { value: "Demo1", label: "Demo1" },
  { value: "Demo2", label: "Demo2" },
  { value: "Demo3", label: "Demo3" },
  { value: "Demo4", label: "Demo4" },
]);
let selectedDemo = ref("Demo1");
const loadDemo = (value) => {
  // selectedDemo = value;
}
</script>
<style scoped>
.output-layout {
  display: flex;
  flex-direction: column;
}

.demo {
  width: 300px;
  height: 300px;
  border: 1px solid;
}
</style>