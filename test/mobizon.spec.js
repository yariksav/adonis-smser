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
const { mobizon: MobizonDriver } = require('../src/Smser/Drivers')

test.group('Mobizon', () => {
  test.skip('send sms', async (assert) => {
    const config = {
      apiKey: process.env.MOBIZON_APIKEY
    }

    const driver = new MobizonDriver()
    driver.setConfig(config)

    const response = await driver.send({
      to: [process.env.TEST_PHONE],
      text: 'Hello world'
    })
    assert.isDefined(response.id)
  }).timeout(0)

  test('send sms through wrong apiKey', async (assert) => {
    const config = {
      apiKey: 'blablabla'
    }
    const driver = new MobizonDriver()
    driver.setConfig(config)

    try {
      const response = await driver.send({
        to: [process.env.TEST_PHONE],
        text: 'Hello world'
      })
    } catch (error) {
      console.log(error)
      assert.match(error.message, /API authentication error/)
    }
  }).timeout(0)
})
