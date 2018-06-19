# Adonis Sms Sender

This repo is a AdonisJs provider to send sms using one of the available drivers, or by writing your own driver.


[![NPM Version][npm-image]][npm-url]
[![Appveyor][appveyor-image]][appveyor-url]

<img src="https://cdn4.iconfinder.com/data/icons/chat-icons-3-1/512/smss.png" width="200px" align="right" hspace="30px" vspace="140px">

## What's in the box?

This repo contains following providers.

1. Consistent API to send smses
2. Support for multiple drivers include **twilio.com**,**plivo.com**, **smsapi.com**,**smsfly.ua**,**mobizon** etc.
3. API to add your own drivers

[Read documentation](https://github.com/yariksav/adonis-smser/blob/master/instructions.md)


## Setup

The package must be installed by using `adonis` command.

```bash
> adonis install adonis-smser
```

You can use directly `npm` or `yarn` but the instructions (`instructions.js` and `instructions.md`) will not be displayed and ran.

> :warning: This package requires `@adonisjs/bodyparser` to be installed.

## Node/OS Target

This repo/branch is supposed to run fine on all major OS platforms and targets `Node.js >=7.0`

## Development

Great! If you are planning to contribute to the framework, make sure to adhere to following conventions, since a consistent code-base is always joy to work with.

Run the following command to see list of available npm scripts.

```
npm run
```

## Environment Variables

There is a `.env.example` file in the project root, rename it as `.env` and add values for all services to run tests on your local. 

DO MAKE SURE TO NOT COMMIT THE `.env` FILE.

### Tests & Linting

1. Lint your code using standardJs. Run `npm run lint` command to check if there are any linting errors.
2. Make sure you write tests for all the changes/bug fixes.
3. Also you can write **regression tests**, which shows that something is failing but doesn't breaks the build. Which is actually a nice way to show that something fails. Regression tests are written using `test.failing()` method.
4. Make sure all the tests are passing on `travis` and `appveyor`.

### General Practices

Since Es6 is in, you should strive to use latest features. For example:

1. Use `Spread` over `arguments` keyword.
2. Never use `bind` or `call`. After calling these methods, we cannot guarantee the scope of any methods and in AdonisJs codebase we do not override the methods scope.
3. Make sure to write proper docblock.

## Issues & PR

It is always helpful if we try to follow certain practices when creating issues or PR's, since it will save everyone's time.

1. Always try creating regression tests when you find a bug (if possible).
2. Share some context on what you are trying to do, with enough code to reproduce the issue.
3. For general questions, please create a forum thread.
4. When creating a PR for a feature, make sure to create a parallel PR for docs too.


## Regression Tests

Regression tests are tests, which shows how a piece of code fails under certain circumstance, but the beauty is even after the failure, the test suite will never fail. Actually is a nice way to notify about bugs, but making sure everything is green.

The regression tests are created using

```
test.failing('2 + 2 is always 4, but add method returns 6', (assert) => {
 assert.true(add(2, 2), 4)
})
```

Now since the `add` method has a bug, it will return `6` instead of `4`. But the build will pass.

[appveyor-image]: https://img.shields.io/appveyor/ci/yariksav/adonis-smser/master.svg?style=flat-square
[appveyor-url]: https://ci.appveyor.com/project/yariksav/adonis-smser

[npm-image]: https://img.shields.io/npm/v/adonis-smser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/adonis-smser
