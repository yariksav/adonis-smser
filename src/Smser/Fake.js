'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const SmsManager = require('./Manager')
const clone = require('clone')
const proxyMethods = ['send']

/**
 * Fake sms is used to send fake smses
 * and run assertions.
 *
 * @class FakeSms
 * @constructor
 */
class FakeSms {
  constructor (Config, View) {
    this.Config = Config
    this.View = View
    this.sender = SmsManager.driver('memory', {}, this.View)
    this._smses = []
  }

  /**
   * Returns reference to this, required to be API
   * compatable
   *
   * @method connection
   *
   * @return {FakeSms}
   */
  connection () {
    return this
  }

  /**
   * Returns the last sent sms.
   *
   * @method recent
   *
   * @return {Object}
   */
  recent () {
    return this._smses[this._smses.length - 1]
  }

  /**
   * Returns the last sent sms and removes it from
   * the array as well
   *
   * @method pullRecent
   *
   * @return {Object}
   */
  pullRecent () {
    return this._smses.pop()
  }

  /**
   * Returns a copy of all the smses
   *
   * @method all
   *
   * @return {Array}
   */
  all () {
    return clone(this._smses)
  }

  /**
   * Clear all stored smses
   *
   * @method clear
   *
   * @return {void}
   */
  clear () {
    this._smses = []
  }
}

proxyMethods.forEach((method) => {
  FakeSms.prototype[method] = async function (...params) {
    const sms = await this.sender[method](...params)
    this._smses.push(sms)
    return sms
  }
})

module.exports = FakeSms
