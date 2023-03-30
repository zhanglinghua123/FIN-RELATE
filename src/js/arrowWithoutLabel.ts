import { ArrowConfig, addArrow } from "./addArrow"
import { animationFrame  } from "./animation"
import { animation } from "./addMultiRectangular"
// 给定具体的箭头颜色
const judgeColor = (arrow:ArrowConfig)=>{
    return (arrow.y2 - arrow.y1)  > 0 ? "#FF0000" : "#00FF00"
}
const similarTendency = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
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
        duration:enterDuration * 2 + twinkleTime + 1 ,
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
                arrow2.twinkle()
            },(enterDuration * 2) * 1000 )
            setTimeout(()=>{
                arrow1.remove()
                arrow2.remove()
            },(enterDuration * 2 + twinkleTime + 1 ) * 1000 )
        },
        first:{
            time:enterDuration,
            animation:()=>{
            arrow1.mount(svg)
            arrow1.beginAnimation()
        }},
        second:{
            time:leaveDuration,
            animation: ()=>{
                arrow2.mount(svg)
                arrow2.beginAnimation()
            }
        },
        complete:{
            time:twinkleTime * 2,
            animation:()=>{
                arrow1.twinkle()
                setTimeout(()=>{
                    arrow2.twinkle()
                },twinkleTime * 1000)
                setTimeout(()=>{
                    arrow1.remove()
                    arrow2.remove()
                })
            } 
        }
    }
}
const diffTendency = ()=>{

}
const timeTendency = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
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
        duration:(enterDuration + twinkleTime) * 2 + 1,
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
                arrow1.remove()
                arrow2.remove()
            },(enterDuration * 2 + twinkleTime * 2 )* 1000 + 1000)
        },
        first:{
            time:enterDuration,
            animation:()=>{
                arrow1.mount(svg)
                arrow1.beginAnimation()
        }},
        second:{
            time:leaveDuration,
            animation: ()=>{
                arrow2.mount(svg)
                arrow2.beginAnimation()
            }
        },
        complete:{
            time:twinkleTime * 2,
            animation:()=>{
                arrow1.twinkle()
                setTimeout(()=>{
                    arrow2.twinkle()
                },twinkleTime * 1000)
                setTimeout(()=>{
                    arrow1.remove()
                    arrow2.remove()
                })
            } 
        }
    }
}
const causeTendency = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
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
        duration:(enterDuration ) * 2 + 1,
        gap:1,
        animation:()=>{
            arrow1.mount(svg)
            arrow1.beginAnimation()
            setTimeout(()=>{
                arrow2.mount(svg)
                arrow2.beginAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                arrow1.remove()
                arrow2.remove()
            },(enterDuration * 2 )* 1000 + 1000)
           
        }
    }
}
export {
    similarTendency,
    diffTendency,
    timeTendency,
    causeTendency,
    judgeColor
}