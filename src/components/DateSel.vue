<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useAnimeWorks } from '../stores/animeWorks'
const animeWorks = useAnimeWorks();

const yearOpen = ref(false);
const monthOpen = ref(false);
const dayOpen = ref(false);

const startYear = ref<string>('1996')
const thisYear = ref<number>(new Date().getFullYear())
const endYear = ref<string>((thisYear.value + 1).toString())
const yearsArray = ref<string[]>(
    [...new Array(+endYear.value - +startYear.value)].map((_, i) => (+startYear.value + i).toString()).reverse()
)
const monthsArray = ref<string[]>(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"])

const daysArray = ref<string[]>(
    [...new Array(new Date(animeWorks.watchYear, +animeWorks.watchMonth, 0).getDate())].map((_, i) => (i + 1) < 10 ? "0" + (i + 1).toString() : (i + 1).toString()))

const selYear = ref<string>(animeWorks.watchYear.toString())
const selMonth = ref<string>(animeWorks.watchMonth.toString())
const selDay = ref<string>(new Date().getDate().toString());


const yearToggle = () => {
    yearOpen.value = !yearOpen.value;
    monthOpen.value = false;
    dayOpen.value = false;
}
const monthToggle = () => {
    monthOpen.value = !monthOpen.value;
    yearOpen.value = false;
    dayOpen.value = false;
}
const dayToggle = () => {
    dayOpen.value = !dayOpen.value;
    yearOpen.value = false;
    monthOpen.value = false;
}

const yearClick = (d: string) => {
    selYear.value = d
    animeWorks.watchYear = +d
    yearOpen.value = !yearOpen.value;
}
const monthClick = (d: string) => {
    selMonth.value = d
    animeWorks.watchMonth = +d
    monthOpen.value = !monthOpen.value;
}
const dayClick = (d: string) => {
    selDay.value = d
    animeWorks.watchDay = +d
    dayOpen.value = !dayOpen.value;
}

onMounted(() => {
})
watchEffect(() => {
    daysArray.value = [...new Array(new Date(animeWorks.watchYear, animeWorks.watchMonth, 0).getDate())].map((_, i) => (i + 1).toString())
})
</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-context">
            <div class="dropdown" @click="yearToggle">
                <p>{{ selYear + "年" }}</p>
                <span class="dropdown-icon" :class="{ down: yearOpen }">
                    <svg height="24" viewBox="0 -960 960 860" width="24" fill="#fff">
                        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                </span>
            </div>
            <div v-if="yearOpen" class="dropdown-date">
                <ul>
                    <li v-for="data in yearsArray" :key="data" @click="yearClick(data)">
                        {{ data + "年" }}
                    </li>
                </ul>
            </div>
            <div v-else></div>
        </div>

        <div class="dropdown-context">
            <div class="dropdown" @click="monthToggle">
                <p>{{ selMonth + "月" }}</p>
                <span class="dropdown-icon" :class="{ down: monthOpen }">
                    <svg height="24" viewBox="0 -960 960 860" width="24" fill="#fff">
                        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                </span>
            </div>
            <div v-if="monthOpen" class="dropdown-date">
                <ul>
                    <li v-for="data in monthsArray" :key="data" @click="monthClick(data)">
                        {{ data + "月" }}
                    </li>
                </ul>
            </div>
            <div v-else></div>
        </div>

        <div class="dropdown-context">
            <div class="dropdown" @click="dayToggle">
                <p>{{ selDay + "日" }}</p>
                <span class="dropdown-icon" :class="{ down: dayOpen }">
                    <svg height="24" viewBox="0 -960 960 860" width="24" fill="#fff">
                        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                </span>
            </div>
            <div v-if="dayOpen" class="dropdown-date">
                <ul>
                    <li v-for="data in daysArray" :key="data" @click="dayClick(data)">
                        {{ data + "日" }}
                    </li>
                </ul>
            </div>
            <div v-else></div>
        </div>
    </div>
</template>

<style lang="scss">
.dropdown-container {
    display: flex;
}

.dropdown-context {
    color: #fff;
    height: 50px;
    width: 140px;
    min-width: 130px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    padding: 8px;
    cursor: pointer;
    user-select: none;
    // pointer-events: none;
}

.dropdown {
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: end;
    border-radius: 5px;
    background: hsla(0, 0%, 100%, 0.4);
    transition: all 0.3s;
    user-select: none;

    >p {
        display: block;
        text-align: center;
        width: 100%;
        margin: 0;
    }

    .dropdown-icon {
        display: flex;
        transition: all 0.5s;
        transform-origin: center;
    }

    .down {
        transition: all 0.5s;
        transform: rotate(180deg)
    }
}

.dropdown-date {
    list-style: none;
    position: relative;
    width: 100%;
    height: 100%;

    >ul {
        padding: 0;
        margin: 0;
        position: absolute;
        background: #525657;
        border-radius: 4px;
        min-width: 100%;
        max-height: 170px;
        transform: translate(0px, 5px);
        overflow-y: auto;
        text-align: center;

        >li {
            line-height: 35px;
            text-align: center;
            transition: all 0.5s;
            padding-right: 10px;

            &:hover {
                background: #d4d4d4;
                color: #000;
            }
        }
    }


    // .dropdown-date-ul {
    //     width: 100%;
    //     height: 100%;
    //     // inset: 0;
    //     margin: 0;
    //     background: hsla(0, 0%, 100%, 0.4);
    //     // padding: 0;
    //     padding: 15px;
    //     position: absolute;
    //     border-radius: 20px;
    // }

    // .dropdown-date-li {
    //     text-align: center;
    //     position: relative;
    //     // margin-top: 5px;
    // }

}
</style>
