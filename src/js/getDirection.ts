import { ArrowConfig } from "./addArrow"

const getDirection = (arrow:ArrowConfig)=>{
    const xDirect = (arrow.x2 - arrow.x1) / Math.sqrt( (arrow.y2 - arrow.y1) ** 2 + ( arrow.x2 - arrow.x1 ) ** 2  )
    const yDirect = (arrow.y2 - arrow.y1) / Math.sqrt( (arrow.y2 - arrow.y1) ** 2 + ( arrow.x2 - arrow.x1 ) ** 2  )
    return {xDirect,yDirect}
}
export {
    getDirection
}