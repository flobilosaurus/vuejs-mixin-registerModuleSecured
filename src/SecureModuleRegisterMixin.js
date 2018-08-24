const createSecureModuleRegistrationMixin = (debugEnabled) => {
  const _dataObject = {
    numRegistrations: {}
  }

  const alreadyRegistered = (numRegistrations, path) => {
    return numRegistrations[path] && numRegistrations[path] > 0
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
        if (alreadyRegistered(this.numRegistrations, path)) {
          this.numRegistrations[path] += 1
        } else {
          this.numRegistrations[path] = 1
          log(`Register module '${path}'`)
          this.$store.registerModule(path, rawModule)
        }
        log(`Currently ${this.numRegistrations[path]} components depend on module '${path}'`)
      },
      unregisterModule (path) {
        if (alreadyRegistered(this.numRegistrations, path)) {
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
