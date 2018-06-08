'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const BaseDriver = require('./BaseDriver')

/**
 * Memory driver is used to get the message back as
 * an object over sending it to a real user.
 *
 * @class MemoryDriver
 * @constructor
 */
class MemoryDriver extends BaseDriver {

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
    return {
      message: message,
      messageId: 'test'
    }
  }
}

module.exports = MemoryDriver
