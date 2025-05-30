import { beforeEach, vi } from 'vitest'


beforeEach(() => {

  vi.clearAllMocks()
  

  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000'
    },
    writable: true
  })
  

  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })


  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock
  })
})


const originalGetComputedStyle = window.getComputedStyle
window.getComputedStyle = (element, pseudoElement) => {
  const style = originalGetComputedStyle(element, pseudoElement)
  return {
    ...style,
    getPropertyValue: (property: string) => {

      const cssVars: Record<string, string> = {
        '--main-background-color': '#ffffff',
        '--text-default-color': '#333333'
      }
      return cssVars[property] || style.getPropertyValue(property)
    }
  }
}
