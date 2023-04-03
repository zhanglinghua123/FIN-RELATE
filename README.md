## FIN-RELATE 代码简介

### 数据流通逻辑

1. history作为全局的数据源，描述了visualization中的标注对象（ interface historyItem） ，因而整体代码是通过其作为数据源，来进行渲染对应的relationship ( 通过js文件夹中transformhistory这个文件，来转换成case one中的关系 ) ，以及生成对应的video(js文件夹中的animationText : 会将文本切分，并将定时播放，然后当高亮文字播放到的时候，触发对应的动画)

```js
app.config.globalProperties.$history = ref([])
```


### 操作逻辑

1. 由于现在动画逻辑是基于文本切分，并将定时播放，然后当高亮文字播放到的时候，触发对应的动画。因而文本框内如果没有文本，是无法generate对应的动画的。
2. 先将文本放置到text区域，然后点亮标注icon，在标注区域进行绘制，最后当绘制完毕后，点击generate即可播放动画，当播放完毕的时候，可以点击export 导出视频。
3. 具体的操作可以详见example文件夹中的视频



### 整体的文件逻辑

#### js中放置的文件

* addArrow addCircle addMultiRect 为最基本的绘制 箭头 圆形 矩形的逻辑函数
* arrowAnimation arrowWithoutLabel circleAnimation multiAnimation rectionAnimation 这五个文件代表的是将addArrow addCircle addMultiRect拼装起来，对应的对比、时序、因果。。。的动画函数文件
* getDirection 获取向量的单位向量
* LineChart 绘制折线图，有范例代码与数据文件caseData.csv
* mutation 是用来检测contentable的div文本变化，并进行响应的函数
* transformHistory 是对应的case函数 ，将history中的标注 转换为对应的 case


#### 组件

* Input Output 分别为对应的左侧与右侧的大组件
* ListItem 是 relationship中每一个relationshipItem的组件


### 开发者认为后期的可以优化的点

* animationText的切分文本的逻辑，以及将文本进行定时播放逻辑，可能可以进行优化，现在是每段文本3s播放，可以优化为基于文本长度的定时
* 文本现在没有在导出的视频中，个人想法认为可以通过canvas.fillText的函数来直接填写文本
  (html2canvas 这个不行，转换的速度太慢了，无法实现视频60帧的要求，而canvg无法转换foreignObject中的内容)
* 现在是纯前端逻辑，所以transformhistory的转换逻辑可能有问题，可能需要后期调整