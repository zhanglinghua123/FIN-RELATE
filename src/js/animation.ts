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
interface animationFrame {
    // 暂停多少时间后 再执行该动画 
    stopTime? : number
    // 持续时间
    duration?: number
    // 与之后动画的间隔时间
    gap? : number
    // 所执行的动画函数
    animation : ()=>void
}
interface historyItem{
    // 用来高光的文字
    words:string,
    // 有关的位置信息
    pos:any,
    // 有关的时间信息
    time:string,
    // type
    operate : "CIRCLE" | "RECT" | "ARROW"
    // 对应的图形的 id
    id:number
}
function animationFormFromHistory(history:historyItem[],chart:{svg:SVGElement,svgConfig : any}){
    console.log(history,"--history--")
    let startTime = 0
    // 一个动画的持续时间
    let duration = 6
    let gap = 2
    let frames:animationFrame[] = []
    const { svg , svgConfig } = chart
    for(let item of history){
        console.log(item,"--item--")
        if(item.operate === "CIRCLE"){
            // 绘制对应的圆圈动画
            frames.push(similarCircle(svg,{
                x:item.pos.cx,
                y:item.pos.cy,
                innerRadius:item.pos.r-2,
                outerRadius:item.pos.r+2,
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                x:item.pos.cx + 100,
                y:item.pos.cy + 100,
                innerRadius:item.pos.r-2,
                outerRadius:item.pos.r+2,
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                enterDuration:duration/2,
                leaveDuration: duration/2
            }))

            frames.push(diffCircle(svg,{
                x:item.pos.cx,
                y:item.pos.cy,
                innerRadius:item.pos.r-2,
                outerRadius:item.pos.r+2,
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                x:item.pos.cx + 100,
                y:item.pos.cy - 100,
                innerRadius:item.pos.r-2,
                outerRadius:item.pos.r+2,
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                color:"#f1a340"
            },{
                color:"#998ec3"
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
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                x:item.pos.cx - 100,
                y:item.pos.cy - 100,
                innerRadius:item.pos.r-2,
                outerRadius:item.pos.r+2,
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                color:"#f1a340"
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
                textContent:item.words,
                color: "rgba(239, 217, 111)",
                strokeDashArray:10,
            },{
                x:item.pos.cx - 100,
                y:item.pos.cy + 100,
                innerRadius:item.pos.r-2,
                outerRadius:item.pos.r+2,
                textContent:item.words,
                color: "rgba(239, 217, 111)"
            },{
                color:"#f1a340"
            },
            {
                enterDuration:duration/2,
                leaveDuration: duration/2
            }))

        }else if(item.operate === "RECT"){
            console.log(svg, item.pos , item.operate,item,"---")
            frames.push(
                similiarRect(svg,{
                ...item.pos,
                textContent:item.words,
                color: "#f1a340"
            },`rectGroup-${item.id}`,{
                ...item.pos,
                x : item.pos.x + 200,
                textContent:item.words,
                color: "#f1a340"
            },`rectGroup-${item.id+100}`,{
                twinkleTime:2,
                
            })
            )
            frames.push(
                similiarRect(svg,{
                    ...item.pos,
                    color: "#f1a340",
                    textContent:item.words,
                },`rectGroup-${item.id}`,{
                    ...item.pos,
                    x : item.pos.x + 200,
                    color: "#998e43",
                    textContent:item.words,
                },`rectGroup-${item.id+100}`,{
                    twinkleTime : 2
                })
            )
            frames.push(
                timeRect(svg,{
                    ...item.pos,
                    color: "#f1a340",
                    textContent:item.words,
                },`rectGroup-${item.id}`,{
                    ...item.pos,
                    color: "#f1a340",
                    x : item.pos.x + 200,
                    textContent:item.words,
                },`rectGroup-${item.id+100}`,{
                    twinkleTime:2
                })
            )
            frames.push(
                causeRect(svg,{
                    ...item.pos,
                    color: "#f1a340",
                    textContent:item.words,
                    stroke : {
                        stroke:"rgba(0,0,0,0.3)",
                        strokeWidth:5,
                        strokeDashArray:10
                    }
                },`rectGroup-${item.id}`,{
                    ...item.pos,
                    color: "#f1a340",
                    x : item.pos.x + 200,
                    textContent:item.words,
                    stroke : {
                        stroke:"rgba(0,0,0,0.3)",
                        strokeWidth:5,
                    }
                },`rectGroup-${item.id+100}`,{
                })
            )
        }else if(item.operate === "ARROW"){
          //  绘制对应的箭头动画
            frames.push(
            similiarArrow(svg,{
                x1:item.pos.startX,
                y1:item.pos.startY,
                x2:item.pos.endX,
                y2:item.pos.endY,
                textContent:item.words || "1212"
            },{
                x1:item.pos.startX+100,
                y1:item.pos.startY,
                x2:item.pos.endX+100,
                y2:item.pos.endY,
                textContent:item.words || "1212"
            },{}))

            frames.push(
                similiarArrow(svg,{
                    x1:item.pos.startX,
                    y1:item.pos.startY,
                    x2:item.pos.endX,
                    y2:item.pos.endY,
                    textContent:item.words || "1212"
                },{
                    x1:item.pos.startX+100,
                    y1:item.pos.startY,
                    x2:item.pos.endX+100,
                    y2:item.pos.endY,
                    textContent:item.words || "1212",
                    color:"#9983c9"
                },{}))

                frames.push(
                    timeArrow(svg,{
                        x1:item.pos.startX,
                        y1:item.pos.startY,
                        x2:item.pos.endX,
                        y2:item.pos.endY,
                        textContent:item.words || "1212"
                    },{
                        x1:item.pos.startX+100,
                        y1:item.pos.startY,
                        x2:item.pos.endX+100,
                        y2:item.pos.endY,
                        textContent:item.words || "1212",
                        color:"#9983c9"
                    },{}))

                frames.push(
                    causeArrow(svg,{
                            x1:item.pos.startX,
                            y1:item.pos.startY,
                            x2:item.pos.endX,
                            y2:item.pos.endY,
                            textContent:item.words || "1212",
                          
                        },{
                            x1:item.pos.startX+200,
                            y1:item.pos.startY,
                            x2:item.pos.endX+200,
                            y2:item.pos.endY,
                            textContent:item.words || "1212",
                            color:"#9983c9",
                        },{}))
                frames.push(similarTendency(svg,{
                    x1:item.pos.startX,
                    y1:item.pos.startY,
                    x2:item.pos.endX,
                    y2:item.pos.endY,
                },{
                    x1:item.pos.startX+100,
                    y2:item.pos.startY,
                    x2:item.pos.endX+100,
                    y1:item.pos.endY,
                },{}))
                frames.push(similarTendency(svg,{
                    x1:item.pos.startX,
                    y1:item.pos.startY,
                    x2:item.pos.endX,
                    y2:item.pos.endY,
                },{
                    x1:item.pos.startX+100,
                    y2:item.pos.startY,
                    x2:item.pos.endX+100,
                    y1:item.pos.endY,
                },{}))
                frames.push(timeTendency(svg,{
                    x1:item.pos.startX,
                    y1:item.pos.startY,
                    x2:item.pos.endX,
                    y2:item.pos.endY,
                },{
                    x1:item.pos.startX+100,
                    y2:item.pos.startY,
                    x2:item.pos.endX+100,
                    y1:item.pos.endY,
                },{}))
                frames.push(causeTendency(svg,{
                    x1:item.pos.startX,
                    y1:item.pos.startY,
                    x2:item.pos.endX,
                    y2:item.pos.endY,
                },{
                    x1:item.pos.startX+100,
                    y2:item.pos.startY,
                    x2:item.pos.endX+100,
                    y1:item.pos.endY,
                },{}))

        }
    }
    return animationForm(frames)
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
async function svg2Canvas(svgNode,ctx){
    
    const v = await Canvg.fromString(
        ctx as any,
        svgNode.innerHTML
      );
    v.resize(600,400)
    v.start(); 
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
async function animation2Video(durationTime, svgNodeContainer){
    const canvas = document.getElementById("video") as HTMLCanvasElement
    const ctx = canvas.getContext("2d");
    // 调用执行动画的函数 并记录将svg渲染到 canvas上面
    const totalTime = durationTime
    let FrameCount = 0
    animationHandler = setInterval(()=>{
        if(FrameCount <= totalTime * 50){
            svg2Canvas(svgNodeContainer,ctx)
            FrameCount++
        }else{
            clearInterval(animationHandler)
        }
    },20)
    recorder = new CanvasRecorder(canvas,4500000);
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