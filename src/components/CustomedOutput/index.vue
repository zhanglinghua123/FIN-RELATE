<!--  -->
<template>
  <div id="output-container">
  <!-- <div class="output-layout">
      <div style="display: flex;margin-left: 50px;">
        <component class="demo" :is="selectedDemo"></component>
      </div>
      
    </div>
                                                                      <div id="textareaOut" contenteditable="false" class="textarea"></div> -->
    <div id="select">
      <div id="title">
        <p>Relationships</p>
        <button>Checked</button>
      </div>
      <div id="content"></div>
    </div>
    <div id="edit">
      <div id="title">
        <p>Video</p>
        <button>Export</button>
      </div>
      <div id="basicChart"></div>
    </div>
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
<style scoped lang="scss">
// .textarea {
//   width: calc(100% - 100px);
//   min-height: 120px;
//   max-height: 300px;
//   _height: 120px;
//   margin: 20px auto 0;
//   padding: 3px;
//   outline: 0;
//   border: 1px solid #a0b3d6;
//   font-size: 12px;
//   color: #fff;
//   word-wrap: break-word;
//   overflow-x: hidden;
//   overflow-y: auto;
//   _overflow-y: visible;
// }

#output-container {
  height: 100%;
  width: 100%;
  padding-top: 2vh;
  padding-left: 3vw;
  padding-right: 3vw;
}

#select {
  height: 50%;
  width: 100%;
  box-sizing: border-box;

  padding-bottom: 20px;

  #title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    height: 10%;
    font-weight: 500;
    font-size: 3vh;
    display: flex;
    margin-bottom: 5px;

    p {
      margin-bottom: 0;
      flex: 1;
    }

    button {
      font-size: 2vh;
      background-color: black;
      max-height: 80%;
      margin-left: 2%;
      border-color: aquamarine;
      cursor: pointer;
    }

  }

  #content {
    width: 100%;
    height: 90%;
    border: 3px solid gray;
  }
}

#edit {
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  padding-bottom: 20px;

  #title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    height: 10%;
    font-weight: 500;
    font-size: 3vh;
    display: flex;
    margin-bottom: 5px;

    p {
      margin-bottom: 0;
      flex: 1;
    }

    button {
      font-size: 2vh;
      background-color: black;
      max-height: 80%;
      margin-left: 2%;
      border-color: aquamarine;
      cursor: pointer;
    }
  }

  #basicChart {
    width: 100%;
    height: 90%;
    border: 1px solid gray;
  }
}
</style>