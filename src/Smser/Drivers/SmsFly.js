'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const convert = require('xml-js')
const Request = require('../../Request')
const BaseDriver = require('./BaseDriver')

class SmsFlyDriver extends BaseDriver {

  get endpoint () {
    return `${(this.config.endpoint || 'http://sms-fly.com/api')}/api.noai.php`
  }

  _generatePayload (message) {
    let obj = {
      '_declaration': {
        '_attributes': {'version':'1.0','encoding':'utf-8'}
      },
      'request': {
        'operation': 'SENDSMS',
        'message': {
          '_attributes':{'start_time':'AUTO','end_time':'AUTO','lifetime':'4','desc':'description'},
          'recipient': message.to,
          'body': message.text
        }
      }
    }
    return convert.js2xml(obj, {compact: true})
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
    let body = this._generatePayload(message)
    let res = await new Request().basicAuth(this.config.username + ':' + this.config.password).post(this.endpoint, body)
    if (res && res.charAt(0) !== '<') {
      throw new Error(res)
    }
    let resObj = convert.xml2js(res, {compact: true});
    // console.log('rere', body, resObj)
    return {
      messageId: resObj.message.state._attributes.campaignID,
      date: resObj.message.state._attributes.date
    }
  }
}

module.exports = SmsFlyDriver

//<?xml version='1.0' encoding='utf-8'?>
// <message>
//         <state code='ACCEPT' campaignID='1853509' date='2018-06-06 20:14:40'>The campaignhas been successfully processed and added tothe queue for delivery</state>
//         <to recipient='380956353711' status='ACCEPTED' />
// </message>