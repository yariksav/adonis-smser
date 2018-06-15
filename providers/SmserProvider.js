'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class SmserProvider extends ServiceProvider {
  /**
   * Register sms provider under `Adonis/Addons/Smser`
   * namespace
   *
   * @method _registerSmser
   *
   * @return {void}
   *
   * @private
   */
  _registerSmser () {
    this.app.singleton('Adonis/Addons/Smser', (app) => {
      const Config = app.use('Adonis/Src/Config')

      const Smser = require('../src/Smser')
      return new Smser(Config)
    })
    this.app.alias('Adonis/Addons/Smser', 'Smser')
  }

  /**
   * Register sms manager to expose the API to get
   * extended
   *
   * @method _registerSmserManager
   *
   * @return {void}
   */
  _registerSmserManager () {
    this.app.manager('Adonis/Addons/Smser', require('../src/Smser/Manager'))
  }

  /**
   * Register bindings
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerSmser()
    this._registerSmserManager()
  }
}

module.exports = SmserProvider
