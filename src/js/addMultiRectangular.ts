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
}
// id 为 rect 元素 对应的id
function addMultiRectangularShadow(id :string = "rectAnimation"  ,datas:animationData[],animation:animation){
    const { enterDuration = 3,leaveDuration = 3 , enterFrame = 60 ,leaveFrame = 60 } = animation
    return {
        mount : (ele)=>ele
        .insert("g",":first-child")
        .selectAll("rect")
        .data(datas)
        .enter()
        .append("rect")
        .attr("x",val=>`${val.x || 0 }px`)
        .attr("y",val=>`${val.y || 0 }px`)   
        .attr("id",id)
        .attr("width",val=>val.width || 100)
        .attr("height",val=>val.height || 100)
        .attr("fill",val=>val.color || "rgba(0,0,0,0.4)")
        .attr("opacity",0)
        ,
        beginAnimation:()=>{
            let count = enterFrame
            let hander = setInterval(()=>{
                if(count >= 0){
                    console.log( 1 - count / enterFrame ,)
                    d3.selectAll(`#${id}`)
                    .attr("opacity", 1 - count / enterFrame )
                    count--   
                }else{
                    clearInterval(hander)
                }
            },enterDuration * 1000 / enterFrame)
        },
        endAnimation:()=>{
            let count = leaveFrame
            let hander = setInterval(()=>{
                if(count >= 0){
                    d3.selectAll(`#${id}`)
                    .attr("opacity",1/ leaveFrame * count)
                    count--
                }else{
                    clearInterval(hander)
                    d3.selectAll(`#${id}`).remove()
                }
            }, leaveDuration * 1000 / leaveFrame)
        }
    }
}

export default addMultiRectangularShadow
