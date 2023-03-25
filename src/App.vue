<template>
  <div>
    <div id="app">
      <div id="title">
        <span>FIN-RELATE</span>
        <!-- <button class="generate-button" @click="onClickButton">Generate</button> -->
      </div>
      <div id="content">
        <div id="input">
          <CustomedInput @changeText="changeText"></CustomedInput>
        </div>
        <div id="output">
          <CustomedOutput :innerStr="innerStr"></CustomedOutput>
          <!-- <CanvasModal ref="modalButton"></CanvasModal> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomedInput from './components/CustomedInput/index.vue'
import CustomedOutput from './components/CustomedOutput/index.vue'
import CanvasModal from "./components/ModalOfCanvas/CanvasModal.vue"
import { animationFormFromHistory, animation2Video } from "./js/animation"
import * as d3 from "d3"
import { getCurrentInstance, ref, defineComponent } from "vue"
export default defineComponent({
  components: { CustomedInput, CustomedOutput, CanvasModal },
  setup() {
    const { proxy } = getCurrentInstance()
    const history = proxy.$history.value
    const modalButton = ref()
    // 需要添加动画的svgNode
    const onClickButton = () => {
      modalButton.value.showModal()
      const totalTime = animationFormFromHistory(history, proxy.$chart.value)
      const lastSvg = d3.select("#d3 svg")
      const svgContainer = document.getElementById("d3")
      animation2Video(totalTime, svgContainer)
    }
    let innerStr = ref('');
    const changeText = (str) => {
      innerStr.value = str;
    }
    return {
      innerStr,
      changeText,
      modalButton,
      onClickButton
    }
  }
})


</script>


<style scoped lang="less">
#app {
  background-color: black;
  min-height: 100vh;
  width: 100vw;
}

#title {
  height: 10vh;
  display: flex;
  border-bottom: 2px solid gray;

  span {
    color: white;
    font-size: 4vh;
    margin-left: 20px;
    line-height: 10vh;
    // text-align: center;
    display: block;
  }

  // button {
  //   position: absolute;
  //   right: 20px;
  //   width: 90px;
  //   top: 25%;
  //   // border: 1px #ebebea;
  //   border-radius: 4px;
  //   border: none;
  //   font-size: 15px;
  //   font-family: PingFang SC;
  //   background-color: #a5a3a3;
  // }
}

#content {
  display: flex;
  height: 90vh;
}

#input {
  width: 50%;
  height: 100%;
  border-right: 2px solid gray;
}

#output {
  width: 50%;
  height: 100%;
}

// .button-layout {
//   display: flex;
//   height: 100vh;
//   align-items: center;
// }

// .button-layout button {
//   width: 150px;
//   height: 40px;
// }


// .overview-layput {
//   display: flex;
//   /* margin: auto; */
//   /* justify-content: space-evenly; */
//   /* align-items: center; */
//   width: 1500px;
//   /* left: 50%;
//   position: absolute;
//   top: 50%;
//   transform: translate(-50%, -50%); */
// }
</style>
