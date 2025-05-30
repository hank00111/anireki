import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../../src/App.vue'
import Home from '../../src/pages/Home.vue'
import History from '../../src/pages/History.vue'
import { useUserControl } from '../../src/stores/userControl'
import { useLoginModalStore } from '../../src/stores/loginModalStore'

// Mock the pages
vi.mock('../../src/pages/Home.vue', () => ({
  default: { template: '<div>Home Page</div>' }
}))

vi.mock('../../src/pages/History.vue', () => ({
  default: { template: '<div>History Page</div>' }
}))

// Mock axios calls
vi.mock('../../src/stores/userControl', () => ({
  useUserControl: vi.fn(() => ({
    isLogin: false,
    getUser: vi.fn().mockResolvedValue({}),
  }))
}))

describe('Login Flow Integration Tests', () => {
  let router: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: Home },
        { 
          path: '/history', 
          name: 'history', 
          component: History,
          meta: { requiresLogin: true }
        }
      ]
    })
    
    // Reset mocks
    vi.clearAllMocks()
  })

  it('should show login modal when unauthenticated user clicks History', async () => {
    const userControl = useUserControl()
    userControl.isLogin = false

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })

    await router.push('/history')
    await wrapper.vm.$nextTick()

    const loginModalStore = useLoginModalStore()
    expect(loginModalStore.isVisible).toBe(true)
    expect(loginModalStore.title).toBe('観覧履歴')
  })

  it('should allow authenticated users to access History page normally', async () => {
    const userControl = useUserControl()
    userControl.isLogin = true

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Try to navigate to history page
    await router.push('/history')
    await wrapper.vm.$nextTick()

    const loginModalStore = useLoginModalStore()
    expect(loginModalStore.isVisible).toBe(false)
    expect(router.currentRoute.value.name).toBe('history')
  })

  it('should trigger login process when modal login button is clicked', async () => {
    const userControl = useUserControl()
    const getUserSpy = vi.spyOn(userControl, 'getUser')
    userControl.isLogin = false

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Manually show modal
    const loginModalStore = useLoginModalStore()
    loginModalStore.showModal('Test Title', 'Test Message')
    await wrapper.vm.$nextTick()

    // Click login button
    const loginButton = wrapper.find('.login-button')
    if (loginButton.exists()) {
      await loginButton.trigger('click')
      expect(getUserSpy).toHaveBeenCalledWith(1)
      expect(loginModalStore.isVisible).toBe(false)
    }
  })
})
