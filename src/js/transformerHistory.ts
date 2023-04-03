interface ListItem{
    type: string,
    itemOneArray: any[],
    itemTwoArray: any[],
    isMulti: boolean,
    svgWidth?: string,
    explanation:string,
}
const transformer = (history)=>{
    // console.log(history.length,"---")
    let historyMid = history
    const exampleArray : ListItem []= [
        {
            type:"TS",
            itemOneArray:[historyMid[0]],
            itemTwoArray:[historyMid[1]],
            isMulti:false,
            explanation:"The paragraph describes the chronological progression of Tesla's stock price changes during 2021"
        },
        {
            type:"CE",
            itemOneArray:[historyMid[2],historyMid[3]],
            itemTwoArray:[historyMid[4]],
            isMulti:true,
            explanation:"The paragraph explains how specific events and factors caused the decline in Tesla's stock price"
        },
        {
            type:"SC",
            itemOneArray:[historyMid[5]],
            itemTwoArray:[historyMid[6]],
            isMulti:false,
            explanation:"The paragraph compares Tesla's stock price and its recovery in its two different periods, highlighting its resilience"
        },
        {
            type:"DC",
            itemOneArray:[historyMid[7]],
            itemTwoArray:[historyMid[8]],
            isMulti:false,
            explanation:"The paragraph contrasts the stock price reaction to two different events related to Tesla's environmental efforts",
        },
    ]
        if( historyMid.length >= 8){
            return exampleArray
        } else if(historyMid.length >= 6) {
            return exampleArray.slice(0,3)
        }else if(historyMid.length >=3){
            if(historyMid.length === 3){
                return [  {
                    type:"TS",
                    itemOneArray:[historyMid[0]],
                    itemTwoArray:[historyMid[1]],
                    isMulti:false,
                    explanation:"The paragraph describes the chronological progression of Tesla's stock price changes during 2021"
                },
                {
                    type:"CE",
                    itemOneArray:[historyMid[2]],
                    itemTwoArray:[historyMid[3]],
                    isMulti:false,
                    explanation:"The paragraph explains how specific events and factors caused the decline in Tesla's stock price"
                },]
            }else if(historyMid.length ===4){
                return [  {
                    type:"TS",
                    itemOneArray:[historyMid[0]],
                    itemTwoArray:[historyMid[1]],
                    isMulti:false,
                    explanation:"The paragraph describes the chronological progression of Tesla's stock price changes during 2021"
                },
                {
                    type:"CE",
                    itemOneArray:[historyMid[2]],
                    itemTwoArray:[historyMid[3]],
                    isMulti:false,
                    explanation:"The paragraph explains how specific events and factors caused the decline in Tesla's stock price"
                },]
            }else
                return exampleArray.slice(0,2)
        }else if(historyMid.length >= 1){
            let result = exampleArray.slice(0,1)
            result[0].explanation = historyMid.length === 2 ? result[0].explanation :""
            return result
        }else{
            return []
        }
}
export {
    transformer
}