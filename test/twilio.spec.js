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
const { twilio: TwilioDriver } = require('../src/Smser/Drivers')

/*
All test number get from official docs
https://www.twilio.com/docs/iam/test-credentials
*/

test.group('Twilio', () => {
  test('send sms with error from', async (assert) => {
    const config = {
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_SECRET
    }

    const twilio = new TwilioDriver()
    twilio.setConfig(config)

    try {
      const response = await twilio.send({
        to: '+15005550006',
        from: '+15005550001',
        text: 'Hello world'
      })
    } catch (error) {
      assert.equal(error.message, "The 'From' number +15005550001 is not a valid phone number, shortcode, or alphanumeric sender ID.")
      assert.equal(error.code, 21212)
    }
  }).timeout(0)

  test('send sms with error receiver', async (assert) => {
    const config = {
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_SECRET
    }

    const twilio = new TwilioDriver()
    twilio.setConfig(config)

    try {
      const response = await twilio.send({
        to: '+15005550002',
        from: '+15005550006',
        text: 'Hello world'
      })
    } catch (error) {
      assert.equal(error.code, 21612)
    }
  }).timeout(0)

  test('send sms with correct receiver', async (assert) => {
    const config = {
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_SECRET
    }

    const twilio = new TwilioDriver()
    twilio.setConfig(config)

    const response = await twilio.send({
      to: '+15005550006',
      from: '+15005550006',
      text: 'Hello world'
    })
    assert.isDefined(response.id)
  }).timeout(0)
})
