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
import { animationForm, animation2Video } from "./js/animation"
import * as d3 from "d3"
import { ref, defineComponent } from "vue"
export default defineComponent({
  components: { CustomedInput, CustomedOutput, CanvasModal },
  setup() {
    const modalButton = ref()
    const onClickButton = () => {
      console.log(modalButton.value, "--")
      modalButton.value.showModal()
      testAnimation()
    }
    return {
      modalButton,
      onClickButton
    }
  }
})

const testAnimation = (containerId) => {

  const lastSvg = d3.select("#d3 svg")
  const svgContainer = document.getElementById("d3")
  const MultiRect = addMultiRect("rectAnimation2", [{
    width: 20,
    height: 350,
    x: 70,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 100,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 140,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 180,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 280,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 380,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 480,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }, {
    width: 20,
    height: 350,
    x: 580,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }], {})
  animation2Video([
    {
      stopTime: 2,
      duration: 3,
      gap: 2,
      animation: () => {
        MultiRect.mount(lastSvg)
        console.log("svg---2 ")
        MultiRect.beginAnimation()
      }
    }, {
      stopTime: 2,
      duration: 3,
      gap: 0,
      animation: () => {
        console.log("svg---8 ")
        MultiRect.endAnimation()
      }
    }
  ], svgContainer)
}

</script>


<style scoped>
#app {
  width: 100vw;
}

.button-layout {
  display: flex;
  align-items: center;
}

.button-layout button {
  width: 150px;
  height: 40px;
}

.overview-layput {
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
