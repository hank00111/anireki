<script setup lang="ts">
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
    <div class="sidebar console">
        <div class="sidebar-logo">
        </div>
        <ul class="sidebar-ul">
            <li>
                <router-link to="/" class="router-link">
                    <span>Anireki</span>
                </router-link>
            </li>
            <li>
                <router-link to="/console" class="router-link">
                    <span>系統動態</span>
                </router-link>
            </li>
            <li>
                <router-link to="/console/works" class="router-link">
                    <span>作品一覽</span>
                </router-link>
            </li>
            <li>
                <router-link to="/console/works" class="router-link">
                    <span>用戶管理</span>
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
