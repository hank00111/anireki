import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLoginModalStore } from '../../../src/stores/loginModalStore'

describe('useLoginModalStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('should have correct initial state', () => {
    const store = useLoginModalStore()
    
    expect(store.isVisible).toBe(false)
    expect(store.title).toBe('')
    expect(store.message).toBe('')
  })

  it('showModal should set correct state', () => {
    const store = useLoginModalStore()
    
    store.showModal('Test Title', 'Test Message')
    
    expect(store.isVisible).toBe(true)
    expect(store.title).toBe('Test Title')
    expect(store.message).toBe('Test Message')
  })

  it('showModal should use empty string when no message provided', () => {
    const store = useLoginModalStore()
    
    store.showModal('Test Title')
    
    expect(store.isVisible).toBe(true)
    expect(store.title).toBe('Test Title')
    expect(store.message).toBe('')
  })

  it('hideModal should reset state', () => {
    const store = useLoginModalStore()
    
    store.showModal('Test Title', 'Test Message')
    store.hideModal()
    
    expect(store.isVisible).toBe(false)
    expect(store.title).toBe('')
    expect(store.message).toBe('')
  })
})
