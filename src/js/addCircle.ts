type cirCleConfigItem = {
    // 圆心 以及 半径
    x: number,
    y:number,
    innerRadius:number,
    outerRadius:number,
    color?:string,
    textColor?:string,
    textContent?:string,
    strokeDashArray?:number
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
function addCircle(data:cirCleConfigItem[],animation:animation) : {
    mount : (svgNode:any)=>void
    beginAnimation : ()=>void
    endAnimation : ()=>void
    remove:()=>void
} {
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60 } = animation
    let circle
    return {
        // ele 为 需要挂载的 svg元素
        mount:(ele)=>{
            circle = ele.append("g")
            .attr("font-size",16)
            circle.
            selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("text-anchor","middle")
            .attr("transform",val=>`translate(${val.x} ${val.y - val.outerRadius - 5})`)
            .attr("color",val=>val.color || "rgba(0,0,0,0.1)")
            .attr("opacity",0)
            .text(val=>val.textContent )
        },
     

        beginAnimation:()=>{
            let count = enterFrame
            let oldCircle :any[] = []
            let newCircle :any[] = []
            let hander = setInterval(()=>{
                if(count > 0){
                    count --
                    circle.
                    selectAll("text") 
                    .attr("opacity", 1 - count / enterFrame)
                    data.forEach(val=>{
                        const arc = d3.arc()
                            .innerRadius((val.innerRadius + val.outerRadius) / 2)
                            .outerRadius((val.innerRadius + val.outerRadius) / 2)
                            .startAngle(0)
                            .endAngle(Math.PI * 2 * ( 1 - count / enterFrame ));
                        const newg =  circle.
                        append("g")

                        newg.attr("stroke",val.color || "rgba(0,0,0,0.1)")
                        .attr("stroke-width",val.outerRadius - val.innerRadius)
                        .append("path")
                        .attr("transform",`translate(${val.x} ${val.y})`)
                        // .attr("fill",val.color)
                        .attr("d",arc())
                        .attr("color",val.color || "black")
                        .attr("stroke-dasharray",val.strokeDashArray || "0")
                        newCircle.push(newg)
                        // circle.selectAll("#preCircle").remove()
                    })
                    if(oldCircle.length) oldCircle.forEach(val=>(val as any).remove())
                    oldCircle = newCircle
                    newCircle = []
                }else{
                    // oldCircle.forEach(val=>(val as any).remove())
                    clearInterval(hander)
                }
            }, enterDuration * 1000 / enterFrame )
        },
        endAnimation:()=>{
            let count = leaveFrame
            let oldCircle : any [] = []
            let newCircle : any [] = []
            let hander = setInterval(()=>{
                if(count > 0){
                    count--
                    circle.attr("opacity" ,count / enterFrame)

                    data.forEach(val=>{
                        const arc = d3.arc()
                            .innerRadius((val.innerRadius + val.outerRadius) / 2)
                            .outerRadius((val.innerRadius + val.outerRadius) / 2)
                            .startAngle(0)
                            .endAngle(Math.PI * 2 * ( count / enterFrame ));
                        const newg = circle.
                        append("g")
                        .attr("stroke",val.color || "rgba(0,0,0,0.1)")
                        .attr("stroke-width",val.outerRadius - val.innerRadius)
                        
                        newg.append("path")
                        .attr("transform",`translate(${val.x} ${val.y})`)
                        // .attr("fill",val.color)
                        .attr("d",arc())
                        .attr("color",val.color || "black")
                        .attr("stroke-dasharray",val.strokeDashArray || "0")
                        newCircle.push( newg )
                    })
                    if(oldCircle.length)  oldCircle.forEach(val=>(val as any).remove())
                    oldCircle = newCircle
                    newCircle = []
                    // circle.selectAll("#preCircle").remove()
                }else{
                    oldCircle.forEach(val=>(val as any).remove())
                    clearInterval(hander)
                    circle.remove()
                }
            }, leaveDuration * 1000 / leaveFrame)
        },
        remove:()=>circle.remove()
    }
}
export {
    addCircle,
    cirCleConfigItem,
    animation
}