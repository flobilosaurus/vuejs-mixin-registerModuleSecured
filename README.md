# SecuredModuleRegistration Mixin
A vuejs mixin to secure dynamic module registration of vuex store.

It keeps track of how many components tried to register a module to the store. In that way multiple registrations under the same path can be prevented. This also enables a secure unregister method: 
Modules under a specified path are only unregistered when no more components require it.

## Usage

### Install Dependencies
`yarn`

### Run unit tests
`yarn test:unit`

### Use Mixin
```javascript
import createSecureModuleRegisterMixin from '@/SecureModuleRegisterMixin'

Vue.mixin(createSecureModuleRegisterMixin(false))
```
