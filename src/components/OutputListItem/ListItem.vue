<template>
    <div class="item">
        <div :class="{
            itemOne: true,
            isHighLight: itemOneHighLight
        }" @mouseenter="highLight" @mouseleave="dishighLight" :style="generateStyle(type, 1)">
            {{
                itemOneWords }}</div>
        <div class="transition">
            <!-- <p>{{ item.words || "SC" }}</p> -->
            <svg :style="{
                width: svgWidth
            }" v-if="type === 'SC' || type === 'DC'" xmlns="http://www.w3.org/2000/svg" stroke="white"
                viewBox="0 0 100 100">
                <path d="M20,50 L80,50" stroke="white" stroke-width="20" />
                <path d="M100,50 L80,30 L80,70 M100,50" fill="white" stroke="white" />
                <path d="M0,50 L20,30 L20,70 L0,50" fill="white" stroke="white" />
            </svg>
            <svg :style="{
                width: svgWidth
            }" v-if="type === 'TS' || type === 'CE'" xmlns="http://www.w3.org/2000/svg" stroke="white"
                viewBox="0 0 100 100">
                <path d="M10,50 L80,50" stroke="white" stroke-width="20" />
                <path d="M100,50 L80,30 L80,70 L100,50" fill="white" stroke="white" />
            </svg>
            <svg :style="{
                width: svgWidth
            }" v-if="type === 'WR'" xmlns="http://www.w3.org/2000/svg" stroke="white" viewBox="0 0 100 100">
                <path d="M20,30 L30,20 L80,70 L70,80 M20,30" fill="white" stroke="white"></path>
                <path d="M80,30 L70,20 L20,70 L30,80 M80,30" fill="white" stroke="white" />
            </svg>
        </div>
        <div :class="{
            itemTwo: true,
            isHighLight: itemTwoHighLight
        }" :style="generateStyle(type, 2)">{{ itemTwoWords }}</div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, getCurrentInstance } from 'vue';
import { number } from 'vue-types';
const props = defineProps({
    type: String,
    itemOneWords: String,
    itemTwoWords: String,
    itemOneHighLight: Boolean,
    itemTwoHighLight: Boolean,
    svgWidth: String,
    id: number,
    operate: String,
})
// 获取出来props属性
const { type, itemOneWords, itemTwoWords, itemOneHighLight, itemTwoHighLight, svgWidth, id, operate } = toRefs(props)
console.log(type, "---")
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
const highLight = () => {

    let textId = `font-${id.value}`
    let backId
    switch (operate.value) {
        case "CIRCLE":
            backId = `circleBack-${id.value}`
            break
        case "RECT":
            backId = `rectBack-${id.value}`
            break
        case "ARROW":
            backId = `arrowBack-${id.value}`
            break
        case "TEXT":
            backId = `arrowBack-${id.value}`
            break
    }

    const font = document.getElementById(textId)
    if (font)
        font.style.backgroundColor = 'rgba(245,255,0,0.3)'
    let BackItem = document.getElementById(backId)
    if (BackItem) {
        BackItem.setAttribute("opacity", 1)
    }
    const index = history.value.findIndex(e => e.id === id.value)
    console.log(textId, backId, index, operate.value)
    history.value[index].highLight = true
}
const dishighLight = () => {
    let textId = `font-${id.value}`
    let backId
    switch (operate.value) {
        case "CIRCLE":
            backId = `circleBack-${id.value}`
            break
        case "RECT":
            backId = `rectBack-${id.value}`
            break
        case "ARROW":
            backId = `arrowBack-${id.value}`
            break
        case "TEXT":
            backId = `arrowBack-${id.value}`
            break
    }
    const font = document.getElementById(textId)
    if (font)
        font.style.backgroundColor = ''
    let BackItem = document.getElementById(backId)
    if (BackItem) {
        BackItem.setAttribute("opacity", 0)
    }
    const index = history.value.findIndex(e => e.id === id.value)
    console.log(textId, backId, index, operate.value)
    history.value[index].highLight = false
}

</script>
<style lang="scss">
.item {
    display: flex;
    min-width: 100px;
}

.isHighLight {
    box-shadow: 0 0 20px yellow;
}


.itemOne {
    width: 40%;
    height: 100%;
    background-color: white;
    border-radius: 5%;
    border: 3px salmon solid;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
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
    width: 40%;
    height: 100%;
    background-color: white;
    background-color: white;
    border-radius: 5%;
    border: 3px skyblue solid;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>