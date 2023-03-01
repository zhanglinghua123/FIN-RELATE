<!--  -->
<template>
  <div id="demoChart2"></div>
</template>

<script setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import LineChartData from "@/assets/data.json"
import * as d3 from "d3";
let svg = null;
let svgConfig = {};

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
const addArrow = (index,to,text,needDis) => {
  // let index = 0;
  const colorArrow = "#264653";
  const pos = svgConfig.X.map((d, index) => [svgConfig.xScale(d), svgConfig.yScale(svgConfig.Y[index])]);
  const i0 = Math.max(index - 1, 0),
    i2 = Math.min(to??(index + 1), pos.length - 1),
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
    .attr("class", "arrowG");
    arrow
    .transition()
    .duration(2000)
    .attr("opacity",1)
    .attr('stroke', colorArrow)
    .attr('stroke-width', 2)
    .attr(
      'transform',
      `rotate(${teta}) translate(0 ${headSize * 3}) rotate(${-teta})`
    )
    .transition()
    .duration(2000)
    .attr("opacity",needDis?0:1)

  arrow
  .append("text")
  .text(text)
  .attr('transform', `translate(${(x2+x)/2-60} ${(y2+y)/2})`);
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
onMounted(() => {
  svg = LineChart(LineChartData.data, "#demoChart2", {
    x: d => new Date(d.date),
    y: d => d.value,
  });
  addArrow(5,7,"30%",true);
  setTimeout(()=>addArrow(8,10,"80%",false),2000);
  // addArrow(8,10);

})
</script>
<style scoped>

</style>