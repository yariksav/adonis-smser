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
const md5 = require('md5')
const { smsapi: SmsApiDriver } = require('../src/Smser/Drivers')

/*
Please read official docs
https://docs.smsapi.com/#libraries
*/

test.group('smsapi.com', () => {
  test.skip('send sms with error from', async (assert) => {
    const config = {
      username: process.env.SMSAPI_USERNAME,
      password: process.env.SMSAPI_PASSWORD
    }

    const driver = new SmsApiDriver()
    driver.setConfig(config)

    try {
      const response = await driver.send({
        to: process.env.TEST_PHONE,
        from: '+15005550001',
        text: 'Hello world'
      })
    } catch (error) {
      assert.equal(error.message, "Invalid from field")
      assert.equal(error.error, 14)
    }
  }).timeout(0)

  test.skip('send sms via smsapi', async (assert) => {
    const config = {
      username: process.env.SMSAPI_USERNAME,
      password: process.env.SMSAPI_PASSWORD
    }

    const driver = new SmsApiDriver()
    driver.setConfig(config)

    const response = await driver.send({
      to: process.env.TEST_PHONE,
      from: 'Test',
      text: 'Hello world'
    })
    assert.isDefined(response.id)
  }).timeout(0)

})
