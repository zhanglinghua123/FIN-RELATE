import * as d3 from "d3"
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
type animationData = {
    // 矩形宽高
    width : number
    height : number
    // 左上角坐标
    x : number
    y : number
    // color
    color : string
    // text
    textContent : string
    // strokeColor
    stroke?:{
        stroke: string,
        strokeWidth:string,
        strokeDashArray:string,
    }
}
type animationResult = {
    mount : (svgNode:any)=>void
    twinkle:()=>void
    beginAnimation : ()=>void
    endAnimation : ()=>void
    remove : ()=>void
}
// id 为 rect 元素 对应的id id一定要唯一
function addMultiRectangularShadow(id :string = "rectAnimation"  , datas:animationData[],animation:animation) : animationResult {
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60 , twinkleTime = 2} = animation
    let group
    return {
        // ele 为 需要挂载的 svg元素
        mount : (ele)=>{
            group =  ele.insert("g",":nth-child(2)")
            .attr("id",`${id}-container`)
            .attr("opacity",0)

            group.attr("font-size",16)
            group.selectAll("rect")
            .data(datas)
            .enter()
            .append("rect")
            .attr("x",val=>`${val.x || 0 }px`)
            .attr("y",val=>`${val.y || 0 }px`)   
            .attr("width",val=>val.width || 100)
            .attr("height",val=>val.height || 100)
            .attr("fill",val=>val.color || "rgba(0,0,0,0.4)")
            .attr("stroke",val=> val?.stroke?.stroke)
            .attr("stroke-width",val=>val?.stroke?.strokeWidth)
            .attr("stroke-dasharray",val=>val?.stroke?.strokeDashArray)
            group.selectAll("text")
            .data(datas)
            .enter()
            .append("text")
            .attr("x", val=>`${val.x + (val.width / 2) - (val.textContent || "").length * 4 }px`)
            .attr("y",  val=>`${val.y - 5}px`)
            .text(val=>val.textContent || "")
            console.log(datas)
        }
        ,
        beginAnimation:()=>{
            let count = enterFrame
            let hander = setInterval(()=>{
                if(count >= 0){
                    group
                    .attr("opacity", 1 - count / enterFrame )
                    count--   
                }else{
                    clearInterval(hander)
                }
            },enterDuration * 1000 / enterFrame)
        },
        twinkle:()=>{
            let twincleCount = twinkleTime * 1000 / 200
            let twinCleHandle = setInterval(()=>{
                if(twincleCount > 0){
                    group
                    .attr("opacity", twincleCount % 2 )
                    twincleCount--   
                }else{
                    clearInterval(twinCleHandle)
                }
            },200)
        },
        endAnimation:()=>{
            let count = leaveFrame
            let hander = setInterval(()=>{
                if(count >= 0){
                    group
                    .attr("opacity",1/ leaveFrame * count)
                    count--
                }else{
                    clearInterval(hander)
                    d3.selectAll(`#${id}-container`).remove()
                }
            }, leaveDuration * 1000 / leaveFrame)
        },
        remove:()=>{
            group.remove()
        }
    }
}

export { 
    addMultiRectangularShadow , 
    animation,
    animationData,
    animationResult
}
