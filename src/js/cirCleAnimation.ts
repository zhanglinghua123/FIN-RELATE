import { cirCleConfigItem , addCircle } from "./addCircle"
import { addArrow } from "./addArrow"
import { animationFrame, } from "./animation"
import { animation, animationResult } from "./addMultiRectangular"
const similarCircle = (svg:SVGElement,circleOne:cirCleConfigItem,circleTwo:cirCleConfigItem,animation:animation) : animationFrame =>{
 
    const { enterDuration = 3,leaveDuration = 3 } = animation
    const circleArray = addCircle([circleOne,circleTwo],animation)
    const x1 = ( circleOne.x + circleTwo.x ) / 2
    const y1 = ( circleOne.y + circleTwo.y ) / 2
    // x y 轴的方向矢量 
    const xDirect = (circleTwo.x - circleOne.x) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    const yDirect = (circleTwo.y - circleOne.y) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    // 计算出来 双向箭头的 坐标位置
    const x2 = circleOne.x + xDirect * (circleOne.outerRadius + 10)
    const y2 = circleOne.y + yDirect * (circleOne.outerRadius + 10)
    const x3 = circleTwo.x - xDirect * (circleTwo.outerRadius + 10)
    const y3 = circleTwo.y - yDirect * (circleTwo.outerRadius + 10)

    const arrowOne = addArrow({
        x1,
        y1,
        x2,
        y2,
    },animation,"arrowOne")
    const arrowTwo = addArrow({
        x1,
        y1,
        x2:x3,
        y2:y3,
    },animation,"arrowTwo")
    return {
        stopTime : 0,
        duration : enterDuration + 1,
        gap : 1,
        animation:()=>{
            circleArray.mount(svg),
            arrowOne.mount(svg),
            arrowTwo.mount(svg),
            circleArray.beginAnimation()
            arrowOne.beginAnimation()
            arrowTwo.beginAnimation()
            setTimeout(()=>{
                arrowOne.remove()
                arrowTwo.remove()
                circleArray.remove()
            },enterDuration * 1000 + 1000)
        }
    }
}
const diffCircle = (svg:SVGElement,circleOne:cirCleConfigItem,circleTwo:cirCleConfigItem,arrowConfigOne,arrowConfigTwo,animation:animation) : animationFrame =>{
 
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
    const circleArray = addCircle([circleOne,circleTwo],animation)
    const x1 = ( circleOne.x + circleTwo.x ) / 2
    const y1 = ( circleOne.y + circleTwo.y ) / 2    
    const xDirect = (circleTwo.x - circleOne.x) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    const yDirect = (circleTwo.y - circleOne.y) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    // 计算出来 双向箭头的 坐标位置
    const x2 = circleOne.x + xDirect * (circleOne.outerRadius + 10)
    const y2 = circleOne.y + yDirect * (circleOne.outerRadius + 10)
    const x3 = circleTwo.x - xDirect * (circleTwo.outerRadius + 10)
    const y3 = circleTwo.y - yDirect * (circleTwo.outerRadius + 10)
    const arrowOne = addArrow({
        x1,
        y1,
        x2,
        y2,
        ...arrowConfigOne
    },animation,"arrowOne")
    const arrowTwo = addArrow({
        x1,
        y1,
        x2:x3,
        y2:y3,
        ...arrowConfigTwo
    },animation,"arrowTwo")
    return {
        stopTime : 0,
        duration : enterDuration + 1 ,
        gap : 1,
        animation:()=>{
            circleArray.mount(svg),
            arrowOne.mount(svg),
            arrowTwo.mount(svg),
            circleArray.beginAnimation()
            arrowOne.beginAnimation()
            arrowTwo.beginAnimation()
            setTimeout(()=>{
                circleArray.remove()
                arrowOne.remove()
                arrowTwo.remove()
            },enterDuration * 1000 + 1000)
        }
    }
}
const timeCircle = (svg:SVGElement,circleOne:cirCleConfigItem,circleTwo:cirCleConfigItem,arrowConfigOne,animation:animation) : animationFrame =>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
    const circleArray = addCircle([circleOne,circleTwo],animation)
  
    const xDirect = (circleTwo.x - circleOne.x) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    const yDirect = (circleTwo.y - circleOne.y) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    const x2 = circleOne.x + xDirect * (circleOne.outerRadius)
    const y2 = circleOne.y + yDirect * (circleOne.outerRadius)
    const x3 = circleTwo.x - xDirect * (circleTwo.outerRadius + 10)
    const y3 = circleTwo.y - yDirect * (circleTwo.outerRadius + 10)
    const arrow = addArrow({
        x1:x2,
        y1:y2,
        x2:x3,
        y2:y3,
        ...arrowConfigOne
    },animation,"arrowOne")
    return {
        stopTime : 0,
        duration : enterDuration + 1 ,
        gap : 1,
        animation:()=>{
            circleArray.mount(svg),
            arrow.mount(svg),
            circleArray.beginAnimation()
            arrow.beginAnimation()
            setTimeout(()=>{
                circleArray.remove()
                arrow.remove()
            },enterDuration * 1000 + 1000)
        }
    }
}
const causeCircle = (svg:SVGElement,circleOne:cirCleConfigItem,circleTwo:cirCleConfigItem,arrowConfigOne,animation:animation) : animationFrame=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
    const circleArray = addCircle([circleOne,circleTwo],animation)
   
    const xDirect = (circleTwo.x - circleOne.x) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    const yDirect = (circleTwo.y - circleOne.y) / Math.sqrt( (circleOne.y - circleTwo.y) ** 2 + ( circleOne.x - circleTwo.x ) ** 2  )
    const x2 = circleOne.x + xDirect * (circleOne.outerRadius)
    const y2 = circleOne.y + yDirect * (circleOne.outerRadius)
    const x3 = circleTwo.x - xDirect * (circleTwo.outerRadius + 10)
    const y3 = circleTwo.y - yDirect * (circleTwo.outerRadius + 10)
    const arrow = addArrow({
        x1:x2,
        y1:y2,
        x2:x3,
        y2:y3,
        ...arrowConfigOne
    },animation,"arrowOne")
    return {
        stopTime : 0,
        duration : enterDuration + 1,
        gap : 1,
        animation:()=>{
            circleArray.mount(svg),
            arrow.mount(svg),
            circleArray.beginAnimation()
            arrow.beginAnimation()
            setTimeout(()=>{
                circleArray.remove()
                arrow.remove()
            },enterDuration * 1000 + 1000)
        }
    }
}


export {
    similarCircle,
    diffCircle,
    timeCircle,
    causeCircle
}