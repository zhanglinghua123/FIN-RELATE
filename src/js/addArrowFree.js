const addArrowFree = (startX, startY, endX, endY, needDis, chart, id, durationTime) => {
    const {  svg , svgConfig } = chart;
    const arrowSvg = svg.append('g').attr("class", "arrowG");
    // 添加箭头
    arrowSvg
      .transition()
      .duration(durationTime * 1000)
      .attr("opacity", 1)
      .transition()
      .duration(durationTime * 1000)
      .attr("opacity", needDis ? 0 : 1);
    arrowSvg.append('path')
      .attr("id", id)
      .attr("d", `M ${startX},${startY} L ${endX},${endY}`)
      .attr("style", `marker-end: url(#${id}-marker)`)
      .attr("stroke", 'rgba(0,0,0,0.5)')
      .attr("stroke-width", "2")
    
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

export {
    addArrowFree
}