'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | Connection to be used for sending emails. Each connection needs to
  | define a driver too.
  |
  */
  connection: Env.get('SMSER_CONNECTION', 'twilio'),

  /*
  |--------------------------------------------------------------------------
  | Twilio
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending smses via Twilio.com.
  |
  */
  twilio: {
    driver: 'twilio',
    accountSid: Env.get('TWILIO_SID'),
    authToken: Env.get('TWILIO_TOKEN'),
    // form: Env.get('TWILIO_FROM')
  },

  /*
  |--------------------------------------------------------------------------
  | Sms Api
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending smses via smsapi.com.
  |
  */
  smsapi: {
    driver: 'smsapi',
    username: Env.get('SMSAPI_USERNAME'),
    password: Env.get('SMSAPI_PASSWORD')
    // form: Env.get('SMSAPI_FROM')
  },

  /*
  |--------------------------------------------------------------------------
  | Sms Fly
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending smsfly via https://sms-fly.ua/.
  |
  */
  smsfly: {
    driver: 'smsfly',
    username: Env.get('SMSFLY_USERNAME'),
    password: Env.get('SMSFLY_PASSWORD'),
    // form: Env.get('SMSFLY_FROM')
  },

  /*
  |--------------------------------------------------------------------------
  | Mobizon
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending mobizon via https://mobizon.ua/panel
  |
  */
  mobizon: {
    driver: 'mobizon',
    key: Env.get('MOBIZON_KEY'),
    // form: Env.get('MOBIZON_FROM')
  },
}
