'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const BaseDriver = require('./BaseDriver')

/**
 * Plivo driver for adonis smser
 * wwww.plivo.com
 *
 * @class Plivo
 * @constructor
 */
class PlivoDriver extends BaseDriver {

  /**
   * This method is called by sms manager automatically
   * and passes the config object
   *
   * @method setConfig
   *
   * @param  {Object}  config
   */
  setConfig (config) {
    super.setConfig(config)
    if (!config || !config.authId || !config.authToken) {
      throw Error ('Plivo driver require config with "authId" and "authToken" params')
    }
    const plivo = require('plivo')
    this.transporter = new plivo.Client(config.authId, config.authToken)
  }

  /**
   * Send a message via message object
   *
   * @method send
   * @async
   *
   * @param  {Object} message
   *
   * @return {Object}
   *
   * @throws {Error} If promise rejects
   */
  
  async send (message) {
    super.send(message)
    let response
    try {
      response = await this.transporter.messages.create(
        message.from || this.config.from,
        message.to,
        message.text
      )
    } catch (error) {
      // plivo request error message is json
      if (error.message && error.message.charAt(0) === '{') {
        let err = JSON.parse(error.message)
        throw new Error(err.error)
      } else {
        throw new Error(error)
      }
    }

    return {
      message,
      id: response.messageUuid[0]
    }
  }
}

module.exports = PlivoDriver
