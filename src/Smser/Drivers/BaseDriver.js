'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/


/**
 * Base sms driver for adonis smser
 *
 * @class BaseDriver
 * @constructor
 */
class BaseDriver {

  /**
   * This method is called by sms manager automatically
   * and passes the config object
   *
   * @method setConfig
   *
   * @param  {Object}  config
   */
  setConfig (config) {
    this.config  = config
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
    if (!message) {
      throw new Error('Message object was not sended')
    }

    if (Array.isArray(message.to) && message.to.length) {
      message.to = message.to[0]
    }

    if (typeof message.text !== 'string') {
      throw new Error('Body must be string.')
    }

    if (typeof message.to !== 'string') {
      throw new Error('Parameter "to" of recipient must be string')
    }
  }

  async sendBulk (message) {
    let result = []
    if (typeof message.to === 'string') {
      message.to = [message.to]
    }
    for (let phone of message.to) {
      try {
        let res = await this.send(Object.assign({}, message, {to: phone}))
        result.push(res)
      } catch (error) {
        result.push({
          error: error
        })
      }
    }
    return {results: result}
  }
}

module.exports = BaseDriver
