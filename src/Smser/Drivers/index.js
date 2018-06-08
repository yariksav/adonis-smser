'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

module.exports = {
  twilio: require('./Twilio'),
  smsapi: require('./SmsApi'),
  smsfly: require('./SmsFly'),
  mobizon: require('./Mobizon'),
  memory: require('./Memory')
}
