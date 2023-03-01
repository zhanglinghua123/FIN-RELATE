import * as d3 from "d3"
type ArrowConfig = {
    x1 : number,
    y1 : number, 
    x2 : number,
    y2 : number,
    textContent:string,
    color:string
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
function addArrow( config:ArrowConfig,animation:animation = {}){
    const {x1 , y1 , x2 , y2} = config
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60 } = animation
    let arrow
    return  {
        mount:(ele)=>{
            arrow = ele
            .append("g")
            .attr("opacity",0)
            
            arrow.append("path")
            .attr("d",`M ${x1},${y1} L ${x2},${y2}`)
            .attr("stroke","black")
            .attr("stroke-width","2")
            .attr("style","marker-end: url(#triangle)")
            // add the head of arrow
            arrow.append("marker")
            .attr("orient","auto")
            .attr("id","triangle")
            .attr("markerUnits","strokeWidth")
            .attr("markerWidth","5")
            .attr("markerHeight","4")
            .attr("refX",0)
            .attr("refY",2)
            .append("path")
            .attr("d","M 0 0 L 5 2 L 0 4 z")
            
            arrow.append("text")
            .attr("transform",`translate(${(x2+x1)/2 - 30} ${(y2+y1)/2 + 30})`)
            .attr("color",config.color)
            .text(config.textContent || "")
        },
        beginAnimation:()=>{
            let count = enterFrame
            let hander = setInterval(()=>{
                if(count > 0){
                    count --
                    arrow.attr("opacity", 1 - count / enterFrame)
                    .attr("transform",`translate(0 ${(1 - count/enterFrame) * 30})`)
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
                    arrow.attr("opacity" ,count / enterFrame)
                    .attr("transform",`translate(0 ${(count/enterFrame) * 30})`)
                }else{
                    clearInterval(hander)
                    arrow.remove()
                }
            }, leaveDuration * 1000 / leaveFrame)
        }
    }
   
}
type SlipperyArrow = {
    data:any[],
    color:string,
    textContent:string
}
function addSlippyArrow(config:SlipperyArrow,animation:animation = {}){
    const { data = [] , color = "rgba(0,0,0,0.1)" , textContent = "" } = config
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60 } = animation
    const line = d3
    .line()
    .curve(d3.curveCatmullRom)
    .context(null);
    let arrow
    return {
        mount:(ele)=>{
            arrow = ele
            .append("g")
            .attr("opacity",0)

            arrow
            .attr("stroke-width","2")
            .append('path')
            .attr('fill', 'none')
            .attr('d', line(data))
            .attr("dx",10)
            .attr("stroke","black")
            .attr("stroke-width","2")
            .attr("style","marker-end: url(#triangle)")


            arrow.append("text")
            .attr("transform",`translate(${(data[0][0]+data[data.length-1][0])/2 - 30} ${(data[0][1]+data[data.length-1][1])/2 + 30})`)
            .attr("color",color)
            .text(textContent )

            arrow.append("marker")
            .attr("orient","auto")
            .attr("id","triangle")
            .attr("markerUnits","strokeWidth")
            .attr("markerWidth","5")
            .attr("markerHeight","4")
            .attr("refX",0)
            .attr("refY",2)
            .append("path")
            .attr("d","M 0 0 L 5 2 L 0 4 z")
        },
            beginAnimation:()=>{
                let count = enterFrame
                let hander = setInterval(()=>{
                    if(count > 0){
                        count --
                        arrow.attr("opacity", 1 - count / enterFrame)
                        .attr("transform",`translate(0 ${(1 - count/enterFrame) * 30})`)
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
                        arrow.attr("opacity" ,count / enterFrame)
                        .attr("transform",`translate(0 ${(count/enterFrame) * 30})`)
                    }else{
                        clearInterval(hander)
                        arrow.remove()
                    }
                }, leaveDuration * 1000 / leaveFrame)
            }
    }
}
export {
    addArrow,
    addSlippyArrow
}