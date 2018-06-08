'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Message = require('./Message')

/**
 * This class sends the sms using the defined driverInstance.
 * You can make use of the @ref('Message') class to build
 * the message via message builder.
 *
 * @class SmsSender
 * @constructor
 */
class SmsSender {
  constructor (driverInstance) {
    this._driverInstance = driverInstance
  }

  /**
   * Send sms via raw text
   *
   * @method raw
   * @async
   *
   * @param  {String}   text
   * @param  {Function|String} callback or receiver phone
   *
   * @return {Object}
   *
   * @example
   * ```js
   * await sender.send('Your security code is 301030', '+1234567890')
   * 
   * await sender.send('Your security code is 301030', (message) => {
   *   message.to('+1234567890')
   *   message.from('+1234567891')
   * })
   * ```
   */
  send (text, callback) {
    const message = new Message()
    message.text(text)

    if (typeof callback === 'function') {
      callback(message)
    } else {
      message.to(callback)
    }
    return this._driverInstance.send(message.toJSON())
  }
}

module.exports = SmsSender
