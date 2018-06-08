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
const manager = require('../src/Smser/Manager')
const { memory: MemoryDriver } = require('../src/Smser/Drivers')

test.group('Sms manager', () => {
  test('get instance of mail sender with driver', (assert) => {
    const sender = manager.driver('memory', {})
    assert.instanceOf(sender._driverInstance, MemoryDriver)
  })

  test('throw exception when invalid driver name is passed', (assert) => {
    const sender = () => manager.driver('foo', {})
    assert.throw(sender, 'E_INVALID_PARAMETER: foo is not a valid sms driver')
  })

  test('throw exception when driver name is missing', (assert) => {
    const sender = () => manager.driver()
    assert.throw(sender, 'E_INVALID_PARAMETER: Cannot get driver instance without a name')
  })
})
