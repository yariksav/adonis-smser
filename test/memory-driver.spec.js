'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

require('dotenv').load()
const test = require('japa')
const { memory: MemoryDriver } = require('../src/Smser/Drivers')

test.group('MemoryDriver driver', (group) => {
  test('newup driver', (assert) => {
    const mem = new MemoryDriver()
    mem.setConfig()
    assert.instanceOf(mem, MemoryDriver)
  })

  test('send plain sms', async (assert) => {
    const mem = new MemoryDriver()
    mem.setConfig()

    const message = await mem.send({
      from: process.env.TEST_FROM,
      to: [process.env.TEST_PHONE],
      text: 'Hello world'
    })

    assert.isDefined(message.messageId)
    assert.equal(message.message.from, process.env.TEST_FROM)
    assert.equal(message.message.to, process.env.TEST_PHONE)
    assert.equal(message.message.text, 'Hello world')
  })
})
