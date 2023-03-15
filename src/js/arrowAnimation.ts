import { ArrowConfig, addArrow } from "./addArrow"
import { animationFrame  } from "./animation"
import { animation } from "./addMultiRectangular"
const similiarArrow = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame =>{
  
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 1} = animation
    let x1 = (arrowOne.x1 + arrowOne.x2) / 2
    let y1 = (arrowOne.y1 + arrowOne.y2) / 2
    let x2 = (arrowTwo.x1 + arrowTwo.x2) / 2
    let y2 = (arrowTwo.y1 + arrowTwo.y2) / 2
    // x y 轴的方向矢量 
    const xDirect = (x2 - x1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
    const yDirect = (y2 - y1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
    x1 = x1 + 10 * xDirect
    y1 = y1 + 10 * yDirect
    x2 = x2 - 10 * xDirect
    y2 = y2 - 10 * yDirect
    // console.log(x1,y1,x2,y2,"--arrow--")
    const arrow1 = addArrow(arrowOne,animation,"arrowOne")
    const arrow2 = addArrow(arrowTwo,animation,"arrowTwo")
    const arrow3 = addArrow({
        x1,
        y1,
        x2,
        y2,
        strokeDashArray:5
    },animation,"arrowThree")
    return {
        stopTime:0,
        duration:enterDuration + leaveDuration,
        gap:1,
        animation:()=>{
            arrow1.mount(svg)
            arrow2.mount(svg)
            arrow3.mount(svg)
            arrow1.beginAnimation()
            arrow2.beginAnimation()
            arrow3.beginAnimation()
            setTimeout(()=>{
                arrow1.endAnimation()
                arrow2.endAnimation()
                arrow3.endAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                // arrow3.remove()
            },(enterDuration + leaveDuration ) * 1000)
        }
    } 

}
const diffArrow = ()=>{

}
const timeArrow = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 1} = animation
    let x1 = (arrowOne.x1 + arrowOne.x2) / 2
    let y1 = (arrowOne.y1 + arrowOne.y2) / 2
    let x2 = (arrowTwo.x1 + arrowTwo.x2) / 2
    let y2 = (arrowTwo.y1 + arrowTwo.y2) / 2
    // x y 轴的方向矢量 
    const xDirect = (x2 - x1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
    const yDirect = (y2 - y1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
    x1 = x1 + 10 * xDirect
    y1 = y1 + 10 * yDirect
    x2 = x2 - 10 * xDirect
    y2 = y2 - 10 * yDirect
    // console.log(x1,y1,x2,y2,"--arrow--")
    const arrow1 = addArrow(arrowOne,animation,"arrowOne")
    const arrow2 = addArrow(arrowTwo,animation,"arrowTwo")
    const arrow3 = addArrow({
        x1,
        y1,
        x2,
        y2,
        strokeDashArray:5
    },animation,"arrowThree")
    return {
        stopTime:0,
        gap:1,
        duration: (enterDuration * 3 + leaveDuration + twinkleTime * 2) ,
        animation:()=>{
            arrow1.mount(svg)
            arrow1.beginAnimation()
            setTimeout(()=>{
                arrow2.mount(svg)
                arrow2.beginAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                arrow3.mount(svg)
                arrow3.beginAnimation()
            },enterDuration * 2000)
            setTimeout(()=>{
                arrow1.twinkle()
            },(enterDuration ) * 3000)
            setTimeout(()=>{
                arrow2.twinkle()
            },(enterDuration * 3 + twinkleTime ) * 1000)
            setTimeout(()=>{
                arrow1.endAnimation()
                arrow2.endAnimation()
                arrow3.endAnimation()
            },(enterDuration * 3 + twinkleTime * 2) * 1000)
        }
    }
}
const causeArrow = (svg:SVGElement,arrowOne:ArrowConfig,arrowTwo:ArrowConfig,animation:animation):animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 1} = animation
    // console.log(x1,y1,x2,y2,"--arrow--")
    const arrow1 = addArrow(arrowOne,animation,"arrowOne")
    const arrow2 = addArrow(arrowTwo,animation,"arrowTwo")
    const arrow3 = addArrow({
        x1:arrowOne.x1,
        y1:arrowOne.y1 - 24,
        x2:arrowTwo.x1,
        y2:arrowTwo.y1 - 24,
        strokeDashArray:5,
        isCurve: true,
    },animation,"arrowThree")
    return {
        stopTime:0,
        gap:1,
        duration:enterDuration * 2 + leaveDuration,
        animation:()=>{
            arrow1.mount(svg)
            arrow2.mount(svg)
            arrow1.beginAnimation()
            arrow2.beginAnimation()
            setTimeout(()=>{
                arrow3.mount(svg)
                arrow3.beginAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                arrow1.endAnimation()
                arrow2.endAnimation()
                arrow3.endAnimation()
            },enterDuration * 2000)
        }
    }
}


export {
    similiarArrow,
    diffArrow,
    timeArrow,
    causeArrow
}