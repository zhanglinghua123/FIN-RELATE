<!--  -->
<template>
  <div id="d3"></div>
</template>

<script setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { LineChart } from '../../js/LineChart';
import addMultiRect from "../../js/addMultiRectangular.ts"
import LineChartData from "../CustomedInput/data.json"

onMounted(() => {
  const chart = LineChart(LineChartData.data, "#d3", {
    x: d => new Date(d.date),
    y: d => d.value,
    width: 300,
    height: 300,
  })
  const MultiRect = addMultiRect("rectAnimation", [{
    width: 140,
    height: 80,
    x: 60,
    y: 20,
    color: "rgba(0,0,0,0.1)"
  }], {})
  MultiRect.mount(chart.svg)
  setTimeout(() => {
    MultiRect.beginAnimation()
  }, 1000)
  setTimeout(() => MultiRect.endAnimation(), 6000)

})

</script>
<style scoped></style>