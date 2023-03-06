
<template>
  <div class="input-layout">
    <a-textarea id="textarea" ref="textarea" v-model:value="value" placeholder="输入分析语句" :rows="4" />
    <section class="basic-layout">
      <div id="basicChart"></div>
      <div class="tag-layout" @click="clickTag">
        <a-tag v-for="item in tags" :key="item.name" :data-key="item.key" class="tag-item" :color="item.color">
          {{ item.name }}
        </a-tag>
      </div>
    </section>
    <section class="history-layout">
      <div class="card" v-for="item in history">
        <a-card :title="item.operate">
          <template #extra><a-button type="link" @click="remove($event, item)">remove</a-button></template>
          <div>words: {{ item.words }}</div>
          <div>time: {{ item.time }}</div>
        </a-card>
      </div>

    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import LineChartData from "../../assets/data.json"
import { LineChart } from '../../js/LineChart';
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
let svg = null, svgConfig = {}, isDraw = true, type = "", currentId = 0;
const colorArrow = "#264653";
const startPos = [];
const history = ref([]);
onMounted(() => {
  const chart = LineChart(LineChartData.data, "#basicChart", {
    x: d => new Date(d.date),
    y: d => d.value,
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
    const selectedWord = getFieldSelection(document.getElementById('textarea'));
    if (type === 'RECT') {
      addRect(x1, y1, currentId);
      addHistory(type, currentId, selectedWord)
    } else if (type === 'CIRCLE') {
      addCircle(x1, y1, currentId);
      addHistory(type, currentId, selectedWord);
    } else if (type === 'ARROW') {
      addArrow(x1, y1, currentId);
      addHistory(type, currentId, selectedWord);
    }
    isDraw = true
    currentId += 1
  })
})
const addHistory = (type, id, words = "empty") => {
  history.value.push({
    operate: type,
    words,
    time: new Date().toLocaleString(),
    id,
  })
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
  const delEl = document.getElementById(item.id);
  if (delEl) {
    delEl.remove();
  }
  const index = history.value.findIndex(his => his.id === item.id);
  if (index !== -1) {
    history.value.splice(index, 1);
  }
}
const addCircle = (endX, endY, id, fill = "transparent", stroke = "black") => {
  const delEl = document.getElementById(id)
  if (delEl) {
    delEl.remove()
  }
  const xr = Math.abs(endX - startPos[0]);
  const yr = Math.abs(endY - startPos[1]);
  const r = Math.sqrt(xr * xr + yr * yr) / 2;
  d3.select(".circleG").append('circle')
    .attr('id', id)
    .attr('r', r)
    .attr('cx', xr / 2 + endX > startPos[0] ? startPos[0] : endX)
    .attr('cy', yr / 2 + endY > startPos[1] ? startPos[1] : endY)
    .attr('fill', fill)
    .attr('stroke', stroke);
}
const addRect = (endX, endY, id, fill = "#fffb8f", stroke = "transparent") => {
  const delEl = document.getElementById(id)
  if (delEl) {
    delEl.remove()
  }
  const width = Math.abs(endX - startPos[0]);
  const height = Math.abs(endY - startPos[1]);
  // const r = Math.sqrt(xr * xr + yr * yr) / 2;
  d3.select(".rectG").append('rect')
    .attr('id', id)
    .attr('width', width)
    .attr('height', height)
    .attr('x', endX > startPos[0] ? startPos[0] : endX)
    .attr('y', endY > startPos[1] ? startPos[1] : endY)
    .attr("fill", fill)
    .attr('stroke', stroke);
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
}
const clickTag = (event) => {
  const classList = event.target.classList;
  type = event.target.dataset.key;
  if (classList.contains("no-opacity")) {
    classList.remove("no-opacity");
  } else {
    event.target.classList.add("no-opacity");
  }

}

</script>
<style lang="scss" scoped>
.input-layout {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}

.basic-layout {
  display: flex;
}

.tag-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.tag-item {
  cursor: pointer;
  opacity: 0.4;
}

.no-opacity {
  opacity: 1;
}

.history-layout {
  display: flex;
  flex-wrap: wrap;

  .card {
    width: 33%;
  }
}
</style>