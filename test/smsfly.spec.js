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
const { smsfly: SmsFlyDriver } = require('../src/Smser/Drivers')

test.group('SmsFly', () => {
  test.skip('send sms', async (assert) => {
    const config = {
      username: process.env.SMSFLY_USERNAME,
      password: process.env.SMSFLY_PASSWORD,
      from: process.env.SMSFLY_FROM,
    }

    const driver = new SmsFlyDriver()
    driver.setConfig(config)

    const response = await driver.send({
      to: process.env.TEST_PHONE,
      text: 'Hello world'
    })

    // console.log(response)
    assert.isDefined(response.messageId)
    // assert.isDefined(response.messageId)
  })

  test('send sms through wrong account', async (assert) => {
    const config = {
      username: '+' + process.env.SMSFLY_USERNAME,
      password: process.env.SMSFLY_PASSWORD
    }

    const driver = new SmsFlyDriver()
    driver.setConfig(config)

    try {
      const response = await driver.send({
        to: process.env.TEST_PHONE,
        text: 'Hello world'
      })
    } catch (error) {
      assert.match(error.message, /Access denied!/)
    }
  })

  test('check is xml correct', async (assert) => {
    const config = {
      username: process.env.SMSFLY_USERNAME,
      password: process.env.SMSFLY_PASSWORD
    }

    const driver = new SmsFlyDriver()
    driver.setConfig(config)

    const res = driver._generatePayload({
      to: process.env.TEST_PHONE,
      text: 'Hello world'
    })

    assert.equal(res, '<?xml version="1.0" encoding="utf-8"?><request><operation>SENDSMS</operation><message start_time="AUTO" end_time="AUTO" lifetime="4" desc="description"><recipient>'+process.env.TEST_PHONE+'</recipient><body>Hello world</body></message></request>')
  })
})
