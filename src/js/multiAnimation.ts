import { addArrow } from "./addArrow"
import { addCircle} from "./addCircle"
import { addMultiRectangularShadow } from "./addMultiRectangular"
import { animationFrame } from "./animation"
import { animation } from "./addMultiRectangular"
import { judgeColor } from "./arrowWithoutLabel"
interface historyItem{
    // 用来高光的文字
    words:string,
    // 有关的位置信息
    pos:any,
    // 有关的时间信息
    time:string,
    // type
    operate : "CIRCLE" | "RECT" | "ARROW" | "TEXT",
    // 对应的图形的 id
    id:number,
    color:string,
}
const MutliCauseEffect = (svg:SVGElement,causeArray:historyItem[],effect:historyItem,animation:animation,itemOnePlus:{}): animationFrame =>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
    // switch(effect.operate){
    //     case "CIRCLE":
    //         case "RECT":
    //             case "ARROW":
    //                 case "TEXT":
    // }
    const causeAnimation = causeArray.map((val)=>{
        return historyIntoAnimtion(val,animation,itemOnePlus)
    })
    const effectArray = historyIntoAnimtion(effect,animation,{})
    return {
        stopTime:0,
        gap:1,
        duration:enterDuration * (causeAnimation.length + 1) + 2,
        animation:()=>{
            effectArray?.mount(svg)
            effectArray?.beginAnimation()
            for(let i=0;i<causeAnimation.length;i++){
                setTimeout(()=>{
                    causeAnimation[i]?.mount(svg)
                    causeAnimation[i]?.beginAnimation()
                },enterDuration * ( i + 1 ) * 1000)
            }
            setTimeout(()=>{
                causeAnimation.forEach((val)=>{
                    val?.remove()
                })
                effectArray?.remove()
            },(enterDuration * (causeAnimation.length + 1) + 2) * 1000)
        }
    }
    
}
const historyIntoAnimtion = (val,animation,plus)=>{
    switch(val.operate){
        case "CIRCLE":
            return addCircle(
                [{
                    x:val.pos.cx,
                    y:val.pos.cy,
                    innerRadius:val.pos.r-2,
                    outerRadius:val.pos.r+2,
                    textContent:val.words,
                    color: val.color|| "rgba(239, 217, 111)",
                    // 默认是因果逻辑
                    ...plus
                }],animation
            )
            case "RECT":
            return addMultiRectangularShadow(`rectGroup-${val.id}`,[{
                ...val.pos,
                textContent:val.words,
                color: val.color|| "#f1a340"
            }],animation)
            case "TEXT":
            return addArrow({
                x1:val.pos.startX,
                y1:val.pos.startY,
                x2:val.pos.endX,
                y2:val.pos.endY,
                textContent:val.words || ""
            },animation,`arrowGroup-${val.id}`)
            case "ARROW":
                return addArrow({
                    x1:val.pos.startX,
                    y1:val.pos.startY,
                    x2:val.pos.endX,
                    y2:val.pos.endY,
                    textContent:val.words || "",
                    color:judgeColor({
                        x1:val.pos.startX,
                        y1:val.pos.startY,
                        x2:val.pos.endX,
                        y2:val.pos.endY,
                    })
            },animation,`rectGroup-${val.id}`)
    }
}
export {
    MutliCauseEffect
}