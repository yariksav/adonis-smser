'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const GE = require('@adonisjs/generic-exceptions')

/**
 * The message builder is used to construct a message
 * by chaining different methods.
 *
 * The instance of this class is passed to `Smser.send`
 * callback function.
 *
 * @class Message
 * @constructor
 */
class Message {
  constructor (config) {
    this.smsMessage = config || {}
  }

  /**
   * Parse and set address object/array on
   * the address key
   *
   * @method _setAddress
   *
   * @param  {String}    key
   * @param  {String|Array}    address
   * @param  {String}    [name]
   *
   * @private
   */
  _setAddress (key, address, name) {
    this.smsMessage[key] = this.smsMessage[key] || []

    /**
     * If address is an array of address object, then concat
     * it directly
     */
    if (address instanceof Array === true) {
      this.smsMessage[key] = this.smsMessage[key].concat(address)
      return
    }

    const addressObj = name ? { name, address } : address
    this.smsMessage[key].push(addressObj)
  }

  /**
   * Set `from` on the sms.
   *
   * @method from
   *
   * @param  {String|Array} address
   * @param  {String} [name]
   *
   * @chainable
   *
   * @example
   * ```
   *  // phone
   * message.from('+15005550000')
   *
   *  // name
   * message.from('InfoCenter')
   * ```
   */
  from (account) {
    this.smsMessage.from = account
    return this
  }

  /**
   * Set `to` on the email.
   *
   * @method to
   *
   * @param  {String|Array} address
   * @param  {String} [name]
   *
   * @chainable
   *
   * @example
   * ```
   *  // just email
   * message.to('+15005550000')
   * ```
   */
  to (phone) {
    this.smsMessage.to = phone
    // this._setAddress('to', address, name)
    return this
  }

  /**
   * Set email text body
   *
   * @method text
   *
   * @param  {String} text
   *
   * @chainable
   */
  text (text) {
    this.smsMessage.text = text
    return this
  }

  /**
   * Returns nodemailer compatable message
   * object
   *
   * @method toJSON
   *
   * @return {Object}
   */
  toJSON () {
    return this.smsMessage
  }
}

module.exports = Message
