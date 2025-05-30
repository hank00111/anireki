import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginModal from '../../../src/components/LoginModal.vue'
import { useUserControl } from '../../../src/stores/userControl'

describe('LoginModal', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = (props: any) => {
    return mount(LoginModal, {
      props,
      global: {
        plugins: [pinia]
      }
    })
  }

  it('should show modal when isVisible is true', () => {
    const wrapper = createWrapper({
      isVisible: true,
      title: 'Please login first'
    })
    
    expect(wrapper.find('.login-modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.login-modal').exists()).toBe(true)
  })

  it('should hide modal when isVisible is false', () => {
    const wrapper = createWrapper({
      isVisible: false,
      title: 'Please login first'
    })
    
    expect(wrapper.find('.login-modal-overlay').exists()).toBe(false)
  })

  it('should display correct title and message', () => {
    const wrapper = createWrapper({
      isVisible: true,
      title: 'Watch History',
      message: 'Please login first to view watch history'
    })
    
    expect(wrapper.find('.login-modal-title').text()).toBe('Watch History')
    expect(wrapper.find('.login-modal-message').text()).toBe('Please login first to view watch history')
  })
  it('should trigger login process when login button is clicked', async () => {
    const userControl = useUserControl()
    const getUserSpy = vi.spyOn(userControl, 'getUser').mockResolvedValue(undefined)
    
    const wrapper = createWrapper({
      isVisible: true,
      title: 'Please login first'
    })
    
    await wrapper.find('.login-button').trigger('click')
    expect(getUserSpy).toHaveBeenCalledWith(1)
  })

  it('should trigger close event when close button is clicked', async () => {
    const wrapper = createWrapper({
      isVisible: true,
      title: 'Please login first'
    })
    
    await wrapper.find('.close-button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should trigger close event when overlay is clicked', async () => {
    const wrapper = createWrapper({
      isVisible: true,
      title: 'Please login first'
    })
    
    await wrapper.find('.login-modal-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should have proper ARIA attributes', () => {
    const wrapper = createWrapper({
      isVisible: true,
      title: 'Please login first'
    })
    
    expect(wrapper.find('.login-modal').attributes('role')).toBe('dialog')
    expect(wrapper.find('.login-modal').attributes('aria-modal')).toBe('true')
  })
})
