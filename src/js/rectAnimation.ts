interface rectItem {
    width : number,
    height:number,
    x:number,
    y:number,
    color:string,
}
import { animation ,addMultiRectangularShadow,animationData} from "./addMultiRectangular"
import { animationFrame } from "./animation"
const similiarRect = (svg:SVGElement ,rectItem1:animationData,idOne = "one",rectItem2:animationData,idTwo = "two",animation:animation) : animationFrame=> {
    const { enterDuration = 4,leaveDuration = 4 ,twinkleTime = 2} = animation
    const rect1 = addMultiRectangularShadow(idOne,[rectItem1],animation)
    const rect2 = addMultiRectangularShadow(idTwo,[rectItem2],animation)
    return {
        stopTime:0,
        duration:enterDuration * 2 + twinkleTime + 1,
        gap:1,
        animation:()=>{
            rect1.mount(svg)
            rect1.beginAnimation()
            setTimeout(()=>{
                rect2.mount(svg)
                rect2.beginAnimation()
            },enterDuration * 1000)
            setTimeout(()=>{
                rect1.twinkle()
                rect2.twinkle()
            },( enterDuration * 2  * 1000))
            setTimeout(()=>{
                rect1.remove()
                rect2.remove()
            }, ((enterDuration * 2 + twinkleTime) * 1000) + 1000 )
        },
        first:{
            time:enterDuration,
            animation:()=>{
            rect1.mount(svg)
            rect1.beginAnimation()
        }},
        second:{
            time:leaveDuration,
            animation: ()=>{
                rect2.mount(svg)
                rect2.beginAnimation()
            }
        },
        complete:{
            time:twinkleTime,
            animation:()=>{
                rect1.twinkle()
                rect2.twinkle()
                setTimeout(()=>{
                    rect1.remove()
                    rect2.remove()
                },twinkleTime * 1000)
            } 
        },
        nonIntensifyComplete:{
            time:twinkleTime,
            animation:()=>{
                setTimeout(()=>{
                    rect1.remove()
                    rect2.remove()
                },twinkleTime * 1000)
            }
        }
    }
}
// 这个函数 与 先前的函数应该一致
const diffRect = ()=>{

}
// 表达矩形时序的函数
const timeRect = (svg:SVGElement ,rectItem1,idOne = "one",rectItem2,idTwo = "two",animation:animation) : animationFrame  =>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 2} = animation
    const rect1 = addMultiRectangularShadow(idOne,[rectItem1],animation)
    const rect2 = addMultiRectangularShadow(idTwo,[rectItem2],animation)
    return {
        stopTime:0,
        duration:enterDuration  + twinkleTime * 2 + 1,
        gap:1,
        animation:()=>{
            rect1.mount(svg)
            rect2.mount(svg)
            rect1.beginAnimation()
            rect2.beginAnimation()
            setTimeout(()=>{
                rect1.twinkle()
            },( enterDuration  * 1000))
            setTimeout(()=>{
                rect2.twinkle()
            },( (enterDuration + twinkleTime )  * 1000))
            setTimeout(()=>{
                rect1.remove()
                rect2.remove()
            }, ((enterDuration + twinkleTime * 2 ) * 1000) + 1000)
        }
    }
}
const causeRect = (svg:SVGElement ,rectItem1,idOne = "one",rectItem2,idTwo = "two",animation:animation)=>{
    const { enterDuration = 3,leaveDuration = 3 ,twinkleTime = 0} = animation
    const rect1 = addMultiRectangularShadow(idOne,[rectItem1],animation)
    const rect2 = addMultiRectangularShadow(idTwo,[rectItem2],animation)   
    return {
        stopTime:0,
        duration: (enterDuration) * 2 + 1,
        gap:1,
        animation:()=>{
            rect1.mount(svg)
            rect1.beginAnimation()
            setTimeout(()=>{
                rect2.mount(svg)
                rect2.beginAnimation()
            },(enterDuration) * 1000 )
            setTimeout(()=>{
                rect1.remove()
                rect2.remove()
            },(enterDuration * 2 ) * 1000 + 1000 )
        }
    }
}
export {
    similiarRect,
    diffRect,
    timeRect,
    causeRect
}