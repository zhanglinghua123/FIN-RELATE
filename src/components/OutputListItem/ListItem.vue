<template>
    <div :style="{
        width: width,
        height: height
    }" v-if="isMulti === false" class="item">
        <div :class="{
            itemOne: true,
            isHighLight: itemOneArray && itemOneArray[0]?.highLight
        }" @mouseenter="itemOneArray && highLight(itemOneArray[0])"
            @mouseleave="itemOneArray && dishighLight(itemOneArray[0])" :style="generateStyle(type, 1)">
            <p> {{ itemOneArray && itemOneArray[0]?.words }}</p>
        </div>
        <div class="transition" :class="{
            notShow: itemTwoArray && itemTwoArray[0] === undefined
        }">
            <svg :style="{
                width: svgWidth,
            }" @mouseenter="highArrowLight(itemOneArray, itemTwoArray)"
                @mouseleave="dishighMultiLight(itemOneArray, itemTwoArray)" v-if="type === 'SC' || type === 'DC'"
                xmlns="http://www.w3.org/2000/svg" stroke="white" viewBox="0 0 100 100">
                <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" /> <!-- 模糊半径为 20 像素 -->
                    <feOffset dx="0" dy="0" result="offsetblur" /> <!-- 阴影偏移量为 0 像素 -->
                    <feFlood flood-color="#11b5cccf" />
                    <!-- 阴影颜色为黄色 -->
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <g width="100" height="100" x="0" y="0" :filter="
                    (itemTwoArray && itemTwoArray[0]?.highLight) || (itemOneArray && itemOneArray[0]?.highLight) ? 'url(#dropshadow)' :
                        ''">
                    <path d="M20,50 L80,50" stroke="white" stroke-width="20" />
                    <path d="M100,50 L80,30 L80,70 M100,50" fill="white" stroke="white" />
                    <path d="M0,50 L20,30 L20,70 L0,50" fill="white" stroke="white" />
                </g>

            </svg>
            <svg :style="{
                width: svgWidth
            }" @mouseenter="highArrowLight(itemOneArray, itemTwoArray)"
                @mouseleave="dishighMultiLight(itemOneArray, itemTwoArray)" v-if="type === 'TS' || type === 'CE'"
                xmlns="http://www.w3.org/2000/svg" stroke="white" viewBox="0 0 100 100">
                <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" /> <!-- 模糊半径为 20 像素 -->
                    <feOffset dx="0" dy="0" result="offsetblur" /> <!-- 阴影偏移量为 0 像素 -->
                    <feFlood flood-color="#11b5cccf" />
                    <!-- 阴影颜色为黄色 -->
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <g width="100" height="100" x="0" y="0" :filter="
                    (itemTwoArray && itemTwoArray[0]?.highLight) || (itemOneArray && itemOneArray[0]?.highLight) ? 'url(#dropshadow)' :
                        ''">
                    <path d="M10,50 L80,50" stroke="white" stroke-width="20" />
                    <path d="M100,50 L80,30 L80,70 L100,50" fill="white" stroke="white" />
                </g>

            </svg>
            <svg :style="{
                width: svgWidth
            }" @mouseenter="highArrowLight(itemOneArray, itemTwoArray)"
                @mouseleave="dishighMultiLight(itemOneArray, itemTwoArray)" v-if="type === 'WR'"
                xmlns="http://www.w3.org/2000/svg"
                :opacity="itemOneArray?.reduce((pre, current) => pre.highLight || current.highLight)" stroke="white"
                viewBox="0 0 100 100">
                <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" /> <!-- 模糊半径为 20 像素 -->
                    <feOffset dx="0" dy="0" result="offsetblur" /> <!-- 阴影偏移量为 0 像素 -->
                    <feFlood flood-color="#11b5cccf" />
                    <!-- 阴影颜色为黄色 -->
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <g width="100" height="100" x="0" y="0" :filter="
                    (itemTwoArray && itemTwoArray[0]?.highLight) || (itemOneArray && itemOneArray[0]?.highLight) ? 'url(#dropshadow)' :
                        ''">
                    <path d="M20,30 L30,20 L80,70 L70,80 M20,30" fill="white" stroke="white"></path>
                    <path d="M80,30 L70,20 L20,70 L30,80 M80,30" fill="white" stroke="white" />
                </g>

            </svg>
        </div>
        <div :class="{
            itemTwo: true,
            isHighLight: itemTwoArray && itemTwoArray[0]?.highLight,
            notShow: itemTwoArray && itemTwoArray[0] === undefined
        }" :style="generateStyle(type, 2)" @mouseenter="itemTwoArray && highLight(itemTwoArray[0])"
            @mouseleave="itemTwoArray && dishighLight(itemTwoArray[0])">
            <p> {{ itemTwoArray && itemTwoArray[0]?.words }} </p>
        </div>
    </div>
    <div :style="{
        width: width,
        height: multiHeight
    }" v-if="isMulti === true" class="item-multi">
        <div class="content-list-multi">
            <div class="content-list-multi-item" v-for="item in itemOneArray" :class="{
                itemOne: true,
                isHighLight: item && item.highLight
            }" @mouseenter="highLight(item)" @mouseleave="dishighLight(item)" :style="generateStyle(type, 1)">
                <p> {{ item && item.words }}</p>
            </div>
        </div>
        <div class="transition">
            <svg :style="{
                width: svgWidth
            }" @mouseenter="highArrowLight(itemOneArray, itemTwoArray)"
                @mouseleave="dishighMultiLight(itemOneArray, itemTwoArray)" v-if="type === 'TS' || type === 'CE'"
                xmlns="http://www.w3.org/2000/svg" stroke="white" viewBox="0 0 100 100">
                <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" /> <!-- 模糊半径为 20 像素 -->
                    <feOffset dx="0" dy="0" result="offsetblur" /> <!-- 阴影偏移量为 0 像素 -->
                    <feFlood flood-color="#11b5cccf" />
                    <!-- 阴影颜色为黄色 -->
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <g width="100" height="100" x="0" y="0" :filter="
                    (itemTwoArray && itemTwoArray[0]?.highLight) || (itemOneArray && itemOneArray[0]?.highLight) ? 'url(#dropshadow)' :
                        ''">
                    <!-- <path d="M0,10 Q30,15 70,50" fill="white" stroke="white"></path> -->
                    <!-- <path d="M10,20 L10,30 L35,30 L35,50 L50,50 L50,20 L10,20" fill="white" stroke="white"></path> -->
                    <!-- <path d="M10,80 L10,70 L35,70 L35,50 L50,50 L50,80 L10,80" fill="white" stroke="white"></path> -->
                    <!-- <path d="M50,50 L80,50" stroke="white" stroke-width="20" /> -->
                    <!-- <path d="M100,50 L80,30 L80,70 L100,50" fill="white" stroke="white" /> -->
                    <path d="M10,20 C25,20 35,28 45,35 M45,35 C55,42 65,50 80,50" fill="transparent" stroke="white"
                        stroke-width="12"></path>
                    <!-- <path d="M10,20 L10,30 L35,30 L35,50 L50,50 L50,20 L10,20" fill="white" stroke="white"></path> -->
                    <!-- <path d="M10,80 L10,70 L35,70 L35,50 L50,50 L50,80 L10,80" fill="white" stroke="white"></path> -->
                    <!-- <path d="M50,50 L80,50" stroke="white" stroke-width="20" /> -->
                    <path d="M100,50 L80,30 L80,70 L100,50" fill="white" stroke="white" />
                    <path d="M10,80 C25,80 35,72 45,65 M45,65 C55,58 65,50 80,50" fill="transparent" stroke="white"
                        stroke-width="12"></path>
                </g>
            </svg>
        </div>

        <div :class="{
            itemTwo: true,
            isHighLight: itemTwoArray && itemTwoArray[0].highLight
        }" :style="generateStyle(type, 2)" @mouseenter="itemTwoArray && highLight(itemTwoArray[0])"
            @mouseleave="itemTwoArray && dishighLight(itemTwoArray[0])" class="content-list-multi-item2">
            <p> {{ itemTwoArray && itemTwoArray[0]?.words }}</p>
        </div>
    </div>
</template>
<script setup>
import { toRefs, getCurrentInstance, effect } from 'vue';
const props = defineProps({
    // 类型 
    type: String,
    // 左侧对象的数组
    itemOneArray: Array,
    // 右侧对象的数组
    itemTwoArray: Array,
    // 是否为多因果逻辑
    isMulti: Boolean,
    // svgWidth的宽度
    svgWidth: String,
    // 对应的整体宽高
    height: String,
    width: String,
    // 多因果的高度
    multiHeight: String,
    // 具体的解释文字
    explain: String,
    // 是否为最后一个的item
    isLast: Boolean,
})
const emit = defineEmits(["changeExplain", "changeExplainContent"])
// 获取出来props属性
const { type, itemOneArray, itemTwoArray, isMulti, svgWidth, height, width, multiHeight, explain, isLast } = toRefs(props)

// 表达鼠标正在上面
let onHover = false

// 根据参数 生成对应的样式
const generateStyle = (type, number) => {
    if (number === 1)
        switch (type) {
            case "SC":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
            case "DC":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
            case "TS":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
            case "CE":
                return {
                    borderColor: 'rgba(45,145,225,1)',
                    borderStyle: "dashed"
                }
            case "WR":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
        }
    else if (number === 2) {
        switch (type) {
            case "SC":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
            case "DC":
                return {
                    borderColor: 'red'
                }
            case "TS":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
            case "CE":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
            case "WR":
                return {
                    borderColor: 'rgba(45,145,225,1)'
                }
        }
    }
}
// highLight
const { proxy } = getCurrentInstance()
const history = proxy.$history
const highLight = (item) => {
    // 避免item为undefined
    if (!item) return
    const id = item.id
    const operate = item.operate
    let textId = `font-${id}`
    let backId
    switch (operate) {
        case "CIRCLE":
            backId = `circleBack-${id}`
            break
        case "RECT":
            backId = `rectBack-${id}`
            break
        case "ARROW":
            backId = `arrowBack-${id}`
            break
        case "TEXT":
            backId = `arrowBack-${id}`
            break
    }
    const font = document.getElementById(textId)
    if (font)
        font.style.backgroundColor = ''
    let BackItem = document.getElementById(backId)
    if (BackItem) {
        BackItem.setAttribute("opacity", 1)
    }
    if (itemTwoArray.value && itemTwoArray.value[0] !== undefined) {
        BackItem.setAttribute("display", "unset")
        // BackItem.removeAttribute("display")
        let graphItem = document.getElementById(id)
        graphItem.setAttribute("display", "unset")
        // BackItem.removeAttribute("display")
        if (item.operate === "TEXT") {
            let textItem = document.getElementById(`text-${id}`)
            textItem.setAttribute("display", "unset")
        }
    }
    const index = history.value.findIndex(e => e.id === id)
    history.value[index].highLight = true
    emit("changeExplain", true)
    emit("changeExplainContent", explain.value)
    onHover = true
}
const dishighLight = (item) => {
    // 避免item为undefined
    if (!item) return

    const id = item.id
    const operate = item.operate
    let textId = `font-${id}`
    let backId
    switch (operate) {
        case "CIRCLE":
            backId = `circleBack-${id}`
            break
        case "RECT":
            backId = `rectBack-${id}`
            break
        case "ARROW":
            backId = `arrowBack-${id}`
            break
        case "TEXT":
            backId = `arrowBack-${id}`
            break
    }
    const font = document.getElementById(textId)
    if (font)
        font.style.backgroundColor = '#11b5cc30'
    let BackItem = document.getElementById(backId)
    if (BackItem) {
        BackItem.setAttribute("opacity", 0)
    }
    if (itemTwoArray.value && itemTwoArray.value[0] !== undefined) {
        // BackItem.setAttribute("display", "none")
        // let graphItem = document.getElementById(id)
        // graphItem.setAttribute("display", "none")
    }
    const index = history.value.findIndex(e => e.id === id)
    if (index >= 0)
        history.value[index].highLight = false
    emit("changeExplain", false)
    // emit("changeExplainContent", "")
    onHover = false
}
const highArrowLight = (itemOneArray, itemTwoArray) => {
    itemOneArray?.forEach((item) => {
        highLight(item)
    })
    itemTwoArray?.forEach((item) => {
        highLight(item)
    })
    onHover = true
}
const dishighMultiLight = (itemOneArray, itemTwoArray) => {
    itemOneArray?.forEach((item) => {
        dishighLight(item)
    })
    itemTwoArray?.forEach((item) => {
        dishighLight(item)
    })
    onHover = false
}
// 移除对应的标注对象
const removeItems = (item, value) => {
    // 避免item为undefined
    if (!item) return
    const id = item.id
    const operate = item.operate
    // let textId = `font-${id}`
    let backId
    let graphId = id
    let plusId
    switch (operate) {
        case "CIRCLE":
            backId = `circleBack-${id}`
            break
        case "RECT":
            backId = `rectBack-${id}`
            break
        case "ARROW":
            backId = `arrowBack-${id}`
            break
        case "TEXT":
            backId = `arrowBack-${id}`
            plusId = `text-${id}`
            break
    }

    // const font = document.getElementById(textId)
    // if (font)
    // font.style.backgroundColor = 'rgba(245,255,0,0.3)'
    let BackItem = document.getElementById(backId)
    if (BackItem) {
        BackItem.setAttribute("display", value)
    }
    let GraphItem = document.getElementById(graphId)
    if (GraphItem) {
        GraphItem.setAttribute("display", value)
    }
    if (plusId) {
        let PlusItem = document.getElementById(plusId)
        if (PlusItem) {
            PlusItem.setAttribute("display", value)
        }
    }
}
// 当所有数据都完备的时候 并且下一个history开始标注的时候 则remove掉所有的标注
effect(() => {
    if (itemTwoArray.value && itemTwoArray.value[0] !== undefined && !onHover && !(isLast.value)) {
        itemOneArray.value.forEach(item => removeItems(item, "none"))
        itemTwoArray.value.forEach(item => removeItems(item, "none"))
    }
    // else {
    //     itemOneArray?.value?.forEach(item => removeItems(item, ""))
    //     itemTwoArray?.value?.forEach(item => removeItems(item, ""))
    // }
})
</script>
<style lang="scss">
.item {
    display: flex;
    min-width: 100px;
    margin-bottom: 20px;
}

.isHighLight {
    box-shadow: 0 0 20px #11b5cccf;
}


.itemOne {
    width: 35%;
    height: 100%;
    background-color: white;
    border-radius: 5%;
    border: 3px salmon solid;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
        margin: 0;
        padding-left: 10%;
        padding-right: 10%;
        white-space: nowrap;
        /* 不换行 */
        overflow: hidden;
        /* 溢出部分隐藏 */
        text-overflow: ellipsis;
        /* 超出部分用省略号表示 */
    }
}

.transition {
    width: 30%;
    height: 100%;
    position: relative;

    p {
        text-align: center;
        margin-bottom: 0;
    }

    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        max-width: 100%;
        width: 50%;
        // height: 30%;
    }
}

.itemTwo {
    width: 35%;
    height: 100%;
    background-color: white;
    background-color: white;
    border-radius: 5%;
    border: 3px skyblue solid;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
        margin: 0;
        padding-left: 10%;
        padding-right: 10%;
        white-space: nowrap;
        /* 不换行 */
        overflow: hidden;
        /* 溢出部分隐藏 */
        text-overflow: ellipsis;
        /* 超出部分用省略号表示 */
    }
}

.item-multi {
    display: flex;
    width: 100%;
    margin-bottom: 20px;

    .content-list-multi {
        display: flex;
        height: 100%;
        width: 35%;
        flex-direction: column;
        justify-content: space-around;

        .content-list-multi-item {
            width: 100%;
            height: 40%;

            p {
                margin: 0;
                padding-left: 10%;
                padding-right: 10%;
                white-space: nowrap;
                /* 不换行 */
                overflow: hidden;
                /* 溢出部分隐藏 */
                text-overflow: ellipsis;
                /* 超出部分用省略号表示 */
            }
        }

        .transition {
            width: 30%;
            height: 100%;
            position: relative;

            p {
                text-align: center;
                margin-bottom: 0;
            }

            svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: block;
                max-width: 100%;
                width: 50%;
                // height: 30%;
            }
        }

        .content-list-multi-item2 {
            width: 100%;
            height: 50%;

            p {
                margin: 0;
                padding-left: 10%;
                padding-right: 10%;
                white-space: nowrap;
                /* 不换行 */
                overflow: hidden;
                /* 溢出部分隐藏 */
                text-overflow: ellipsis;
                /* 超出部分用省略号表示 */
            }
        }

    }
}

.notShow {
    opacity: 0;
}
</style>