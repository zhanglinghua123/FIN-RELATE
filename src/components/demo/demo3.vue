<!--  -->
<template>
    <div id="d3"></div>
</template>
  
<script setup>
import { getCurrentInstance, onMounted } from 'vue'
import { LineChart } from '../../js/LineChart';
import LineChartData from "../../assets/data.json"

onMounted(() => {
    // 定义图表
    const d3 = document.getElementById("d3")
    const chart = LineChart(LineChartData.data, "#d3", {
        x: d => new Date(d.date),
        y: d => d.value,
        width: d3.getBoundingClientRect().width,
        height: d3.getBoundingClientRect().height,
    })
    const { proxy } = getCurrentInstance()
    proxy.$chart.value = chart
    console.log(chart, "--", proxy.$chart)
    // // 定义展示的 背景动画
    // const MultiRect = addMultiRect("rectAnimation2", [{
    //     width: 20,
    //     height: 350,
    //     x: 70,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 100,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 140,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 180,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 280,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 380,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 480,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }, {
    //     width: 20,
    //     height: 350,
    //     x: 580,
    //     y: 20,
    //     color: "rgba(0,0,0,0.1)"
    // }], {})
    // // 所有的数据
    // const data = chart.svgConfig.X.map(
    //     (d, index) => {
    //         console.log(d, index, "--");
    //         return [chart.svgConfig.xScale(d), chart.svgConfig.yScale(chart.svgConfig.Y[index])]
    //     })

    // // 将动画挂载到 图表上
    // MultiRect.mount(chart.svg)
    // const arrow = addArrow({
    //     x1: data[7][0],
    //     y1: data[7][1],
    //     x2: data[9][0],
    //     y2: data[9][1],
    //     textContent: "30%"
    // })



    // const slipperyArrow = addSlippyArrow({ data: data.slice(3, 7), textContent: "20%" }, {})

    // slipperyArrow.mount(chart.svg)

    // arrow.mount(chart.svg)
    // // 设置对应的动画效果
    // setTimeout(() => {
    //     MultiRect.beginAnimation()
    //     arrow.beginAnimation()
    // }, 1000)
    // setTimeout(() => {
    //     MultiRect.endAnimation()
    //     arrow.endAnimation()
    // }, 6000)
    // setTimeout(() => {
    //     MultiRect.beginAnimation()
    //     slipperyArrow.beginAnimation()
    // }, 11000)
    // setTimeout(() => {
    //     MultiRect.endAnimation()
    //     slipperyArrow.endAnimation()
    // }, 16000)
})

</script>
<style scoped>
#d3 {
    width: 100%;
    /* min-height: calc(60vh - 80px); */
}
</style>