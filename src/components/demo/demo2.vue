<!--  -->
<template>
  <div id="d3"></div>
</template>

<script setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import LineChartData from "@/assets/data.json"
import { LineChart } from '../../js/LineChart';
import * as d3 from "d3";

const colorArrow = "#264653";
const addArrow = (index, to, text, needDis, chart) => {
  const { svg, svgConfig } = chart;
  // let index = 0;
  const pos = svgConfig.X.map((d, index) => [svgConfig.xScale(d), svgConfig.yScale(svgConfig.Y[index])]);
  const i0 = Math.max(index - 1, 0),
    i2 = Math.min(to ?? (index + 1), pos.length - 1),
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
    .attr("opacity", 1)
    .attr('stroke', colorArrow)
    .attr('stroke-width', 2)
    .attr(
      'transform',
      `rotate(${teta}) translate(0 ${headSize * 3}) rotate(${-teta})`
    )
    .transition()
    .duration(2000)
    .attr("opacity", needDis ? 0 : 1)

  arrow
    .append("text")
    .text(text)
    .attr('transform', `translate(${(x2 + x) / 2 - 60} ${(y2 + y) / 2})`);
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
const addArrowFree = (startX, startY, endX, endY, needDis, chart, id) => {
  const { arrowSvg, svgConfig } = chart;
  // 添加箭头
  arrowSvg
    .transition()
    .duration(2000)
    .attr("opacity", 1)
    .attr("stroke", 'rgba(0,0,0,0.5)')
    .attr("stroke-width", "2")
    .transition()
    .duration(2000)
    .attr("opacity", needDis ? 0 : 1);
  arrowSvg.append('path')
    .attr("id", id)
    .attr("d", `M ${startX},${startY} L ${endX},${endY}`)
    .attr("style", `marker-end: url(#${id}-marker)`)

  arrowSvg
    .append("marker")
    .attr("orient", "auto")
    .attr("id", `${id}-marker`)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "6")
    .attr("markerHeight", "4")
    .attr("refX", 0)
    .attr("refY", 2)
    .append("path")
    .attr("d", "M 0 0 L 5 2 L 0 4 z")
}
onMounted(() => {
  const { svg, svgConfig } = LineChart(LineChartData.data, "#d3", {
    x: d => new Date(d.date),
    y: d => d.value,
  });
  const arrowSvg = svg.append('g').attr("class", "arrowG");
  // addArrow(5, 7, "30%", true, { svg, svgConfig });
  // setTimeout(() => addArrow(8, 10, "80%", false, { svg, svgConfig }), 2000);
  addArrowFree(174, 198, 287, 192, false, { arrowSvg, svgConfig }, "#demo2-1");
})
</script>
<style scoped></style>