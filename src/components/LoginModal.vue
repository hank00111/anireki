<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isVisible" 
        class="login-modal-overlay"
        @click="handleOverlayClick"
      >
        <div 
          class="login-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @click.stop
        >
          <div class="login-modal-header">
            <h2 :id="titleId" class="login-modal-title">{{ title }}</h2>
            <button 
              class="close-button"
              @click="$emit('close')"
              aria-label="關閉"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>            <div class="login-modal-content">
            <p v-if="message" class="login-modal-message">{{ message }}</p>
            <p v-else class="login-modal-message">ログインが必要です</p>
          </div>
            <div class="login-modal-footer">
            <button class="login-button" @click="handleLogin">
              ログイン
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useUserControl } from '@/stores/userControl'

interface Props {
  isVisible: boolean
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ログインが必要',
  message: ''
})

const emit = defineEmits<{
  close: []
}>()

const userControl = useUserControl()

const titleId = computed(() => `login-modal-title-${Math.random().toString(36).substr(2, 9)}`)

const handleLogin = () => {
  userControl.getUser(1)
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isVisible) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped lang="scss">
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-modal {
  background: var(--main-background-color);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  color: var(--text-default-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
  
  .login-modal-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-default-color);
  }
  
  .close-button {
    background: none;
    border: none;
    color: var(--text-default-color);
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.login-modal-content {
  padding: 24px;
  text-align: center;
  
  .login-modal-message {
    font-size: 1.1rem;
    margin: 0 0 20px;
    color: var(--text-default-color);
    line-height: 1.5;
  }
}

.login-modal-footer {
  display: flex;
  justify-content: center;
  padding: 0 24px 24px;
  
  button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
  }
  
  .login-button {
    background: #4f46e5;
    color: white;
    
    &:hover {
      background: #4338ca;
    }
  }
}

// 動畫效果
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
  
  .login-modal {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  
  .login-modal {
    transform: scale(0.9) translateY(-20px);
  }
}

// 響應式設計
@media (max-width: 640px) {
  .login-modal {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
  
  .login-modal-header {
    padding: 20px 20px 0;
    
    .login-modal-title {
      font-size: 1.25rem;
    }
  }
  
  .login-modal-content {
    padding: 20px;
  }
  
  .login-modal-footer {
    padding: 0 20px 20px;
    flex-direction: column;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
}

// 深色模式適配
html[data-theme="dark"] {
  .login-modal {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
