import { Canvg } from "canvg";
import { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'
import {addCircle} from  "./addCircle"
import { addArrowFree  } from "./addArrowFree";
 // 时间单位均为 秒
import { similiarRect , diffRect, timeRect , causeRect } from "./rectAnimation"
import { similarCircle , diffCircle , timeCircle , causeCircle } from "./cirCleAnimation";
import { similiarArrow,diffArrow,timeArrow,causeArrow } from "./arrowAnimation";
import { similarTendency,diffTendency,timeTendency,causeTendency } from "./arrowWithoutLabel";
import { MutliCauseEffect } from "./multiAnimation";
import { animationText, textAnimationItem } from "./animationText";
interface animationFrame {
    // 暂停多少时间后 再执行该动画 
    stopTime? : number
    // 持续时间
    duration?: number
    // 与之后动画的间隔时间
    gap? : number
    // 所执行的动画函数
    animation : ()=>void
    // 用来让你可以接受函数的分割
    [key:string]: number | string | animationItem | animationItem[] | undefined | (()=>void) 
}
interface animationItem {
    time:number,
    animation:()=>void
}
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
interface transHistoryItem{
    type: "SC"| "TS" | "CE" | "DC" | "WR",
    itemOneArray: any[],
    itemTwoArray: any[],
    isMulti: boolean,
    svgWidth?: string,
    explanation:string,
}
function textListItemIntoFrame(item:textAnimationItem):animationFrame{
    // 一行字幕三秒
    let period = 3
    let otherTotalTime = 0
    if(item.plus){
        for(let frame of item.plus){
            otherTotalTime += frame.time
        }
    }

    // console.log(otherTotalTime,item.plus, "----")
    return {
        stopTime:0,
        duration: Math.max(period,otherTotalTime),
        gap:1,
        animation:()=>{
            item.animation(period,Math.max(period,otherTotalTime))
            let totalTime = 0
            for(let i=0;i<(item.plus.length);i++){
                setTimeout(()=>{
                    item.plus[i].animation()
                },totalTime * 1000)
                totalTime += item.plus[i].time
            }
        }
    }
}
function animationFormFromNoNIntensifyHistory(realHistory:historyItem[],history:transHistoryItem[],chart:SVGElement){
    
    // 一个动画的持续时间
    const svg  = chart

    
    const textList = animationText("textarea", "output-graph", {
        fontSize:16,
        wordsDict: realHistory.map(val => val.words)
    })

    console.log(textList,history,"---history---")
    // return animationForm(frames)
    
    
    for(let item of  history){
        switch(item.type){
            case "SC":{
                switch(item.itemOneArray[0].operate){
                    case "RECT":
                        const itemOne = item.itemOneArray[0]
                        const itemTwo = item.itemTwoArray[0]
                        const wordOne = item.itemOneArray[0].words
                        const wordTwo = item.itemTwoArray[0].words

                        const graph = similiarRect(svg,{
                            ...itemOne.pos,
                            textContent:"",
                            color: "rgba(45,145,225,0.4)"
                        },`rectGroup-${itemOne.id}`,{
                            ...itemTwo.pos,
                            x : itemTwo.pos.x ,
                            textContent:"",
                            color: "rgba(45,145,225,0.4)"
                        },`rectGroup-${itemTwo.id}`,{
                            twinkleTime:2,                            
                        })

                        // 将动画与文字相互照应
                        textList.forEach((val)=>{
                           if( val.keyWords.includes(wordOne) ){
                                (val.plus as any).push(graph.first)
                           }
                        })
                        textList.forEach((val)=>{
                            if( val.keyWords.includes(wordTwo) ){
                                 (val.plus as any).push(...[graph.second,graph.nonIntensifyComplete])
                            }
                        }) 
                        
                }
                break
            }
            case "TS":{       
                switch(item.itemOneArray[0].operate){
                    case "ARROW":{
                    const itemOne = item.itemOneArray[0]
                    const itemTwo = item.itemTwoArray[0]
                    const wordOne = item.itemOneArray[0].words
                    const wordTwo = item.itemTwoArray[0].words

                    const graph = timeTendency(svg,{
                            x1:itemOne.pos.startX,
                            y1:itemOne.pos.startY,
                            x2:itemOne.pos.endX,
                            y2:itemOne.pos.endY,
                            textContent: "",
                            color:"rgba(45,145,225,0.8)"
                            // isCurve:true,
                        },{
                            x1:itemTwo.pos.startX,
                            y1:itemTwo.pos.startY,
                            x2:itemTwo.pos.endX,
                            y2:itemTwo.pos.endY,
                            textContent: "",
                            color:"rgba(45,145,225,0.8)"
                            // color:"#9983c9",
                            // isCurve:true,
                        },{},false)
                     // 将动画与文字相互照应
                     textList.forEach((val)=>{
                        if( val.keyWords.includes(wordOne) ){
                            (val.plus as any).push(graph.first)   
                        }
                        if( val.keyWords.includes(wordTwo) ){
                            // TODO: val.plus 经过改变后 就无法再次使用了
                            (val.plus as any).push(...[graph.second,graph.nonIntensifyComplete])
                        }
                     })

                     
                    }
                }    
                break
            }
            case "DC":{
                switch(item.itemOneArray[0].operate){
                    case "TEXT":{
                        const itemOne = item.itemOneArray[0]
                        const itemTwo = item.itemTwoArray[0]
                        const wordOne = item.itemOneArray[0].words
                        const wordTwo = item.itemTwoArray[0].words

                        const graph = similarTendency(svg,{
                            x1:itemOne.pos.startX,
                            y1:itemOne.pos.startY,
                            x2:itemOne.pos.endX,
                            y2:itemOne.pos.endY,
                            isCurve:true,
                            textContent:item.itemOneArray[0].labelWords,
                            color:"rgba(45,145,225,0.8)"
                        },{
                            x1:itemTwo.pos.startX,
                            y1:itemTwo.pos.startY,
                            x2:itemTwo.pos.endX,
                            y2:itemTwo.pos.endY,
                            isCurve:true,
                            textContent:item.itemTwoArray[0].labelWords,
                            color:"rgba(45,145,225,0.8)"
                        },{},false)

                        // 将动画与文字相互照应
                     textList.forEach((val)=>{
                        if( val.keyWords.includes(wordOne) ){
                             (val.plus as any).push(graph.first)
                        }
                     })

                     textList.forEach((val)=>{
                         if( val.keyWords.includes(wordTwo) ){
                              (val.plus as any).push(...[graph.second,graph.nonIntensifyComplete])
                         }
                     }) 
                    }
                }              
                break
            }
            case "CE":{
                const itemOne = [item.itemOneArray[1],...item.itemTwoArray]
                const itemTwo = item.itemOneArray[0]
                const wordOne = [item.itemOneArray[1],...item.itemTwoArray].map(val=>val.words)
                const wordTwo = item.itemOneArray[0].words
                const {cause , effect , nonIntensifyComplete} =  MutliCauseEffect(svg,itemOne,itemTwo,{},{strokeDashArray:0})
                // console.log(itemOne,itemTwo, wordOne,wordTwo,"--words--")
                // 为文字添加对应的动画
                wordOne.forEach((value,index)=>{
                      textList.forEach(val=>{
                        if(val.keyWords.includes(value)){
                            (val.plus as any).push(cause![index])
                        }
                      })
                })
                const causeLast =  wordOne[wordOne.length-1]
                textList.forEach(val=>{
                    if(val.keyWords.includes(causeLast)){
                        (val.plus as any).push(nonIntensifyComplete)
                    }
                  })
                textList.forEach(val=>{
                    if(val.keyWords.includes(wordTwo)){
                        (val.plus as any).push(...[effect])
                    }
                })
                break
            }
            default:{
                console.log("--default--")
            }
        }
    }
    console.log("---final---",textList)
    // let effectPlus = textList[effectIndex].plus
    // let causeOnePlus = textList[causeOneIndex].plus
    // let causeTwoPlus = textList[causeTwoIndex].plus
    // textList[causeOneIndex].plus = effectPlus
    // textList[causeTwoIndex].plus = causeOnePlus
    // textList[effectIndex].plus = causeTwoPlus

    const mid = textList.map(val=>textListItemIntoFrame(val))
    return animationForm(mid)
}
function animationFormFromHistory(realHistory:historyItem[],history:transHistoryItem[],chart:SVGElement){
    
    let startTime = 0
    // 一个动画的持续时间
    let duration = 6
    let gap = 2
    let frames:animationFrame[] = []
    const svg  = chart

    
    const textList = animationText("textarea", "output-graph", {
        fontSize:16,
        wordsDict: realHistory.map(val => val.words)
    })

    console.log(textList,history,"---history---")
    // return animationForm(frames)
    
    
    for(let item of  history){
        switch(item.type){
            case "SC":{
                switch(item.itemOneArray[0].operate){
                    case "RECT":
                        const itemOne = item.itemOneArray[0]
                        const itemTwo = item.itemTwoArray[0]
                        const wordOne = item.itemOneArray[0].words
                        const wordTwo = item.itemTwoArray[0].words

                        const graph = similiarRect(svg,{
                            ...itemOne.pos,
                            textContent:"",
                            color: 'rgba(45,145,225,0.4)',
                        },`rectGroup-${itemOne.id}`,{
                            ...itemTwo.pos,
                            x : itemTwo.pos.x ,
                            textContent:"",
                            color: 'rgba(45,145,225,0.4)',
                        },`rectGroup-${itemTwo.id}`,{
                            twinkleTime:2,                            
                        })

                        // 将动画与文字相互照应
                        textList.forEach((val)=>{
                           if( val.keyWords.includes(wordOne) ){
                                (val.plus as any).push(graph.first)
                           }
                        })
                        textList.forEach((val)=>{
                            if( val.keyWords.includes(wordTwo) ){
                                 (val.plus as any).push(...[graph.second,graph.complete])
                            }
                        }) 
                        
                }
                break
            }
            case "TS":{       
                switch(item.itemOneArray[0].operate){
                    case "ARROW":{
                    const itemOne = item.itemOneArray[0]
                    const itemTwo = item.itemTwoArray[0]
                    const wordOne = item.itemOneArray[0].words
                    const wordTwo = item.itemTwoArray[0].words

                    const graph = timeTendency(svg,{
                            x1:itemOne.pos.startX,
                            y1:itemOne.pos.startY,
                            x2:itemOne.pos.endX,
                            y2:itemOne.pos.endY,
                            textContent:itemOne.words || "",
                            
                            // isCurve:true,
                        },{
                            x1:itemTwo.pos.startX,
                            y1:itemTwo.pos.startY,
                            x2:itemTwo.pos.endX,
                            y2:itemTwo.pos.endY,
                            textContent:itemTwo.words || "",
                            // color:"#9983c9",
                            // isCurve:true,
                        },{})
                     // 将动画与文字相互照应
                     textList.forEach((val)=>{
                        if( val.keyWords.includes(wordOne) ){
                            (val.plus as any).push(graph.first)   
                        }
                        if( val.keyWords.includes(wordTwo) ){
                            // TODO: val.plus 经过改变后 就无法再次使用了
                            (val.plus as any).push(...[graph.second,graph.complete])
                        }
                     })

                     
                    }
                }    
                break
            }
            case "DC":{
                switch(item.itemOneArray[0].operate){
                    case "TEXT":{
                        const itemOne = item.itemOneArray[0]
                        const itemTwo = item.itemTwoArray[0]
                        const wordOne = item.itemOneArray[0].words
                        const wordTwo = item.itemTwoArray[0].words
                        console.log(item.itemOneArray[0].labelWords,item.itemTwoArray[0].labelWords,"--DC--")
                        const graph = similarTendency(svg,{
                            x1:itemOne.pos.startX,
                            y1:itemOne.pos.startY,
                            x2:itemOne.pos.endX,
                            y2:itemOne.pos.endY,
                            isCurve:true,
                            textContent:item.itemOneArray[0].labelWords,
                            color:"rgba(45,145,225,0.8)",
                        },{
                            x1:itemTwo.pos.startX,
                            y1:itemTwo.pos.startY,
                            x2:itemTwo.pos.endX,
                            y2:itemTwo.pos.endY,
                            isCurve:true,
                            textContent:item.itemTwoArray[0].labelWords,
                            color:"#ef8a62",
                        },{})

                        // 将动画与文字相互照应
                     textList.forEach((val)=>{
                        if( val.keyWords.includes(wordOne) ){
                             (val.plus as any).push(graph.first)
                        }
                     })

                     textList.forEach((val)=>{
                         if( val.keyWords.includes(wordTwo) ){
                              (val.plus as any).push(...[graph.second,graph.complete])
                         }
                     }) 
                    }
                }              
                break
            }
            case "CE":{
                const itemOne = [item.itemOneArray[1],...item.itemTwoArray]
                const itemTwo = item.itemOneArray[0]
                const wordOne = [item.itemOneArray[1],...item.itemTwoArray].map(val=>val.words)
                const wordTwo = item.itemOneArray[0].words
                const {cause , effect , complete} =  MutliCauseEffect(svg,itemOne,itemTwo,{},{strokeDashArray:6})
                // console.log(itemOne,itemTwo, wordOne,wordTwo,"--words--")
                // 为文字添加对应的动画
                wordOne.forEach((value,index)=>{
                      textList.forEach(val=>{
                        if(val.keyWords.includes(value)){
                            (val.plus as any).push(cause![index])
                        }
                      })
                })
                const causeLast =  wordOne[wordOne.length-1]
                textList.forEach(val=>{
                    if(val.keyWords.includes(causeLast)){
                        (val.plus as any).push(complete)
                    }
                  })
                textList.forEach(val=>{
                    if(val.keyWords.includes(wordTwo)){
                        (val.plus as any).push(...[effect])
                    }
                })
                break
            }
            default:{
                console.log("--default--")
            }
        }
    }
    console.log("---final---",textList)
    // let effectPlus = textList[effectIndex].plus
    // let causeOnePlus = textList[causeOneIndex].plus
    // let causeTwoPlus = textList[causeTwoIndex].plus
    // textList[causeOneIndex].plus = effectPlus
    // textList[causeTwoIndex].plus = causeOnePlus
    // textList[effectIndex].plus = causeTwoPlus

    const mid = textList.map(val=>textListItemIntoFrame(val))
    return animationForm(mid)
                //  绘制对应的箭头动画
                // frames.push(
                //   similiarArrow(svg,{
                //       x1:item.pos.startX,
                //       y1:item.pos.startY,
                //       x2:item.pos.endX,
                //       y2:item.pos.endY,
                //       textContent:item.words || "1212"
                //   },{
                //       x1:item.pos.startX+100,
                //       y1:item.pos.startY,
                //       x2:item.pos.endX+100,
                //       y2:item.pos.endY,
                //       textContent:item.words || "1212"
                //   },{}))
      
                //   frames.push(
                //       similiarArrow(svg,{
                //           x1:item.pos.startX,
                //           y1:item.pos.startY,
                //           x2:item.pos.endX,
                //           y2:item.pos.endY,
                //           textContent:item.words || "1212"
                //       },{
                //           x1:item.pos.startX+100,
                //           y1:item.pos.startY,
                //           x2:item.pos.endX+100,
                //           y2:item.pos.endY,
                //           textContent:item.words || "1212",
                //           color:"#9983c9"
                //       },{}))
      
                //       frames.push(
                //           timeArrow(svg,{
                //               x1:item.pos.startX,
                //               y1:item.pos.startY,
                //               x2:item.pos.endX,
                //               y2:item.pos.endY,
                //               textContent:item.words || "1212"
                //           },{
                //               x1:item.pos.startX+100,
                //               y1:item.pos.startY,
                //               x2:item.pos.endX+100,
                //               y2:item.pos.endY,
                //               textContent:item.words || "1212",
                //               color:"#9983c9"
                //           },{}))
      
                //   frames.push(
                //       causeArrow(svg,{
                //           x1:item.pos.startX,
                //           y1:item.pos.startY,
                //           x2:item.pos.endX,
                //           y2:item.pos.endY,
                //           textContent:item.words || "1212",
                //           },{
                //           x1:item.pos.startX+200,
                //           y1:item.pos.startY,
                //           x2:item.pos.endX+200,
                //           y2:item.pos.endY,
                //           textContent:item.words || "1212",
                //           color:"#9983c9",
                //       },{}))
                
             
                // frames.push(
                //     similiarRect(svg,{
                //     ...item.pos,
                //     textContent:item.words,
                //     color: item.color|| "#f1a340"
                // },`rectGroup-${item.id}`,{
                //     ...item.pos,
                //     x : item.pos.x + 200,
                //     textContent:item.words,
                //     color:  item.color|| "#f1a340"
                // },`rectGroup-${item.id+100}`,{
                //     twinkleTime:2,
                    
                // })
                // )
                // frames.push(
                //     similiarRect(svg,{
                //         ...item.pos,
                //         color:  item.color|| "#f1a340",
                //         textContent:item.words,
                //     },`rectGroup-${item.id}`,{
                //         ...item.pos,
                //         x : item.pos.x + 200,
                //         color:  item.color|| "#f1a340",
                //         textContent:item.words,
                //     },`rectGroup-${item.id+100}`,{
                //         twinkleTime : 2
                //     })
                // )
                // frames.push(
                //     timeRect(svg,{
                //         ...item.pos,
                //         color: item.color|| "#f1a340",
                //         textContent:item.words,
                //     },`rectGroup-${item.id}`,{
                //         ...item.pos,
                //         color:  item.color|| "#f1a340",
                //         x : item.pos.x + 200,
                //         textContent:item.words,
                //     },`rectGroup-${item.id+100}`,{
                //         twinkleTime:2
                //     })
                // )
                // frames.push(
                //     causeRect(svg,{
                //         ...item.pos,
                //         color:  item.color|| "#f1a340",
                //         textContent:item.words,
                //         stroke : {
                //             stroke:"rgba(0,0,0,0.3)",
                //             strokeWidth:5,
                //             strokeDashArray:10
                //         }
                //     },`rectGroup-${item.id}`,{
                //         ...item.pos,
                //         color:  item.color|| "#f1a340",
                //         x : item.pos.x + 200,
                //         textContent:item.words,
                //         stroke : {
                //             stroke:"rgba(0,0,0,0.3)",
                //             strokeWidth:5,
                //         }
                //     },`rectGroup-${item.id+100}`,{
                //     })
                // )
                
            
    
                // frames.push(similarCircle(svg,{
                //     x:item.pos.cx,
                //     y:item.pos.cy,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)"
                // },{
                //     x:item.pos.cx + 100,
                //     y:item.pos.cy + 100,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)"
                // },{
                //     enterDuration:duration/2,
                //     leaveDuration: duration/2
                // }))
    
                // frames.push(diffCircle(svg,{
                //     x:item.pos.cx,
                //     y:item.pos.cy,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)"
                // },{
                //     x:item.pos.cx + 100,
                //     y:item.pos.cy - 100,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)"
                // },{
                //     color:"#f1a340"
                // },{
                //     color:"#998ec3"
                // },
                // {
                //     enterDuration:duration/2,
                //     leaveDuration: duration/2
                // }))
                // frames.push(timeCircle(svg,{
                //     x:item.pos.cx,
                //     y:item.pos.cy,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)"
                // },{
                //     x:item.pos.cx - 100,
                //     y:item.pos.cy - 100,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)"
                // },{
                //     color:"#f1a340"
                // },
                // {
                //     enterDuration:duration/2,
                //     leaveDuration: duration/2
                // }))
    
                // frames.push(causeCircle(svg,{
                //     x:item.pos.cx,
                //     y:item.pos.cy,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color: item.color|| "rgba(239, 217, 111)",
                //     strokeDashArray:10,
                // },{
                //     x:item.pos.cx - 100,
                //     y:item.pos.cy + 100,
                //     innerRadius:item.pos.r-2,
                //     outerRadius:item.pos.r+2,
                //     textContent:item.words,
                //     color:item.color|| "rgba(239, 217, 111)"
                // },{
                //     color:"#f1a340"
                // },
                // {
                //     enterDuration:duration/2,
                //     leaveDuration: duration/2
                // }))
                
          
           
            // case "CE":{
            //     console.log(item,"--TEXT--")
            //     frames.push(similarTendency(svg,{
            //         x1:item.pos.startX,
            //         y1:item.pos.startY,
            //         x2:item.pos.endX,
            //         y2:item.pos.endY,
            //     },{
            //         x1:item.pos.startX+100,
            //         y2:item.pos.startY,
            //         x2:item.pos.endX+100,
            //         y1:item.pos.endY,
            //     },{}))
            //     frames.push(similarTendency(svg,{
            //         x1:item.pos.startX,
            //         y1:item.pos.startY,
            //         x2:item.pos.endX,
            //         y2:item.pos.endY,
            //     },{
            //         x1:item.pos.startX+100,
            //         y2:item.pos.startY,
            //         x2:item.pos.endX+100,
            //         y1:item.pos.endY,
            //     },{}))
            //     frames.push(timeTendency(svg,{
            //         x1:item.pos.startX,
            //         y1:item.pos.startY,
            //         x2:item.pos.endX,
            //         y2:item.pos.endY,
            //     },{
            //         x1:item.pos.startX+100,
            //         y2:item.pos.startY,
            //         x2:item.pos.endX+100,
            //         y1:item.pos.endY,
            //     },{}))
            //     frames.push(causeTendency(svg,{
            //         x1:item.pos.startX,
            //         y1:item.pos.startY,
            //         x2:item.pos.endX,
            //         y2:item.pos.endY,
            //     },{
            //         x1:item.pos.startX+100,
            //         y2:item.pos.startY,
            //         x2:item.pos.endX+100,
            //         y1:item.pos.endY,
            //     },{}))
            // }
                
    
   
}

// 执行生成对应的animation
function animationForm(frames:animationFrame[]){
    let startTime = 0
    for(let element of frames){
        startTime += element.stopTime || 0
        setTimeout(()=>element.animation(),startTime * 1000)
        console.log(startTime , element ,"--")
        startTime += ((element.duration || 0) + (element.gap || 0))
    }
    return startTime
}
import html2canvas from 'html2canvas';
let count = 200
let v 
function renderText(text,x,y,context:CanvasRenderingContext2D,color,fontSize){
    context?.fillText(text,x,y)
}
async function svg2Canvas(svgNode:HTMLElement,ctx){
    // 只负责绘制一帧
        v = await Canvg.fromString(
            ctx as any,
            svgNode.innerHTML
            // svgNode.innerHTML
          );
        const size =   svgNode.getBoundingClientRect()
        v.resize(size.width,size.height)
        v.start(); 
    
    // const textdiv = document.getElementById("foreign-text")!
    // const canvas = document.getElementById("video") as HTMLCanvasElement
    // const context = canvas.getContext("2d")

    //  const canvas = document.getElementById("video") as any
    //  const context = canvas.getContext('2d');
    //  const output = document.getElementById("output-graph")!
    //  console.log(output?.outerHTML,"html--")
    // var draw = function (img) {
    //     console.log(canvas,img,"--draw--")
    //     var width = img.width, height = img.height;
    //     // canvas绘制
    //     canvas.width = width;
    //     canvas.height = height;
    //     // 画布清除
    //     context.clearRect(0, 0, width, height);
    //     // 绘制图片到canvas
    //     context.drawImage(img, 0, 0);
    //   };
    //    // canvas画布绘制的原图片
    // var img = new Image();
    // var htmlSvg = `data:image/svg+xml;charset=utf-8,${output?.outerHTML}`;
    // img.src = htmlSvg;
    // img.width = output?.getBoundingClientRect().width
    // img.height = output.getBoundingClientRect().height
    // draw(img)

    // console.log(document.getElementById("foreign-text"),"doc---")
    // const canvas = document.getElementById("video") as any
    // new XMLSerializer().serializeToString(svgNode)  
    // var htmlSvg = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="' + 
    // svgNode.offsetWidth + '" height="' + 
    // svgNode.offsetHeight + '"><foreignObject x="0" y="0" width="100%" height="100%">'+
    //             new XMLSerializer().serializeToString(svgNode) +
    //             document.querySelector('style').outerHTML +
    //          '</foreignObject></svg>';
    // html2canvas(document.getElementById("foreign-text")!,{
    //     canvas:canvas,
    //     allowTaint:true,
    //         // foreignObjectRendering:true,
    //     backgroundColor: '#ffffff'
    // }).then(val=>{
    //     console.log(count,"----count---")
    //     if(count === 0){
    //         count = 500
    //         let img = document.createElement('a');
    //         img.href = val.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    //         img.download = 'pic_name.jpg';
    //         img.click();
    //     }else{
    //         count--
    //     }
    // })  
  
    // .then(canvas => {
    //     document.body.appendChild(canvas)
    // });
}
const animationSample = (history:transHistoryItem[],chart:SVGElement)=>{
    let startTime = 0
    // 一个动画的持续时间
    let duration = 6
    let gap = 2
    let frames:animationFrame[] = []
    const svg  = chart
    for(let historyitem of history){
        let item = historyitem.itemOneArray[0]
        let itemTwo = historyitem.itemTwoArray[0]
        console.log(item,itemTwo,"---")
        frames.push(similarCircle(svg,{
            x:item.pos.cx,
            y:item.pos.cy,
            innerRadius:item.pos.r-2,
            outerRadius:item.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)"
        },{
            x:itemTwo.pos.cx,
            y:itemTwo.pos.cy,
            innerRadius:itemTwo.pos.r-2,
            outerRadius:itemTwo.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)"
        },{
            enterDuration:duration/2,
            leaveDuration: duration/2
        }))

        frames.push(diffCircle(svg,{
            x:item.pos.cx,
            y:item.pos.cy,
            innerRadius:item.pos.r-2,
            outerRadius:item.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)"
        },{
            x:itemTwo.pos.cx,
            y:itemTwo.pos.cy,
            innerRadius:itemTwo.pos.r-2,
            outerRadius:itemTwo.pos.r+2,
            textContent:"",
            // color: "rgba(45,145,225,0.8)"
            color: "#efd96f",
        },{
            // color:"#f1a340"
        },{
            // color:"#998ec3"
        },
        {
            enterDuration:duration/2,
            leaveDuration: duration/2
        }))
        frames.push(timeCircle(svg,{
            x:item.pos.cx,
            y:item.pos.cy,
            innerRadius:item.pos.r-2,
            outerRadius:item.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)"
        },{
            x:itemTwo.pos.cx,
            y:itemTwo.pos.cy,
            innerRadius:itemTwo.pos.r-2,
            outerRadius:itemTwo.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)"
        },{
            // color:"#f1a340"
        },
        {
            enterDuration:duration/2,
            leaveDuration: duration/2
        }))

        frames.push(causeCircle(svg,{
            x:item.pos.cx,
            y:item.pos.cy,
            innerRadius:item.pos.r-2,
            outerRadius:item.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)",
            strokeDashArray:10,
        },{
            x:itemTwo.pos.cx,
            y:itemTwo.pos.cy,
            innerRadius:itemTwo.pos.r-2,
            outerRadius:itemTwo.pos.r+2,
            textContent:"",
            color:"rgba(45,145,225,0.8)",
        },{
            // color:"#f1a340"
        },
        {
            enterDuration:duration/2,
            leaveDuration: duration/2
        }))
        const circleArray = addCircle([{
            x:item.pos.cx,
            y:item.pos.cy,
            innerRadius:item.pos.r-2,
            outerRadius:item.pos.r+2,
            textContent:"",
            color: "rgba(45,145,225,0.8)",
            // strokeDashArray:10,
        },{
            x:itemTwo.pos.cx,
            y:itemTwo.pos.cy,
            innerRadius:itemTwo.pos.r-2,
            outerRadius:itemTwo.pos.r+2,
            textContent:"",
            color:"rgba(45,145,225,0.8)",
        }],{
            enterDuration:duration/2,
            leaveDuration: duration/2
        })
        frames.push({
            stopTime:0,
            gap:1,
            duration:duration / 2 ,
            animation:()=>{
                circleArray.mount(svg)
                circleArray.beginAnimation()
            }
        })
    }
    return animationForm(frames)
}
let canDownload = false
// 执行动画操作的定时器
let animationHandler 
//  视频数据流
let recorder
//  用来结束记录视频数据流的定时器
let recordStopHandler
//  用来表达 视频流是否已经停止的变量
let hasStopRecorder = true
// 将svg元素的container 作为 节点参数传入即可
async function animation2Video(durationTime, svgNode,canvasNode:HTMLCanvasElement){
    const ctx = canvasNode.getContext("2d");
    console.log(ctx,"----")
    // 调用执行动画的函数 并记录将svg渲染到 canvas上面
    const totalTime = durationTime
    let FrameCount = 0
    animationHandler = setInterval(()=>{
        if(FrameCount <= totalTime * 10){
            svg2Canvas(svgNode,ctx)
            FrameCount++
        }else{
            clearInterval(animationHandler)
        }
    },100)
    recorder = new CanvasRecorder(canvasNode,10000000);
    recorder.start()
    hasStopRecorder = false
    recordStopHandler = setTimeout(()=>{
        canDownload = true
        recorder.stop() 
        hasStopRecorder = true
        message.success("视频播放完毕,可以进行下载!")
    },totalTime * 1000)
}
//  关闭Modal的时候 用来取消视频导出的函数
function interruptSvg2Video(){
    clearTimeout(recordStopHandler)
    clearInterval(animationHandler)
    canDownload = false
    if(!hasStopRecorder)
    recorder.stop()
}
function downloadVideo(){
    if(canDownload){
        recorder.save()
        // canDownload = false
    }
    else{
        message.error("视频还未播放完毕,不能进行导出")
    }
}
export {
    animationForm,
    animationFrame,
    animation2Video,
    animationFormFromHistory,
    interruptSvg2Video,
    downloadVideo,
    animationFormFromNoNIntensifyHistory,
    animationSample
}
// CanvasRecorder.js - smusamashah
// To record canvas effitiently using MediaRecorder
// https://webrtc.github.io/samples/src/content/capture/canvas-record/

function CanvasRecorder(canvas, video_bits_per_sec) {
    this.start = startRecording;
    this.stop = stopRecording;
    this.save = download;

    var recordedBlobs:Blob[] = [];
    var supportedType : string | null = null;
    var mediaRecorder :MediaRecorder | null = null;

    var stream = canvas.captureStream();
    if (typeof stream == undefined || !stream) {
        return;
    }

    const video = document.createElement('video');
    video.style.display = 'none';

    function startRecording() {
        let types = [
            "video/webm",
            'video/webm,codecs=vp9',
            'video/vp8',
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/webm\;codecs=h264",
            "video/mpeg"
        ];

        for (let i in types) {
            if (MediaRecorder.isTypeSupported(types[i])) {
                supportedType = types[i];
                break;
            }
        }
        if (supportedType == null) {
            console.log("No supported type found for MediaRecorder");
        }
        let options = { 
            mimeType: supportedType as string,
            videoBitsPerSecond: video_bits_per_sec || 2500000 // 2.5Mbps
        };

        recordedBlobs = [];
        try {
            mediaRecorder  = new MediaRecorder(stream, options);
        } catch (e) {
            alert('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // collect 100ms of data blobs
        console.log('MediaRecorder started', mediaRecorder);
    }

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
        console.log('Recorder stopped: ', event);
        const superBuffer = new Blob(recordedBlobs, { type: supportedType as string});
        video.src = window.URL.createObjectURL(superBuffer);
    }

    function stopRecording() {
        mediaRecorder!.stop();
        console.log('Recorded Blobs: ', recordedBlobs);
        video.controls = true;
    }

    function download(file_name) {
        console.log(file_name,"----")
        const name = file_name || 'recording.webm';
        const blob = new Blob(recordedBlobs, { type: supportedType as string });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}