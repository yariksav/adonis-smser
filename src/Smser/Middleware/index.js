'use strict'

const Smser = require('../index.js')

class SmserMiddleware {

  constructor (Config, Smser) {
    this.Config = Config
    this.Smser = Smser
    this.message = Config.get('smser.activation.message', 'Activation code: {0}')
  }

  async handle ({ request, response }, next, keys) {
    let key = (keys && keys.length && keys[0]) || 'phone'
    let res
    let { smser_code, smser_token } = request.all()
    const phone = request.input(key)
    // if sent phone number
    if (!smser_token && phone) {
      res = await this.Smser.sendActivation(this.message, phone)
      return response.status(200).send({ smser_token: res.token })
    }

    // resend activation
    else if (smser_token && phone && !smser_code) {
      await this.Smser.resendActivation(smser_token)
      return response.status(200).send({ smser_token })
    }

    // verify activation
    else if (smser_token && phone && smser_code) {
      await this.Smser.verifyActivation(smser_token, smser_code)
      //await next()
    } 
    //else {
    //  return response.status(403).send({message: 'Invalid phone verification params', code: 'E_INVALID_PARAMS'})
    //}
    await next()
  }
}

module.exports = SmserMiddleware
