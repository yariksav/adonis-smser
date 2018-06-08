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
 * Twilio driver for adonis smser
 * wwww.twilio.com
 *
 * @class Twilio
 * @constructor
 */
class Twilio extends BaseDriver {

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
    if (!config || !config.accountSid || !config.authToken) {
      throw Error ('Twilio driver require config with "accountSid" and "authToken" params')
    }
    const Twilio = require('twilio')
    this.transporter  = new Twilio(config.accountSid, config.authToken)
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

    let payload = {
      to: message.to,
      from: message.from || this.config.from,
      body: message.text
    }

    let res = await this.transporter.messages.create(payload)
    return {
      message,
      id: res.sid,
      date: res.dateCreated,
      status: res.status
    }
  }

}

module.exports = Twilio
