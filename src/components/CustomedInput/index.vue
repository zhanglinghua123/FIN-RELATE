
<template>
  <div class="input-layout">
    <section>
      <a-textarea v-model:value="value" placeholder="输入分析语句" :rows="4" />
      <div class="basic-layout">
        <div id="basicChart"></div>
        <div class="tag-layout" @click="clickTag">
          <a-tag v-for="(item, index) in tags" :key="item.name" :data-index="index" class="tag-item" :color="item.color">
            {{ item.name }}
          </a-tag>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import LineChartData from "../../assets/data.json"
import * as d3 from "d3";
const tags = [
  {
    name: "圆",
    color: "pink",
  },
  {
    name: "矩形高亮",
    color: "green",
  },
  {
    name: "箭头",
    color: "yellow",
  },
];
let svg = null;
let svgConfig = {};
const colorArrow = "#264653";

function LineChart(data, id, {
  x = ([x]) => x,
  y = ([, y]) => y,
  defined,
  curve = d3.curveLinear,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40,
  width = 640,
  height = 400,
  xType = d3.scaleUtc,
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear,
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat,
  yLabel,
  color = "currentColor",
  strokeLinecap = "round",
  strokeLinejoin = "round",
  strokeWidth = 1.5,
  strokeOpacity = 1,
} = {}) {
  const X = d3.map(data, x);
  svgConfig.X = X;
  const Y = d3.map(data, y);
  svgConfig.Y = Y;
  const I = d3.range(X.length);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  const xScale = xType(xDomain, xRange);
  svgConfig.xScale = xScale;
  const yScale = yType(yDomain, yRange);
  svgConfig.yScale = yScale;
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  const line = d3.line()
    .defined(i => D[i])
    .curve(curve)
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]));

  const svg = d3.select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(yLabel));

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-opacity", strokeOpacity)
    .attr("d", line(I));

  return svg;
}
onMounted(() => {
  svg = LineChart(LineChartData.data, "#basicChart", {
    x: d => new Date(d.date),
    y: d => d.value,
  });
})
const removeCircle = () => {
  d3.select(".circleG").remove();
}
const addCircle = () => {
  svg
    .append("g")
    .attr("class", "circleG")
    .append("circle")
    .attr("r", 10)
    .attr("cx", svgConfig.xScale(new Date("2023-01-05")))
    .attr("cy", svgConfig.yScale(26))
    .attr("fill", "transparent")
    .attr("stroke", "black");
}
const removeRect = () => {
  d3.select(".rectG").remove();
}
const addRect = () => {
  svg
    .append("g")
    .attr("class", "rectG")
    .append("rect")
    .attr("width", svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-08")))
    .attr("height", 350)
    .attr("x", svgConfig.xScale(new Date("2023-01-08")))
    .attr("y", svgConfig.yScale(26))
    .attr("fill", "green")
    .attr("opacity", 0.6);
}
const removeArrow = () => {
  d3.select(".arrowG").remove();
}
const addArrow = (index) => {
  // let index = 0;
  const pos = svgConfig.X.map((d, index) => [svgConfig.xScale(d), svgConfig.yScale(svgConfig.Y[index])]);
  const i0 = Math.max(index - 1, 0),
    i2 = Math.min(index + 1, pos.length - 1),
    [x, y] = pos[index],
    [x1, y1] = pos[i0],
    [x2, y2] = pos[i2],
    teta = Math.atan2(y2 - y, x2 - x),
    tetaDeg = (teta * 360) / (2 * Math.PI),
    headSize = 10;

  const line = d3
    .line()
    .curve(d3.curveCatmullRom)
    .context(null);

  const arrow = svg
    .append('g')
    .attr("class", "arrowG")
    .attr('stroke', colorArrow)
    .attr('stroke-width', 2)
    .attr(
      'transform',
      `rotate(${teta}) translate(0 ${headSize * 3}) rotate(${-teta})`
    );

  arrow
    .append('path')
    .attr('fill', 'none')
    .attr('d', line(pos.slice(i0, i2 + 1)));

  const arrowHead = arrow
    .append('g')
    .attr('transform', `translate(${x2} ${y2}) rotate(${tetaDeg}) `);

  arrowHead
    .append('line')
    .attr('x1', -headSize)
    .attr('x2', 0)
    .attr('y1', +headSize / 2)
    .attr('y2', 0);

  arrowHead
    .append('line')
    .attr('x1', -headSize)
    .attr('x2', 0)
    .attr('y1', -headSize / 2)
    .attr('y2', 0);

}
const clickTag = (event, d) => {
  const classList = event.target.classList;
  const index = event.target.dataset.index;
  if (classList.contains("no-opacity")) {
    classList.remove("no-opacity");
    if (index === "0") {
      removeCircle();
    } else if (index === "1") {
      removeRect();
    } else if (index === "2") {
      removeArrow();
    }
  } else {
    event.target.classList.add("no-opacity");
    if (index === "0") {
      addCircle();
    } else if (index === "1") {
      addRect();
    } else if (index === "2") {
      addArrow(1);
    }
  }

}

</script>
<style scoped>
.input-layout{
  display: flex;
  justify-content: space-evenly;
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
</style>