type cirCleConfigItem = {
    // 圆心 以及 半径
    x: number,
    y:number,
    innerRadius:number,
    outerRadius:number,
    color?:string,
    textColor?:string,
    textContent?:string
}
type animation = {
    // 渐进持续时间
    enterDuration? : number
    // 淡出持续时间
    leaveDuration? : number
    // 渐进帧数
    enterFrame?:number
    // 淡出帧数
    leaveFrame?:number
}
import * as d3 from "d3"
function addCircle(data:cirCleConfigItem[],animation:animation){
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60 } = animation
    let circle
    return {
        mount:(ele)=>{
            circle = ele.append("g")

            circle.
            selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("text-anchor","middle")
            .attr("transform",val=>`translate(${val.x} ${val.y - 30})`)
            .attr("color",val=>val.color || "rgba(0,0,0,0.1)")
            .attr("opacity",0)
            .text(val=>val.textContent )
        },
     

        beginAnimation:()=>{
            let count = enterFrame
            let hander = setInterval(()=>{
                if(count > 0){
                    count --
                    circle.
                    selectAll("text") 
                    .attr("opacity", 1 - count / enterFrame)
                    data.forEach(val=>{
                        const arc = d3.arc()
                            .innerRadius(val.innerRadius)
                            .outerRadius(val.outerRadius)
                            .startAngle(0)
                            .endAngle(Math.PI * 2 * ( 1 - count / enterFrame ));
                        circle.append("path")
                        .attr("transform",`translate(${val.x} ${val.y})`)
                        .attr("fill",val.color)
                        .attr("d",arc())
                        .attr("color",val.color || "black")
                    })
                }else{
                    clearInterval(hander)
                }
            }, enterDuration * 1000 / enterFrame )
        },
        endAnimation:()=>{
            let count = leaveFrame
            let hander = setInterval(()=>{
                if(count > 0){
                    count--
                    circle.attr("opacity" ,count / enterFrame)

                    data.forEach(val=>{
                        const arc = d3.arc()
                        .innerRadius(val.innerRadius)
                        .outerRadius(val.outerRadius)
                        .startAngle(0)
                            .endAngle(Math.PI * 2 * ( count / enterFrame ));
                        circle.append("path")
                            .attr("transform",`translate(${val.x} ${val.y})`)
                            .attr("fill",val.color)
                            .attr("d",arc())
                            .attr("color",val.color || "black")
                    })

                }else{
                    clearInterval(hander)
                    circle.remove()
                }
            }, leaveDuration * 1000 / leaveFrame)
        }
    }
}
export {
    addCircle
}