import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import createSecureModuleRegisterMixin from '@/SecureModuleRegisterMixin'



describe('SecureModuleRegisterMixin', () => {
  let wrapper
  const cmp = { render: () => {} }
  const module = { namespaced: true, state: {num: 1} }
  const path = 'myModule'

  beforeEach(() => {
    let localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.mixin(createSecureModuleRegisterMixin(false))

    const store = new Vuex.Store({})

    wrapper = shallowMount(cmp, {
      store,
      localVue
    })
  })

  it('provides registerModule method', () => {
    expect(wrapper.vm.registerModule).toBeDefined()
  })

  it('provides unregisterModule method', () => {
    expect(wrapper.vm.unregisterModule).toBeDefined()
  })

  it('increases num of registrations when module is registered', () => {
    wrapper.vm.numRegistrations[path] = 0

    wrapper.vm.registerModule(path, module)

    expect(wrapper.vm.numRegistrations[path]).toEqual(1)
  })

  it('decreases num of registrations when module is unregistered', () => {
    wrapper.vm.$store.registerModule(path, module)
    wrapper.vm.numRegistrations[path] = 2

    wrapper.vm.unregisterModule(path)

    expect(wrapper.vm.numRegistrations[path]).toEqual(1)
  })

  it('registerModule registeres module in store instance', () => {
    wrapper.vm.registerModule(path, module)

    expect(wrapper.vm.$store.state[path]).toBeDefined()
  })

  it('unregisterModule unregisteres module in store instance', () => {
    wrapper.vm.registerModule(path, module)

    wrapper.vm.unregisterModule(path)

    expect(wrapper.vm.$store.state[path]).not.toBeDefined()
  })

  it('registerModule does only register module once when called twice in a row', () => {
    const registerModuleSpy = jest.spyOn(wrapper.vm.$store, 'registerModule')

    wrapper.vm.registerModule(path, module)
    wrapper.vm.registerModule(path, module)

    expect(registerModuleSpy).toHaveBeenCalledTimes(1)
    expect(registerModuleSpy).toHaveBeenCalledWith(path, module)
  })

  it('unregisterModule does only unregister module once when called twice in a row', () => {
    wrapper.vm.$store.unregisterModule = jest.fn()

    wrapper.vm.registerModule(path, module)
    wrapper.vm.unregisterModule(path)
    wrapper.vm.unregisterModule(path)

    expect(wrapper.vm.$store.unregisterModule).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.$store.unregisterModule).toHaveBeenCalledWith(path)
  })

  it('vuex overrides module state without options.preserveState', async () => {
    const m1 = { namespaced: true, state: { foo: 'm1' } }
    const m2 = { namespaced: true, state: {} }

    wrapper.vm.$store.registerModule('module', m1)
    wrapper.vm.$store.registerModule('module', m2)

    expect(wrapper.vm.$store.state.module.foo).not.toBeDefined()
  })

  it('wont override state in store if module is registered already', () => {
    const m1 = { namespaced: true, state: { foo: 'm1' } }
    const m2 = { namespaced: true, state: {} }

    wrapper.vm.registerModule('module', m1)
    wrapper.vm.registerModule('module', m2)

    expect(wrapper.vm.$store.state.module.foo).toBeDefined()
  })

  it('wont override state in store if module is registered already outside of mixin', () => {
    const m1 = { namespaced: true, state: { foo: 'm1' } }
    const m2 = { namespaced: true, state: {} }

    wrapper.vm.$store.registerModule('module', m1)
    wrapper.vm.registerModule('module', m2)

    expect(wrapper.vm.$store.state.module.foo).toBeDefined()
  })
})
