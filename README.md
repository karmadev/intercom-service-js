# Intercom Service for Node JS

Communicate with the Intercom API from your Node JS backend. This package is built on top of the offical [intercom-node](https://github.com/intercom/intercom-node) package. It gives you TypeScript type definitions for all exported functions and will validate the incoming data so it complies with the rules of the Intercom API.

## Quickstart

```shell
  yarn add intercom-service-js
```

#### Basic Usage
Basic usage involves adding the `IntercomService` to your setup. **IMPORTANT** You need to fetch your own access token and feed it to `IntercomService` (as seen below). Read more here [Create an Access Token](https://developers.intercom.com/docs/personal-access-tokens).

```js
import { IntercomService } from 'intercom-service-js'

// Initialize the IntercomService
const intercom = new IntercomService({ token: process.env.INTERCOM_AUTH_TOKEN })
// ways down in your code ...
intercom.createOrUpdateUser({
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

## API

All functions will **return** a `Promise` with the following structure (`?` suffix indicates it's optional). Note: this syntax is a [TypeScript interface](https://www.typescriptlang.org/docs/handbook/interfaces.html).

```js
{
  success: boolean
  data?: {
    internal_id: string
    intercom_id: string
    result: {
      // This contains the body of the response from the API
      [propName: string]: any
    }
  }
  error?: {
    code: string
    message: string
    errors: string[]
    data?: {
      internal_id: string
    }
    originalError?: any
  }
}
```

Async/Await

Please note we're using `await` (of **async/await**) in the examples below. We're using [TypeScript](https://www.typescriptlang.org) to allow that but there are lot's of other way to allow that so pick your favourite.

### tagCompany

Example

```js
const tagResult = await intercom.tagCompany({
  company_id: '1234',
  tag: 'test tag',
})
```

Accepts

- **company_id** (`string`)
- **tag** (`object`)

Mandatory

- `company_id`
- `tag`

### createOrUpdateCompany

Example

```js
const result = await intercom.createOrUpdateCompany({ company_id: '233' })
```

Accepts

- **company_id** (`string`)
- **remote_created_at** (`string`)
- **name** (`string`)
- **monthly_spend** (`number`)
- **plan** (`string`)
- **size** (`number`)
- **website** (`string`)
- **industry** (`string`)
- **custom_attributes** (`object`)

Mandatory

- `company_id`

### createOrUpdateUser

Example

```js
const userDataData = {
  user_id: user.id,
  email: user.email,
  name: user.name,
  companies: [
    {
      company_id: company.id,
    },
  ],
}
const result = await intercom.createOrUpdateUser(userDataData)
```

Accepts

- **user_id** (`string`)
- **email** (`string`)
- **name** (`string`)
- **phone** (`string`)
- **website** (`string`)
- **signed_up_at** (`string`)
- **last_request_at** (`string`)
- **last_seen_ip** (`string`)
- **last_seen_user_agent** (`string`)
- **update_last_request_at** (`string`)
- **unsubscribed_from_emails** (`boolean`)
- **new_session** (`boolean`)
- **companies** (`Array<object>`)
- **custom_attributes** (`object`)

Mandatory

- `user_id`
- `email`

### deleteUser

Example

```js
const result = await intercom.deleteUser({
  user_id: user.id,
})
```

Accepts

- **userId** (`string`)

Mandatory

- `userId`
