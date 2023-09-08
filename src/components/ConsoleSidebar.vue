<script setup lang="ts">
//import { watch, ref } from 'vue';
import { useDrakModeStore } from '../stores/drakMode'
const darkMode = useDrakModeStore();


const SwichDarkMode = () => {
    darkMode.SwichDarkMode();
    if (darkMode.drakState) {
        document.documentElement.setAttribute('data-theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
    }
}

</script>

<template>
    <div class="sidebar console">
        <div class="sidebar-logo">
        </div>
        <ul class="sidebar-ul">
            <li>
                <router-link to="/console" class="router-link">
                    <span>系統紀錄</span>
                </router-link>
            </li>
            <li>
                <router-link to="/console/addworks" class="router-link">
                    <span>新增動畫</span>
                </router-link>
            </li>

        </ul>

        <div class="sidebar-switch-darkmode">
            <input class="swift-btn_toggle" type="checkbox" id="lightSwitch" @click="SwichDarkMode"
                v-bind:checked="darkMode.drakState">
            <label for="lightSwitch"></label>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
