<!--  -->
<template>
  <div id="output-container">
    <div id="select">
      <div id="title">
        <p>Relationships</p>
        <button @click="onClick">Checked</button>
      </div>
      <div id="content">
        <div id="content-title">
          <span>SC : Similarity Comparison</span>
          <span>TS : Time Sequence</span>
          <span>DC : Difference Comparison</span>
          <span>CB : Cause and Effect</span>
          <span>NR : No Relationships</span>
        </div>
        <div id="content-relation">
          <div id="content-list">
            <div v-for=" (item, index) in history" :key="index">
              <div v-if="index > 0" class="content-listItem">
                <div class="itemOne">One</div>
                <div class="transition">
                  <p>{{ item.words || "SC" }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" stroke="white" viewBox="0 0 100 100">
                    <path d="M10,50 L80,50" stroke="white" stroke-width="3" />
                    <path d="M90,50 L80,46 L80,54 L90,50" fill="white" />
                  </svg>
                </div>
                <div class="itemTwo">Two</div>
              </div>

            </div>
          </div>
          <div id="content-explanation">
            Explanation
          </div>
        </div>
      </div>
    </div>
    <div id="edit">
      <div id="title">
        <p>Video</p>
        <button @click="onGenerate">Export</button>
      </div>
      <div id="svg-container">
        <svg id="output-graph"></svg>
      </div>

    </div>
    <CanvasModal ref="Modal"></CanvasModal>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { animation2Video, animationFormFromHistory } from '../../js/animation';
import CanvasModal from '../ModalOfCanvas/CanvasModal.vue';
import * as d3 from "d3";

const props = defineProps(['innerStr'])

const { proxy } = getCurrentInstance()
const history = proxy.$history.value
// Modal的引用
const Modal = ref()
onMounted(() => {
  // 新建背景图片
  const svg = d3.select("#output-graph")
  svg.attr("width", document.getElementById("output-graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("output-graph").getBoundingClientRect().height)
  console.log(document.getElementById("output-graph").getClientRects().width)
  // 注意不是同一种 image 元素 -> img
  svg
    .append("defs")
    .append("pattern")
    // .attr("patternUnits", "userSpaceOnUse")
    // .attr("preserveAspectRatio", "none")
    // .attr("vector-effect", "non-scaling-stroke")
    .attr("id", "outbg-pattern")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("image")
    // .attr("preserveAspectRatio", "slice")
    .attr("width", document.getElementById("output-graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("output-graph").getBoundingClientRect().height)
    .attr("x", "0")
    .attr("y", "0")
    .attr("href", "")
    .attr("id", "image")

  const back = svg.append("g")
  back.append("rect")
    .attr("width", document.getElementById("output-graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("output-graph").getBoundingClientRect().height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "white")
  back
    .append("rect")
    .attr("width", document.getElementById("output-graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("output-graph").getBoundingClientRect().height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "url(#outbg-pattern)")
})
const onChangeBackGround = (file) => {
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    const imageData = reader.result;
    const image = document.querySelector("#output-graph #image")
    image.setAttribute("href", imageData)
  });

  reader.readAsDataURL(file);
}
// 需要添加动画的svgNode
const onGenerate = () => {
  // 调用子组件函数
  Modal.value.showModal()
  const svgContainer = d3.select("#output-graph")
  const totalTime = animationFormFromHistory(history, svgContainer)
  const svgNode = document.getElementById("svg-container")
  animation2Video(totalTime, svgNode)
}
// 必须定义这个才能进行调用
defineExpose({
  onChangeBackGround
})
</script>
<style scoped lang="scss">
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
    color: white;

    #content-title {
      margin-top: 4px;
      display: flex;
      height: 10%;

      span {
        font-size: 0.7vw;
        margin-left: 10px;
        width: auto;
        color: white;
      }
    }

    #content-relation {
      width: 100%;
      height: calc(90% - 6px);
      // padding-top: 5%;
      padding-left: 20px;
      padding-right: 20px;
      display: flex;

      #content-list::-webkit-scrollbar {
        display: none;
      }


      #content-list {
        width: 70%;
        height: 100%;
        overflow: scroll !important;



        .content-listItem {
          display: flex;
          height: 6vh;
          width: 100%;
          margin-bottom: 2vh;
          margin-top: 2vh;


          .itemOne {
            width: 40%;
            height: 100%;
            background-color: white;
            border-radius: 5%;
            border: 4px salmon solid;
            color: black;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .transition {
            width: 30%;
            height: 100%;
            position: relative;

            p {
              text-align: center;
              margin-bottom: 0;
            }

            svg {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: block;
              max-width: 100%;
              // height: 30%;
            }
          }

          .itemTwo {
            width: 40%;
            height: 100%;
            background-color: white;
            background-color: white;
            border-radius: 5%;
            border: 4px skyblue solid;
            color: black;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

      }

      #content-explanation {
        width: 25%;
        height: 90%;
        margin-left: 5%;
        background-color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
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

  #svg-container {
    width: 100%;
    height: 90%;
    border: 1px solid gray;

    #output-graph {
      display: block;
      width: 100%;
      height: 100%;
      border: 1px solid gray;
    }
  }

}
</style>