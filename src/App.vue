<template>
  <section class="overview-layput">
    <CustomedInput></CustomedInput>
    <section class="button-layout">
      <button @click="onClickButton">生成</button>
    </section>
    <CustomedOutput></CustomedOutput>
    <CanvasModal ref="modalButton"></CanvasModal>
    <!-- <canvas ref="canvas" :style="{ width: `640px`, height: `400px` }"></canvas> -->
  </section>
</template>

<script>
import CustomedInput from './components/CustomedInput/index.vue'
import CustomedOutput from './components/CustomedOutput/index.vue'
import CanvasModal from "./components/ModalOfCanvas/CanvasModal.vue"
import addMultiRect from "./js/addMultiRectangular"
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


<style scoped>
#app {
  width: 100vw;
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
