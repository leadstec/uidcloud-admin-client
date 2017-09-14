### UidCloud Admin Client

## Installation

```
npm install uidcloud-admin-client -S
```

## Usage

```js
'use strict';

let adminClient = require('./');

let settings = {
  baseUrl: 'http://127.0.0.1:8080/auth',
  username: 'admin',
  password: 'admin',
  grant_type: 'password',
  client_id: 'admin-cli'
};

adminClient(settings)
  .then((client) => {
  console.log('client', client);
  client.realms.find()
    .then((realms) => {
    console.log('realms', realms);
    });
  })
  .catch((err) => {
    console.log('Error', err);
  });
```
