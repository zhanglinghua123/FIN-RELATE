<template>
  <div>
    <div id="app">
      <div id="title">
        <span>VisGenerator</span>
        <button @click="onClickButton">生成</button>
      </div>
      <div id="content">
        <div id="input">
          <CustomedInput></CustomedInput>
        </div>
        <div id="output">
          <CustomedOutput></CustomedOutput>
          <CanvasModal ref="modalButton"></CanvasModal>
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
    return {
      modalButton,
      onClickButton
    }
  }
})


</script>


<style scoped lang="less">
#app {
  background-color: rgba(0, 0, 0, 0.8);
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 40px;
  padding-top: 10px;
}

#title {
  position: relative;
  // display: flex;
  // justify-content: center;

  span {
    color: white;
    font-size: 30px;
    text-align: center;
    display: block;
  }

  button {
    position: absolute;
    right: 20px;
    width: 50px;
    top: 25%;
  }
}

#content {
  display: flex;

}

#input {
  margin-right: 20px;
  width: 50%;
}

#output {
  width: 50%;
}

.button-layout {
  display: flex;
  height: 100vh;
  align-items: center;
}

.button-layout button {
  width: 150px;
  height: 40px;
}

.overview-layput {
  display: flex;
  /* margin: auto; */
  /* justify-content: space-evenly; */
  /* align-items: center; */
  width: 1500px;
  /* left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%); */
}
</style>
