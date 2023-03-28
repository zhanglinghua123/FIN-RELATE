const fetchData = async ()=>{
    await fetch("https://query1.finance.yahoo.com/v8/finance/chart/TSLA?symbol=TSLA&period1=1618243200&period2=1679920646&useYfid=true&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&crumb=undefined&corsDomain=finance.yahoo.com")
    .then(val=>val.json())
    .then(val=>{
        // console.log(val.chart.result[0].timestamp)
        // console.log(val.chart.result[0].indicators.adjclose[0].adjclose)
        // console.log(val.chart.result[0].indicators.quote[0].open)
        // console.log(val.chart.result[0].indicators.quote[0].close)
        // console.log(val.chart.result[0].indicators.quote[0].low)
        // console.log(val.chart.result[0].indicators.quote[0].high)
        // console.log(val.chart.result[0].indicators.quote[0].volume)
        download("timestamp,adjclose,open,close,low,high,volume,\n" , [val.chart.result[0].timestamp,
        val.chart.result[0].indicators.adjclose[0].adjclose,
        val.chart.result[0].indicators.quote[0].open,
        val.chart.result[0].indicators.quote[0].close,
        val.chart.result[0].indicators.quote[0].low,
        val.chart.result[0].indicators.quote[0].high,
        val.chart.result[0].indicators.quote[0].volume
        ])
    })
}
fetchData()
const download = (str, data) => {
    
    // 增加\t为了不让表格显示科学计数法或者其他格式

    console.log(data[0][0])
    for(let i=0;i<data[0].length;i++){
        for(let j=0;j<data.length;j++){
            str += data[j][i] + ','
        }
        str += '\n'
    }
    // encodeURIComponent解决中文乱码
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
    // 通过创建a标签实现
    const link = document.createElement("a")
    link.href = uri
    // 对下载的文件命名
    link.download =  "下载数据.csv"
    link.click()
}
