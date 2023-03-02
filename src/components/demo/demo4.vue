<!--  -->
<template>
  <div id="d3"></div>
</template>

<script setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { LineChart } from '../../js/LineChart';
import addMultiRect from "../../js/addMultiRectangular.ts"
import LineChartData from "../../assets/data.json"
import { addCircle } from '../../js/addCircle';

onMounted(() => {
  const chart = LineChart(LineChartData.data, "#d3", {
    x: d => new Date(d.date),
    y: d => d.value,
    width: 640,
    height: 400,
  })

  // 所有的数据
  const data = chart.svgConfig.X.map(
    (d, index) => {
      console.log(d, index, "--");
      return [chart.svgConfig.xScale(d), chart.svgConfig.yScale(chart.svgConfig.Y[index])]
    })

  const circle = addCircle(data.slice(7, 9).map(val => {
    return {
      x: val[0],
      y: val[1],
      innerRadius: 16,
      outerRadius: 20,
      textContent: "20%",
      color: "rgba(239, 217, 111)"
    }
  }), {})

  circle.mount(chart.svg)

  setTimeout(() => {
    circle.beginAnimation()
  }, 1000)
  setTimeout(() => {
    circle.endAnimation()
  }, 6000)

})

</script>
<style scoped></style>