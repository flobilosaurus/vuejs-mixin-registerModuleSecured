const createSecureModuleRegistrationMixin = (debugEnabled) => {
  const _dataObject = {
    numRegistrations: {}
  }

  const alreadyRegistered = (store, path) => {
    return store && store.state && store.state[path]
  }

  const log = debugEnabled ? (msg) => {
    console.warn(`[SecureModuleRegisterMixin] ${msg}`)
  } : (_) => {}

  return {
    data: () => {
      return _dataObject
    },
    methods: {
      registerModule (path, rawModule) {
        if (alreadyRegistered(this.$store, path)) {
          if (this.numRegistrations === 0) {
            this.numRegistrations = 1
            log(`A component registered module ${path} straight by $store.registerModule! I cannot secure the registration then...`)
          }
          this.numRegistrations[path] += 1
        } else {
          this.numRegistrations[path] = 1
          log(`Register module '${path}'`)
          this.$store.registerModule(path, rawModule)
        }
        log(`Currently ${this.numRegistrations[path]} components depend on module '${path}'`)
      },
      unregisterModule (path) {
        if (alreadyRegistered(this.$store, path)) {
          this.numRegistrations[path] -= 1
        } else {
          log(`Can not unregister non present module '${path}'`)
          return
        }
        log(`Currently ${this.numRegistrations[path]} components depend on module '${path}'`)

        if (this.numRegistrations[path] === 0) {
          log(`Unregister module '${path}'`)
          this.$store.unregisterModule(path)
        }
      }
    }
  }
}

export default createSecureModuleRegistrationMixin
