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
    const { enterDuration = 4,leaveDuration = 4 ,twinkleTime = 2} = animation
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
        },
        cause:causeAnimation.map(val=>{
          return {
            time:enterDuration,
            animation:()=>{
                val?.mount(svg)
                val?.beginAnimation()
            }
          }  
        }),
        effect:{
            time:leaveDuration,
            animation:()=>{
                effectArray?.mount(svg)
                effectArray?.beginAnimation()
            }
        },
        complete:{
            time:2,
            animation:()=>{
                setTimeout(()=>{
                    causeAnimation.forEach(val=>val?.remove())
                    effectArray?.remove()
                },2000)
            }
        },
        nonIntensifyComplete:{
            time:2,
            animation:()=>{
                setTimeout(()=>{
                    causeAnimation.forEach(val=>val?.remove())
                    effectArray?.remove()
                },2000)
            }
        },
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
                    textContent:"",
                    // color: "#fadb1499",
                    color:"rgba(45,145,225,0.8)",
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
                textContent:"",
                color:"rgba(45,145,225,0.8)"
            },animation,`arrowGroup-${val.id}`)
            case "ARROW":
                return addArrow({
                    x1:val.pos.startX,
                    y1:val.pos.startY,
                    x2:val.pos.endX,
                    y2:val.pos.endY,
                    // textContent:val.words || "",
                    color:"rgba(45,145,225,0.8)"
            },animation,`rectGroup-${val.id}`)
    }
}
export {
    MutliCauseEffect
}