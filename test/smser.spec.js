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
const Smser = require('../src/Smser')
const { memory: MemoryDriver } = require('../src/Smser/Drivers')

test.group('Smser', () => {
  test('throw exception when unable to find sms connection', (assert) => {
    const config = new Config()
    const smser = new Smser(config)
    const fn = () => smser.connection()
    assert.throw(fn, 'E_INVALID_PARAMETER: Make sure to define connection inside config/smser.js file')
  })

  test('throw exception connection config is missing', (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    const smser = new Smser(config)
    const fn = () => smser.connection()
    assert.throw(fn, 'E_MISSING_CONFIG: memory is not defined inside config/smser.js file')
  })

  test('throw exception when driver is not defined on connection', (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      username: ''
    })
    const smser = new Smser(config)
    const fn = () => smser.connection()
    assert.throw(fn, 'E_MISSING_CONFIG: memory.driver is not defined inside config/smser.js file')
  })

  test('get memory driver instance', (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      driver: 'memory'
    })
    const smser = new Smser(config)
    const driver = smser.connection('memory')
    assert.instanceOf(driver._driverInstance, MemoryDriver)
  })

  test('return the cache instance if exists', (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      driver: 'memory'
    })
    const smser = new Smser(config)
    const memory = smser.connection('memory')
    const memory2 = smser.connection('memory')
    assert.deepEqual(memory, memory2)
  })

  test('proxy sender methods', async (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      driver: 'memory'
    })
    const smser = new Smser(config)
    assert.isFunction(smser.send)
    let res = await smser.send('test text', '1(123)4231234')
    assert.deepEqual(res.message, { text: 'test text', to: '+11234231234' })
  })

  let smser
  let recentSms
  let token
  let verificationCode
  test('check send activation code', async (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      driver: 'memory'
    })
    config.set('smser.activation', {
      codeSize: 6
    })
    smser = new Smser(config)
    assert.isFunction(smser.sendActivation)
    assert.isFunction(smser.resendActivation)
    assert.isFunction(smser.verifyActivation)

    smser.fake()
    const response = await smser.sendActivation('Your verification code is {0}', '380501111111')
    recentSms = smser.pullRecent()
    smser.restore()

    assert.isDefined(response.token)
    assert.isDefined(recentSms.message)
    assert.isDefined(recentSms.message.text)
    assert.isDefined(recentSms.message.to)
    token = response.token

    // get verification code from sms
    verificationCode = recentSms.message.text.replace( /^\D+/g, '')
    assert.isTrue(verificationCode.length === 6, 'verifivation code must be 6 digits')
  })

  test('check resend activation code', async (assert) => {
    smser.fake()
    const response = await smser.resendActivation(token)
    let sms = smser.pullRecent()
    smser.restore()

    assert.deepEqual(recentSms.message, sms.message)
    assert.isTrue(response.token === token)
  }).timeout(0)

  test('check resend activation code with wrong token', async (assert) => {
    try {
      await smser.resendActivation(token + '_123')
    } catch (error) {
      assert.equal(error.message, 'E_INVALID_TOKEN: Token not found')
    }
  }).timeout(0)

  test('check verification activation code with wrong code', async (assert) => {
    let res = await smser.verifyActivation(token, 'xxx')
    assert.isFalse(res)
  })

  test('check verification activation code with correct code', async (assert) => {
    let res = await smser.verifyActivation(token, verificationCode)
    assert.isObject(res)
    assert.equal(res.phone, '+380501111111')
  })

  test('check try limit', async (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      driver: 'memory'
    })
    config.set('smser.activation', {
      codeSize: 6,
      tryLimit: 2
    })

    let smser = new Smser(config)
    let {token} = await smser.sendActivation('Your verification code is {0}', '380501111111')
    let res = await smser.verifyActivation(token, 'xxx')
    assert.isFalse(res)
    res = await smser.verifyActivation(token, 'xxx')
    assert.isFalse(res)
    try {
      res = await smser.verifyActivation(token, 'xxx')
      assert.isTrue(false, 'wrong logic')
    } catch (error) {
      assert.equal(error.message, 'E_RESEND_LIMIT_RICHED: Resend limit reached')
    }
  })

  test('check resend limit', async (assert) => {
    const config = new Config()
    config.set('smser.connection', 'memory')
    config.set('smser.memory', {
      driver: 'memory'
    })
    config.set('smser.activation', {
      codeSize: 6,
      resendLimit: 1
    })
    let smser = new Smser(config)
    let {token} = await smser.sendActivation('Your verification code is {0}', '38(050)1111111')
    let res = await smser.resendActivation(token)
    try {
      res = await smser.resendActivation(token)
      assert.isTrue(false, 'wrong logic')
    } catch (error) {
      assert.equal(error.message, 'E_RESEND_LIMIT_RICHED: Resend limit reached')
    }
  })
})
