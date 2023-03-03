import { Canvg } from "canvg";
// 时间单位均为 秒
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
// 执行生成对应的animation
function animationForm(frames:animationFrame[]){
    let startTime = 0
    for(let element of frames){
        startTime += element.stopTime || 0
        setTimeout(()=>element.animation(),startTime * 1000)
        console.log(startTime , element ,"--")
        startTime += ((element.duration || 0) + (element.gap || 0))
    }
}
async function svg2Canvas(svgNode,ctx){
    
    const v = await Canvg.fromString(
        ctx as any,
        svgNode.innerHTML
      );
    v.resize(600,400)
    v.start(); 
}
// 将svg元素的container 作为 节点参数传入即可
async function animation2Video(svgNodeContainer){
    const canvas = document.getElementById("video") as HTMLCanvasElement
    const ctx = canvas.getContext("2d");
    setInterval(()=>{
        svg2Canvas(svgNodeContainer,ctx)
    },33)
   
    const mediaStream = canvas.captureStream() // 设置帧频率(FPS)
    const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });

    const data:Blob[] = [];
    recorder.ondataavailable = function (event) {
      if (event.data && event.data.size) {
        data.push(event.data);
      }
    };
    recorder.start()
    setTimeout(()=>{
        recorder.stop()
    },10000)
    recorder.onstop = () => {
        const url = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));
        download(url)
    };
}

function download (videoUrl) {
    var a = document.createElement('a')
    a.href = videoUrl
    a.download = 'record-canvas.webm'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
}
export {
    animationForm,
    animation2Video
}