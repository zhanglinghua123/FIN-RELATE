import * as d3 from "d3"
type ArrowConfig = {
    x1 : number,
    y1 : number, 
    x2 : number,
    y2 : number,
    textContent?:string,
    // 箭头颜色
    color?:string
    // 箭头是否为虚线
    strokeDashArray? : number
    // label是否有虚线边框
    labelStroke?:{
        stroke?:number,
        strokeWidth?:number,
        strokeDashArray?:number
    }
    // 字体大小
    fontSize?:number
    // 是否为弯曲曲线
    isCurve?:boolean

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
    // 闪烁时间
    twinkleTime?:number
}
function addArrow( config:ArrowConfig,animation:animation = {},id:string = "") : {
    mount : (svgNode:any)=>void
    beginAnimation : ()=>void
    endAnimation : ()=>void
    remove:()=>void
    twinkle : ()=>void
} {
    const {x1 , y1 , x2 , y2, color = "black",labelStroke = undefined ,fontSize = 16 , isCurve = false} = config
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60, twinkleTime = 2 } = animation
    let arrow
    let points = [ 
        {x:x1,  y:y1}, 
        {x:x1,  y:y1},
        {x:x1,  y:y1}, ]
        
    let Gen = d3.line() 
        .x((p) => p.x) 
        .y((p) => p.y) 
        .curve(d3.curveBasis); 
    return  {
          // ele 为 需要挂载的 svg元素
        mount:(ele)=>{
            arrow = ele
            .append("g")
            .attr("font-size",fontSize)
            .attr("opacity",0)

            if(!isCurve){
                arrow.append("path")
                .attr("id",`arrow-${id}`)
                .attr("d",`M ${x1},${y1} L ${x1},${y1}`)
                .attr("stroke",color)
                .attr("stroke-width","2")
                .attr("stroke-dasharray",config.strokeDashArray || 0 )
                .attr("color",color)
                .attr("style",`marker-end: url(#triangle-${id})`)
            }
            else{
                arrow.append("path")
                    .attr("id",`arrow-${id}`)
                    .attr("d",Gen(points))
                    .attr("stroke",color)
                    .attr("fill","transparent")
                    .attr("stroke-width","2")
                    .attr("stroke-dasharray",config.strokeDashArray || 0 )
                    .attr("color",color)
                    .attr("style",`marker-end: url(#triangle-${id})`)
            }
            // add the head of arrow
            arrow.append("marker")
            .attr("orient","auto")
            // .attr("stroke",color)
            .attr("fill",color)
            .attr("id",`triangle-${id}`)
            .attr("markerUnits","strokeWidth")
            .attr("markerWidth","6")
            .attr("markerHeight","4")
            .attr("refX",0)
            .attr("refY",2)
            .append("path")
            .attr("d","M 0 0 L 5 2 L 0 4 z")
              // x y 轴的方向矢量 
            const xDirect = (x2 - x1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
            const yDirect = (y2 - y1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
            
            arrow.append("text")
            .attr("transform",`translate(${x1 - 10 * xDirect} ${y1 - 10 * yDirect + 20})`)
            .attr("text-anchor","middle")
            .attr("color","black")
            .text(config.textContent || "")
            if(labelStroke){
                arrow.append("rect")
                .attr("x",x1 - 10 * xDirect - (config.textContent || "" ) .length * 4 - 8)
                .attr("y",y1 - 10 * yDirect - 18)
                .attr("width",(config.textContent || "") .length * 8 + 16)
                .attr("height",24)
                .attr("fill","transparent")
                .attr("stroke",labelStroke.stroke || "black")
                .attr("stroke-width",labelStroke.strokeWidth)
                .attr("stroke-dasharray",labelStroke.strokeDashArray)
            }
        },
        beginAnimation:()=>{
            let count = enterFrame
            let hander = setInterval(()=>{
                if(count > 0){
                    count--
                    arrow.
                    attr("opacity",(enterFrame - count) / enterFrame)
                    if(!isCurve){
                        arrow
                        .select("path")
                        .attr("d",`M ${x1},${y1} L ${ x1 +( x1 - x2 ) * (count - enterFrame) / enterFrame },${ y1 +( y1 - y2 ) * (count - enterFrame) / enterFrame}`)
                    }else{
                        points[2] = {x :x1 +( x1 - x2 ) * (count - enterFrame) / enterFrame  , y :y1 +( y1 - y2 ) * (count - enterFrame) / enterFrame }
                        points[1] = {x : (x1 + points[2].x ) / 2 , y:(y1 + points[2].y)/2 + 10 }
                        arrow
                        .select("path")
                        .attr("d",Gen(points))
                    }
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
                    arrow.
                    attr("opacity", count  / leaveFrame)
                    
                    if(!isCurve){
                        arrow
                        .select("path")
                        .attr("d",`M ${x1},${y1} L ${ x1 +( x2 - x1 ) * count / leaveFrame },${ y1 +( y2 - y1 ) * count / leaveFrame}`)
                    }else{
                        points[2] = {x : x1 +( x2 - x1 ) * count / leaveFrame , y:  y1 +( y2 - y1 ) * count / leaveFrame  }
                        points[1] = {x : (x1 + points[2].x ) / 2 , y:(y1 + points[2].y)/2 + 10 }
                        arrow
                        .select("path")
                        .attr("d",Gen(points))
                    }
                }else{
                    clearInterval(hander)
                    arrow.remove()
                }
            }, leaveDuration * 1000 / leaveFrame)
        },
        remove:()=>{
            arrow.remove()
        },
        twinkle:()=>{
            let twincleCount = twinkleTime * 1000 / 200
            let twinCleHandle = setInterval(()=>{
                if(twincleCount > 0){
                    arrow
                    .attr("opacity", twincleCount % 2 )
                    twincleCount--   
                }else{
                    clearInterval(twinCleHandle)
                }
            },200)
        },
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
    addSlippyArrow,
    ArrowConfig
}