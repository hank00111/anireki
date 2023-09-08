<script setup lang="ts">
import Header from '../components/Header.vue'
import ConsoleSidebar from '../components/ConsoleSidebar.vue'
import { ref, reactive, onMounted, onBeforeMount } from 'vue';
import { useAnimeWorks } from '../stores/animeWorks'

const animeWorks = useAnimeWorks();

interface seasonModel {
    [key: string]: any;
    [index: number]: any;
}

const startYear = ref<string>('1996')
const thisYear = ref<number>(new Date().getFullYear())
const endYear = ref<string>((thisYear.value + 4).toString())
const yearsArray = ref<string[]>(
    [...new Array(+endYear.value - +startYear.value)].map((_, i) => (+startYear.value + i).toString()).reverse()
)

const thisSeason = ref<number>(Math.ceil((new Date().getMonth() + 1) / 3))
const season = reactive<seasonModel>({ 1: '春季', 2: '夏季', 3: '秋季', 4: '冬季', })

onBeforeMount(() => {
    animeWorks.getWorksCount();
})

onMounted(() => {
    document.title = 'Console - Anireki';

})
</script>

<template>
    <ConsoleSidebar></ConsoleSidebar>
    <div class="main">
        <Header class="console-header"></Header>
        <div class="content console-content">
            <div class="console-container">
                <div class="card">
                    <div class="card-item">
                        <p>ID</p>
                        <input type="text" :placeholder="animeWorks.worksCount"
                            readonly="true">
                    </div>
                    <div class="card-item">
                        <p>年份</p>
                        <select v-model="thisYear">
                            <option v-for="year in yearsArray" :value="year" :key="year">{{ year }}</option>
                        </select>
                    </div>
                    <div class="card-item">
                        <p>季度</p>
                        <select v-model="season[thisSeason]">
                            <option v-for="(value, index) in season" :value="value" :key="index">{{ value }}</option>
                        </select>
                    </div>
                    <div class="card-item">
                        <p>動畫名稱</p>
                        <input type="text">
                    </div>
                    <div class="card-item">
                        <p>日文名稱</p>
                        <input type="text">
                    </div>
                    <div class="card-item">
                        <p>主視覺圖</p>
                        <input type="text">
                    </div>
                    <div class="card-item">
                        <button @click="animeWorks.addWorks">新增</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.console-container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-width: 80%;

    .card {
        // background-color: #2e2f31;
        border-radius: 10px;
        padding: 1.1em;

        .card-item {
            display: flex;
            flex-direction: column;
            color: #ffffff;

            >p {
                margin: 0;
                font-size: 1.4em;
                font-weight: 600;
            }

            >button {
                border: 0;
                height: 48px;
                font-size: 20px;
                font-weight: 600;
                border-radius: 10px;
                background-color: #00a760;
                transition: 0.2s;

                &:hover {
                    background-color: #67be8d;
                }
            }

            >input {
                border: 2px solid #57595d;
                border-radius: 10px;
                color: #ffffff;
                font-size: 1.4em;
                margin-top: 10px;
                margin-bottom: 20px;
                max-width: 100%;
                padding: 10px;
                vertical-align: middle;
                background-color: #141516;
                outline: none;
                transition: 0.2s;

                &:focus {
                    border: 2px solid #91ddf9;
                }

                &:hover {
                    border: 2px solid #91ddf9;
                }
            }

            >select {
                border: 2px solid #57595d;
                border-radius: 10px;
                color: #ffffff;
                font-size: 1.4em;
                margin-top: 10px;
                margin-bottom: 20px;
                padding: 12px;
                background-color: #141516;
                transition: 0.2s;
                background-image: url(../assets/sel.svg);
                background-repeat: no-repeat;
                background-position: right 0.45em center;
                background-size: 32px 32px;
                appearance: none;

                &:focus {
                    outline: none;
                }

                &:hover {
                    border: 2px solid #91ddf9;
                }

            }
        }
    }

}

// .add-form {
//     display: flex;
//     width: 100%;
//     height: 5%;
//     color: var(--console-text-default-color);
//     font-size: 1.6em;
//     align-items: center;

//     >p {
//         width: 120px;
//     }

//     >input {
//         border: 0;
//         border-radius: 2px;
//         color: #000;
//         font-size: 18px;
//         line-height: 20px;
//         margin-left: 10px;
//         max-width: 100%;
//         padding: 8px;
//         vertical-align: middle;
//         width: 400px;
//         max-height: 36px;
//         background-color: #e9ecef;

//     }
// }
</style>
