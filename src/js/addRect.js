const addRect = (chart, ...rectX) => {
    const { svg, svgConfig } = chart;
    const rect = svg
      .append("g")
      .attr("class", "rectG");
    rect
      .append("rect")
      .attr("width", svgConfig.xScale(new Date(rectX[1])) - svgConfig.xScale(new Date(rectX[0])))
      .attr("height", 350)
      .attr("x", svgConfig.xScale(new Date(rectX[0])))
      .attr("y", svgConfig.yScale(26))
      .attr("fill", "#efd96f")
      .transition()
      .duration(2000)
      .attr("opacity", 0.6)
      .transition()
      .duration(2000)
      .attr("width", svgConfig.xScale(new Date(rectX[3])) - svgConfig.xScale(new Date(rectX[2])))
      .attr("x", svgConfig.xScale(new Date(rectX[2])))
    rect.append("text")
      .text("5% HIGHER THAN JUNE")
      .attr("x", svgConfig.xScale(new Date("2023-01-05")) + 45)
      .attr("y", svgConfig.yScale(26))
      // .attr("transform", `translate(${svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-05"))},${svgConfig.yScale(26)})`)
      .attr("font-size", 20)
      .attr("stroke", "#b0030a")
      .attr("opacity", 0)
      .transition()
      .duration(2000)
      .attr("opacity", 1)
      .transition()
      .duration(2000)
      .attr("x", svgConfig.xScale(new Date("2023-01-08")) - 45)
      .attr("y", svgConfig.yScale(26))
      .text("7% HIGHER THAN OCTPBER")
    // .attr("transform", `translate(${svgConfig.xScale(new Date("2023-01-11")) - svgConfig.xScale(new Date("2023-01-08"))},${svgConfig.yScale(26)})`)
  }

export {
    addRect
}