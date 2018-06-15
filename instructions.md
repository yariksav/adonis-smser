## Registering provider

The provider is registered inside `start/app.js` file under `providers` array.

```js
const providers = [
  'adonis-smser/providers/SmserProvider'
]
```

That's all! Now you can use the sms provider as follows.

```js
const Smser = use('Smser')

await Smser.send('Your verification code is 1234', '+380501233211')
})

await Smser.send('Test message', (message) => {
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

## Activator module

This module has a Activator class to automatically verify phone numbers
To use activator firstly install node cache module

```js
npm install node-cache-promise --save
```

base config example:

```js
activation: {
  tryLimit: 2, // limits of verification tries
  resendLimit: 2, // limits of resend sms verification,
  codeSize: 6 //Size of verification code
}
```

Now you can verify phone numbers.
For sending sms with verification code:
```js
let { token } = await Smser.sendActivation('Your verification code is {0}', '380', '501112233')
```

also you can put number witout prefix
```js
let { token } = await Smser.sendActivation('Your verification code is {0}', '+380501112233')
```

to resend same sms activation code
```js
await Smser.resendActivation(token)
```


to verify activation code
```js
await Smser.verifyActivation(token, code)
```


## Configuration and Environment variables

The configuration file is saved as `config/smser.js`, feel free to tweak it according.

Also make sure to define sensitive driver details inside the `.env` file and reference them via `Env` provider.
