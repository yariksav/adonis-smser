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
const { ioc } = require('@adonisjs/fold')
const Drivers = require('./Drivers')
const SmsSender = require('./Sender')

/**
 * Sms manager manages the drivers and also
 * exposes the api to add new drivers.
 *
 * @class SmsManager
 * @constructor
 */
class SmsManager {
  constructor () {
    this._drivers = {}
  }

  /**
   * Exposing api to be extend, IoC container will
   * use this method when someone tries to
   * extend sms provider
   *
   * @method extend
   *
   * @param  {String} name
   * @param  {Object} implementation
   *
   * @return {void}
   */
  extend (name, implementation) {
    this._drivers[name] = implementation
  }

  /**
   * Returns an instance of sender with the defined
   * driver.
   *
   * @method driver
   *
   * @param  {String} name
   * @param  {Object} config
   * @param  {Object} viewInstance
   *
   * @return {SmsManager}
   */
  driver (name, config, viewInstance) {
    if (!name) {
      throw GE.InvalidArgumentException.invalidParameter('Cannot get driver instance without a name')
    }

    name = name.toLowerCase()
    const Driver = Drivers[name] || this._drivers[name]

    if (!Driver) {
      throw GE.InvalidArgumentException.invalidParameter(`${name} is not a valid sms driver`)
    }

    const driverInstance = ioc.make(Driver)
    driverInstance.setConfig(config)
    return new SmsSender(driverInstance, viewInstance)
  }
}

module.exports = new SmsManager()
