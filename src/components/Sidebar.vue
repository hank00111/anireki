<script setup lang="ts">
//import { watch, ref } from 'vue';
import { useDrakModeStore } from '@/stores/drakMode'
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
    <div class="sidebar">
        <div class="sidebar-logo">
        </div>
        <ul class="sidebar-ul">
            <li>
                <router-link to="/" class="router-link">
                    <svg height="26" width="26" viewBox="0 -980 960 960" fill="currentColor">
                        <path
                            d="M229.333-189.333h137.334v-245.833h226.666v245.833h137.334V-566L480-754.001l-250.667 187.89v376.778ZM166-126v-471.833l314-235.5 314 235.777V-126H530v-245.833H430V-126H166Zm314-346Z" />
                    </svg>
                    <span>首頁</span>
                </router-link>
            </li>
            <li>
                <router-link to="/history" class="router-link">
                    <svg height="26" width="26" viewBox="0 -1020 960 960" fill="currentColor">
                        <path
                            d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
                    </svg>
                    <span>觀看記錄</span>
                </router-link>
            </li>
            <li>
                <router-link to="/watchlater" class="router-link">
                    <svg height="26" width="26" viewBox="0 -1020 960 960" fill="currentColor">
                        <path
                            d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
                    </svg>
                    <span>稍後觀看</span>
                </router-link>
            </li>

        </ul>

        <div class="sidebar-switch-darkmode" style="display: none;">
            <input class="swift-btn_toggle" type="checkbox" id="lightSwitch" @click="SwichDarkMode"
                v-bind:checked="darkMode.drakState">
            <label for="lightSwitch"></label>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
