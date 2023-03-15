import { ArrowConfig, addArrow } from "./addArrow"
import { animationFrame  } from "./animation"
import { animation } from "./addMultiRectangular"
// 给定具体的箭头颜色
const judgeColor = (arrow:ArrowConfig)=>{
    return (arrow.y2 - arrow.y1)  > 0 ? "#FF0000" : "#00FF00"
}
const similarTendency = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 1} = animation
    const arrow1 = addArrow({
        ...arrowOne,
        textContent:"",
        color:judgeColor(arrowOne)
    },animation,"arrowOne")
    const arrow2 = addArrow({
        ...arrowTwo,
        textContent:"",
        color:judgeColor(arrowTwo)
    },animation,"arrowTwo")
    return {
        stopTime:0,
        duration:enterDuration + leaveDuration,
        gap:1,
        animation:()=>{
            arrow1.mount(svg)
            arrow2.mount(svg)
            arrow1.beginAnimation()
            arrow2.beginAnimation()
            setTimeout(()=>{
                arrow1.endAnimation()
                arrow2.endAnimation()
            },enterDuration * 1000)
        }
    }
}
const diffTendency = ()=>{

}
const timeTendency = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 1} = animation
    const arrow1 = addArrow({
        ...arrowOne,
        textContent:"",
        color:judgeColor(arrowOne)
    },animation,"arrowOne")
    const arrow2 = addArrow({
        ...arrowTwo,
        textContent:"",
        color:judgeColor(arrowTwo)
    },animation,"arrowTwo")
    return {
        stopTime:0,
        duration:(enterDuration + leaveDuration + twinkleTime) * 2,
        gap:1,
        animation:()=>{
            arrow1.mount(svg)
            arrow1.beginAnimation()
            setTimeout(()=>{
                arrow2.mount(svg)
                arrow2.beginAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                arrow1.twinkle()
            },enterDuration * 2000)
            setTimeout(()=>{
                arrow2.twinkle()
            },(enterDuration * 2 + twinkleTime )* 1000)
            setTimeout(()=>{
                arrow1.endAnimation()
            },(enterDuration * 2 + twinkleTime * 2 )* 1000)
            setTimeout(()=>{
                arrow2.endAnimation()
            },(enterDuration * 2 + twinkleTime * 2 + leaveDuration )* 1000)
        }
    }
}
const causeTendency = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 1} = animation
    const arrow1 = addArrow({
        ...arrowOne,
        textContent:"",
        color:judgeColor(arrowOne),
        strokeDashArray:10
    },animation,"arrowOne")
    const arrow2 = addArrow({
        ...arrowTwo,
        textContent:"",
        color:judgeColor(arrowTwo)
    },animation,"arrowTwo")
    return {
        stopTime:0,
        duration:(enterDuration + leaveDuration) * 2,
        gap:1,
        animation:()=>{
            arrow1.mount(svg)
            arrow1.beginAnimation()
            setTimeout(()=>{
                arrow2.mount(svg)
                arrow2.beginAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                arrow1.endAnimation()
            },(enterDuration * 2 )* 1000)
            setTimeout(()=>{
                arrow2.endAnimation()
            },(enterDuration * 2 + leaveDuration )* 1000)
        }
    }
}
export {
    similarTendency,
    diffTendency,
    timeTendency,
    causeTendency
}