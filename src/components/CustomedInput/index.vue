
<template>
  <div>
    <div class="input-layout">
      <!-- <div id="textarea" ref="textarea" contenteditable="true">物品</div> -->
      <!-- <a-textarea id="textarea" ref="textarea" v-model:value="value" placeholder="输入分析语句" :rows="4" /> -->
      <section class="basic-layout">
        <div id="basicChart"></div>
      </section>
    </div>
    <div id="select">
      <div id="textarea" contenteditable="true" class="textarea" @mouseup="selectWords"></div>
      <div class="tag-layout" @click="clickTag">
        <a-tag v-for="item in tags" :key="item.name" :data-key="item.key" class="tag-item" :ref="setItemRef"
          :color="item.color">
          {{ item.name }}
        </a-tag>
      </div>
    </div>
    <div id="select-card">
      <div class="card" v-for="item in history">
        <a-card :title="item.operate">
          <template #extra><a-button type="link" @click="remove($event, item)">remove</a-button></template>
          <div>words: {{ item.words }}</div>
          <div>time: {{ item.time }}</div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LineChart } from '../../js/LineChart';
import LineChartData from "../../assets/data.json"
import { getCurrentInstance, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import * as d3 from "d3";
const tags = [
  {
    name: "圆",
    color: "pink",
    key: "CIRCLE"
  },
  {
    name: "矩形高亮",
    color: "green",
    key: "RECT"
  },
  {
    name: "箭头",
    color: "yellow",
    key: "ARROW"
  },
];
let svg = null, svgConfig = {}, isDraw = true, type = "", currentId = 0, selectedWord = '', needReSelect = false;
const colorArrow = "#264653";
const startPos = [];
// 将 history 修改为 全局变量
const { proxy } = getCurrentInstance()
const history = proxy.$history
const itemRefs = []
const setItemRef = el => {
  if (el) {
    itemRefs.push(el)
  }
}
const selectWords = (e) => {
  let tmp = window.getSelection().toString();
  if (["CIRCLE", "RECT", "ARROW"].includes(type)) {
    needReSelect = false;
    selectedWord = tmp;
  } else {
    selectedWord = "";
    message.error("请先选择可视化类型再选中！")
  }
}
onMounted(() => {
  const basicChart = document.getElementById("basicChart")
  console.log(basicChart.getBoundingClientRect().height, "----")
  const chart = LineChart(LineChartData.data, "#basicChart", {
    x: d => new Date(d.date),
    y: d => d.value,
    width: basicChart.getBoundingClientRect().width,
    height: basicChart.getBoundingClientRect().height,
  });
  ({ svg, svgConfig } = chart);
  //把同一种类型放一起，方便管理
  svg.append("g").attr("class", "circleG");
  // 插入到白色背景元素的前面
  svg.insert("g", ":nth-child(2)").attr("class", "rectG");
  svg.append("g").attr("class", "arrowG");

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
    if (!isDraw) {
      if (type === 'RECT') {
        addRect(x1, y1, currentId);
      } else if (type === 'CIRCLE') {
        addCircle(x1, y1, currentId);
      } else if (type === 'ARROW') {
        addArrow(x1, y1, currentId);
      }
    }
  })
  svg.on("mouseup", e => {
    const x1 = e.offsetX;
    const y1 = e.offsetY;
    if (type === 'RECT') {
      const pos = addRect(x1, y1, currentId);
      addHistory(type, currentId, pos, selectedWord);
    } else if (type === 'CIRCLE') {
      const pos = addCircle(x1, y1, currentId);
      addHistory(type, currentId, pos, selectedWord);
    } else if (type === 'ARROW') {
      const pos = addArrow(x1, y1, currentId);
      addHistory(type, currentId, pos, selectedWord);
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
  }
}
const addHistory = (type, id, pos, words = "") => {
  history.value.push({
    operate: type,
    words,
    time: new Date().toLocaleString(),
    id,
    pos,
  })
  highlightText(words);
  needReSelect = true;
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
const remove = (_, item) => {
  console.log(item);
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
  d3.select(".circleG").append('circle')
    .attr('id', id)
    .attr('r', r)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', fill)
    .attr('stroke', stroke);
  return { cx, cy, r };
}
const addRect = (endX, endY, id, fill = "#fffb8f", stroke = "transparent") => {
  const delEl = document.getElementById(id)
  if (delEl) {
    delEl.remove()
  }
  const width = Math.abs(endX - startPos[0]);
  const height = Math.abs(endY - startPos[1]);

  d3.select(".rectG").append('rect')
    .attr('id', id)
    .attr('width', width)
    .attr('height', height)
    .attr('x', endX > startPos[0] ? startPos[0] : endX)
    .attr('y', endY > startPos[1] ? startPos[1] : endY)
    .attr("fill", fill)
    .attr('stroke', stroke);
  const basicChart = document.getElementById("basicChart")

  return {
    x: endX > startPos[0] ? startPos[0] : endX,
    y: 20,
    width,
    height: basicChart.getBoundingClientRect().height - 50,
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
  console.log(startPos[0], startPos[1], endX, endY);
  const arrow = d3.select(".arrowG").append('path')
    .attr("id", id)
    .attr("d", `M ${startPos[0]},${startPos[1]} L ${endX},${endY}`)
    .attr("stroke", stroke)
    .attr("stroke-width", "2")
    .attr("style", `marker-end: url(#${id}-marker)`)

  d3.select(".arrowG").append("marker")
    .attr("orient", "auto")
    .attr("id", `${id}-marker`)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "5")
    .attr("markerHeight", "4")
    .attr("refX", 0)
    .attr("refY", 2)
    .append("path")
    .attr("d", "M 0 0 L 5 2 L 0 4 z")
  return {
    startX: startPos[0],
    startY: startPos[1],
    endX,
    endY
  }
}
const refRemoveClass = (ref_info, class_name) => {
  ref_info.forEach((element) => {
    // 区分是否为组件内，使用需要用 $el
    let class_name_arr = element.$el
      ? element.$el.className.split(" ")
      : element.className.split(" ");
    let index = class_name_arr.findIndex((item) => {
      return item == class_name;
    });
    if (index !== -1) class_name_arr.splice(index, 1);
    if (element.$el) {
      element.$el.className = class_name_arr.join(" ");
    } else {
      element.className = class_name_arr.join(" ");
    }
  });
}
const clickTag = (event) => {
  console.log(document.getElementById("textarea").innerHTML)
  const classList = event.target.classList;
  type = event.target.dataset.key;
  refRemoveClass(itemRefs, "no-opacity")
  classList.add("no-opacity");

}

</script>
<style lang="scss" scoped>
#select {
  margin-top: 20px;
  display: flex;

  .textarea {
    width: calc(100% - 100px);
    min-height: 120px;
    max-height: 300px;
    _height: 120px;
    padding: 3px;
    outline: 0;
    border: 1px solid #a0b3d6;
    font-size: 12px;
    word-wrap: break-word;
    overflow-x: hidden;
    overflow-y: auto;
    _overflow-y: visible;
  }
}

#select-card {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .card {
    width: 33%;
  }
}

.input-layout {
  display: flex;
  // justify-content: space-evenly;
  flex-direction: column;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  min-height: 60vh;
  padding: 20px;
  box-sizing: border-box;

  #basicChart {
    width: 100%;
    height: calc(60vh - 40px);
  }
}

.basic-layout {
  display: flex;
}

.card {
  width: 33%;
  background-color: rgba(0, 0, 0, 0.1);
}

.tag-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  margin-left: 20px;
}

.tag-item {
  cursor: pointer;
  opacity: 0.4;
}

.no-opacity {
  opacity: 1;
}



#basicChart {
  width: 100%;
}
</style>