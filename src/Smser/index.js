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
const SmsManager = require('./Manager')
const Avtivator = require('./Activator')
const proxyMethods = ['send']
const activatorProxyMethods = ['sendActivation', 'resendActivation', 'verifyActivation']

const proxyHandler = {
  get (target, name) {
    /**
     * if node is inspecting then stick to target properties
     */
    if (typeof (name) === 'symbol' || name === 'inspect') {
      return target[name]
    }

    /**
     * If a faker object exists, give preference to it over
     * the actual methods
     */
    if (target._fake && target._fake[name] !== undefined) {
      return typeof (target._fake[name]) === 'function' ? target._fake[name].bind(target._fake) : target._fake[name]
    }

    return target[name]
  }
}

/**
 * The sms class is used to grab an instance of
 * sender for a given connection and driver.
 *
 * @namespace Adonis/Addons/Smser
 * @alias Smser
 *
 * @class Smser
 * @constructor
 */
class Smser {
  constructor (Config) {
    this._config = Config
    this._sendersPool = {}
    this._fake = null
    this._proxyHandler = new Proxy(this, proxyHandler)
    return this._proxyHandler
  }

  get activator () {
    if (!this._activator) {
      this._activator = new Avtivator(this._proxyHandler, this._config.get(`smser.activation`))
    }
    return this._activator
  }

  /**
   * Returns an instance of a sms connection. Also this
   * method will cache the connection for re-usability.
   *
   * @method connection
   *
   * @param  {String}   name
   *
   * @return {Object}
   */
  connection (name) {
    name = name || this._config.get('smser.connection')

    /**
     * Returns the cache connection if defined
     */
    if (this._sendersPool[name]) {
      return this._sendersPool[name]
    }

    /**
     * Cannot get default connection
     */
    if (!name) {
      throw GE.InvalidArgumentException.invalidParameter('Make sure to define connection inside config/smser.js file')
    }

    /**
     * Get connection config
     */
    const connectionConfig = this._config.get(`smser.${name}`)

    /**
     * Cannot get config for the defined connection
     */
    if (!connectionConfig) {
      throw GE.RuntimeException.missingConfig(name, 'config/smser.js')
    }

    /**
     * Throw exception when config doesn't have driver property
     * on it
     */
    if (!connectionConfig.driver) {
      throw GE.RuntimeException.missingConfig(`${name}.driver`, 'config/smser.js')
    }

    this._sendersPool[name] = SmsManager.driver(connectionConfig.driver, connectionConfig, this.View)
    return this._sendersPool[name]
  }

  /**
   * Setup a faker object, which will be used over
   * using the actual smser methods
   *
   * @method fake
   *
   * @return {void}
   */
  fake () {
    this._fake = new (require('./Fake'))(this._config)
  }

  /**
   * Restore faker object
   *
   * @method restore
   *
   * @return {void}
   */
  restore () {
    this._fake = null
  }
}

proxyMethods.forEach((method) => {
  Smser.prototype[method] = function (...params) {
    return this.connection()[method](...params)
  }
})

activatorProxyMethods.forEach((method) => {
  Smser.prototype[method] = function (...params) {
    return this.activator[method](...params)
  }
})


module.exports = Smser
