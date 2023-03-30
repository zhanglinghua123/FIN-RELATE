interface config{
    fontSize:number,
    wordsDict:string[]
}
const animationText = (textContainerId,renderId,config:config)=>{
    const {fontSize = 16,wordsDict = []} = config
    const textArea = document.getElementById(textContainerId)

    console.log(textArea?.innerText,wordsDict,"--animationText--")
    
    // 这是所对应的纯文本
    let pureString:string = labelString(textArea?.innerText)
    let paragraph = pureString.split(/\n+/g)
    const container = document.getElementById(renderId) as HTMLElement
    const width = container?.getBoundingClientRect().width
    const height = container?.getBoundingClientRect().height
    const maxLength = Math.round( (width - 100) / fontSize )
    let message = paragraph.reduce((pre,next)=>pre+next)
        
    // 添加字幕的文本框
    const svgElement = document.getElementById(renderId)
    let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    myforeign.setAttribute("width", `100%`);
    myforeign.setAttribute("height",`100%`);
    myforeign.style.textAlign = "left"
    myforeign.style.fontSize = "16px"
    myforeign.setAttribute("transform", `translate(${0} ${height * 0.8})`)
    let textdiv = document.createElement("div");
    let textnode = document.createTextNode( "");
    textdiv.appendChild(textnode);
    textdiv.setAttribute("width", "auto");
    textdiv.setAttribute("display","flex")
    textdiv.setAttribute("align-items","center")
    textdiv.setAttribute("justify-content","center")
    // textdiv.setAttribute("id","renderText")
    // textdiv.style.setProperty('-webkit-background-clip', 'text');
    textdiv.style.textAlign = "center"
    textdiv.style.color = "transparent"
    textdiv.style.background = "linear-gradient(90deg, blue 0%,blue 50%, gray 50% 100%)"
    textdiv.style.setProperty('-webkit-background-clip', 'text');
    myforeign.append(textdiv)
    svgElement?.append(myforeign)
    // myforeign.setAttribute("width", `${textdiv.getBoundingClientRect().width}px`);
    // myforeign.setAttribute("height",`${textdiv.getBoundingClientRect().height}px`);
    // setChangeBackground(5,textdiv,renderArray[0],wordsDict)
    // console.log(renderArray,"----")
    let renderArray = formatWords(message,wordsDict,maxLength)
    console.log(renderArray,"--final--renderArray--")
    return renderArray.map(val=>{
        return textAnimation(textdiv,val,wordsDict)
    })
}
const labelString = (str) => {
    str = str.replace(/\<[^>]*\>(([^<])*)/gi, function () {
      return arguments[1];
    });
    return str;
  };
export {
    animationText
}

const formatWords = (sentence:string,wordsDict:string[],maxLength:number)=>{
    console.log(sentence,wordsDict,maxLength,"--")
    let renderArray:string[] = []
    // 把不能分割的词汇先分割出来
    for(let word of wordsDict){
        let beginIndex = sentence.indexOf(word)
        let endIndex = beginIndex + word.length
        while(sentence[beginIndex] !== " "){
            beginIndex--
        }
        while(sentence[endIndex-1] !== " "){
            endIndex++
        }
        // console.log(beginIndex,endIndex,"----")
        // console.log(sentence.slice(beginIndex,endIndex))
        renderArray.push(...sentence.slice(0,beginIndex).split(" "))
        renderArray.push(sentence.slice(beginIndex,endIndex))
        sentence = sentence.slice(endIndex)
    }
    renderArray.push(...sentence.split(" "))
    let words = renderArray
    renderArray = []
    console.log(renderArray,words,"--array--")
    let total = 0
    let mid = ""
    for(let word of words){
        if((total - (word.length+1)) <= maxLength){
            mid += " " + word 
            total += word.length + 1
        }else{
            renderArray.push(mid)
            mid = word
            total = word.length
        }
    }
    renderArray.push(mid)
    return renderArray
}

const textAnimation = (node,renderString:string,highLightWords:string[])=>{
    // 先执行第一个字符串序列的渲染
    // let renderIndex = 0
    let keyWords:string[] = []
    highLightWords.forEach((val)=>{
        if(renderString.indexOf(val) >= 0){
            renderString = renderString.replace(val,replaceTextToFont(val))
            keyWords.push(val)
        }
    })
    return {
        animation : (period:number)=>{
            node.innerHTML = renderString
            let frameCount = 0
            const handler = setInterval(()=>{
                if(frameCount < 60){
                    node.style.background = `linear-gradient(90deg, blue 0%,blue ${frameCount * 100 / 60}%, gray 50% 100%)`
                    node.style.setProperty('-webkit-background-clip', 'text');
                    frameCount++
                }else{
                    clearInterval(handler)
                    // node.innerText = ""
                }
            },period * 1000 / 60)
        },
        keyWords,
        plus:[]
    }
   
    // // 再执行之后的序列的渲染
    // const changeText = setInterval(()=>{
    //     if(renderIndex === renderArray.length){
    //         clearInterval(changeText)
    //         node.innerText = ""
    //     }else{
    //         node.innerText = renderArray[renderIndex]
    //         let frameCount = 0
    //         const handler = setInterval(()=>{
    //             if(frameCount < 60){
    //                 node.style.background = `linear-gradient(90deg, blue 0%,blue ${frameCount * 100 / 60}%, gray 50% 100%)`
    //                 node.style.setProperty('-webkit-background-clip', 'text');
    //                 frameCount++
    //             }else{
    //                 clearInterval(handler)
    //             }
    //         },period * 1000 / 60)
    //         renderIndex++
    //     }
    // },period * 1000)
   
}
function replaceTextToFont(string:string){
    return `<Font style="border-bottom: 1px solid red;">${string}</Font>`
}