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
const { plivo: PlivoDriver } = require('../src/Smser/Drivers')

/*
All test number get from official docs
https://www.twilio.com/docs/iam/test-credentials
*/

test.group('Plivo', () => {
  test('send sms with error from', async (assert) => {
    const config = {
      authId: process.env.PLIVO_AUTHID,
      authToken: process.env.PLIVO_AUTHTOKEN
    }

    const driver = new PlivoDriver()
    driver.setConfig(config)

    try {
      const response = await driver.send({
        to: '+15005550000',
        from: '+15005550006',
        text: 'Hello world'
      })
    } catch (error) {
      assert.equal(error.message, "Destination Phone Numbers need to be verified. Please go to https://manage.plivo.com/sandbox-numbers/ to verify them.")
    }
  }).timeout(0)

  test('send sms with wrong auth', async (assert) => {
    const config = {
      authId: '_' + process.env.PLIVO_AUTHID,
      authToken: process.env.PLIVO_AUTHTOKEN
    }

    const driver = new PlivoDriver()
    driver.setConfig(config)

    try {
      const response = await driver.send({
        to: '+15005550002',
        from: '+15005550006',
        text: 'Hello world'
      })
    } catch (error) {
      assert.equal(error.message, `Error: Could not verify your access level for that URL.
You have to login with proper credentials`)
    }
  }).timeout(0)

  test.skip('send sms with correct receiver', async (assert) => {
    const config = {
      authId: process.env.PLIVO_AUTHID,
      authToken: process.env.PLIVO_AUTHTOKEN
    }

    const driver = new PlivoDriver()
    driver.setConfig(config)

    const response = await driver.send({
      to: process.env.TEST_PHONE,
      from: '+380955550006',
      text: 'Hello world'
    })
    assert.isDefined(response.id)
  }).timeout(0)
})
