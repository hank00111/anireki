<template>
  <div class="notifications-container">
    <TransitionGroup name="notifications">
      <div v-for="error in errors" :key="error.id" class="notifications" :class="error.type">
        <div class="notifications-content">
          <svg v-if="error.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <svg v-if="error.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
          <svg v-if="error.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
            <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <span>{{ error.message }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useErrorStore } from '../stores/errorStore'

const errorStore = useErrorStore()
const errors = computed(() => errorStore.errors)
</script>

<style scoped lang="scss">
.notifications-container {
  position: fixed;
  z-index: 9998;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notifications {
  width: auto;
  min-width: 300px;
  max-width: 400px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &.error {
    background-color: #e53e3e;
  }
  &.warning {
    background-color: #dd6b20;
  }
  &.info {
    background-color: #007c45;
  }

  .notifications-content {
    width: 100%;
    color: #fff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    font-size: 1.15em;
    font-weight: 600;
    gap: 10px;

    > svg {
      flex-shrink: 0;
    }
  }
}

.notifications-enter-active,
.notifications-leave-active {
  transition: all 0.3s ease;
}

.notifications-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notifications-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notifications-move {
  transition: transform 0.3s ease;
}
</style>