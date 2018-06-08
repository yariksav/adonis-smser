'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const Message = require('../src/Smser/Message')

test.group('Message', () => {
  test('create compatible message object', (assert) => {
    const message = new Message()
    message.to('+15005550006')
    message.from('+15005550000')
    assert.deepEqual(message.toJSON(), {
      to: '+15005550006',
      from: '+15005550000'
    })
  })

  test('create compatible message object with text', (assert) => {
    const message = new Message()
    message.to(['+15005550006', '+15005550005'])
    message.from('+15005550000')
    message.text('Test text')
    assert.deepEqual(message.toJSON(), {
      to: ['+15005550006', '+15005550005'],
      from: '+15005550000',
      text: 'Test text'
    })
  })
})
