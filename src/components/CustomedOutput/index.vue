<!--  -->
<template>
  <div>
    <div class="output-layout">
      <component class="demo" :is="selectedDemo"></component>
    </div>
    <div id="textareaOut" contenteditable="false" class="textarea"></div>
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
import { ref, onMounted, onUpdated } from 'vue'
const props = defineProps(['innerStr'])
const selectOptions = ref([
  { value: "Demo3", label: "Demo3" },
]);
let selectedDemo = ref("Demo3");
onUpdated(() => {
  let textarea = document.getElementById("textareaOut");
  textarea.innerHTML = props.innerStr;
  textarea = null;
})
</script>
<style scoped>
.output-layout {
  min-height: 60vh;
  height: 50vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 60px;
  /* height: 600px; */
  /* display: flex; */
  /* flex-direction: column; */
  /* height: 6px; */
  /* justify-content: space-evenly; */
}

.textarea {
  width: calc(100% - 100px);
  min-height: 120px;
  max-height: 300px;
  _height: 120px;
  margin: 20px auto 0;
  padding: 3px;
  outline: 0;
  border: 1px solid #a0b3d6;
  font-size: 12px;
  color: #fff;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto;
  _overflow-y: visible;
}

.demo {
  width: 100%;
  height: calc(60vh - 40px);
  margin-left: 50px;
}
</style>