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
          <ListItem height="100%" svgWidth="80%" type="SC"></ListItem>
          <ListItem height="100%" svgWidth="80%" type="DC"></ListItem>
          <ListItem height="100%" svgWidth="80%" type="TS"></ListItem>
          <ListItem height="100%" svgWidth="80%" type="CE"></ListItem>
          <ListItem height="100%" svgWidth="80%" type="WR"></ListItem>
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
            <div v-for=" (item, index) in transformer(history)" :key="index">
              <ListItem :isLast="(index + 1) === transformer(history).length" :explain="item.explanation"
                @changeExplainContent="changeExplainationContent" @changeExplain="changeExplainationHighLight"
                multiHeight="12vh" height="6vh" svgWidth="50%" :itemOneArray="item.itemOneArray"
                :itemTwoArray="item.itemTwoArray" :isMulti="item.isMulti" :type="item.type">
              </ListItem>
            </div>
          </div>
          <div :class="{
            isHighLight: explanationHighLight
          }" id="content-explanation">
            <p id="content-explanation-para"></p>
          </div>
        </div>
      </div>
    </div>
    <div id="edit">
      <div id="title">
        <p>Video</p>
      <!-- <button @click="onGenerateSample">Sample</button>
          <button @click="onGenerateSimple">Simple</button> -->
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
import { animation2Video, animationSample, animationFormFromHistory, downloadVideo, animationFormFromNoNIntensifyHistory } from '../../js/animation';
import * as d3 from "d3";
import { transformer } from "../../js/transformerHistory"
import { LineChart } from "../../js/LineChart"
import { animationText } from "../../js/animationText"

const props = defineProps(['innerStr'])

let explanationHighLight = ref(false)

const { proxy } = getCurrentInstance()
const history = proxy.$history.value
// Modal的引用
onMounted(async () => {
  // 新建背景图片
  const svg = d3.select("#output-graph")
  svg.attr("width", document.getElementById("output-graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("output-graph").getBoundingClientRect().height)
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
    .attr("id", "whiteBackGround")
  back
    .append("rect")
    .attr("width", document.getElementById("output-graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("output-graph").getBoundingClientRect().height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "url(#outbg-pattern)")


  // // 插入背景的线型图
  // let datas = []
  // // 路径是从 main.js开始算的 图形如果显示的是错误的时候 查看数据源对不对
  // await d3.csv("./caseData.csv", function (data) {
  //   datas.push(data)
  // });
  // console.log(datas)
  // datas = datas.slice(2500, 2730)
  // LineChart(datas, "#output-graph", {
  //   x: (data) => data.timestamp * 1000,
  //   y: (data) => parseFloat(data.open),
  //   width: document.getElementById("output-graph").getBoundingClientRect().width,
  //   height: document.getElementById("output-graph").getBoundingClientRect().height,
  //   color: "rgba(0,0,0,0.6)",
  // })


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
  // 调用子组件函数 来生成对应的动画
  const svgContainer = d3.select("#output-graph")
  const totalTime = animationFormFromHistory(history, transformer(history), svgContainer)
  const svgNode = document.getElementById("svg-container")
  const canvas = document.getElementById("video")
  animation2Video(totalTime, svgNode, canvas)
  // animationText("textarea", "output-graph", {
  //   wordsDict: history.map(val => val.words)
  // })
}
const onGenerateSimple = () => {
  // 调用子组件函数 来生成对应的动画
  const svgContainer = d3.select("#output-graph")
  const totalTime = animationFormFromNoNIntensifyHistory(history, transformer(history), svgContainer)
  const svgNode = document.getElementById("svg-container")
  const canvas = document.getElementById("video")
  animation2Video(totalTime, svgNode, canvas)
  // animationText("textarea", "output-graph", {
  //   wordsDict: history.map(val => val.words)
  // })
}
const onGenerateSample = () => {
  const svgContainer = d3.select("#output-graph")
  const totalTime = animationSample(transformer(history), svgContainer)
  const svgNode = document.getElementById("svg-container")
  const canvas = document.getElementById("video")
  animation2Video(totalTime, svgNode, canvas)
}
const changeExplainationContent = (text) => {
  console.log(text, "--text--")
  document.getElementById("content-explanation-para").textContent = text
}
const changeExplainationHighLight = (val) => {
  explanationHighLight.value = val
}
// 必须定义这个才能进行调用
defineExpose({
  onChangeBackGround
})
</script>
<style scoped lang="scss">
// .renderText {
//   -webkit-background-clip: "text";
// }

// #renderText {
//   -webkit-background-clip: "text";
// }
button {
  padding: 3px 10px;
  border-color: #11b5cccf #11B5CC #11B5CC #11b5cccf;
}

p {
  margin-bottom: 0;
}

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
    height: 15%;
    font-weight: 500;
    font-size: 3.6vh;
    display: flex;
    // margin-bottom: 5px;

    p {
      margin-bottom: 0;
      flex: 1;
    }

    button {
      font-size: 2vh;
      background-color: black;
      max-height: 80%;
      margin-left: 2%;
      // border-color: aquamarine;
      cursor: pointer;
    }

  }

  #content {
    width: 100%;
    height: 85%;
    border: 2px solid rgba(80, 80, 80, 0.9);
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

        .content-list-item {
          display: flex;
          height: 6vh;
          width: 100%;
          margin-bottom: 2vh;
          margin-top: 2vh;
        }

      }

      #content-explanation {
        padding: 10px;
        width: 25%;
        height: 85%;
        margin-left: 5%;
        background-color: #303030;

        // display: flex;
        // justify-content: center;
        // align-items: center;
        p {
          font-size: 18px;
          font-weight: 500;
          overflow: scroll;
          text-overflow: ellipsis;
          // word-break: break-all;
          max-height: 100%;
        }

        p::-webkit-scrollbar {
          display: none;
        }


        // p:hover::before {
        //   content: attr(data-content);
        //   display: block;
        //   position: absolute;
        //   top: 100%;
        //   left: 0;
        //   width: 100%;
        //   padding: 10px;
        //   background-color: #f9f9f9;
        //   border: 1px solid #ccc;
        //   z-index: 1;
        // }
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
    height: 15%;
    font-weight: 500;
    font-size: 3.6vh;
    display: flex;
    // margin-bottom: 5px;

    p {
      margin-bottom: 0;
      flex: 1;
    }

    button {
      font-size: 2vh;
      background-color: black;
      max-height: 80%;
      margin-left: 2%;
      // border-color: aquamarine;
      cursor: pointer;
    }
  }

  #svg-contain {
    width: 100%;
    height: 85%;
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
      left: -200px;

      display: block;
      width: 100%;
      height: 100%;
      border: 1px solid gray;
    }
  }

}

.isHighLight {
  box-shadow: 0 0 20px #11b5cccf;
}
</style>