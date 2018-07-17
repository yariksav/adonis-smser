

## Installation

```js
adonis install adonis-smser
```

If you want use twilio driver:
```js
npm install twilio --save
```

If you want use plivo driver:
```js
npm install plivo --save
```

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
  codeSize: 6, //Size of verification code
  timeout: 120 // verify timeout in sec
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

## Registering middleware

It's sipmle to use activation middleware
```js
const namedMiddleware = {
  smsActivation: 'Adonis/Middleware/Smser',
}
```
then you can use it in your routes:
```js
  Route.post('profile/phone', 'PhofileController.phone').middleware([ 'smsActivation']) 
```

After first post
```js
{
  phone: '140123456789',
  ... //other params
}
```
 to 'profile/phone' route middleware will send sms with verification code automaticaly and return `smser_token` param
After this frontend env has to send to same route params below:
```js
{
  phone: '140123456789',
  smser_token: 'yyyy',
  smser_code: '000',
  .... //other params
}
```
For resend sms you have to send smser_token without smser_code
```js
{
  phone: '140123456789',
  smser_token: 'yyyy'
  .... //other params
}
```

## Configuration and Environment variables

The configuration file is saved as `config/smser.js`, feel free to tweak it according.

Also make sure to define sensitive driver details inside the `.env` file and reference them via `Env` provider.
