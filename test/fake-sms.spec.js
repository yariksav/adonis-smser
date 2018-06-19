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
const { Config } = require('@adonisjs/sink')
const FakeSms = require('../src/Smser/Fake')
const Smser = require('../src/Smser')
const phone = '+380951234567'

test.group('FakeSms', () => {
  test('fake sms send via memory driver', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    const response = await sms.send('Hello everyone', (message) => {
      message.to(phone)
    })
    assert.equal(response.message.to, phone)
    assert.equal(response.message.text, 'Hello everyone')
  })

  test('fake short sms send via memory driver', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    const response = await sms.send('Hello everyone', phone)
    assert.equal(response.message.to, phone)
    assert.equal(response.message.text, 'Hello everyone')
  })

 test('store sent sms in memory', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    const response = await sms.send('Hello everyone', (message) => {
      message.to(phone)
    })

    assert.deepEqual(response, sms._smses[0])
  })

  test('give last sms from the smses array', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    const response = await sms.send('Hello everyone', phone)

    assert.deepEqual(response, sms.recent())
  })

  test('pull last email from array', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    await sms.send('Hello everyone', phone)
    const response = await sms.send('Another one', phone)

    assert.deepEqual(response, sms.pullRecent())
    assert.lengthOf(sms._smses, 1)
  })

  test('return a copy of all smses', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    await sms.send('Hello everyone', phone)
    await sms.send('Another one', phone)

    const smses = sms.all()
    assert.lengthOf(smses, 2)
    smses[0].message.text = 'Changed test'
    assert.equal(sms._smses[0].message.text, 'Hello everyone')
  })

  test('clear all emails', async (assert) => {
    const sms = new Smser(new Config())
    sms.fake()

    await sms.send('Hello everyone', phone)
    await sms.send('Another one', phone)

    sms.clear()
    assert.lengthOf(sms.all(), 0)
  })

  test('restore fake mailer', async (assert) => {
    assert.plan(2)

    const sms = new Smser(new Config())
    sms.fake()

    assert.instanceOf(sms._fake, FakeSms)

    sms.restore()

    assert.isNull(sms._fake)
  })
})
