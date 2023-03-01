<!--  -->
<template>
  <div id="demoChart1"></div>
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
const addRect = () => {
  const rect = svg
    .append("g")
    .attr("class", "rectG");
    rect
    .append("rect")
    .attr("width", svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-05")))
    .attr("height", 350)
    .attr("x", svgConfig.xScale(new Date("2023-01-05")))
    .attr("y", svgConfig.yScale(26))
    .attr("fill", "#efd96f")
    .transition()
    .duration(2000)
    .attr("opacity", 0.6)
    .transition()
    .duration(2000)
    .attr("width", svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-08")))
    .attr("x", svgConfig.xScale(new Date("2023-01-08")))
    rect.append("text")
    .text("5% HIGHER THAN JUNE")
    .attr("x", svgConfig.xScale(new Date("2023-01-05"))+45)
    .attr("y", svgConfig.yScale(26))
    // .attr("transform", `translate(${svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-05"))},${svgConfig.yScale(26)})`)
    .attr("font-size",20)
    .attr("stroke","#b0030a")
    .attr("opacity",0)
    .transition()
    .duration(2000)
    .attr("opacity",1)
    .transition()
    .duration(2000)
    .attr("x", svgConfig.xScale(new Date("2023-01-08"))-45)
    .attr("y", svgConfig.yScale(26))
    .text("7% HIGHER THAN OCTPBER")
    // .attr("transform", `translate(${svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-08"))},${svgConfig.yScale(26)})`)
}
onMounted(() => {
  svg = LineChart(LineChartData.data, "#demoChart1", {
    x: d => new Date(d.date),
    y: d => d.value,
  });
  addRect();

})
</script>
<style scoped></style>