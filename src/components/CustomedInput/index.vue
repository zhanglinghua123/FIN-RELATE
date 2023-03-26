
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
        <button @click="upload">Input</button>
        <button>Generation</button>
      </div>
      <div id="basicChart">
        <div id="content">
          <div id="spanArray">
            <!-- 可以动态绑定class 但是不能动态计算样式 -->
            <span v-for="(file, index) in selectedFiles" :class="{
              isActive: selectImage === index
            }" @click="onChangeSelectedImage(index)"></span>
          </div>
          <svg id="graph"></svg>
        </div>
        <div id="tool">
          <p>Annotation</p>
          <div id="category">
            <svg @click='e => onChangeType("CIRCLE")' v-bind:class="{
              isSelect: type === 'CIRCLE'
            }" width="25" height="25" view-box="0 0 25 25">
              <circle cx="50%" cy="50%" r="10" fill="white" stroke="black" stroke-width="4">
              </circle>
            </svg>
            <svg @click='e => onChangeType("RECT")' :class="{
              isSelect: type === 'RECT'
            }" width="25" height="25" view-box="0 0 25 25">
              <rect x="0" y="0" width="25" height="25" stroke="black" stroke-width="8" fill="gray"></rect>
            </svg>
            <svg @click='e => onChangeType("TEXT")' :class="{
              isSelect: type === 'TEXT'
            }" width="25" height="25" view-box="0 0 25 25">
              <defs>
                <marker id="triangle" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2"
                  orient="auto">
                  <path d="M 0 0 L 5 2 L 0 4 z" />
                </marker>
              </defs>
              <text x="12" y="12">A</text>
              <path d="M 2,2 L 18,18" stroke="black" stroke-width="2" fill="none" style="marker-end: url(#triangle);" />
            </svg>
            <svg @click='e => onChangeType("ARROW")' :class="{
              isSelect: type === 'ARROW'
            }" width="25" height="25" view-box="0 0 25 25">
              <defs>
                <marker id="triangle" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2"
                  orient="auto">
                  <path d="M 0 0 L 5 2 L 0 4 z" />
                </marker>
              </defs>
              <path d="M 2,2 L 18,18" stroke="black" stroke-width="2" fill="none" style="marker-end: url(#triangle);" />
            </svg>
          </div>
          <div id="edit-choice">
            <p>Styles</p>
            <div id="style" :style="{
              position: 'relative',
            }">
              <svg width="25" height="25" @click="onClickColor">
                <path d="M 12.5 25 A 12.5 12.5 0 0 1 12.5 0" fill="red" stroke="transparent" />
                <path d="M 12.5 25 A 12.5 12.5 0 0 0 12.5 0" fill="green" stroke="transparent" />
              </svg>
              <input type="color" v-model="selectColor" ref="colorPicker" />
              <svg width="25" height="25" view-box="0 0 25 25">
                <line x1="0" y1="2" x2="25" y2="2" stroke="black" stroke-width="1"></line>
                <line x1="0" y1="6" x2="25" y2="6" stroke="black" stroke-width="2"></line>
                <line x1="0" y1="10" x2="25" y2="10" stroke="black" stroke-width="3"></line>
                <line x1="0" y1="16" x2="25" y2="16" stroke="black" stroke-width="4"></line>
                <line x1="0" y1="22" x2="25" y2="22" stroke="black" stroke-width="5"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import { getCurrentInstance, ref, onMounted, defineComponent } from 'vue'
import { message } from 'ant-design-vue';
import * as d3 from "d3";
import { addMutation, removeMutation } from "../../js/mutation"
import { getDirection } from '../../js/getDirection';
const emit = defineEmits(['changeText', "changeBackGround"])


// 在 setup形势下面 只有setup才能实时的获取变量的值
let svg = null, configPosition = { left: 0, top: 0 }, isDraw = true, type = ref(""),
  currentId = 0, selectedWord = '', needReSelect = false, selectColor = "black", colorPicker = ref();

const startPos = [], cardBodyStyle = { backgroundColor: "#cccccc" };
// 将 history 修改为 全局变量
const { proxy } = getCurrentInstance()
const history = proxy.$history
const selectWords = (e) => {
  // 获取用户当前选中的文本
  let tmp = window.getSelection().toString();
  if (["CIRCLE", "RECT", "ARROW"].includes(type.value)) {
    needReSelect = false;
    selectedWord = tmp;
  } else if (!["TEXT"].includes(type.value)) {
    selectedWord = "";
    message.error("请先选择可视化类型再选中！")
  }
}
onMounted(() => {
  // 新建背景图片
  const svg = d3.select("#graph")
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
    .attr("preserveAspectRatio", "slice")
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
        addRect(x1, y1, currentId, selectColor);
      } else if (type.value === 'CIRCLE') {
        addCircle(x1, y1, currentId, "transparent", selectColor);
      } else if (type.value === 'ARROW') {
        addArrow(x1, y1, currentId, selectColor);
      } else if (type.value === "TEXT") {
        addArrow(x1, y1, currentId, selectColor);
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
        const pos = addRect(x1, y1, currentId, selectColor);
        addHistory(type.value, currentId, pos, selectedWord, selectColor);
      } else if (type.value === 'CIRCLE') {
        const pos = addCircle(x1, y1, currentId, "transparent", selectColor);
        addHistory(type.value, currentId, pos, selectedWord, selectColor);
      } else if (type.value === 'ARROW') {
        const pos = addArrow(x1, y1, currentId, selectColor);
        addHistory(type.value, currentId, pos, selectedWord, selectColor);
      } else if (type.value === "TEXT") {
        const pos = addArrow(x1, y1, currentId, selectColor)
        const direction = getDirection({ x1: startPos[0], y1: startPos[1], x2: x1, y2: y1 })
        const { _, words } = addText(startPos[0] - 5 * direction.xDirect, startPos[1] - 5 * direction.yDirect, "", currentId, history.value.length)
        addHistory(type.value, currentId, pos, words, selectColor)
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
  if (words.length && (method === 'DELETE' || !needReSelect)) {
    const textarea = document.getElementById("textarea");
    const inner = textarea.innerHTML.toString();
    let pureInner = labelString(inner);
    let str = '';
    let colorCnt = 0;
    history.value.forEach((his) => {
      if (his.words.length) {
        const index = pureInner.indexOf(his.words);
        str = `${str}${pureInner.slice(0, index)}<Font color="${d3.schemeCategory10[colorCnt++]}">${his.words}</Font>`;
        pureInner = pureInner.slice(index + his.words.length);
      }
    })
    str = str + pureInner;
    textarea.innerHTML = str;
    emit("changeText", str);
  }
}
const addHistory = (type, id, pos, words = "", color = "black") => {
  history.value.push({
    operate: type,
    words,
    time: new Date().toLocaleString(),
    id,
    pos,
    color
  })
  if (["CIRCLE", "RECT", "ARROW"].includes(type)) {
    highlightText(words);
    needReSelect = true;
  }
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
  if (delEl) {
    delEl.remove()
  }
  const xr = Math.abs(endX - startPos[0]);
  const yr = Math.abs(endY - startPos[1]);
  const r = Math.sqrt(xr * xr + yr * yr) / 2;
  const cx = xr / 2 + endX > startPos[0] ? startPos[0] : endX;
  const cy = yr / 2 + endY > startPos[1] ? startPos[1] : endY;
  const circle = d3.select(".circleG").append('circle')

  circle.attr('id', id)
    .attr('r', r)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', fill)
    .attr('stroke', stroke)
    .on("contextmenu", (event) => {
      removeHistory(id)
      circle.remove()
      event.preventDefault(); // 防止默认的上下文菜单弹出
    })
  const [xScale, yScale] = resize("graph", "output-graph")
  return { cx: cx * xScale, cy: cy * yScale, r: r * xScale };
}
const addRect = (endX, endY, id, fill = "#fffb8f", stroke = "transparent") => {
  const svg = document.querySelector("#graph")
  const delEl = document.getElementById(id)
  if (delEl) {
    delEl.remove()
  }
  const width = Math.abs(endX - startPos[0]);
  const height = Math.abs(endY - startPos[1]);

  const rect = d3.select(".rectG").append('rect')

  rect.attr('id', id)
    .attr('width', width)
    .attr('height', height)
    .attr('x', endX > startPos[0] ? startPos[0] : endX)
    .attr('y', endY > startPos[1] ? startPos[1] : endY)
    .attr("fill", fill)
    .attr('stroke', stroke)
    .on("contextmenu", (event) => {
      event.preventDefault(); // 防止默认的上下文菜单弹出
      removeHistory(currentId)
      rect.remove()
    })
  const [xScale, yScale] = resize("graph", "output-graph")
  return {
    x: (endX > startPos[0] ? startPos[0] : endX) * xScale,
    y: 0,
    width: width * xScale,
    height: svg.getBoundingClientRect().height * yScale,
    id: id,
  }
}
const addArrow = (endX, endY, id, stroke = "rgba(0,0,0,0.5)") => {

  const delEl = document.getElementById(id)
  const delMarker = document.getElementById(`${id}-marker`)
  if (delEl) {
    delEl.remove()
    delMarker.remove()
  }
  // 添加箭头
  const arrow = d3.select(".arrowG").append('path')
    .attr("id", id)
    .attr("d", `M ${startPos[0]},${startPos[1]} L ${endX},${endY}`)
    .attr("stroke", stroke)
    .attr("stroke-width", "2")
    .attr("style", `marker-end: url(#${id}-marker)`)
    .on("contextmenu", (event) => {
      removeHistory(id)
      arrow.remove();
      marker.remove()
      document.getElementById(id).remove()
      event.preventDefault(); // 防止默认的上下文菜单弹出
    })
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
// 使用外部标签 来进行 更改svg
const addText = (x1, y1, text, id, length) => {
  const svg = document.querySelector("#basicChart svg")
  let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  myforeign.setAttribute("width", "100%");
  myforeign.setAttribute("height", "100%");
  myforeign.setAttribute("transform", `translate(${x1} ${y1})`)
  myforeign.style.textAlign = "left"
  myforeign.style.fontSize = "16px"
  let textdiv = document.createElement("div");
  let textnode = document.createTextNode(text || "Click to edit");
  textdiv.appendChild(textnode);
  textdiv.setAttribute("contentEditable", "true");
  textdiv.setAttribute("width", "auto");
  textdiv.setAttribute("id", id)
  textdiv.style.display = "inline-block"
  textdiv.addEventListener("contextmenu", (event) => {
    event.preventDefault()
    removeHistory(id)
    myforeign.parentNode.removeChild(myforeign);
    document.getElementById(id).remove()
  })
  svg.appendChild(myforeign)
  myforeign.appendChild(textdiv);
  myforeign.setAttribute("width", textdiv.offsetWidth);
  myforeign.setAttribute("height", textdiv.offsetHeight);
  myforeign.setAttribute("transform", `translate(${x1 - 0.5 * textdiv.offsetWidth} ${y1})`)

  const onChange = () => {
    const findIndex = history.value.findIndex((e) => e.id === id)
    history.value[findIndex].words = textdiv.innerText
    myforeign.setAttribute("width", textdiv.offsetWidth);
    myforeign.setAttribute("height", textdiv.offsetHeight);
  }
  // addMutation(id, onChange, textdiv)

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
</script>
<style lang="scss" scoped>
.input-container {
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

  .title {
    color: white !important;
    height: 10%;
    font-weight: 500;
    font-size: 3vh;
    margin-bottom: 5px;

  }



  .textarea {
    width: 100%;
    height: 90%;
    margin: 0 auto;
    padding: 3px;
    outline: 0;
    // border: 1px solid gray;
    font-size: 12px;
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
    height: 10%;
    font-weight: 500;
    font-size: 3vh;
    display: flex;
    padding-bottom: 2px;

    p {
      margin-bottom: 5px;
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
    display: flex;
    background-color: white;
    padding: 10px;

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
      position: relative;

      input[type="color"] {
        // display: none;
        position: absolute;
        left: 10px;
        top: 20px;
        z-index: -10;
      }



      p {
        text-align: center;
        font-size: 16px;
        margin-bottom: 0;
        width: 100%;
      }

      #category {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        border: 2px solid black;

        svg {
          margin: 12px 6px 12px 6px;
          // width: 50%;
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