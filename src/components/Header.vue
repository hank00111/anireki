<script setup lang="ts">
import { ref } from 'vue';
import { useUserControl } from '../stores/userControl'

const showMenu = ref(false)
const userControll = useUserControl();

// onMounted(() => {
//     //document.title = 'Home - Anireki';
// })

const userLogout = () => {
    showMenu.value = !showMenu
    userControll.logout();
}

</script>

<template>
    <div class="header">
        <div class=""></div>
        <div class=""></div>
        <div class="userPanel">

            <div v-if="userControll.name.length != 0 ? true : false" class="userLoggedin">
                <button @click="showMenu = !showMenu">
                    <img draggable="false" :src=userControll.picture alt="">
                </button>
                <div v-if="showMenu" class="userMenu">
                    <div class="contextMenu">
                        <ul>
                            <li @click="showMenu = !showMenu"><button><span>設定</span></button></li>
                            <li @click="userLogout"><button><span>登出</span></button></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div v-else class="userLogin">
                <button @click="userControll.getUser(1)">
                    <span>登入</span>
                </button>
            </div>

            <!-- 登入 -->


        </div>
    </div>
</template>

<style leng="scss"></style>
