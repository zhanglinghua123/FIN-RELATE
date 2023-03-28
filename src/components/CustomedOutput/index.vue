<!--  -->
<template>
  <div id="output-container">
    <div id="select">
      <div id="title">
        <p>Relationships</p>
        <!-- <button @click="onClick">Checked</button> -->
      </div>
      <div id="content">
        <div id="content-example">
          <ListItem svgWidth="80%" class="content-example-item" type="SC"></ListItem>
          <ListItem svgWidth="80%" class="content-example-item" type="DC"></ListItem>
          <ListItem svgWidth="80%" class="content-example-item" type="TS"></ListItem>
          <ListItem svgWidth="80%" class="content-example-item" type="CE"></ListItem>
          <ListItem svgWidth="80%" class="content-example-item" type="WR"></ListItem>
        </div>
        <div id="content-title">
          <span>Similarity/Comparison</span>
          <span>Difference/Contrast</span>
          <span>Time/Sequence</span>
          <span>Cause and Effect</span>
          <span>Without Relationship</span>
        </div>
        <div id="content-relation">
          <div id="content-list">
            <div v-for=" (item, index) in history" :key="index">
              <ListItem v-if="index > 0" :id="history[index - 1].id" :itemOneWords="history[index - 1].words"
                :itemTwoWords="history[index].words" :type="item.type" :operate="history[index - 1].operate"
                :itemOneHighLight="history[index - 1].highLight" class="content-listItem">
              </ListItem>
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
        <button @click="onGenerate">Generate</button>
        <button @click="downloadVideo">Export</button>
      </div>
      <div id="svg-contain">
        <div id="svg-container" :style="{
          width: '100%',
          height: '100%',
        }">
          <svg id="output-graph"></svg>
        </div>
        <canvas id="video"></canvas>
      </div>

    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import ListItem from "../OutputListItem/ListItem.vue"
import { animation2Video, animationFormFromHistory, downloadVideo } from '../../js/animation';
import * as d3 from "d3";

const props = defineProps(['innerStr'])

const { proxy } = getCurrentInstance()
const history = proxy.$history.value
// Modal的引用
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
  const svgContainer = d3.select("#output-graph")
  const totalTime = animationFormFromHistory(history, svgContainer)
  const svgNode = document.getElementById("svg-container")
  const canvas = document.getElementById("video")
  animation2Video(totalTime, svgNode, canvas)
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

    #content-example {
      display: flex;
      height: 10%;
      justify-content: space-around;
      padding-top: 4px;

      .content-example-item {
        margin-left: 10px;
        margin-right: 10px;
        width: 20%;
      }
    }

    #content-title {
      margin-top: 4px;
      display: flex;
      height: 10%;
      display: flex;
      justify-content: space-between;

      span {
        display: block;
        width: 20%;
        text-align: center;
        font-size: 0.7vw;
        margin-left: 10px;
        // width: auto;
        color: white;
      }
    }

    #content-relation {
      width: 100%;
      height: calc(80% - 6px);
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
        padding-left: 20px;
        padding-right: 20px;

        .content-listItem {
          display: flex;
          height: 6vh;
          width: 100%;
          margin-bottom: 2vh;
          margin-top: 2vh;
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

  #svg-contain {
    width: 100%;
    height: 90%;
    border: 1px solid gray;
    position: relative;

    #output-graph {
      display: block;
      width: 100%;
      height: 100%;
      border: 1px solid gray;
    }

    #video {
      position: absolute;
      top: 0;
      z-index: -1;
      display: block;
      width: 100%;
      height: 100%;
      border: 1px solid gray;
    }
  }

}
</style>