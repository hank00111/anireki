import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { Component } from 'vue'

export interface TestWrapperOptions {
  props?: Record<string, any>
  slots?: Record<string, any>
  global?: {
    plugins?: any[]
    mocks?: Record<string, any>
    stubs?: Record<string, any>
  }
}


export function createTestRouter(routes?: any[]): Router {
  const defaultRoutes = [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/history', name: 'history', component: { template: '<div>History</div>' }, meta: { requiresLogin: true } },
    { path: '/watchlater', name: 'watchlater', component: { template: '<div>Watch Later</div>' }, meta: { requiresLogin: true } }
  ]
  
  return createRouter({
    history: createWebHistory(),
    routes: routes || defaultRoutes
  })
}


export function createTestWrapper(
  component: Component,
  options: TestWrapperOptions = {}
): VueWrapper<any> {
  const pinia = createPinia()
  const router = createTestRouter()
  
  const defaultGlobal = {
    plugins: [pinia, router],
    mocks: {},
    stubs: {}
  }
  
  return mount(component, {
    ...options,
    global: {
      ...defaultGlobal,
      ...options.global,
      plugins: [
        ...defaultGlobal.plugins,
        ...(options.global?.plugins || [])
      ]
    }
  })
}


export async function clickElement(wrapper: VueWrapper<any>, selector: string) {
  const element = wrapper.find(selector)
  if (!element.exists()) {
    throw new Error(`Element with selector "${selector}" not found`)
  }
  await element.trigger('click')
  await wrapper.vm.$nextTick()
}


export async function setInputValue(wrapper: VueWrapper<any>, selector: string, value: string) {
  const input = wrapper.find(selector)
  if (!input.exists()) {
    throw new Error(`Input with selector "${selector}" not found`)
  }
  await input.setValue(value)
  await wrapper.vm.$nextTick()
}


export async function waitForAsync() {
  await new Promise(resolve => setTimeout(resolve, 0))
}


export function mockAxiosResponse(data: any, status = 200) {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {}
  }
}


export function mockAxiosError(message = 'Network Error', status = 500) {
  const error = new Error(message) as any
  error.response = {
    data: { message },
    status,
    statusText: 'Internal Server Error'
  }
  error.isAxiosError = true
  return error
}
