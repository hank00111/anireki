<script setup lang="ts">
interface Props {
    show: boolean;
    worksTitle?: string;
}

interface Emits {
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

// Confirm deletion action
const confirmDelete = () => {
    emit('confirm');
};

// Cancel deletion action
const cancelDelete = () => {
    emit('cancel');
};
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-overlay" @click="cancelDelete">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>削除確認</h3>
                </div>
                <div class="modal-content">
                    <p>本当にこの作品を削除しますか？</p>
                    <p v-if="worksTitle" class="works-title">「{{ worksTitle }}」</p>
                    <p class="warning-text">この操作は取り消せません。</p>
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel" @click="cancelDelete">キャンセル</button>
                    <button class="btn-delete" @click="confirmDelete">削除</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-container {
    background: #232932;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    max-width: 480px;
    width: 90%;
    border: 1px solid #404040;
}

.modal-header {
    padding: 20px 24px 0;
    border-bottom: 1px solid #404040;
    margin-bottom: 0;

    h3 {
        color: #fff;
        margin: 0;
        font-size: 1.25em;
        font-weight: 600;
        padding-bottom: 16px;
    }
}

.modal-content {
    padding: 24px;
    color: #e0e0e0;

    p {
        margin: 0 0 12px 0;
        line-height: 1.5;
    }

    .works-title {
        color: #ff6b6b;
        font-weight: 600;
        font-size: 1.1em;
        margin: 16px 0;
        padding: 8px 12px;
        background: rgba(255, 107, 107, 0.1);
        border-radius: 6px;
        border-left: 4px solid #ff6b6b;
    }

    .warning-text {
        color: #ffa726;
        font-size: 0.9em;
        margin-top: 16px;
    }
}

.modal-actions {
    padding: 0 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 0.95em;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 80px;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    }

    .btn-cancel {
        background: #4a4a4a;
        color: #e0e0e0;

        &:hover {
            background: #565656;
        }
    }

    .btn-delete {
        background: #e53e3e;
        color: #fff;

        &:hover {
            background: #c53030;
        }

        &:active {
            transform: translateY(0);
        }
    }
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    transform: scale(0.9) translateY(-20px);
}
</style>
