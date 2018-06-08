## Registering provider

The provider is registered inside `start/app.js` file under `providers` array.

```js
const providers = [
  'adonisjs-sms-sender/providers/SmsProvider'
]
```

That's all! Now you can use the sms provider as follows.

```js
const Sms = use('Smser')

await Sms.send('sms.verify', '+380501233211')
})

await Sms.send('Test message', (message) => {
  message.from('InfoCentr')
  message.to('+380501233211')
})
```

The `verify` is the view name stored inside the `resources/views/sms` directory.

## Installation

To use twilio driver:
```js
npm install twilio --save
```

To use plivo driver:
```js
npm install plivo --save
```
## Configuration and Environment variables

The configuration file is saved as `config/smser.js`, feel free to tweak it according.

Also make sure to define sensitive driver details inside the `.env` file and reference them via `Env` provider.
