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
const uuidv1 = require('uuid/v1')
const debug = require('debug')('adonis:smser')

/**
 * This class sends ans verifies activation smses
 *
 * @class Activator
 * @constructor
 */
class Activator {
  constructor (smser, config = {}) {
    this._codeSize = config.codeSize || 6
    this._resendLimit = config.resendLimit || 3
    this._tryLimit = config.tryLimit || 3
    this._ttl = (config.timeout || 120)
    this._smser = smser
    const NodeCache = require('node-cache-promise')
    this._nodeCache = new NodeCache({
      stdTTL: this._ttl
    })
  }

  /**
   * Generation of random code
   * 
   * @method generator
   */
  generator (length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
  }

  /**
   * Send sms with activation code
   *
   * @method sendActivation
   * @async
   *
   * @param  {String}  text
   * @param  {String|Number}  phone prefix
   * @param  {String|Number}  phone number
   *
   * @return {Object}
   *
   * @example
   * ```js
   * await sender.sendActivation('Your security code is {0}', '1', '422567890')
   * ```
   */
  async sendActivation (text, phone) {
    debug('sendActivation', {text, phone})
    const code = this.generator(this._codeSize)
    const token = uuidv1()
    if (typeof text === 'function') {
      text = text(code)
    }
    if (typeof text !== 'string') {
      throw new GE.LogicalException('Text is not string', 400, 'E_SYSTEM')
    }
    text = text.replace('{0}', code)
    phone = '+' + phone.match(/\d/g).join('')

    let obj = {
      phone,
      text,
      code,
      resendCount: 0,
      tryCount: 0
    }
    await this._smser.send(text, obj.phone)
    await this._nodeCache.set(token, obj)
    return {
      token: token
    }
  }

  /**
   * Resend sms with activation code
   *
   * @method resendActivation
   * @async
   *
   * @param  {String}  token
   * @return {Object}
   *
   * @example
   * ```js
   * await sender.resendActivation('...token...')
   * ```
   */
  async resendActivation (token) {
    debug('resendActivation', {token})
    const obj = await this._nodeCache.get(token)
    if (!obj) {
      throw new GE.LogicalException('Token not found', 400, 'E_INVALID_TOKEN')
    }
    if (obj.resendCount >= this._resendLimit) {
      await this._nodeCache.del(token)
      throw new GE.LogicalException('Resend limit reached', 400, 'E_RESEND_LIMIT_RICHED')
    }
    if (obj) {
      await this._smser.send(obj.text, obj.phone)
    }
    obj.resendCount++
    await this._nodeCache.set(token, obj)
    return {
      token
    }
  }

  /**
   * Verify sms with activation code
   *
   * @method verifyActivation
   * @async
   *
   * @param  {String}  token
   * @param  {String|Number}  token
   * @return {Object}
   *
   * @example
   * ```js
   * await sender.verifyActivation('...token...', '123456')
   * ```
   */
  async verifyActivation (token, code) {
    debug('resendActivation', {token, code})
    const obj = await this._nodeCache.get(token)
    if (!obj) {
      throw new GE.LogicalException('Token not found', 400, 'E_INVALID_TOKEN')
    }
    if (obj.tryCount >= this._tryLimit) {
      await this._nodeCache.del(token)
      throw new GE.LogicalException('Resend limit reached', 400, 'E_RESEND_LIMIT_RICHED')
    }
    let res = +obj.code === +code
    if (res) {
      await this._nodeCache.del(token)
      return obj
    } else {
      obj.tryCount++
      await this._nodeCache.set(token, obj)
      return false
    }
  }

}

module.exports = Activator
