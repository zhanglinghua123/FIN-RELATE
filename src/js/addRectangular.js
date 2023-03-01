import * as d3 from "d3"
function addRectangularShadow(datas,animation){
    return {
        mount : (ele)=>ele
        .append("g")
        .selectAll("rect")
        .data(datas)
        .enter()
        .append("rect")
        .attr("x",val=>`${val*100}px`)
        .attr("y",val=>`${val*100}px`)   
        .attr("id","rectAnimation")
        .attr("width","100")
        .attr("opacity",0)
        .attr("height","100")
        .text(1)
        ,
        beginAnimation:()=>{
            let count = 60
            let hander = setInterval(()=>{
                if(count >= 0){
                    d3.selectAll("#rectAnimation")
                    .attr("opacity", 1 - count/60 * 1)
                    count--   
                }else{
                    clearInterval(hander)
                }
            },50)
        },
        endAnimation:()=>{
            let count = 60
            let hander = setInterval(()=>{
                if(count >= 0){
                    d3.selectAll("#rectAnimation")
                    .attr("opacity",1/60 * count)
                    count--
                }else{
                    clearInterval(hander)
                    d3.selectAll("#rectAnimation").remove()
                }
            },50)
        }
    }
}
export default addRectangularShadow