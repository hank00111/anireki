<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const props = defineProps({
    selID: String,
    selected: String,
    selDataArray: Array,
    selDataNumber: Number,
    selDataObject: Object,
    selDataString: String
})

const refShow = ref<boolean>(false);

const show = (e: string) => {

    if (e === '1') {
        refShow.value = !refShow.value;
    } else if (props.selID) {
        props.selID == props.selected ? refShow.value = true : refShow.value = false;
    }
}

watchEffect(() => {
    show('0');

})
// const consoleLoad = ref<string>('console-loading ')
// // console.log(props)
//$emit('update:modelValue', $event.target.value)"

</script>

<template>
    <span>
        <div class="selBar-btn ml-4" :class="{ activeSel: refShow }" @click="show('1')">
            {{ selDataNumber ? selDataNumber : selDataString }}</div>
        <div class="selBar" v-show="refShow">
            <div class="selBar-Container ml-4">
                <ul v-if="selDataArray">
                    <li v-for="d in selDataArray" @click="$emit('update:selDataString', d); refShow = false"
                        :class="{ sel: d === selDataString }">{{ d }}</li>
                </ul>
                <ul v-else>
                    <li v-for="d in selDataObject" @click="$emit('update:selDataString', d); refShow = false"
                        :class="{ sel: d === selDataString }">{{ d }}</li>
                </ul>
            </div>
        </div>
    </span>
</template>

<style lang="scss">
.sel {
    background-color: #33373b;
}

.ml-4 {
    margin-left: 4px;
}

.ml-10 {
    margin-left: 10px;
}

.selBar {
    position: relative;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
    padding: 0;
}

.selBar-Container {
    position: absolute;
    z-index: 99;
    width: 300px;
    height: auto;
    display: flex;
    margin-top: 8px;
    max-height: 480px;
    overflow: hidden;
    pointer-events: auto;
    flex-direction: column;
    background-color: #141516;
    border: 1px solid #7a828e;
    border-radius: 6px;
    animation: selbar-animation .12s cubic-bezier(0, 0.1, 0.1, 1) backwards;

    ul {
        color: #fff;
        margin: 0;
        padding: 0;
        list-style: none;
        overflow: auto;
        user-select: none;
        pointer-events: auto;
    }

    li {
        margin: 0;
        padding: 5px 10px;

        &:hover {
            background-color: #787a7b;
            transition: 0.1s;
        }
    }
}

.selBar-Container-show {
    display: none;
}

.selBar-btn {
    position: relative;
    display: inline-block;
    padding: 8px 12px;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    border: 1px solid #888888;
    border-radius: 6px;
    appearance: none;
    color: #fff;
    background-color: #141516;

    &:after {
        display: inline-block;
        width: 12px;
        height: 12px;
        content: "";
        margin-left: 6px;
        background-image: url(../assets/sel.svg);
        background-size: 12px 12px;
    }
}

.activeSel {
    background-color: #333333bf;
}


@keyframes selbar-animation {
    0% {
        opacity: 0;
        transform: translateY(-16px);
    }
}
</style>
