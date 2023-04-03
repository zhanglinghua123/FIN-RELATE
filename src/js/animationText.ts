interface config{
    fontSize:number,
    wordsDict:string[]
}
interface textAnimationItem {
    animation:(period:number,clearTime:number)=>void,
    keyWords:string[]
    plus:any[]
}
const animationText = (textContainerId,renderId,config:config):textAnimationItem[]=>{
    const {fontSize = 16,wordsDict = []} = config
    const textArea = document.getElementById(textContainerId)

    console.log(textArea?.innerText,wordsDict,"--animationText--")
    
    // 这是所对应的纯文本
    let pureString:string = labelString(textArea?.innerText)
    // let paragraph = pureString.split(/\n+/g)
    const container = document.getElementById(renderId) as HTMLElement
    const width = container?.getBoundingClientRect().width
    const height = container?.getBoundingClientRect().height
    const maxLength = Math.round( (width - 60) / fontSize )
    let message = pureString
        
    // 添加字幕的文本框
    const svgElement = document.getElementById(renderId)
    let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    myforeign.setAttribute("width", `100%`);
    myforeign.setAttribute("height",`100%`);
    myforeign.setAttribute("id","foreign")
    myforeign.style.textAlign = "left"
    myforeign.style.fontSize = "16px"
    myforeign.setAttribute("transform", `translate(${0} ${height * 0.77})`)
    // myforeign.setAttribute("display","none")
    let textdiv = document.createElement("div");
    let textnode = document.createTextNode( "");
    // 先设置样式 避免频闪
    textdiv.style.textAlign = "center"
    textdiv.style.color = "transparent"
    textdiv.style.background = "linear-gradient(90deg, blue 0%,blue 0%, gray 0% 100%)"
    textdiv.style.setProperty('-webkit-background-clip', 'text');
    textdiv.appendChild(textnode);
    textdiv.setAttribute("width", "auto");
    textdiv.setAttribute("display","flex")
    textdiv.setAttribute("align-items","center")
    textdiv.setAttribute("justify-content","center")
    textdiv.setAttribute("id","foreign-text")
    // textdiv.setAttribute("display","none")
    // textdiv.setAttribute("id","renderText")
    // textdiv.style.setProperty('-webkit-background-clip', 'text');
   
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
        while(sentence[beginIndex] !== " " && (endIndex >= 0 ) ){
            beginIndex--
        }
        // 不加校验 就会死循环
        while(sentence[endIndex-1] !== " " && (endIndex < sentence.length ) ){
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
const clearText = (node)=>{
    // 避免频闪
    node.style.background = `transparent`
    node.style.setProperty('-webkit-background-clip', 'text');
    node!.textContent = ""
}
const textAnimation = (node,renderString:string,highLightWords:string[])=>{
    // 先执行第一个字符串序列的渲染
    let renderIndex = 0
    let keyWords:string[] = []
    // 避免html2canvas 报错

    
    renderString = renderString.replace("&nbsp","&#160")
    highLightWords.forEach((val)=>{
        if(renderString.indexOf(val) >= 0){
            renderString = renderString.replace(val,replaceTextToFont(val))
            keyWords.push(val)
        }
    })
    return {
        animation : (period:number,clearTime:number)=>{
            node.innerHTML = renderString
            let frameCount = 0
            const handler = setInterval(()=>{
                if(frameCount < 60){
                    // console.log(frameCount,"--Frame--",renderString)
                    node.style.background = `linear-gradient(90deg, blue 0%,blue ${frameCount * 100 / 60}%, gray ${frameCount * 100 / 60}% 100%)`
                    // node.style.background = "transparent"
                    node.style.setProperty('-webkit-background-clip', 'text');
                    frameCount++
                }else{
                    clearInterval(handler)
                }
            },period * 1000 / 60)
            setTimeout(()=>{
                clearText(node)
            },clearTime * 1000)
        },
        keyWords,
        plus:[]
    }
   
   
}
function replaceTextToFont(string:string){
    return `<Font style="border-bottom: 1px solid red;">${string}</Font>`
}
export {
    textAnimationItem
}