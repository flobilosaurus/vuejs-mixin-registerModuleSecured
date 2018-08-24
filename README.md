# SecuredModuleRegistration Mixin
A vuejs mixin to secure dynamic module registration of vuex store.

It keeps track of how many components tried to register a module to the store. In that way multiple registrations under the same path can be prevented. This also enables a secure unregister method: 
Modules under a specified path are only unregistered when no more components require it.

## Problem getting solved
```javascript
export default {
  name: 'A',
  created () {
    this.$store.registerModule('cars', carsModule)
  }
  // dependend on store module 'cars'
  destroyed () {
    this.$store.unregisterModule('cars')
  }
}

export default { 
  name: 'B', 
  created () {
    this.$store.registerModule('cars', carsModule)
  }
  // dependend on store module 'cars'
  destroyed () {
    this.$store.unregisterModule('cars')
  }
}
```

Situation: Components A and B are living beside each other. 
* Problem: At some point A is destroyed (unregisteres module 'cars') and after that B can not access store module 'cars' anymore.

## Usage

### Install Dependencies
`yarn`

### Run unit tests
`yarn test:unit`

### Use Mixin
```javascript
import Vue from 'vue'
import createSecureModuleRegisterMixin from '@/SecureModuleRegisterMixin'

Vue.mixin(createSecureModuleRegisterMixin(false)) // register as global mixin
...
```
