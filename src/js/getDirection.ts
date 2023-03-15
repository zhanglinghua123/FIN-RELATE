const getDirection = (x1,x2,y1,y2)=>{
    const xDirect = (x2 - x1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
    const yDirect = (y2 - y1) / Math.sqrt( (y2 - y1) ** 2 + ( x2 - x1 ) ** 2  )
    return {xDirect,yDirect}
}
export {
    getDirection
}