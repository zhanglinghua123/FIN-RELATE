
<template>
  <div class="input-container">
    <div id="select">
      <p class="title">CopyWriting</p>
      <div id="textarea" contenteditable="true" class="textarea" @mouseup="selectWords"></div>
    </div>
    <div id="edit">
      <div id="title">
        <p>Visualizations</p>
        <input id="file-input" multiple="multiple" accept="image/*" type="file" @change="onFileChange"
          style="display: none;" />
        <button @click="upload">Import</button>
      </div>
      <div id="basicChart">
        <div id="content">
          <div id="spanArray">
            <!-- 可以动态绑定class 但是不能动态计算样式 -->
            <span v-for="(file, index) in selectedFiles" :class="{
              isActive: selectImage === index
            }" @click="onChangeSelectedImage(index)"></span>
          </div>
          <svg id="graph">

          </svg>
        </div>
        <div id="tool">
          <p>Annotation</p>
          <div id="category">
            <svg @click='e => onChangeType("CIRCLE")' v-bind:class="{
              isSelect: type === 'CIRCLE'
            }" view-box="0 0 25 25">
              <circle cx="50%" cy="50%" r="10" fill="white" stroke="rgba(45,145,225,0.8)" stroke-width="4">
              </circle>
            </svg>
            <svg @click='e => onChangeType("RECT")' :class="{
              isSelect: type === 'RECT'
            }" view-box="0 0 25 25">
              <rect x="1" y="1" width="22" height="22" fill="rgba(45,145,225,0.8)"></rect>
            </svg>
            <svg @click='e => onChangeType("TEXT")' :class="{
              isSelect: type === 'TEXT'
            }" view-box="0 0 25 25">
              <defs>
                <marker id="triangle" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2"
                  orient="auto">
                  <path fill="rgba(45,145,225,0.8)" stroke="none" d="M 0 0 L 5 2 L 0 4 z" />
                </marker>
              </defs>
              <text fill="rgba(45,145,225,0.8)" x="12" y="12">A</text>
              <path d="M 4,4 Q 10,15 18,18" stroke="rgba(45,145,225,0.8)" stroke-width="2" fill="none"
                style="marker-end: url(#triangle);" />
            </svg>
            <svg @click='e => onChangeType("ARROW")' :class="{
              isSelect: type === 'ARROW'
            }" view-box="0 0 25 25">
              <defs>
                <marker id="triangle" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2"
                  orient="auto">
                  <path fill="rgba(45,145,225,0.8)" stroke="none" d="M 0 0 L 5 2 L 0 4 z" />
                </marker>
              </defs>
              <path d="M 2,2 L 18,18" stroke="rgba(45,145,225,0.8)" fill="rgba(45,145,225,0.8)" stroke-width="2"
                style="marker-end: url(#triangle);" />
            </svg>
            <svg @click='e => onChangeType("DELETE")' :class="{
              isSelect: type === 'DELETE'
            }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M20,30 L30,20 L80,70 L70,80 M20,30" fill="rgba(45,145,225,0.8)" stroke="rgba(45,145,225,0.8)">
              </path>
              <path d="M80,30 L70,20 L20,70 L30,80 M80,30" fill="rgba(45,145,225,0.8)" stroke="rgba(45,145,225,0.8)" />
            </svg>
          </div>
        <!-- <div id="edit-choice">
            <p>Styles</p>
            <div id="style" :style="{
              position: 'relative',
            }">
              <svg  @click="onClickColor">
                <path d="M 12.5 25 A 12.5 12.5 0 0 1 12.5 0" fill="red" stroke="transparent" />
                <path d="M 12.5 25 A 12.5 12.5 0 0 0 12.5 0" fill="green" stroke="transparent" />
              </svg>
              <input type="color" v-model="selectColor" ref="colorPicker" />
              <svg  view-box="0 0 25 25">
                <line x1="0" y1="2" x2="25" y2="2" stroke="black" stroke-width="1"></line>
                <line x1="0" y1="6" x2="25" y2="6" stroke="black" stroke-width="2"></line>
                <line x1="0" y1="10" x2="25" y2="10" stroke="black" stroke-width="3"></line>
                <line x1="0" y1="16" x2="25" y2="16" stroke="black" stroke-width="4"></line>
                <line x1="0" y1="22" x2="25" y2="22" stroke="black" stroke-width="5"></line>
              </svg>
            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div> -->
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import { getCurrentInstance, ref, onMounted, defineComponent } from 'vue'
import { message } from 'ant-design-vue';
import * as d3 from "d3";
import { getDirection } from '../../js/getDirection';
import { LineChart } from '../../js/LineChart';
import { addMutation } from "../../js/mutation"
const emit = defineEmits(["changeBackGround"])


// 在 setup形势下面 只有setup才能实时的获取变量的值
let svg = null, configPosition = { left: 0, top: 0 }, isDraw = true, type = ref(""),
  currentId = 0, selectedWord = '', needReSelect = false, selectColor = "rgba(45,145,225,1)", colorPicker = ref();

const startPos = [], cardBodyStyle = { backgroundColor: "#cccccc" };
// 将 history 修改为 全局变量
const { proxy } = getCurrentInstance()
const history = proxy.$history
const selectWords = (e) => {
  // 获取用户当前选中的文本
  let tmp = window.getSelection().toString();
  if (["CIRCLE", "RECT", "ARROW", "TEXT"].includes(type.value)) {
    needReSelect = false;
    selectedWord = tmp;
  } else if (!["TEXT"].includes(type.value)) {
    selectedWord = "";
    // message.error("请先选择可视化类型再选中！")
  }
}
onMounted(async () => {
  // 新建背景图片
  const svg = d3.select("#graph")

  // let datas = []
  // // 路径是从 main.js开始算的 图形如果显示的是错误的时候 查看数据源对不对
  // await d3.csv("./caseData.csv", function (data) {
  //   datas.push(data)
  // });
  // console.log(datas)
  // datas = datas.slice(2500, 2700)
  // LineChart(datas, "#graph", {
  //   x: (data) => data.timestamp * 1000,
  //   y: (data) => parseFloat(data.open),
  //   width: document.getElementById("graph").getBoundingClientRect().width,
  //   height: document.getElementById("graph").getBoundingClientRect().height,
  //   color: "rgba(0,0,0,0.6)",
  // })

  svg.attr("width", document.getElementById("graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("graph").getBoundingClientRect().height)
  // 注意不是同一种 image 元素 -> img
  svg
    .append("defs")
    .append("pattern")
    // .attr("patternUnits", "userSpaceOnUse")
    .attr("vector-effect", "non-scaling-stroke")
    .attr("id", "bg-pattern")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("image")
    // 这个是让图片自动拉伸适应视口的属性
    // .attr("preserveAspectRatio", "slice")
    .attr("width", document.getElementById("graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("graph").getBoundingClientRect().height)
    .attr("x", "0")
    .attr("y", "0")
    .attr("href", "")
    .attr("id", "image")

  svg.append("g")
    .append("rect")
    .attr("width", document.getElementById("graph").getBoundingClientRect().width)
    .attr("height", document.getElementById("graph").getBoundingClientRect().height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "url(#bg-pattern)")
  //把同一种类型放一起，方便管理
  svg.append("g",).attr("class", "rectG");
  svg.append("g").attr("class", "circleG");
  svg.append("g").attr("class", "arrowG");
  // svg.append("g").attr("class", "textG")

  svg.on("mousedown", e => {
    const x0 = e.offsetX;
    const y0 = e.offsetY;
    startPos[0] = x0;
    startPos[1] = y0;
    isDraw = false;
  })
  svg.on("mousemove", e => {
    const x1 = e.offsetX;
    const y1 = e.offsetY;
    // 并且当且没有选中类型
    if (!isDraw && ((Math.sqrt((x1 - startPos[0]) ** 2 + (y1 - startPos[1]) ** 2)) > 10)) {
      if (type.value === 'RECT') {
        addRect(x1, y1, currentId, "rgba(45,145,225,0.4)");
      } else if (type.value === 'CIRCLE') {
        addCircle(x1, y1, currentId, "transparent", "rgba(45,145,225,0.8)");
      } else if (type.value === 'ARROW') {
        addArrow(x1, y1, currentId, "rgba(45,145,225,0.8)");
      } else if (type.value === "TEXT") {
        addArrow(x1, y1, currentId, "rgba(45,145,225,0.8)", true);
      } else {

      }
    }
  })
  svg.on("mouseup", e => {
    const x1 = e.offsetX;
    const y1 = e.offsetY;
    // 并且右击事件触发事务
    if ((Math.sqrt((x1 - startPos[0]) ** 2 + (y1 - startPos[1]) ** 2)) > 10) {
      if (type.value === 'RECT') {
        const pos = addRect(x1, y1, currentId, "rgba(45,145,225,0.4)");
        addHistory(type.value, currentId, pos, selectedWord, selectColor);
      } else if (type.value === 'CIRCLE') {
        const pos = addCircle(x1, y1, currentId, "transparent", "rgba(45,145,225,0.8)");
        addHistory(type.value, currentId, pos, selectedWord, selectColor);
      } else if (type.value === 'ARROW') {
        const pos = addArrow(x1, y1, currentId, "rgba(45,145,225,0.8)", false, true);
        addHistory(type.value, currentId, pos, selectedWord, selectColor);
      } else if (type.value === "TEXT") {
        const pos = addArrow(x1, y1, currentId, "rgba(45,145,225,0.8)", true, true)
        // const direction = getDirection({ x1: startPos[0], y1: startPos[1], x2: x1, y2: y1 })
        addText(x1, y1, "", currentId, history.value.length)
        addHistory(type.value, currentId, pos, selectedWord, selectColor)
      } else {

      }
    }
    isDraw = true;
    currentId += 1;

  })
})
const labelString = (str) => {
  str = str.replace(/\<[^>]*\>(([^<])*)/gi, function () {
    return arguments[1];
  });
  return str;
};
const highlightText = (words, method = 'ADD') => {
  if (!needReSelect) {

    const textarea = document.getElementById("textarea");
    const inner = textarea.innerHTML.toString();
    let pureInner = labelString(inner);
    let str = '';
    let repalceArray = []
    history.value.forEach((his) => {
      if (his.words.length) {
        const beginIndex = pureInner.indexOf(his.words);
        const endIndex = beginIndex + his.words.length
        repalceArray.push([beginIndex, endIndex, his.id, his.words])
      }
    })
    repalceArray.sort((a, b) => a[0] - b[0])
    if (repalceArray.length >= 1)
      str += pureInner.slice(0, repalceArray[0][0])
    for (let i = 0; i < repalceArray.length; i++) {
      str += `<Font id="font-${repalceArray[i][2]}" color="${d3.schemeCategory10[0]}">${repalceArray[i][3]}</Font>`
      str += pureInner.slice(repalceArray[i][1], repalceArray[i + 1] ? repalceArray[i + 1][0] : pureInner.length + 1)
    }
    textarea.innerHTML = str;

  }
}
// 为font元素添加高亮效果
const fontAddHighLightEvent = function (id, type) {
  const font = document.getElementById(`font-${id}`)
  // console.log(font, "---")
  if (font && type === "CIRCLE") {
    font.addEventListener("mouseenter", () => highLightCircle(id))
    font.addEventListener("mouseleave", () => disHighLightCircle(id))
    font.addEventListener("focus", () => highLightCircle(id))
  } else if (font && type === "RECT") {
    font.addEventListener("mouseenter", () => highLightRect(id))
    font.addEventListener("mouseleave", () => disHighLightRect(id))
    font.addEventListener("focus", () => highLightRect(id))
  } else if (font && (type === "ARROW" || type === "TEXT")) {
    font.addEventListener("mouseenter", () => highLightArrow(id))
    font.addEventListener("mouseleave", () => disHighLightArrow(id))
    font.addEventListener("focus", () => highLightArrow(id))
  }

}
const highLightItem = (textId, graphId, historyItem) => {
  let isHightLight = false
  return () => {
    if (isHightLight) {
      isHightLight = false
      const textNode = document.getElementById(textId)

    } else {

    }
  }
}
const addHistory = (type, id, pos, words = "", color = "black") => {
  history.value.push({
    operate: type,
    words,
    time: new Date().toLocaleString(),
    id,
    pos,
    // color: type === "RECT" ? "rgba(45,145,225,0.2)" : selectColor,
    // 来一个随机类型
    type: Math.random() > 0.5 ? "SC" : "WR",
    highLight: false,
    labelWords: "",
  })
  // console.log(history, '--history--')
  if (["CIRCLE", "RECT", "ARROW", "TEXT"].includes(type)) {
    highlightText(words, "ADD", id);
    needReSelect = true;
  }
  console.log(history, type, "--type--")
  // 由于每次添加的时候 都会导致 font标签的更新 因而需要重新挂载事件
  history.value.forEach((val) => {
    // console.log(val.id, val.operate, "-----refresh")
    // 给文字注册高亮事件
    fontAddHighLightEvent(val.id, val.operate)
  }
  )
}
// 更新type
function onChangeType(t) {
  if (type.value !== t)
    type.value = t
  else {
    type.value = undefined
  }
}
function onClickColor() {
  colorPicker.value.click()
}
function getFieldSelection(select_field) {
  let word = '';
  if (document.selection) {
    let sel = document.selection.createRange();
    if (sel.text.length > 0) {
      word = sel.text;
    }
  }
  else if (select_field.selectionStart || select_field.selectionStart == '0') {
    let startP = select_field.selectionStart;
    let endP = select_field.selectionEnd;
    if (startP != endP) {
      word = select_field.value.substring(startP, endP);
    }
  }
  return word;
}
// 根据id 删除对应的history item
const removeHistory = (removeId) => {
  const removeIndex = history.value.findIndex(e => e.id === removeId)
  if (removeIndex !== -1) {
    const deleteHis = history.value.splice(removeIndex, 1)[0];
    highlightText(deleteHis.words, 'DELETE');
  }
  // console.log(history, "--remove--")
}



const remove = (_, item) => {
  // 在remove的状态下可以选择svg上的相应图标删除，同时更新history
  if (type.value !== "REMOVE") {
    return;
  }
  //TODO 点击svg时获取svg上的id 把下面的相应id替换
  const delEl = document.getElementById(item.id);
  if (delEl) {
    delEl.remove();
  }
  const index = history.value.findIndex(his => his.id === item.id);
  if (index !== -1) {
    history.value.splice(index, 1);
  }
  highlightText(item.words, 'DELETE');
}
const addCircle = (endX, endY, id, fill = "transparent", stroke = "black") => {
  const delEl = document.getElementById(id)
  const delElBack = document.getElementById(`circleBack-${id}`)
  if (delEl) {
    delEl.remove()
    delElBack.remove()
  }
  const xr = Math.abs(endX - startPos[0]);
  const yr = Math.abs(endY - startPos[1]);
  const r = Math.sqrt(xr * xr + yr * yr) / 2;
  const cx = xr / 2 + endX > startPos[0] ? startPos[0] : endX;
  const cy = yr / 2 + endY > startPos[1] ? startPos[1] : endY;
  const circleHighLight = d3.select(".circleG").append("circle")
  circleHighLight
    .attr('r', r + 10)
    .attr("id", `circleBack-${id}`)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr("opacity", 0)
    .attr("fill", '#11b5cc30')

  const circle = d3.select(".circleG").append('circle')

  circle.attr('id', id)
    .attr('r', r)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', fill)
    .attr('stroke', stroke)
    .attr("stroke-width", 3)
    .on("click", (event) => {
      if (type.value === "DELETE") {
        removeHistory(id)
        circle.remove()
        circleHighLight.remove()
        changeExplainationHighLight(false)
      }
    })
    .on("mouseover", () => {
      // 显示提示框
      highLightCircle(id)
    })
    .on("mouseout", () => {
      // 隐藏提示框
      disHighLightCircle(id)
    });
  // 适应对应的图形
  const [xScale, yScale] = resize("graph", "output-graph")
  // 高亮的回调函数
  d3.select("[id='0']").insert("circle", ":first-child")
  return { cx: cx * xScale, cy: cy * yScale, r: r * xScale };
}
const highLightCircle = function (id) {
  const textId = `font-${id}`
  const graphId = `circleBack-${id}`
  const font = document.getElementById(textId)
  if (font)
    font.style.backgroundColor = '#11b5cc30'
  console.log(textId, graphId, "--")
  const circleBack = document.getElementById(graphId)
  circleBack.setAttribute("opacity", 1)
  const index = history.value.findIndex(e => e.id === id)
  if (index >= 0)
    history.value[index].highLight = true
  changeExplainationHighLight(true)
}

const disHighLightCircle = function (id) {
  const textId = `font-${id}`
  const graphId = `circleBack-${id}`

  const font = document.getElementById(textId)
  if (font)
    font.style.backgroundColor = ''
  console.log(textId, graphId, "--")
  const circleBack = document.getElementById(graphId)
  circleBack.setAttribute("opacity", 0)
  const index = history.value.findIndex(e => e.id === id)
  if (index >= 0)
    history.value[index].highLight = false
  changeExplainationHighLight(false)

}

const addRect = (endX, endY, id, fill = "rgba(45,145,225,0.8)", stroke = "transparent") => {
  const svg = document.querySelector("#graph")
  const delEl = document.getElementById(id)
  const delElBack = document.getElementById(`rectBack-${id}`)
  if (delEl) {
    delEl.remove()
    delElBack.remove()
  }
  const width = Math.abs(endX - startPos[0]);
  const height = document.getElementById("graph").getBoundingClientRect().height - 34

  const rectBack = d3.select(".rectG").append("rect")
  const rect = d3.select(".rectG").append('rect')
  rectBack.attr("id", `rectBack-${id}`)
    .attr('width', width + 20)
    .attr('height', height + 20)
    .attr('x', endX > startPos[0] ? startPos[0] - 10 : endX - 10)
    .attr('y', 0)
    .attr("opacity", 1)
    .attr("fill", "#11b5cc30")

  rect.attr('id', id)
    .attr('width', width)
    .attr('height', height)
    .attr('x', endX > startPos[0] ? startPos[0] : endX)
    .attr('y', 10)
    .attr("fill", fill)
    .attr('stroke', stroke)
    .on("click", (event) => {
      if (type.value === "DELETE") {
        removeHistory(id)
        rect.remove()
        rectBack.remove()
        changeExplainationHighLight(false)
      }
    })
    .on("mouseover", () => {
      // 显示提示框
      highLightRect(id)
    })
    .on("mouseout", () => {
      // 隐藏提示框
      disHighLightRect(id)
    });
  const [xScale, yScale] = resize("graph", "output-graph")
  return {
    x: (endX > startPos[0] ? startPos[0] : endX) * xScale,
    y: 10 * yScale,
    width: width * xScale,
    height: height * yScale,
    id: id,
  }
}
const highLightRect = function (id) {
  const textId = `font-${id}`
  const graphId = `rectBack-${id}`
  const font = document.getElementById(textId)

  if (font)
    font.style.backgroundColor = '#11b5cc30'
  const circleBack = document.getElementById(graphId)
  circleBack.setAttribute("opacity", 1)
  const index = history.value.findIndex(e => e.id === id)
  if (index >= 0)
    history.value[index].highLight = true
  changeExplainationHighLight(true)

}

const disHighLightRect = function (id) {
  const textId = `font-${id}`
  const graphId = `rectBack-${id}`

  const font = document.getElementById(textId)
  if (font)
    font.style.backgroundColor = ''
  const circleBack = document.getElementById(graphId)
  circleBack.setAttribute("opacity", 0)
  const index = history.value.findIndex(e => e.id === id)
  if (index >= 0)
    history.value[index].highLight = false
  changeExplainationHighLight(false)

}


const addArrow = (endX, endY, id, stroke = "rgba(0,0,0,0.5)", isSilppery, isOnHover) => {

  const delEl = document.getElementById(id)
  const delMarker = document.getElementById(`${id}-marker`)
  const delElBack = document.getElementById(`arrowBack-${id}`)
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .context(null);
  if (delEl) {
    delEl.remove()
    delMarker.remove()
    delElBack.remove()
  }
  const { xDirect, yDirect } = getDirection({
    x1: startPos[0],
    y1: startPos[1],
    x2: endX,
    y2: endY,
  })
  // 添加箭头背景
  const arrowBack = d3.select(".arrowG").append("path")
    .attr("id", `arrowBack-${id}`)
    .attr("d", `M ${startPos[0]},${startPos[1]} L ${endX + 10 * xDirect},${endY + 10 * yDirect} `)
    .attr("fill", "#11b5cc30")
    .attr("stroke", "#11b5cc30")
    .attr("opacity", 0)
    .attr("stroke-width", 20)


  // 添加箭头
  const arrow = d3.select(".arrowG").append('path')
    .attr("id", id)
    .attr("d", `M ${startPos[0]},${startPos[1]} L ${endX},${endY} `)
    .attr("stroke", stroke)
    .attr("stroke-width", "2")
    .attr("style", `marker-end: url(#${id}-marker)`)

  if (isOnHover)
    arrow
      .on("click", (event) => {
        if (type.value === "DELETE") {
          removeHistory(id)
          arrowBack.remove()
          arrow.remove();
          marker.remove()
          document.getElementById(`text-${id}`)?.remove()
          changeExplainationHighLight(false)
        }
      })
      .on("mouseover", () => {
        // 显示提示框
        highLightArrow(id)
      })
      .on("mouseout", () => {
        // 隐藏提示框
        disHighLightArrow(id)
      });
  //  是否为曲线
  if (isSilppery) {
    const data = [startPos, [(startPos[0] * 3 + endX) / 4, (startPos[1] * 3 + endY) / 4 - 20],
      // [(startPos[0] * 7 + endX) / 8, (startPos[1] * 7 + endY) / 8 - 10],
      [(startPos[0] + endX) / 2, (startPos[1] + endY) / 2 - 20], [(startPos[0] + endX * 3) / 4, (startPos[1] + endY * 3) / 4 - 20],
      // [(startPos[0] + endX * 7) / 8, (startPos[1] + endY * 7) / 8 - 20],
      [endX, endY]
    ]
    arrow.attr("d", line(data))
      .attr("fill", "transparent")
    arrowBack.attr("d", line(data))
      .attr("fill", "transparent")
  }
  const marker = d3.select(".arrowG").append("marker")
  marker.attr("orient", "auto")
    .attr("id", `${id}-marker`)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "5")
    .attr("markerHeight", "4")
    .attr("fill", stroke)
    .attr("refX", 0)
    .attr("refY", 2)
    .append("path")
    .attr("d", "M 0 0 L 5 2 L 0 4 z")
    .on("contextmenu", (event) => {
      event.preventDefault(); // 防止默认的上下文菜单弹出
    })
  const [xScale, yScale] = resize("graph", "output-graph")
  return {
    startX: startPos[0] * xScale,
    startY: startPos[1] * yScale,
    endX: endX * xScale,
    endY: endY * yScale
  }
}
const highLightArrow = function (id) {
  const textId = `font-${id}`
  const graphId = `arrowBack-${id}`
  const font = document.getElementById(textId)

  if (font)
    font.style.backgroundColor = '#11b5cc30'
  const circleBack = document.getElementById(graphId)
  circleBack.setAttribute("opacity", 1)
  const index = history.value.findIndex(e => e.id === id)
  if (index >= 0)
    history.value[index].highLight = true
  changeExplainationHighLight(true)

}

const disHighLightArrow = function (id) {
  const textId = `font-${id}`
  const graphId = `arrowBack-${id}`

  const font = document.getElementById(textId)
  if (font)
    font.style.backgroundColor = ''
  const circleBack = document.getElementById(graphId)
  circleBack.setAttribute("opacity", 0)
  const index = history.value.findIndex(e => e.id === id)
  if (index >= 0)
    history.value[index].highLight = false
  changeExplainationHighLight(false)
}

// 使用外部标签 来进行 更改svg
const addText = (x1, y1, text, id, length) => {
  console.log(x1, y1, startPos, `translate(${(startPos[0] + x1) / 2} ${(startPos[1] + y1) / 2 - 20})`)
  const svg = document.querySelector("#basicChart svg")
  let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  myforeign.setAttribute("width", "100%");
  myforeign.setAttribute("height", "100%");
  myforeign.setAttribute("transform", `translate(${(startPos[0] + x1) / 2} ${(startPos[1] + y1) / 2 - 40})`)
  myforeign.setAttribute("id", `text-${id}`)
  myforeign.style.textAlign = "left"
  myforeign.style.fontSize = "16px"
  let textdiv = document.createElement("div");
  let textnode = document.createTextNode(text || "Click to edit");
  textdiv.appendChild(textnode);
  textdiv.setAttribute("contentEditable", "true");
  textdiv.setAttribute("width", "auto");
  textdiv.setAttribute("id", id)
  textdiv.style.display = "inline-block"
  textdiv.addEventListener("click", (event) => {
    if (type.value === "DELETE") {
      removeHistory(id)
      myforeign.parentNode.removeChild(myforeign);
      document.getElementById(id).remove()
      changeExplainationHighLight(false)
    }
    event.preventDefault()
  })
  svg.appendChild(myforeign)
  myforeign.appendChild(textdiv);
  myforeign.setAttribute("width", textdiv.offsetWidth);
  myforeign.setAttribute("height", textdiv.offsetHeight);
  // 适应曲线的位置移动偏移量
  myforeign.setAttribute("transform", `translate(${(startPos[0] + x1) / 2 - 0.5 * textdiv.offsetWidth
    + (startPos[1] > y1 ? - 40 : 40)
    } ${(startPos[1] + y1) / 2 - 40})`)
  // myforeign.setAttribute("transform", `translate(${x1 - 0.5 * textdiv.offsetWidth} ${y1})`)

  // text 标注 有对应的labelText
  const onChange = () => {
    const findIndex = history.value.findIndex((e) => e.id === id)
    if (findIndex >= 0)
      history.value[findIndex].labelWords = textdiv.innerText.trim()
    myforeign.setAttribute("width", textdiv.offsetWidth);
    myforeign.setAttribute("height", textdiv.offsetHeight);
  }
  // 监听div中文本node的变化
  addMutation(id, onChange, textdiv)

  return { pos: {}, words: textdiv.innerText }
}

const refRemoveClass = (ref_info, class_name) => {
  ref_info.forEach((element) => {
    element.classList.remove(class_name)
    // let class_name_arr = element.$el
    //   ? element.$el.className.split(" ")
    //   : element.className.split(" ")
    // let index = class_name_arr.findIndex((item) => {
    //   return item == class_name;
    // });
    // if (index !== -1) class_name_arr.splice(index, 1);
    // if (element.$el) {
    //   element.$el.className = class_name_arr.join(" ");
    // } else {
    //   element.className = class_name_arr.join(" ");
    // }
  });
}
const clickTag = (event) => {
  const classList = event.target.classList;
  type.value = event.target.dataset.key;
  refRemoveClass(itemRefs, "no-opacity")
  classList.add("no-opacity");
}

// 文件上传逻辑
const upload = () => {
  const file = document.getElementById("file-input")
  file.click();
}
const selectedFiles = ref([])
const onFileChange = (event) => {
  selectedFiles.value.push(...event.target.files)
  // 清空已经选中的文件
  const fileInput = document.getElementById("file-input")
  fileInput.value = ""
  ChangeSvgBack(selectedFiles.value[selectImage.value], document.querySelector('#graph #image'))

}
// 背景图片切换逻辑
let selectImage = ref(0)
const onChangeSelectedImage = (index) => {
  selectImage.value = index
  // 更新背景图片
  ChangeSvgBack(selectedFiles.value[selectImage.value], document.querySelector('#graph #image'))
}
const ChangeSvgBack = (file, svgImage) => {
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    const imageData = reader.result;
    svgImage.setAttribute('href', imageData);
    emit("changeBackGround", file)
  });

  reader.readAsDataURL(file);
}
// item控制面板的逻辑
let visible = true
const onContextMenu = (event) => {
  const modal = document.getElementById("modal")
  modal.style.left = event.clientX
  modal.style.top = event.clientY

}
let resize = (pastId, nowId) => {
  const past = document.getElementById(pastId).getBoundingClientRect()
  const now = document.getElementById(nowId).getBoundingClientRect()
  return [now.width / past.width, now.height / past.height]
}
const changeExplainationHighLight = (val) => {
  const ele = document.getElementById("content-explanation")
  if (val) {
    ele.classList.add("isHighLight")
  } else {
    ele.classList.remove("isHighLight")
  }
}
</script>
<style lang="scss" scoped>
p {
  margin-top: 0;
  margin-bottom: 0;
}

button {
  padding: 3px 10px;
  border-color: #11b5cccf #11B5CC #11B5CC #11b5cccf;
}

.input-container {
  height: 100%;
  width: 100%;
  padding-top: 2vh;
  padding-left: 3vw;
  padding-right: 3vw;
  // box-sizing: content-box;
}

#select {
  height: 50%;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 20px;

  .title {
    color: white !important;
    height: 15%;
    font-weight: 500;
    font-size: 3.6vh;
  }



  .textarea {
    width: 100%;
    height: 85%;
    margin: 0 auto;
    padding: 3px;
    outline: 0;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    word-wrap: break-word;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #303030;
    _overflow-y: visible;
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
    color: white !important;
    height: 15%;
    font-weight: 500;
    font-size: 3.6vh;
    display: flex;

    // padding-bottom: 2px;
    p {}

    button {
      font-size: 2vh;
      background-color: black;
      max-height: 80%;
      margin-left: 2%;
      // border-color: aquamarine;
      cursor: pointer;
    }
  }

  #basicChart {
    width: 100%;
    height: 85%;
    // border: 1px solid gray;
    display: flex;
    background-color: white;
    // padding: 10px;


    .isSelect {
      opacity: 0.5;
    }

    #content {
      width: 85%;
      height: 100%;

      #spanArray {
        display: flex;
        width: 100%;
        height: 10%;
        align-items: center;
        justify-content: center;
        flex-direction: row;


        .isActive {
          opacity: 0.5;
        }

        span {
          width: 20px;
          height: 4px;
          margin-left: 4px;
          margin-right: 4px;
          background-color: gray;
          cursor: pointer;
        }
      }

      #graph {
        display: block;
        width: 100%;
        height: 85%;

      }
    }

    #tool {
      width: 15%;
      height: 100%;
      display: flex;
      flex-direction: column;
      // align-items: center
      align-content: center;
      position: relative;
      padding-top: 20px;

      input[type="color"] {
        // display: none;
        position: absolute;
        left: 10px;
        top: 20px;
        z-index: -10;
      }

      p {
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 0;
        width: 100%;
      }

      #category {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        // border: 2px solid black;
        margin-left: 20%;
        margin-right: 20%;

        svg {
          width: 25px;
          height: 25px;
          margin-left: calc(50% - 12.5px);
          margin-right: calc(50% - 12.5px);
          margin-top: 6px;
          margin-bottom: 6px;
          // margin: 12px 6px 12px 6px;
          // width: 40%;
          box-sizing: border-box;
          cursor: pointer;
        }
      }

      #style {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        border: 2px solid black;

        svg {
          margin: 12px 6px 12px 6px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>