# Intercom Service for Node JS

Communicate with the Intercom API from your Node JS backend. This package is built on top of the offical [intercom-node](https://github.com/intercom/intercom-node) package. It gives you TypeScript type definitions for all exported functions and will validate the incoming data so it complies with the rules of the Intercom API.

## Quickstart

```shell
  npm install intercom-service-js
```

#### Basic Usage
Basic usage involves adding the `IntercomService` to your setup. **IMPORTANT** You need to fetch your own access token and feed it to `IntercomService` (as seen below). Read more here [Create an Access Token](https://developers.intercom.com/docs/personal-access-tokens).

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