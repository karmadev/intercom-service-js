# Intercom Service for Node JS

Communicate with the Intercom API from your backend.

## Quickstart

```shell
  npm install intercom-service-js
```

#### Basic Usage
Basic usage involves adding `persistReducer` and `persistStore` to your setup. **IMPORTANT** Every app needs to decide how many levels of state they want to "merge". The default is 1 level. Please read through the [state reconciler docs](#state-reconciler) for more information.

```js
import { IntercomService } from 'intercom-service-js'

// Initialize the IntercomService
const intercomService = new IntercomService({ token: process.env.INTERCOM_AUTH_TOKEN })
// ways down in your code ...
intercomService.createOrUpdateUser({
    user_id: `${data.user_id}`,
    name: data.user_name,
    email: data.user_email,
    signed_up_at: data.user_created_date,
    companies: [
      {
        company_id: `${data.company_id}`,
      },
    ],
    custom_attributes: {
      timezone: data.location_timezone,
      city: data.location_city,
    },
  })
  .then(intercomUpdate => {
    if (intercomUpdate && intercomUpdate.success) {
      resolve({
        success: true,
      })
    } else {
      resolve({
        success: false,
        error: intercomUpdate.error,
      })
    }
  })
  .catch(error => {
    resolve({
      success: false,
      error: error,
    })
  })
```