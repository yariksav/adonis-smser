'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Request = require('../../Request')
const BaseDriver = require('./BaseDriver')
const got = require('got')

class MobizonDriver extends BaseDriver {

  get endpoint () {
    return `${(this.config.endpoint || 'https://api.mobizon.com/service')}`
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

  //https://api.mobizon.com/service/user/getownbalance/?apiKey=916a480b29b2004064e3d41885dde3faf1be0c0b

  async send (message) {
    super.send(message)
    if (!this.config || !this.config.apiKey) {
      throw Error ('Mobizon driver require config with "apiKey" param')
    }
    let from = message.from || this.config.from
    let url = this.endpoint + '/message/sendsmsmessage?'+
      'apiKey='+this.config.apiKey+
      '&recipient='+message.to+
      (from ? '&from=' + from : '') +
      '&text='+message.text

    let res = await got.get(url)
    let data = JSON.parse(res.body)
    if (data.code > 0) {
      throw new Error(data.message)
    }
    return {
      message,
      id: data.messageId
    }
  }
}

module.exports = MobizonDriver
