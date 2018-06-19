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
  | Activator
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for activator phone numbers
  |
  */
  activation: {
    codeSize: 6,
    tryLimit: 2,
    resendLimit: 1,
    timeout: 120
  },
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
    // from: Env.get('TWILIO_FROM')
  },

  /*
  |--------------------------------------------------------------------------
  | Plivo
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending smses via plivo.com.
  |
  */
  plivo: {
    driver: 'plivo',
    authId: Env.get('PLIVO_AUTHID'),
    authToken: Env.get('PLIVO_AUTHTOKEN'),
    // from: Env.get('TPLIVO_FROM')
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
    // from: Env.get('SMSAPI_FROM')
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
    // from: Env.get('SMSFLY_FROM')
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
    apiKey: Env.get('MOBIZON_APIKEY'),
    // from: Env.get('MOBIZON_FROM')
  },
}
